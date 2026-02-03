/* //backend/src/controllers/payments.controller.js */

import Booking from "../models/bookings.js"
import { stripe } from "../server.js";

export const createCheckoutSession = async ( req, res ) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        if ( booking.status !== "reserved") {
            return res.status(400).json({
                error: "Booking is not available for payment",
            });
        }

        const sessions = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "used",
                        product_data: {
                            name: booking.service,
                        },
                        unit_amount: booking.price * 100,
                    },
                    quantity: 1,
                },
            ],
            success_url: "http://localhost:5173/payment-success",
            cancel_url: "http://localhost:5173/payment-cancel",
            metadata: {
                bookingId: booking._id.toString(),
            },
        });

        res.json({ url: sessions.url });
    } catch (err) {
        console.error("Stripe checkout error:", err);
        res.status(500).json({ error: "Stripe checkout failed" });
    }
};