/* //backend/src/controllers/payments.controller.js */

import mongoose from "mongoose";
import stripe from "../services/stripe.js";
import Booking from "../models/bookings.js"

/**
 * Middleware: validate checkout request
 * Prevent invalid, expired, or replayed payment attempts
 */

export const validateCheckoutRequest = async (req, res, next) => {
try {
    const { bookingId } = req.body;

    // booking id present
    if (!bookingId) {
        return res.status(400).json({ error: "bookingId is required" });
    }

    // BookingId valid
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({ error: "invalid bookingId" });
    }

    // Fetch Booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
    }

    // Status gate - reserved booking may proceed
    if ( booking.status !== "reserved" ) {
        return res.status(400).json({
            error: "Booking is not available for payment",
        });
    }

    // Expiration enforcement
    if (booking.expiresAt < new Date()) {
        booking.status ="expired";
        await booking.save();
        return res.status(400).json({ error: "Booking has expired" });
    }

    // Already paid / refunded safety
    if (booking.paid || booking.paymentIntentId) {
        return res.status(400).json({
            error: "Booking has already been paid",
        });
    }

    // Attach booking for controller use
    req.booking = booking;
    next();
} catch (err) {
    console.error("Checkout validation error:", err);
    res.status(500).json({ error: "Checkout validation failed" })
}

};

/**
 * Controller create Stripe checkout session
 */

export const createCheckoutSession = async ( req, res ) => {
    const booking = req.booking; // injected by middleware

    try {
        // Idempotency: reuse session if exists
        if (booking.checkoutSessionUrl) {
            return res.json({ url: booking.checkoutSessionUrl });
        }

        // Lock booking Before creating Stripe Session
        booking.locked = true;
        await booking.save();

        // Create stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: booking.service },
                        unit_amount: booking.price * 100 // cents
                    },
                    quantity: 1,
                },
            ],

            // Session-level metadata
            metadata: {
                bookingId: booking._id.toString(),
            },

            // PaymentIntet-level metadata (used for refounds)
            payment_intent_data: {
                metadata: {
                    bookingId: booking._id.toString(),
                },
            },

            success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
        });

        // Persis session for idempotency + recovery
        booking.checkoutSessionId = session.id;
        booking.checkoutSessionUrl = session.url;
        await booking.save();

        // Return checkout URL
        res.json({ url: session.url });

    } catch (err) {
        console.error("Sripe checkout error:", err);

        // Unlock booking if stripe creation failed
        await Booking.findByIdAndUpdate(booking._id, {
            locked: false,
        });

        res.status(500).json({ error: "Stripe checkout failed"});
    }
};