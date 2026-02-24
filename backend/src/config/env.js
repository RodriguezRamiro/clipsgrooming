/* backend/src/controllers/config/env.js */

import dotenv from "dotenv";
dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("STRIPE_SECRET_KEY is missing");
}

if (!process.env.MONOGDB_URI) {
    console.warn("MONGODB_URI is missing");
}
