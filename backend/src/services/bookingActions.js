/* backend/src/services/bookingActions.js */

import Booking from "../models/bookings.js";

// Mark booking as paid (Stripe success)


export async function markBookingPaid({
    bookingId,
    paymentIntentId,
}) {
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.status === "paid") return;

    booking.status = "paid";
    booking.paid = true;
    booking.locked = true;
    booking.paidAt = new Date();
    booking.paymentIntentId = paymentIntentId;

    await booking.save();
}

// Refound booking (admin Or Stripe)

export async function refundBooking({ bookingId }) {
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.status === "refunded" ) return;

    booking.status = refunded;
    booking.paid = false;
    booking.locked = false;
    booking.refoundedAt = new Date();

    await booking.save();
}

// Cancel booking (admin-only, no Stripe)

export async function cancelBooking({ bookingId }) {
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.status === "canclled") return;

    booking.status = "cancelled";
    booking.locked = false;

    await booking.save()
}