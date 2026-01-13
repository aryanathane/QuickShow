# 🎬 QuickShow - Movie Ticket Booking Application

A full-stack movie ticket booking platform that allows users to browse movies, select seats, and book tickets with secure payment processing. Features real-time seat management, automated email notifications, and a comprehensive admin dashboard.

🔗 **Live Demo**: [https://quickshow-one-pearl.vercel.app/](https://quickshow-one-pearl.vercel.app/)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Features in Detail](#features-in-detail)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## ✨ Features

### User Features
- 🎥 Browse movies with detailed information from TMDB
- 🔍 Search and filter movies by genre, rating, and release date
- 🪑 Real-time seat selection with visual seat map
- ⏱️ Seat hold timer to prevent double booking
- 💳 Secure payment processing with Stripe
- 📧 Automated email confirmations after booking
- 👤 User authentication and profile management with Clerk
- 📱 Responsive design for mobile and desktop
- 🎫 View booking history and ticket details

### Admin Features
- 📊 Comprehensive admin dashboard
- 🎬 Movie management (add, edit, delete)
- 🏢 Theater and showtime management
- 📈 Booking analytics and reports
- 👥 User management
- 💰 Revenue tracking
- 🎯 Seat configuration for different halls

### Technical Features
- ⚡ Fast performance with modern build tools
- 🔐 Secure authentication with Clerk
- 📅 Event scheduling and automation with Inngest
- 🎨 Beautiful UI with modern design principles
- 🔄 Real-time updates
- 📧 Email notifications via SMTP
- 🌐 RESTful API architecture

## 🛠 Tech Stack

**Frontend:**
- React.js / Vite
- JavaScript/TypeScript
- Tailwind CSS
- Framer Motion (animations)
- React Router

**Backend:**
- Node.js
- Express.js
- MongoDB (Database)
- Mongoose (ODM)

**Authentication & Authorization:**
- Clerk (User authentication)
- JWT tokens

**Third-Party Services:**
- **TMDB API** - Movie data and information
- **Stripe** - Payment processing
- **Inngest** - Event scheduling and automation
- **Nodemailer** - Email notifications

**DevOps:**
- Vite (Build tool)
- Git & GitHub

## 🏗 Architecture

```
┌─────────────────┐
│   React Client  │
│   (Frontend)    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Express API   │
│   (Backend)     │
└────────┬────────┘
         │
         ├──→ MongoDB (Database)
         ├──→ Clerk (Authentication)
         ├──→ TMDB API (Movie Data)
         ├──→ Stripe (Payments)
         ├──→ Inngest (Events)
         └──→ SMTP (Emails)
```

## 📦 Prerequisites

Ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

You'll also need accounts for:
- [Clerk](https://clerk.dev) - Authentication
- [TMDB](https://www.themoviedb.org/settings/api) - Movie data
- [Stripe](https://stripe.com) - Payment processing
- [Inngest](https://www.inngest.com) - Event scheduling
- SMTP service (Gmail, SendGrid, etc.)

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/aryanathane/QuickShow.git
cd QuickShow
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../client
npm install
```

## 🔐 Environment Variables

### Backend Environment Variables

Create a `.env` file in the **backend** directory:

```env
# ========================
# DATABASE CONFIGURATION
# ========================
MONGODB_URI=mongodb://localhost:27017/quickshow
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickshow?retryWrites=true&w=majority

# ========================
# CLERK AUTHENTICATION
# ========================
CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx

# ========================
# INNGEST EVENT SCHEDULING
# ========================
INNGEST_EVENT_KEY=your_inngest_event_key_here
INNGEST_SIGNING_KEY=your_inngest_signing_key_here

# ========================
# TMDB API (Movie Data)
# ========================
TMDB_API_KEY=your_tmdb_api_key_here

# ========================
# STRIPE PAYMENT PROCESSING
# ========================
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxx

# ========================
# EMAIL CONFIGURATION (SMTP)
# ========================
SENDER_EMAIL=noreply@quickshow.com
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password

# Optional: For Gmail
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
```

### Frontend Environment Variables

Create a `.env` file in the **client** directory:

```env
# ========================
# CLERK AUTHENTICATION (Frontend)
# ========================
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx

# ========================
# API CONFIGURATION
# ========================
VITE_BASE_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000/api

# ========================
# TMDB IMAGE BASE URL
# ========================
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/original

# ========================
# STRIPE (Frontend)
# ========================
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx

# ========================
# OTHER CONFIGURATIONS
# ========================
VITE_CURRENCY=$
```

## 🔑 How to Get API Keys

### 1. Clerk Authentication
1. Sign up at [clerk.dev](https://clerk.dev)
2. Create a new application
3. Go to **API Keys** section
4. Copy both **Publishable Key** and **Secret Key**

### 2. TMDB API
1. Create account at [themoviedb.org](https://www.themoviedb.org)
2. Go to **Settings** → **API**
3. Request an API key
4. Copy your **API Key (v3 auth)**

### 3. Stripe
1. Sign up at [stripe.com](https://stripe.com)
2. Go to **Developers** → **API Keys**
3. Copy **Publishable Key** and **Secret Key** (use test keys for development)
4. For webhooks: **Developers** → **Webhooks** → Add endpoint
5. Copy **Webhook Secret**

### 4. Inngest
1. Sign up at [inngest.com](https://www.inngest.com)
2. Create a new project
3. Go to **Settings** → **Keys**
4. Copy **Event Key** and **Signing Key**

### 5. SMTP Configuration (Gmail Example)
1. Go to Google Account settings
2. Enable **2-Step Verification**
3. Generate an **App Password**
4. Use your Gmail and App Password as SMTP credentials

**Settings for Gmail:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_app_password
```

## 🏃 Running the Application

### Development Mode

**Start Backend Server:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

**Start Frontend Development Server:**
```bash
cd client
npm run dev
```
Frontend runs on `http://localhost:5173` (Vite default)

### Production Build

**Build Frontend:**
```bash
cd client
npm run build
```

**Start Backend in Production:**
```bash
cd backend
npm start
```

## 📁 Project Structure

```
QuickShow/
├── backend/
│   ├── config/
│   │   ├── database.js          # MongoDB configuration
│   │   ├── clerk.js              # Clerk setup
│   │   └── stripe.js             # Stripe configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── movieController.js    # Movie operations
│   │   ├── bookingController.js  # Booking management
│   │   └── paymentController.js  # Payment processing
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Movie.js              # Movie schema
│   │   ├── Booking.js            # Booking schema
│   │   └── Theater.js            # Theater schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── movieRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── paymentRoutes.js
│   ├── middleware/
│   │   ├── auth.js               # Authentication middleware
│   │   └── errorHandler.js       # Error handling
│   ├── services/
│   │   ├── tmdbService.js        # TMDB API integration
│   │   ├── emailService.js       # Email notifications
│   │   └── inngestService.js     # Event scheduling
│   ├── utils/
│   │   └── helpers.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Reusable components
│   │   │   ├── movies/          # Movie-related components
│   │   │   ├── booking/         # Booking components
│   │   │   └── admin/           # Admin panel components
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── MovieDetails.jsx
│   │   │   ├── Booking.jsx
│   │   │   ├── Payment.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Admin/
│   │   ├── services/
│   │   │   └── api.js           # API calls
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── hooks/               # Custom React hooks
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # User login
GET    /api/auth/profile           # Get user profile
PUT    /api/auth/profile           # Update profile
```

### Movies
```
GET    /api/movies                 # Get all movies
GET    /api/movies/:id             # Get movie by ID
GET    /api/movies/search          # Search movies
GET    /api/movies/trending        # Get trending movies
POST   /api/movies                 # Add movie (Admin)
PUT    /api/movies/:id             # Update movie (Admin)
DELETE /api/movies/:id             # Delete movie (Admin)
```

### Bookings
```
POST   /api/bookings               # Create new booking
GET    /api/bookings               # Get user bookings
GET    /api/bookings/:id           # Get booking details
PUT    /api/bookings/:id/cancel    # Cancel booking
GET    /api/bookings/seats/:showId # Get available seats
POST   /api/bookings/hold-seats    # Hold seats temporarily
```

### Payments
```
POST   /api/payments/create-intent # Create payment intent
POST   /api/payments/confirm       # Confirm payment
POST   /api/payments/webhook       # Stripe webhook
GET    /api/payments/:id           # Get payment details
```

### Admin
```
GET    /api/admin/dashboard        # Dashboard stats
GET    /api/admin/bookings         # All bookings
GET    /api/admin/users            # User management
POST   /api/admin/theaters         # Add theater
PUT    /api/admin/theaters/:id     # Update theater
```

## 🎯 Features in Detail

### Real-time Seat Selection
- Visual seat map with different seat categories
- Color-coded seat status (available, booked, selected)
- Automatic seat hold for 10 minutes
- Real-time updates when other users book

### Payment Flow
1. User selects movie and showtime
2. Chooses seats from interactive seat map
3. Seats are held for 10 minutes
4. Proceeds to payment (Stripe Checkout)
5. Payment confirmation
6. Email confirmation sent via Inngest
7. Ticket generated with QR code

### Email Notifications
- Booking confirmation with ticket details
- Payment receipt
- Booking cancellation confirmation
- Reminder emails before show time

### Admin Dashboard
- Real-time booking statistics
- Revenue analytics with charts
- Movie management interface
- Theater and screen configuration
- User activity monitoring

## 🌐 Deployment

### Backend Deployment (Railway/Render)

**Railway:**
```bash
railway login
railway init
railway add
railway up
```

**Render:**
1. Connect GitHub repository
2. Add environment variables
3. Deploy

### Frontend Deployment (Vercel/Netlify)

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm run build
netlify deploy --prod --dir=dist
```

### MongoDB Atlas Setup
1. Create cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Add database user
3. Whitelist IP addresses (or allow all)
4. Get connection string
5. Update `MONGODB_URI` in backend `.env`

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Kill process on port 5000
npx kill-port 5000
```

**MongoDB Connection Error:**
- Check if MongoDB is running: `mongod --version`
- Verify connection string in `.env`
- Check network access in MongoDB Atlas

**Clerk Authentication Issues:**
- Verify API keys are correct
- Check if domain is added in Clerk dashboard
- Ensure environment variables are loaded

**Stripe Webhook Not Working:**
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:5000/api/payments/webhook
```

**TMDB API Rate Limiting:**
- TMDB allows 40 requests every 10 seconds
- Implement caching for frequently accessed data

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### Coding Standards
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

## 👤 Author

**Aryan Athane**
- GitHub: [@aryanathane](https://github.com/aryanathane)

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org) for movie data
- [Clerk](https://clerk.dev) for authentication
- [Stripe](https://stripe.com) for payment processing
- [Inngest](https://www.inngest.com) for event scheduling
- All contributors and supporters

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Email: aryanathane@gmail.com
- Join our Discord community

---

⭐ **If you find this project useful, please give it a star!**

🎬 **Happy Movie Booking!**
