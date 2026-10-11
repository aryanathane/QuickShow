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
