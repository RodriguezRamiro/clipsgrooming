/* backend/src/services/bookingActions.js */

import Booking from "../models/bookings.js";

// Mark booking as paid (Stripe success)

export async function markBookingPaid({
    bookingId,
    paymentIntentId,
}) {
    await Booking.findOneAndUpdate(

        {
            _id: bookingId,
            status: { $in: ["reserved", "expired"] }
        },

        {
            $set: {
                status: "paid",
                paid: true,
                locked: true,
                paidAt: new Date(),
                paymentIntentId,
            },
        },
        { new: true }
    )


}

// Refund booking (admin Or Stripe)

export async function refundBooking({ bookingId }) {
    await Booking.findOneAndUpdate(
        {
            _id: bookingId,
            status: "paid",
        },
        {
            $set: {
                status: "refunded",
                paid: false,
                locked: false,
                refundedAt: new Date(),
            },
        },
        { new: true }
    );
}

// Cancel booking (admin-only, no Stripe)
export async function cancelBooking({ bookingId }) {
    await Booking.findOneAndUpdate(
        {
            _id: bookingId,
            status: "reserved",
        },
        {
            $set: {
                status: "cancelled",
                locked: false,
            },
        },
        { new: true }
    );
}