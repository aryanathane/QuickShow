# QuickShow

A modern full-stack web application built with JavaScript, featuring a responsive client interface and robust server backend.

🔗 **Live Demo**: [quickshow-one-pearl.vercel.app](https://quickshow-one-pearl.vercel.app/)

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
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

QuickShow is a full-stack JavaScript application designed to provide a seamless user experience with a modern client-side interface and a powerful server-side API. The application is built with scalability and performance in mind, deployed on Vercel for optimal delivery.

## ✨ Features

- 🚀 Fast and responsive user interface
- 🔐 Secure authentication and authorization
- 💳 Stripe payment integration for secure transactions
- 📧 Email notifications powered by Nodemailer
- 📱 Mobile-responsive design
- 🌐 RESTful API architecture
- ⚡ Real-time data updates
- 🎨 Modern and intuitive UI/UX
- 🔄 Seamless client-server communication
- 📊 Data management and processing
- 🛡️ Error handling and validation
- 🌍 Cross-browser compatibility
- 💰 Payment processing and order confirmations
- 📬 Automated email delivery system

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
- **Stripe API** - Payment processing
- **Nodemailer** - Email service
- **RESTful API** - API architecture
- **JavaScript** - Server-side logic

### Deployment
- **Vercel** - Cloud hosting platform
- **Git** - Version control

## 📁 Project Structure

```
QuickShow/
├── client/                # Frontend application
│   ├── public/           # Static assets
│   ├── src/              # Source files
│   │   ├── components/   # UI components
│   │   ├── pages/        # Application pages
│   │   ├── utils/        # Utility functions
│   │   ├── services/     # API services
│   │   └── styles/       # CSS styles
│   ├── index.html        # Entry HTML file
│   └── package.json      # Client dependencies
│
├── server/               # Backend application
│   ├── controllers/      # Route controllers
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── models/           # Data models
│   ├── config/           # Configuration files
│   ├── utils/            # Server utilities
│   ├── index.js          # Server entry point
│   └── package.json      # Server dependencies
│
├── .gitignore           # Git ignore rules
└── README.md            # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
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

## ⚙️ Configuration

### Server Configuration

Create a `.env` file in the `server` directory:

```env
PORT=5000
NODE_ENV=development

# Database Configuration (if applicable)
DATABASE_URL=your_database_connection_string

# JWT Secret (if using authentication)
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Nodemailer Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password
FROM_EMAIL=noreply@quickshow.com
FROM_NAME=QuickShow

# API Configuration
API_VERSION=v1

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### Client Configuration

Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
REACT_APP_ENV=development
```

## 💻 Usage

### Development Mode

1. **Start the Server**
   ```bash
   cd server
   npm start
   # or for development with auto-reload
   npm run dev
   ```

2. **Start the Client**
   ```bash
   cd client
   npm start
   ```

The applications will be available at:
- **Server**: `http://localhost:5000`
- **Client**: `http://localhost:3000`

### Production Build

1. **Build the Client**
   ```bash
   cd client
   npm run build
   ```

2. **Start Production Server**
   ```bash
   cd server
   npm run start:prod
   ```

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Health Check
```http
GET /api/health
```
Returns server health status.

#### Example Endpoints (Customize based on your actual API)

**Authentication**
```http
POST /api/auth/register    # Register new user
POST /api/auth/login       # User login
GET  /api/auth/profile     # Get user profile
```

**Resources**
```http
GET    /api/resource       # Get all resources
GET    /api/resource/:id   # Get single resource
POST   /api/resource       # Create resource
PUT    /api/resource/:id   # Update resource
DELETE /api/resource/:id   # Delete resource
```

**Payment (Stripe)**
```http
POST /api/payment/create-checkout-session    # Create Stripe checkout session
POST /api/payment/webhook                    # Handle Stripe webhooks
GET  /api/payment/success                    # Payment success callback
GET  /api/payment/cancel                     # Payment cancellation callback
POST /api/payment/create-payment-intent      # Create payment intent
GET  /api/payment/orders/:id                 # Get payment details
```

**Email (Nodemailer)**
```http
POST /api/email/send                    # Send email
POST /api/email/welcome                 # Send welcome email
POST /api/email/order-confirmation      # Send order confirmation
POST /api/email/password-reset          # Send password reset email
POST /api/email/contact                 # Send contact form email
```

### Request/Response Format

**Request Header**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>"
}
```

**Success Response**
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

**Error Response**
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
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

### Environment Variables on Vercel

**Server Configuration:**
- Add all environment variables from your `.env` file
- Set `NODE_ENV=production`
- Configure database connection strings
- Add API keys and secrets
- **Stripe Variables:**
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- **Nodemailer Variables:**
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASSWORD`
  - `FROM_EMAIL`
  - `FROM_NAME`

