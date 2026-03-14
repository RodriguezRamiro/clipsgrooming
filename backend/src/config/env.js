/* backend/src/config/env.js */

import dotenv from "dotenv";
dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("STRIPE_SECRET_KEY is missing");
}

if (!process.env.MONOGODB_URI) {
    console.warn("MONGODB_URI is missing");
}

if (!process.env.JWT_SECRET) {
    console.warn("JWT_SECRET is missing");
}
