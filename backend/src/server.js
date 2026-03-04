/* //backend/src/server.js */

import "./config/env.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import bookingsRouter from "./routes/bookings.routes.js";
import paymentsRouter from "./routes/payments.routes.js";
import stripeWebhookRouter from "./routes/StripeWebhooks.js";
import adminAuthRouter from "./routes/adminAuth.routes.js";


console.log("Stripe key loaded:", !!process.env.STRIPE_SECRET_KEY);
console.log("MongoDB URI loaded:", !!process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);

// DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// CORS
const allowedOrigins = [
        "http://localhost:5173",
        process.env.FRONTEND_URL,
    ];

app.use(
    cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // allow curl / server to server
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error("Not allowed by CORS"));
    },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
})
);

// Stripe WebHook
app.use("/api/stripe", stripeWebhookRouter);

//Middleware
app.use(express.json());


//Health Check
app.get("/", (req, res) => {
    res.json({ status: "Clips Grooming API running" });
});

// API Routes
app.use("/api/bookings", bookingsRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/admin/auth", adminAuthRouter);


app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});


export default app;
