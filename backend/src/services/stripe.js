/* //backend/src/stripe/stripe.js */

import Stripe from "stripe";


if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is missing from enviroment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-01-28.clover",
});

export default stripe