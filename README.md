# QuickShow

A comprehensive movie/show ticket booking platform with real-time seat management, secure payment processing, and an admin dashboard for complete show management.

🔗 **Live Demo**: 
- **User Platform**: [https://quickshow-one-pearl.vercel.app/](https://quickshow-one-pearl.vercel.app/)
- **Admin Dashboard**: [https://quickshow-one-pearl.vercel.app/admin](https://quickshow-one-pearl.vercel.app/admin)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Additional Setup](#additional-setup)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

QuickShow is a full-stack ticket booking platform that enables users to browse shows, select seats, and complete secure payments through Stripe. The application features real-time seat availability management to prevent double bookings, automated email confirmations via Nodemailer, and a comprehensive admin dashboard for managing shows, viewing bookings, and monitoring revenue.

## ✨ Features

### User Features
- 🎬 Browse available shows and events
- 🪑 Interactive seat selection interface
- 🔒 Real-time seat locking to prevent double bookings
- 💳 Secure payment processing with Stripe
- 📧 Instant booking confirmation emails
- 🎫 Digital ticket generation
- 📱 Mobile-responsive booking experience
- 👤 User authentication and profile management
- 📜 Booking history and order tracking
- ❌ Booking cancellation (if enabled)

### Admin Features
- 📊 Comprehensive admin dashboard
- 🎭 Add, edit, and delete shows/events
- 🎫 View all bookings in real-time
- 💰 Revenue tracking and analytics
- 🪑 Seat management and availability monitoring
- 👥 User management
- 📈 Booking statistics and reports
- 🕐 Show scheduling and timing management
- 🎨 Show details (venue, price, timing, capacity)
- 🔍 Search and filter bookings

### Technical Features
- 🚫 Double booking prevention system
- ⚡ Real-time seat availability updates
- 🔐 Secure authentication and authorization
- 🌐 RESTful API architecture
- 🛡️ Error handling and validation
- 🌍 Cross-browser compatibility
- 📬 Automated email notifications
- 💾 Persistent data storage

## 🛠️ Tech Stack

### Frontend (Client)
- **JavaScript** - Programming language
- **HTML5** - Markup
- **CSS3** - Styling
- **Modern ES6+** - Latest JavaScript features
- **Responsive Design** - Mobile-first approach

### Backend (Server)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database for storing shows, bookings, and users
- **Mongoose** - MongoDB ODM
- **Stripe API** - Payment processing
- **Nodemailer** - Email service
- **JWT** - Authentication tokens
- **RESTful API** - API architecture
- **JavaScript** - Server-side logic

### Admin Dashboard
- **JavaScript** - Programming language
- **HTML/CSS** - Interface design
- **Admin UI Framework** - Dashboard interface

### Deployment
- **Vercel** - Cloud hosting platform
- **MongoDB Atlas** - Cloud database
- **Git** - Version control

## 📁 Project Structure
```
QuickShow/
├── client/                      # User-facing frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── ShowList.js    # Display available shows
│   │   │   ├── SeatSelection.js # Interactive seat picker
│   │   │   ├── Checkout.js    # Payment interface
│   │   │   └── BookingConfirmation.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── ShowDetails.js
│   │   │   ├── MyBookings.js
│   │   │   └── Profile.js
│   │   ├── services/
│   │   │   ├── api.js         # API client
│   │   │   ├── stripe.js      # Stripe integration
│   │   │   └── auth.js        # Authentication
│   │   └── utils/
│   │       ├── seatUtils.js   # Seat management utilities
│   │       └── dateUtils.js
│   └── package.json
│
├── admin/                       # Admin dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js   # Main admin dashboard
│   │   │   ├── ShowManagement.js # Add/Edit/Delete shows
│   │   │   ├── BookingsList.js   # View all bookings
│   │   │   └── Analytics.js      # Revenue and statistics
│   │   ├── pages/
│   │   │   ├── AdminLogin.js
│   │   │   ├── Shows.js
│   │   │   ├── Bookings.js
│   │   │   └── Reports.js
│   │   └── services/
│   │       └── adminApi.js
│   └── package.json
│
├── server/                      # Backend application
│   ├── controllers/
│   │   ├── showController.js       # Show CRUD operations
│   │   ├── bookingController.js    # Booking management
│   │   ├── paymentController.js    # Stripe integration
│   │   ├── emailController.js      # Email notifications
│   │   └── authController.js       # Authentication
│   ├── models/
│   │   ├── Show.js            # Show schema
│   │   ├── Booking.js         # Booking schema with seat info
│   │   ├── User.js            # User schema
│   │   └── Seat.js            # Seat availability schema
│   ├── routes/
│   │   ├── shows.js
│   │   ├── bookings.js
│   │   ├── payments.js
│   │   ├── emails.js
│   │   └── admin.js
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   ├── adminAuth.js       # Admin authentication
│   │   ├── seatLock.js        # Prevent double booking
│   │   └── errorHandler.js
│   ├── config/
│   │   ├── database.js
│   │   ├── stripe.js
│   │   └── nodemailer.js
│   ├── utils/
│   │   ├── seatManager.js     # Seat locking logic
│   │   ├── emailTemplates.js  # Email HTML templates
│   │   └── helpers.js
│   ├── templates/             # Email templates
│   │   ├── bookingConfirmation.html
│   │   ├── welcomeEmail.html
│   │   └── ticketEmail.html
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas account)
- Git
- Stripe Account (for payment processing)
- Email service provider (Gmail/SendGrid/Mailgun)

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/aryanathane/QuickShow.git
   cd QuickShow
```

2. **Install Server Dependencies**
```bash
   cd server
   npm install
```

3. **Install Client Dependencies**
```bash
   cd ../client
   npm install
```

4. **Install Admin Dependencies**
```bash
   cd ../admin
   npm install
```

## ⚙️ Configuration

### Server Configuration

Create a `.env` file in the `server` directory:
```env
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/quickshow
# Or for MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickshow

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
ADMIN_JWT_SECRET=your_admin_jwt_secret

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Nodemailer Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password
FROM_EMAIL=noreply@quickshow.com
FROM_NAME=QuickShow

# Seat Lock Configuration
SEAT_LOCK_DURATION=300000  # 5 minutes in milliseconds

# CORS Configuration
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

### Client Configuration

Create a `.env` file in the `client` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### Admin Configuration

Create a `.env` file in the `admin` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ADMIN_API_URL=http://localhost:5000/api/admin
```

## 💻 Usage

### Development Mode

1. **Start MongoDB** (if running locally)
```bash
   mongod
```

2. **Start the Server**
```bash
   cd server
   npm start
   # or for development with auto-reload
   npm run dev
```

3. **Start the Client**
```bash
   cd client
   npm start
```

4. **Start the Admin Dashboard**
```bash
   cd admin
   npm start
```

The applications will be available at:
- **Server API**: `http://localhost:5000`
- **Client**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:3001`

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
```http
POST /api/auth/register              # Register new user
POST /api/auth/login                 # User login
GET  /api/auth/profile               # Get user profile
PUT  /api/auth/profile               # Update profile
POST /api/auth/logout                # Logout user
POST /api/auth/forgot-password       # Request password reset
POST /api/auth/reset-password        # Reset password
```

### Show Endpoints
```http
GET    /api/shows                    # Get all shows
GET    /api/shows/:id                # Get single show details
GET    /api/shows/:id/availability   # Get seat availability
POST   /api/shows                    # Create show (Admin only)
PUT    /api/shows/:id                # Update show (Admin only)
DELETE /api/shows/:id                # Delete show (Admin only)
GET    /api/shows/search             # Search shows
```

### Booking Endpoints
```http
POST   /api/bookings/check-seats     # Check if seats are available
POST   /api/bookings/lock-seats      # Temporarily lock seats (5 min)
POST   /api/bookings/create          # Create booking after payment
GET    /api/bookings                 # Get user's bookings
GET    /api/bookings/:id             # Get booking details
DELETE /api/bookings/:id             # Cancel booking
GET    /api/bookings/:id/ticket      # Get digital ticket
```

### Payment Endpoints (Stripe)
```http
POST /api/payment/create-checkout-session    # Create Stripe checkout
POST /api/payment/webhook                    # Stripe webhook handler
GET  /api/payment/success                    # Payment success callback
GET  /api/payment/cancel                     # Payment cancel callback
POST /api/payment/verify                     # Verify payment status
```

### Email Endpoints
```http
POST /api/email/booking-confirmation    # Send booking confirmation
POST /api/email/ticket                  # Send ticket email
POST /api/email/cancellation            # Send cancellation email
POST /api/email/reminder                # Send show reminder
```

### Admin Endpoints
```http
POST   /api/admin/login                      # Admin login
GET    /api/admin/dashboard                  # Dashboard statistics
GET    /api/admin/bookings                   # Get all bookings
GET    /api/admin/bookings/:id               # Get booking details
PUT    /api/admin/bookings/:id/status        # Update booking status
GET    /api/admin/shows                      # Get all shows
POST   /api/admin/shows                      # Create new show
PUT    /api/admin/shows/:id                  # Update show
DELETE /api/admin/shows/:id                  # Delete show
GET    /api/admin/revenue                    # Get revenue statistics
GET    /api/admin/users                      # Get all users
```

### Request Examples

**Create a Show (Admin)**
```json
POST /api/admin/shows
{
  "title": "Avengers: Endgame",
  "description": "The epic conclusion to the Infinity Saga",
  "genre": "Action/Sci-Fi",
  "duration": 180,
  "language": "English",
  "venue": "PVR Cinemas, Phoenix Mall",
  "showTime": "2024-01-15T19:00:00Z",
  "price": 350,
  "totalSeats": 100,
  "seatLayout": {
    "rows": 10,
    "seatsPerRow": 10
  },
  "image": "https://example.com/poster.jpg"
}
```

**Book Tickets**
```json
POST /api/bookings/create
{
  "showId": "65abc123def456",
  "seats": ["A1", "A2", "A3"],
  "userId": "65xyz789abc123",
  "totalAmount": 1050,
  "paymentIntentId": "pi_stripe_payment_id",
  "email": "user@example.com",
  "phone": "+919876543210"
}
```

**Check Seat Availability**
```json
POST /api/bookings/check-seats
{
  "showId": "65abc123def456",
  "seats": ["A1", "A2"]
}

Response:
{
  "available": true,
  "seats": [
    { "seatNumber": "A1", "status": "available" },
    { "seatNumber": "A2", "status": "available" }
  ]
}
```

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
   npm install -g vercel
```

2. **Deploy Server**
```bash
   cd server
   vercel --prod
```

3. **Deploy Client**
```bash
   cd client
   vercel --prod
```

4. **Deploy Admin Dashboard**
```bash
   cd admin
   vercel --prod
```

### Environment Variables on Vercel

**Server Configuration:**
- `NODE_ENV=production`
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET`
- `ADMIN_JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`
- `FROM_EMAIL`, `FROM_NAME`
- `CLIENT_URL` - Deployed client URL
- `ADMIN_URL` - Deployed admin URL
- `SEAT_LOCK_DURATION`

**Client Configuration:**
- `REACT_APP_API_URL` - Deployed server URL
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`

**Admin Configuration:**
- `REACT_APP_API_URL` - Deployed server URL
- `REACT_APP_ADMIN_API_URL` - Deployed admin API URL

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Add database user
4. Whitelist your IP (or 0.0.0.0/0 for Vercel)
5. Get connection string and add to `MONGODB_URI`

## 🔧 Additional Setup

### Double Booking Prevention System

The application implements a sophisticated seat locking mechanism:

1. **Temporary Lock**: When a user selects seats, they are locked for 5 minutes
2. **Payment Timeout**: If payment isn't completed in 5 minutes, seats are released
3. **Real-time Updates**: Other users see seats as "temporarily unavailable"
4. **Database Transactions**: Uses MongoDB transactions for atomicity
5. **Race Condition Handling**: Prevents simultaneous bookings of same seats

**Implementation Flow:**
```
User selects seats → Seats locked (5 min) → Payment page → 
Payment successful → Permanent booking → Email confirmation
                   ↓
Payment failed/timeout → Seats released → Available again
```

### Stripe Setup

1. **Create Stripe Account**
   - Sign up at [stripe.com](https://stripe.com)
   - Get API keys from Dashboard > Developers > API keys

2. **Configure Webhooks**
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-server-url.vercel.app/api/payment/webhook`
   - Select events:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy webhook signing secret

3. **Test Cards**
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Authentication: `4000 0025 0000 3155`

### Nodemailer Setup

1. **Gmail Configuration**
   - Enable 2-Step Verification
   - Generate App Password:
     - Google Account > Security > 2-Step Verification > App passwords
     - Select "Mail" and "Other (Custom name)"
     - Copy password to `SMTP_PASSWORD`

2. **Email Templates**
   Located in `server/templates/`:
   - `bookingConfirmation.html` - Sent after successful booking
   - `ticketEmail.html` - Digital ticket with QR code
   - `cancellationEmail.html` - Booking cancellation notice

3. **Email Features**
   - Booking confirmation with ticket details
   - QR code for ticket verification
   - Show details (venue, time, seats)
   - Payment receipt

### Admin Dashboard Features

**Dashboard Overview:**
- Total revenue
- Number of bookings today/this week/this month
- Total shows
- Seat occupancy rate
- Recent bookings list
- Revenue chart

**Show Management:**
- Add new shows with full details
- Edit show information
- Delete shows (with confirmation)
- View seat layout and availability
- Manage show timing

**Booking Management:**
- View all bookings (past and upcoming)
- Filter by date, show, status
- Search by user email/phone
- View booking details
- Cancel bookings (with refund option)
- Export booking data

## 🧪 Testing

### Test Seat Locking Feature

1. Open two browser windows
2. Window 1: Select seats and proceed to payment
3. Window 2: Try to select the same seats
4. Result: Seats should show as "temporarily unavailable"
5. Wait 5 minutes or complete payment in Window 1
6. Refresh Window 2 to see updated availability

### Test Stripe Integration
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:5000/api/payment/webhook

# Trigger test webhook
stripe trigger checkout.session.completed
```

## 📝 Database Schema

### Show Schema
```javascript
{
  title: String,
  description: String,
  genre: String,
  duration: Number,
  language: String,
  venue: String,
  showTime: Date,
  price: Number,
  totalSeats: Number,
  availableSeats: Number,
  seatLayout: Object,
  bookedSeats: [String],
  lockedSeats: [{
    seatNumber: String,
    lockedUntil: Date,
    userId: ObjectId
  }],
  image: String,
  createdAt: Date
}
```

### Booking Schema
```javascript
{
  userId: ObjectId,
  showId: ObjectId,
  seats: [String],
  totalAmount: Number,
  paymentStatus: String,
  paymentIntentId: String,
  bookingDate: Date,
  showDate: Date,
  email: String,
  phone: String,
  status: String, // confirmed, cancelled
  qrCode: String
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Aryan Athane**
- GitHub: [@aryanathane](https://github.com/aryanathane)
- Repository: [QuickShow](https://github.com/aryanathane/QuickShow)

## 🙏 Acknowledgments

- Stripe for secure payment processing
- Nodemailer for reliable email delivery
- MongoDB for flexible data storage
- Vercel for seamless deployment
- All contributors and users

## 📞 Support

For support and questions:
- Open an issue in the [GitHub repository](https://github.com/aryanathane/QuickShow/issues)
- Email: [your-email@example.com]

---

⭐ If you find this project useful, please give it a star!

## 🗺️ Roadmap

- [ ] QR code ticket verification system
- [ ] Mobile app for iOS and Android
- [ ] Multiple payment gateway support
- [ ] Show recommendations based on user history
- [ ] Social media integration
- [ ] Review and rating system
- [ ] Loyalty points program
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode

## 💡 Key Features Explained

### Real-Time Seat Management
- Seats are locked when selected by any user
- Lock expires after 5 minutes if payment not completed
- Visual indicators show available/booked/locked seats
- Prevents race conditions using database transactions

### Payment Flow
1. User selects seats (locked for 5 min)
2. Stripe checkout session created
3. User completes payment
4. Webhook confirms payment
5. Booking created in database
6. Confirmation email sent
7. Digital ticket generated

### Admin Capabilities
- Full CRUD operations on shows
- Real-time booking monitoring
- Revenue analytics and reporting
- User management
- Seat availability tracking
- Bulk operations support
