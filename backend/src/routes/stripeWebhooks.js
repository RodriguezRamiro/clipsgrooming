/* backend/src/routes/stripeWebhooks.js */

import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import { handleStripeEvent } from "../services/stripeHandlers.js";

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-01-28.clover",
});

router.post("/webhook",
bodyParser.raw({ type: "application/json" }),
async (req, res) => {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
        return res.status(400).send("Missing Stripe signature");
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("❌ Webhook signature verification failed.", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }


    try {
        await handleStripeEvent(event);
        res.sendStatus(200);
    } catch (err) {
        console.error("webhook handler error:", err);
        res.status(500).json({ error: " Webhook processing failed"});
    }
  }
);

export default router;