# Aim Arcade - Tournament Management Platform

A comprehensive web-based tournament management platform for gaming competitions, featuring team registration, payment processing, and tournament organization capabilities.

## 🎮 Features

### Core Functionality
- **Tournament Management**: Create and manage gaming tournaments with different modes (Classic, Clash Squad) and types (Solo, Duo, Squad)
- **User Authentication**: Support for both local authentication and Google OAuth
- **Team Registration**: Register teams or individual players for tournaments
- **Payment Processing**: Integrated Razorpay payment system for tournament entry fees
- **Role-Based Access**: Player and Owner roles with different permissions
- **Real-time Updates**: Live tournament status and participant management

### Key Features
- Tournament creation with customizable settings (maps, entry fees, team limits)
- Team code generation for easy team joining
- Manual payment verification system with proof upload
- User profiles and registration history
- Responsive design with modern UI/UX
- RESTful API architecture

## 🏗️ Architecture

### Frontend (Client)
- **Framework**: React 19.1.1 with Vite
- **Styling**: TailwindCSS v4.1.16
- **Routing**: React Router DOM v6.30.1
- **Build Tool**: Vite 7.1.7
- **Deployment**: Vercel

### Backend (Server)
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Google OAuth 2.0
- **Payment**: Razorpay integration
- **Security**: bcryptjs for password hashing, JWT tokens

## 📁 Project Structure

```
Aim-Arcade/
├── client/                     # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── HeaderBar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── TopNav.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Tournaments.jsx
│   │   │   ├── TournamentDetail.jsx
│   │   │   ├── RegisterTeam.jsx
│   │   │   ├── JoinTeam.jsx
│   │   │   ├── PayTeam.jsx
│   │   │   ├── PayPlayer.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Owner.jsx
│   │   │   └── ...
│   │   ├── api/
│   │   │   └── client.js       # API client configuration
│   │   ├── utils/
│   │   │   └── razorpay.js     # Razorpay utilities
│   │   ├── App.jsx             # Main application component
│   │   └── main.jsx            # Application entry point
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json             # Vercel deployment config
├── server/                     # Express backend application
│   ├── config/
│   │   ├── db.js               # Database connection
│   │   └── passport.js         # Passport configuration
│   ├── controllers/            # Route controllers
│   │   ├── authController.js
│   │   ├── paymentController.js
│   │   ├── registrationController.js
│   │   ├── tournamentController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # Authentication middleware
│   │   └── validate.js         # Input validation
│   ├── models/                 # Mongoose models
│   │   ├── User.js
│   │   ├── Tournaments.models.js
│   │   └── Registeration.models.js
│   ├── routes/                 # API routes
│   │   ├── authRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── registrationRoutes.js
│   │   ├── tournamentRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── generateToken.js    # JWT token generation
│   ├── server.js               # Main server file
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- Razorpay account (for payments)
- Google OAuth credentials (optional)

### Environment Variables

Create a `.env` file in the `server` directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=http://localhost:5008/api/auth/google/callback

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Server
PORT=5008
NODE_ENV=development
```

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Aim-Arcade
```

2. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Start the development servers**

**Server (Backend):**
```bash
cd server
npm run dev
```
The server will run on `http://localhost:5008`

**Client (Frontend):**
```bash
cd client
npm run dev
```
The client will run on `http://localhost:5173`

## 📊 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (required for local auth),
  googleAuth: Boolean,
  googleId: String,
  avatar: String,
  authType: ["local", "google"],
  role: ["player", "owner"]
}
```

### Tournament Model
```javascript
{
  name: String,
  mode: ["classic", "clash_squad"],
  type: ["solo", "duo", "squad"],
  entryFee: Number,
  map: String,
  date: String,
  time: String,
  maxTeams: Number,
  roomId: String,
  roomPassword: String,
  status: ["upcoming", "completed"],
  createdBy: ObjectId (ref: User)
}
```

### Registration Model
```javascript
{
  tournamentId: ObjectId (ref: Tournament),
  teamName: String,
  iglName: String,
  players: [{
    name: String,
    inGameName: String,
    playerId: String,
    email: String,
    upiId: String,
    paid: Boolean,
    paymentId: String
  }],
  registeredByUserId: ObjectId (ref: User),
  type: ["team", "individual"],
  paymentStatus: ["pending", "paid"],
  paymentId: String,
  manualPayment: {
    submitted: Boolean,
    status: ["none", "pending", "approved", "rejected"],
    amount: Number,
    note: String,
    proof: String,
    submittedByUserId: ObjectId,
    submittedAt: Date
  },
  paidByUserId: ObjectId (ref: User),
  teamCode: String,
  inviteLink: String
}
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

### Users
- `GET /api/users/me` - Get current user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Tournaments
- `GET /api/tournaments` - Get all tournaments
- `GET /api/tournaments/:id` - Get tournament by ID
- `POST /api/tournaments` - Create tournament (owner only)
- `PUT /api/tournaments/:id` - Update tournament (owner only)

### Registrations
- `POST /api/registrations` - Register for tournament
- `GET /api/registrations/my` - Get user's registrations
- `GET /api/registrations/:tournamentId` - Get tournament registrations
- `POST /api/registrations/join` - Join team via code
- `PUT /api/registrations/:id/manual-payment` - Submit manual payment

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/webhook` - Razorpay webhook

## 🎯 Key Features Explained

### Tournament Modes
- **Classic**: Traditional battle royale format
- **Clash Squad**: Team-based quick matches

### Tournament Types
- **Solo**: Individual competition
- **Duo**: 2-player teams
- **Squad**: 4-player teams

### Payment System
- **Online Payment**: Razorpay integration for instant payments
- **Manual Payment**: UPI transfer with proof upload and admin verification
- **Team Payments**: Split payments for team registrations

### User Roles
- **Player**: Can register for tournaments and manage teams
- **Owner**: Can create tournaments and manage participants

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/dist`
3. Set environment variables in Vercel dashboard

### Backend (Any Node.js Hosting)
1. Deploy the server to any Node.js hosting platform
2. Set all environment variables
3. Ensure MongoDB is accessible
4. Configure CORS to allow your frontend domain

## 🛠️ Technologies Used

### Frontend Stack
- React 19.1.1 - UI framework
- Vite 7.1.7 - Build tool and dev server
- TailwindCSS 4.1.16 - CSS framework
- React Router DOM 6.30.1 - Client-side routing

### Backend Stack
- Express.js 5.1.0 - Web framework
- MongoDB - NoSQL database
- Mongoose 8.19.2 - MongoDB ODM
- Passport.js - Authentication middleware
- JWT - Token-based authentication
- Razorpay - Payment gateway
- bcryptjs - Password hashing

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and queries, please contact the development team or create an issue in the repository.
