import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        service: {
            type: String,
            required: true,
        },

        date: {
            type: String, // string is easier for comparison
            required: true,
        },

        time: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        client: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
        },

        status: {
            type: String,
            enum: ["reserved", "paid", "expired"],
            default: "reserved",
        },
        expiresAt: {
            type: date,
            required: true,
        },
        PaidAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

export default mongoose.model("booking", bookingSchema);