import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import passport from "passport";
import "./config/passport.js";
import cookieParser from "cookie-parser";
import { webhook as razorpayWebhook } from "./controllers/paymentController.js";

import userRoutes from "./routes/userRoutes.js";
import tournamentRoutes from "./routes/tournamentRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";


const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Razorpay webhook BEFORE express.json to keep raw body
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), razorpayWebhook);

// Increase body size limits for proof uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use((req, res, next) => {
  req.login = function (user, callback) {
    return callback(null);
  };
  next();
});


connectDB();

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5008;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//Routes 
app.use("/api/users", userRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);