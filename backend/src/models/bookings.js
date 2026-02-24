/* //backend/src/models/bookings.js */

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        checkoutSessionId: {
            type: String,
            index: true,
        },

        checkoutSessionUrl: {
            type: String,
        },

        paymentIntentId: {
            type: String,
            index: true,
        },

        // Booking Info

        service: {
            type: String,
            required: true,
            trim: true,
        },

        date: {
            type: String, // YYYY-MM-DD
            required: true,
        },

        time: {
            type: String, // HH:mm
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        client: {
            name: { type: String, required: true, trim: true, },
            phone: { type: String, required: true, trim: true, },
        },

        // Booking lifecycle state

        status: {
            type: String,
            enum: [
                "reserved",
                "paid",
                "cancelled",
                "expired",
                "refunded",
            ],

            default: "reserved",
            required: true,
            index: true,
        },

        // Auto expiration for unpaid reservations
        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },

        locked: {
            type: Boolean,
            default: false,
            index: true,
        },

        // Payment state
        paid: {
            type: Boolean,
            default: false,
        },

        paidAt: {
            type: Date,
        },

        refundedAt: {
            type: Date,
        },
    },
    { timestamp: true }
);

/**
 * Prevent double booking at the db level
 * Only applies to active (reserved/paid) bookings
 */

bookingSchema.index(
    { date: 1, time: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: { $in: ["reserved", "paid"] },
        },
    }
);

export default mongoose.model("Booking", bookingSchema);

