# 🎬 QuickShow - Movie Ticket Booking Application

A full-stack movie ticket booking platform that allows users to browse movies, select seats, and book tickets with secure payment processing. Features real-time seat management, automated notifications, and an admin dashboard.

🔗 **Live Demo**: [https://quickshow-one-pearl.vercel.app/](https://quickshow-one-pearl.vercel.app/)

## ✨ Features

- 🎥 Browse and search movies with detailed information
- 🪑 Real-time seat selection with interactive seat map
- 💳 Secure payment processing with Stripe
- 📧 Automated email confirmations and tickets
- 👤 User authentication and profile management
- 📊 Admin dashboard for managing movies, shows, and bookings
- 📱 Fully responsive design

## 🛠 Tech Stack

**Frontend:** React.js, Tailwind CSS, Vite

**Backend:** Node.js, Express.js, MongoDB

**Services:** Clerk (Auth), Stripe (Payments), TMDB (Movie Data), Inngest (Events), Nodemailer (Emails)

## 📦 Prerequisites

- Node.js (v16+)
- MongoDB
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/aryanathane/QuickShow.git
cd QuickShow

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Setup

Create `.env` file in **backend** directory:

```env
MONGODB_URI=your_mongodb_uri
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
TMDB_API_KEY=your_tmdb_api_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
SENDER_EMAIL=your_email@example.com
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

Create `.env` file in **client** directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BASE_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 3. Get API Keys

**Clerk** - [clerk.dev](https://clerk.dev) (User authentication)

**TMDB** - [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) (Movie data)

**Stripe** - [stripe.com/docs/keys](https://stripe.com/docs/keys) (Payment processing)

**Inngest** - [inngest.com](https://www.inngest.com) (Event scheduling)

**SMTP** - Use Gmail, SendGrid, or any SMTP provider

### 4. Run the Application

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

Backend: `http://localhost:5000`  
Frontend: `http://localhost:5173`

## 📁 Project Structure

```
QuickShow/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── services/        # External services
├── client/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   └── context/     # State management
└── README.md
```

## 🔑 Key Features

### Real-time Seat Management
- Interactive seat selection with color-coded availability
- Automatic seat hold with 5-minute timeout
- Prevents double booking with MongoDB transactions

### Payment & Notifications
- Secure Stripe integration
- Instant email confirmations with QR-coded tickets
- Automated booking reminders

### Admin Dashboard
- Movie and showtime management
- Booking analytics and reports
- User and revenue tracking

## 🌐 Deployment

The application is deployed on Vercel. For your own deployment:

```bash
# Build frontend
cd client
npm run build

# Deploy using Vercel CLI
vercel
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


## 👤 Author

**Aryan Athane**  
GitHub: [@aryanathane](https://github.com/aryanathane)

---

⭐ If you find this project useful, please give it a star!
