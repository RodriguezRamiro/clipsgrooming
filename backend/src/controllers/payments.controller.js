/* //backend/src/controllers/payments.controller.js */

import stripe from "../services/stripe.js";
import Booking from "../models/bookings.js"

export const createCheckoutSession = async ( req, res ) => {
    try {
        const { bookingId } = req.body;

        // Validate Input
        if (!bookingId) {
            return res.status(400).json({ error: "bookingId is required" });
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

        // Hard expiration enforcement
        if (booking.expiresAt < new Date()) {
            booking.status ="expired";
            await booking.save();
            return res.status(400).json({ error: "Booking has expired" });
        }

        // Idempotency: reuse existing checkout session if present
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
                            name: booking.service,
                        },
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

            success_url: `${process.env.FRONTEND_URL}/payment-sucess`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
        });

        // Persis session for idempotency + recovery
        booking.checkoutSessionId = session.id;
        booking.checkoutSessionURL = session.url;
        await booking.save();

        // Return checkout URL
        res.json({ url: session.url });

    } catch (err) {
        console.error("Sripe checkout error:", err);

        // Optional: unlock booking if stripe creation failed
        if (err && err.bookingId) {
            await Booking.findByIdAndUpdate(err.bookingId, { locked: false });
        }

        res.status(500).json({ error: "Stripe checkout failed"});
    }
};