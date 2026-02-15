/* backend/src/services/stripeHandlers.js */

import Booking from "../models/bookings.js";

export async function handleStripeevent(event, stripe) {
    switch ( event.type) {

        case "chackout.session.completed": {
            const session = event.data.object;
            const bookingId = session.metadata?.bookingId;

            if (!bookingId) return;

            const booking = await Booking.findById(bookingId);
            if (!booking || booking.status === "paid") return;

            const paymentIntentId =
            typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id;

            booking.status = "paid";
            booking.paid = true;
            booking.locked = true;
            booking.paidAt = new Date();
            booking.paymentIntentId = paymentIntentId;

            await booking.save();

            break;
        }

        case "charge.refounded": {
            const charge = event.data.object;
            const bookingId = charge.metadata?.bookingId;

            if (!bookingId) return;

            const booking = await booking.findById(bookingId);
            if (!booking || booking.status === "refounded" ) return;

            booking.status = "refunded";
            booking.paid = false;
            booking.locked = false;

            await booking.save();
            break;
        }

        default:
        // Ignore unhandled events
        break;
    }
}