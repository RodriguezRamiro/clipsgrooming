/* //backend/src/controllers/payments.controller.js */

import stripe from "../stripe/stripe.js";
import Booking from "../models/bookings.js"

export const createCheckoutSession = async ( req, res ) => {
    try {
        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId);
        console.log("Booking found?", !!booking);

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        if ( booking.status !== "reserved" ) {
            return res.status(400).json({
                error: "Booking is not available for payment",
            });
        }

        console.log("BookingId from metadata:", bookingId);

        if ( booking.paid || booking.locked) {
            return res.status(400).json({
                error: "This booking has already been paid",
            });
        }
        const sessions = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: booking.service,
                        },
                        unit_amount: booking.price * 100, //cents
                    },
                    quantity: 1,
                },
            ],
            // On success session level metadata
            metadata: {
                bookingId: booking._id.toString(),
            },
            // Payment Intent level metadata on refounds
            payment_intent_data: {
                metadata: {
                    bookingId: booking._id.toString(),
                },
            },
            
            success_url: "http://localhost:5173/payment-success",
            cancel_url: "http://localhost:5173/payment-cancel",
        });

        res.json({ url: sessions.url });
    } catch (err) {
        console.error("Stripe checkout error:", err);
        res.status(500).json({ error: "Stripe checkout failed" });
    }
};