/* backend/src/routes/StripeWebhooks.js */

import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/webhook",
bodyParser.raw({ type: "application/json" }),
(req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Webhook signature verification failed.", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle success check out
    if (event.type === "chekout.session.completed") {
        const session = event.data.object;

        console.log("💰 Payment confirmed:", session.id);

        // Todo:
        // 1. find booking by session.id
        // 2. Mark booking as paid
        // 3. Store payment intent ID
    }
    res.json({ recieved: true });
  }
);

export default router;