**Client Configuration:**
- `REACT_APP_API_URL` (your deployed server URL)
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`
- Other client-side environment variables

### Vercel Configuration Files

Create `vercel.json` in server directory:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

## 🔧 Additional Setup

### Stripe Setup

1. **Create Stripe Account**
   - Sign up at [stripe.com](https://stripe.com)
   - Get your API keys from the Stripe Dashboard (Developers > API keys)

2. **Configure Webhooks**
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://your-server-url.vercel.app/api/payment/webhook`
   - Select events to listen to:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy the webhook signing secret to your `.env` file

3. **Test Mode**
   - Use test API keys for development
   - Test card: `4242 4242 4242 4242`
   - Any future expiry date and CVC

### Nodemailer Setup

1. **Gmail Configuration (Most Common)**
   - Enable 2-Step Verification in your Google Account
   - Generate App Password:
     - Go to Google Account > Security > 2-Step Verification > App passwords
     - Select "Mail" and "Other (Custom name)"
     - Copy the generated password to `SMTP_PASSWORD` in `.env`

2. **Alternative SMTP Providers**
   - **SendGrid**: `smtp.sendgrid.net` (Port: 587)
   - **Mailgun**: `smtp.mailgun.org` (Port: 587)
   - **Outlook**: `smtp-mail.outlook.com` (Port: 587)

3. **Email Templates**
   - Create HTML email templates in `server/templates/`
   - Use dynamic placeholders for personalization
   - Test emails in development before production

### Environment-Specific Configuration

**Development:**
- Use Stripe test keys
- Use a test email account or service like Mailtrap
- Enable detailed logging

**Production:**
- Use Stripe live keys
- Configure proper SMTP credentials
- Enable error monitoring
- Set up email delivery tracking

## 🧪 Testing

```bash
# Run server tests
cd server
npm test

# Run client tests
cd client
npm test
```

## 📝 Scripts

### Server Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with auto-reload
npm test           # Run tests
npm run lint       # Run linter
```

### Client Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Run linter
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

### Code Style Guidelines

- Use ES6+ syntax
- Follow consistent naming conventions
- Write meaningful commit messages
- Add comments for complex logic
- Ensure code passes linting checks


## 👤 Author

**Aryan Athane**
- GitHub: [@aryanathane](https://github.com/aryanathane)
- Repository: [QuickShow](https://github.com/aryanathane/QuickShow)

## 🙏 Acknowledgments

- Thanks to all contributors
- Built with modern JavaScript technologies
- Stripe for secure payment processing
- Nodemailer for reliable email delivery
- Deployed on Vercel for optimal performance
- Inspired by best practices in full-stack development

## 📞 Support

- Email: [aryanathane@gmail.com]

---

⭐ If you find this project useful, please give it a star!

## 🔄 Updates and Changelog

### Version History
- **v1.0.0** - Initial release
  - Basic client-server architecture
  - RESTful API implementation
  - Responsive UI design
  - Vercel deployment



## 🗺️ Roadmap

- [ ] Add comprehensive test coverage
- [ ] Implement advanced features
- [ ] Performance optimizations
- [ ] Enhanced documentation
- [ ] Mobile application version

## 💡 Tips

- Always keep your dependencies updated
- Use environment variables for sensitive data
- Follow the contribution guidelines
- Test your changes before submitting PR
- Keep your code clean and documented
