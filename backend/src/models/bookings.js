/* //backend/src/models/bookings.js */

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
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

        status: {
            type: String,
            enum: ["reserved", "paid", "expired"],
            default: "reserved",
            index: true,
        },

        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },
        PaidAt: {
            type: Date,
        },
    },
    { timestamps: true }
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