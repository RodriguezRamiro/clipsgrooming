/* backend/src/routes/StripeWebhooks.js */

import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import Booking from "../models/bookings.js";

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/webhook",
bodyParser.raw({ type: "application/json" }),
async (req, res) => {
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

    console.log("🔔 Stripe Event:", event.type);

    // Handle success check out
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId){
            console.warn("⚠️ Missing bookingId in session metadata");
            return res.json({ received: true });
        }

        await Booking.findByIdAndUpdate(bookingId, {
            status: "paid",
            paid: true,
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent,
            paidAt: new Date(),
        });

        console.log("✅ Booking marked as PAID:", bookingId);

    }
    res.json({ recieved: true });

  }
);

export default router;