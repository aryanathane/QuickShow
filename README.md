<<<<<<< HEAD
# 🎬 QuickShow – Movie Ticket Booking Application

A full-stack movie ticket booking platform. Users browse movies, pick a show, choose seats and pay securely with Stripe. Bookings are confirmed by email, unpaid bookings are released automatically, and admins manage shows and track revenue from a dashboard.

🔗 **Live Demo:** https://quickshow-one-pearl.vercel.app/
🔗 **Admin Dashboard:** https://quickshow-one-pearl.vercel.app/admin

**Demo Admin Login:**
- Email: `kewab17731@chaineor.com`
- Password: `Pass#123456`

**Demo Admin Login (alternate):**
- Email: `quikshow@example.com`
- Password: `QuickShow@123`

*(To make your own admin account when running locally, see [Creating an admin](#creating-an-admin).)*

## ✨ Features

**For users**
- Browse now-showing movies with details, cast, ratings and trailers
- Pick a date and showtime, then choose up to 5 seats on an interactive seat map (rows A–J, 9 seats per row)
- Pay with Stripe Checkout (test mode)
- Email confirmation after successful payment
- Reminder emails before the show
- My Bookings page and a Favorites list
- Authentication and profile management with Clerk
- Responsive UI

**For admins**
- Add shows for any movie currently playing on TMDB (multiple dates and times, one price)
- Dashboard with 4 metrics: total paid bookings, total revenue, active shows, total users
- View all upcoming shows and all bookings

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS 4, React Router, Axios, react-hot-toast |
| Backend | Node.js, Express 5, Mongoose |
| Database | MongoDB |
| Auth | Clerk |
| Payments | Stripe Checkout + webhooks |
| Movie data | TMDB API |
| Background jobs | Inngest (event-driven, durable) |
| Email | Nodemailer (SMTP, Brevo relay) |
| Deployment | Vercel (client and server as separate projects) |

## 🏗 How It Works

### Booking flow
1. The user selects a show and seats, then clicks **Proceed to checkout**.
2. `POST /api/booking/create` checks that the seats are free, creates a `Booking` (amount = show price × seats, calculated on the server) and marks the seats in the show's `occupiedSeats`.
3. The server creates a Stripe Checkout session (booking ID in the metadata) and returns its URL.
4. An `app/checkpayment` event is sent to Inngest. After **10 minutes**, if the booking is still unpaid, the booking is deleted and its seats are released.
5. After payment, Stripe calls `POST /api/stripe` (signature verified with the webhook secret). The booking is marked paid and an `app/show.booked` event triggers the confirmation email.

### Background jobs (Inngest)
| Function | Trigger | What it does |
|---|---|---|
| `sync-user-from-clerk` | `clerk/user.created` | Creates the user in MongoDB |
| `update-user-from-clerk` | `clerk/user.updated` | Updates the user |
| `delete-user-from-clerk` | `clerk/user.deleted` | Deletes the user |
| `release-seats-delete-booking` | `app/checkpayment` | Releases seats of unpaid bookings after 10 minutes |
| `send-booking-confirmation-email` | `app/show.booked` | Sends the confirmation email |
| `send-show-reminders` | Cron, every 8 hours | Sends reminder emails and sets `reminderSent` |

### Data models
- **User** – `_id` (Clerk user ID), name, email, image
- **Movie** – `_id` (TMDB ID), title, overview, posters, genres, cast, runtime, rating
- **Show** – movie, `showDateTime`, `showPrice`, `occupiedSeats` (`{ "A1": userId }`)
- **Booking** – user, show, amount, `bookedSeats`, `isPaid`, `paymentLink`, `reminderSent`

### API overview
| Route | Access | Purpose |
|---|---|---|
| `GET /api/show/all` | Public | Movies that have upcoming shows |
| `GET /api/show/:movieId` | Public | Movie details and showtimes grouped by date |
| `GET /api/show/now-playing` | Admin | Now-playing movies from TMDB |
| `POST /api/show/add` | Admin | Add shows |
| `POST /api/booking/create` | Logged-in user | Create booking and Stripe session |
| `GET /api/booking/seats/:showId` | Public | Occupied seats for a show |
| `GET /api/user/bookings` | Logged-in user | The user's bookings |
| `POST /api/user/update-favorite` | Logged-in user | Add or remove a favorite |
| `GET /api/user/favorites` | Logged-in user | The user's favorite movies |
| `GET /api/admin/is-admin`, `/dashboard`, `/all-shows`, `/all-bookings` | Admin | Admin data |
| `POST /api/stripe` | Stripe only | Payment webhook |
| `/api/inngest` | Inngest only | Background function endpoint |

## 📦 Prerequisites

- Node.js v18+
- A MongoDB database (local or Atlas)
- Accounts for Clerk, Stripe (test mode), TMDB, Inngest and an SMTP provider (e.g. Brevo)

## 🚀 Getting Started

### 1. Clone and install

```bash
git clone https://github.com/aryanathane/QuickShow.git
cd QuickShow

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Environment variables

Create `server/.env`:

```env
MONGODB_URI=your_mongodb_connection_string   # database name "quickshow" is appended automatically
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
TMDB_API_KEY=your_tmdb_read_access_token      # the "API Read Access Token" (Bearer token)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
SENDER_EMAIL=your_verified_sender_email
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

Create `client/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BASE_URL=http://localhost:3000
VITE_CURRENCY=₹
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/original
```

> Only publishable keys belong in the client. Never put secret keys in a `VITE_` variable.

### 3. Run the app

```bash
# Terminal 1 – backend (http://localhost:3000)
cd server
npm run server        # nodemon; use "npm start" for plain node

# Terminal 2 – frontend (http://localhost:5173)
cd client
npm run dev
```

### 4. Connect webhooks and background jobs (local development)

```bash
# Stripe: forward payment events and copy the printed signing secret into STRIPE_WEBHOOK_SECRET
stripe listen --forward-to localhost:3000/api/stripe

# Inngest: run the dev server so background functions are picked up
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

For Clerk → MongoDB user sync, connect Clerk to Inngest (Clerk dashboard → Webhooks → Inngest integration) so `clerk/user.*` events are delivered.
Use Stripe test card `4242 4242 4242 4242` with any future expiry and any CVC.

### Creating an admin

Sign up in the app, then in the **Clerk dashboard → Users → your user → Metadata → Private**, set:

```json
{ "role": "admin" }
```

You can then open `/admin`.

## 📁 Project Structure

```
QuickShow/
├── server/
│   ├── configs/        # MongoDB and Nodemailer setup
│   ├── controllers/    # Show, booking, user, admin and Stripe webhook logic
│   ├── inngest/        # Background functions (user sync, seat release, emails, reminders)
│   ├── middleware/     # protectAdmin (Clerk role check)
│   ├── models/         # User, Movie, Show, Booking schemas
│   ├── routes/         # Express routers
│   └── server.js
└── client/
    └── src/
        ├── components/ # Reusable UI (Navbar, MovieCard, admin components...)
        ├── context/    # AppContext (user, admin flag, shows, favorites)
        ├── lib/        # Date/time formatting helpers
        └── pages/      # Home, Movies, MovieDetails, SeatLayout, MyBookings, Favorite, admin/*
```

## 🌐 Deployment

Both projects are deployed on Vercel as separate projects.

- **Client:** `vercel.json` rewrites every route to `/` so React Router works on refresh. Set the `VITE_*` variables in Vercel.
- **Server:** deployed with `@vercel/node` using `server/vercel.json`. Set all server variables in Vercel, point the Stripe webhook to `https://<your-server>/api/stripe`, and register `https://<your-server>/api/inngest` in the Inngest dashboard.

## ⚠️ Known Limitations & Roadmap

- **Seat booking is not atomic.** Availability is checked and seats are saved in separate steps, so two users selecting the same seat at the same moment could both succeed. Planned fix: a conditional atomic update (or a unique seat-lock collection).
- **Unpaid-booking cleanup (10 min) is shorter than the Stripe session (30 min).** Planned fix: align the two or expire the Stripe session when releasing seats.
- **Reminder window is narrow.** Reminders are only sent for shows starting about 8 hours after each cron run. Planned fix: widen the window to `now → now + 8h`.
- **Seat map is not live.** Occupied seats are loaded when a showtime is selected; real-time updates (SSE/WebSockets) are planned.
- Server-side validation of seat IDs/count, proper HTTP status codes, restricted CORS, and automated tests are planned.

## 🤝 Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## 👤 Author

**Aryan Athane** – [@aryanathane](https://github.com/aryanathane)

---

⭐ If you find this project useful, please give it a star!
=======
# 🎬 QuickShow - Movie Booking Platform

A modern, full-stack movie booking application similar to BookMyShow. Users can discover movies, book tickets, select seats, and make secure payments. Admins can manage shows, movies, and bookings.

---

## ✨ Features

### **User Features**
- 🎥 **Browse Movies** - Discover movies with details, ratings, trailers, and cast information
- 📅 **Date & Time Selection** - Choose theatre, show timings, and dates
- 💺 **Interactive Seat Selection** - Visual seat layout with real-time booking
- 💳 **Secure Payment** - Stripe integration for safe ticket purchases
- 🔔 **Booking Confirmation** - Email confirmations and reminder notifications
- ❤️ **Favorites** - Save movies to watchlist for later
- 📱 **My Bookings** - View booking history and ticket details
- 🔐 **Secure Authentication** - Clerk-based authentication system

### **Admin Features**
- 📊 **Dashboard** - View analytics, revenue, and statistics
- ➕ **Add Shows** - Create new movie shows with theatre and timing details
- 📋 **Manage Shows** - Edit, delete, and update show information
- 👁️ **View Bookings** - Monitor all user bookings and payment status
- 🎯 **Seat Management** - Configure seat layouts and availability

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19** - UI library
- **Vite 7** - Lightning-fast build tool
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **React Router v7** - Client-side routing
- **Axios** - HTTP client for API calls
- **Clerk** - Authentication service
- **React Hot Toast** - Toast notifications
- **React Player** - Video player for trailers
- **Lucide React** - Icon library

### **Backend**
- **Node.js + Express 5.1** - Server framework
- **MongoDB + Mongoose 8.19** - Database
- **Stripe** - Payment processing
- **Inngest** - Scheduled tasks & workflows
- **Nodemailer** - Email service
- **Cloudinary** - Image storage
- **Clerk Express** - Authentication middleware

### **DevOps & Deployment**
- **Vercel** - Deployment platform (configured for both frontend & backend)
- **ESLint** - Code quality & linting

---

## 📁 Project Structure

```
BookMyShow App/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components & routes
│   │   ├── context/           # Global state management
│   │   ├── lib/               # Utility functions
│   │   └── assets/            # Static assets
│   ├── vite.config.js
│   └── package.json
│
└── server/                     # Node.js Backend
    ├── models/                # MongoDB schemas
    ├── controllers/           # Business logic
    ├── routes/                # API endpoints
    ├── middleware/            # Custom middleware
    ├── configs/               # Configuration files
    ├── inngest/               # Background jobs
    └── server.js              # Main server file
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 16+ and npm/yarn
- MongoDB database
- Stripe account
- Clerk account
- Cloudinary account
- Nodemailer credentials

### **Installation**

#### **1. Clone the repository**
```bash
git clone https://github.com/aryanathane/QuickShow.git
cd BookMyShow\ App
```

#### **2. Setup Backend**
```bash
cd server
npm install
```

Create `.env` file in server folder:
```env
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
INNGEST_EVENT_KEY=your_inngest_key
SVIX_WEBHOOK_SECRET=your_svix_secret
PORT=3000
```

Start backend:
```bash
npm run server    # Development with nodemon
npm start         # Production
```

#### **3. Setup Frontend**
```bash
cd client
npm install
```

Create `.env` file in client folder:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3000/api
```

Start frontend:
```bash
npm run dev       # Development
npm run build     # Production build
```

---

## 📡 API Endpoints

### **Show Routes** (`/api/show`)
```
GET    /api/show              - Get all shows/movies
GET    /api/show/:id          - Get show details
POST   /api/show              - Create show (admin)
PUT    /api/show/:id          - Update show (admin)
DELETE /api/show/:id          - Delete show (admin)
```

### **Booking Routes** (`/api/booking`)
```
POST   /api/booking           - Create new booking
GET    /api/booking/:id       - Get booking details
GET    /api/booking/user/:id  - Get user's bookings
PUT    /api/booking/:id       - Update booking
DELETE /api/booking/:id       - Cancel booking
```

### **Admin Routes** (`/api/admin`)
```
GET    /api/admin/dashboard   - Dashboard statistics
POST   /api/admin/show        - Add new show
GET    /api/admin/shows       - List all shows
GET    /api/admin/bookings    - List all bookings
```

### **User Routes** (`/api/user`)
```
GET    /api/user/profile      - Get user profile
PUT    /api/user/profile      - Update profile
GET    /api/user/bookings     - User bookings
```

### **Payment Routes** (`/api/stripe`)
```
POST   /api/stripe/webhook    - Stripe webhook handler
```

---

## 📚 Database Schema

### **Movie**
```javascript
{
  _id: String,
  title: String,
  overview: String,
  poster_path: String,
  backdrop_path: String,
  release_date: String,
  genres: Array,
  casts: Array,
  vote_average: Number,
  runtime: Number,
  timestamps: true
}
```

### **Show**
```javascript
{
  movie: ObjectId (ref: Movie),
  theatre: String,
  showTime: String,
  date: Date,
  price: Number,
  availableSeats: Array,
  bookedSeats: Array,
  totalSeats: Number,
  timestamps: true
}
```

### **Booking**
```javascript
{
  user: String (Clerk ID),
  show: String (Show ID),
  amount: Number,
  bookedSeats: [String],
  isPaid: Boolean,
  paymentLink: String,
  reminderSent: Boolean,
  timestamps: true
}
```

### **User**
```javascript
{
  clerkId: String,
  email: String,
  name: String,
  avatar: String,
  favorites: [String],
  timestamps: true
}
```

---

## 🔄 User Flow

### **Booking Flow**
1. User browses movies on **Home** page
2. Clicks movie to view **Movie Details** (trailer, cast, ratings)
3. Selects date/time on **Date Select** component
4. Chooses seats on **Seat Layout** page
5. Proceeds to **Stripe Checkout** for payment
6. System processes payment via **Stripe Webhook**
7. **Inngest** sends confirmation email
8. User sees booking in **My Bookings**

### **Admin Flow**
1. Admin logs in via Clerk authentication
2. Views **Admin Dashboard** for statistics
3. Can **Add Shows** for movies
4. **Edit/Delete Shows** from list
5. Monitors **All Bookings** with payment status

---

## 🔐 Authentication

This project uses **Clerk** for secure authentication:
- Sign up / Sign in functionality
- Social login support
- Session management
- Protected routes for admin

### **Protected Routes**
- `/admin/*` - Admin routes (requires authentication)
- `/my-bookings` - User bookings (requires authentication)

---

## 📧 Email & Notifications

- **Toast Notifications**: Real-time feedback via React Hot Toast
- **Booking Confirmations**: Nodemailer sends emails on successful booking
- **Reminders**: Inngest scheduled jobs send reminder emails before show

---

## 💳 Payment Processing

- **Stripe Integration**: Secure payment gateway
- **Webhook Handling**: Automatic payment verification
- **Order Tracking**: Real-time booking status updates

---

## 🚢 Deployment

Both frontend and backend are configured for **Vercel** deployment:

### **Frontend Deployment**
```bash
cd client
npm run build
vercel
```

### **Backend Deployment**
```bash
cd server
vercel
```

Set environment variables in Vercel dashboard for both deployments.

---

## 📝 Environment Variables

### **Server (.env)**
- `MONGODB_URI` - MongoDB connection string
- `CLERK_SECRET_KEY` - Clerk authentication secret
- `STRIPE_SECRET_KEY` - Stripe secret key
- `CLOUDINARY_*` - Cloudinary image upload credentials
- `EMAIL_USER`, `EMAIL_PASSWORD` - SMTP credentials
- `INNGEST_EVENT_KEY` - Inngest workflow key

### **Client (.env)**
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `VITE_API_URL` - Backend API URL

---

## 🐛 Troubleshooting

### **MongoDB Connection Error**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify IP whitelist in MongoDB Atlas

### **Stripe Payment Fails**
- Verify Stripe keys are correct
- Check webhook endpoint is active
- Ensure test/live mode matches credentials

### **Email Not Sending**
- Enable "Less secure app access" for Gmail
- Check nodemailer credentials
- Verify SMTP port (usually 587)

### **Frontend Not Connecting to Backend**
- Ensure backend server is running on port 3000
- Check `VITE_API_URL` environment variable
- Verify CORS is enabled in Express

---

## 📊 Performance Optimizations

- **Vite** for fast development & optimized builds
- **Tailwind CSS** for minimal CSS bundle
- **Lazy Loading** of pages and components
- **Image Optimization** via Cloudinary
- **Caching** strategies for frequent API calls

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Aryan Athane** - [GitHub Profile](https://github.com/aryanathane)

---

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the author.

---

## 🔗 Links

- **Live Demo**: [QuickShow](https://quickshow.vercel.app)
- **GitHub Repository**: [aryanathane/QuickShow](https://github.com/aryanathane/QuickShow)

---

**Built with ❤️ for movie lovers**
>>>>>>> a010dfd (updated README.md)
