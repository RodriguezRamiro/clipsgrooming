/* backend/src/routes/stripeWebhooks.js */

console.log("✅ StripeWebhook router file loaded");

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
        console.error("❌ Webhook signature verification failed.", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("🔔 Stripe Event:", event.type);

    try {
    // Payment success
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) {
            console.warn("⚠️ Missing bookingId in session metadata");
            return res.json({ received: true });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            console.warn("⚠️ Booking not found:", bookingId);
            return res.json({ received: true });
        }

        if (booking.status === "paid") {
            console.log("🔁 Booking already paid:", bookingId);
            return res.json({ received: true });
        }

        // Extract paymentintentId
        const paymentIntentId =
        typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

        booking.status = "paid";
        booking.paid = true;
        booking.locked = true;
        booking.paidAt = new Date();
        booking.paymentIntentId = paymentIntentId;
        booking.stripeSessionId = session.id;

        await booking.save();

        console.log("✅ Booking reserved & paid:", bookingId);
        console.log("Saved paymentIntentId:", paymentIntentId);
    }

    // Refound Handling
    if (event.type === "charge.refunded") {
        const charge = event.data.object;
        const paymentIntentId = charge.payment_intent;

        if(!paymentIntentId) {
            console.warn("Refund missing payment_intent");
            return res.json({ received: true });
        }

        // Fetch PaymentIntent directly form Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        const bookingId = charge.metadata?.bookingId;

        if (!bookingId) {
            console.warn("Refound missing bookingId on PaymentIntent");
            return res.json({ received: true })
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            console.warn("Booking not found for refound:", paymentIntentId);
            return res.json({ received: true });
        }

        console.log("Refund paymentIntentId:", paymentIntentId);

        // Idempotency guard
        if(booking.status === "cancelled") {
            console.log("🔁 Already refunded:", booking._id);
            return res.json({ received: true });
        }

        booking.status = "cancelled";
        booking.paid = false;
        booking.locked = false;
        booking.refundedAt = new Date();

        await booking.save();

        console.log("💸 Booking cancelled & slot released:", booking._id);
    }

    res.json({ received: true });

}   catch (error) {
    console.error("🔥 Webhook processing error:", error);
    res.status(500).json({ error: "webhook handler failed" });
    }
  }
);

export default router;