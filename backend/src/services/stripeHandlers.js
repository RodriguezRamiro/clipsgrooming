/* backend/src/services/stripeHandlers.js */

import Booking from "../models/bookings.js";
import { markBookingPaid,
         refundBooking } from "./bookingActions.js";
import { sendCustomerConfirmation,
         sendAdminNotification } from "../utils/email.js";

export async function handleStripeEvent(event) {
    const eventId = event.id;

    switch ( event.type ) {

        // Payment completed
        case "checkout.session.completed": {
            const session = event.data.object;
            console.log("Stripe session received:", session.id);

        // Safety gate
            if (session.payment_status !== "paid") return;

            const bookingId = session.metadata?.bookingId;
            console.log("BookinId:", bookingId);

            if (!bookingId) {
                console.warn("stripe session missing bookingId", eventId);
                return;
        }

        // Idempotency check at DB level
            const booking = await Booking.findById(bookingId);
            if (!booking) return;

            if (booking.status === "paid") {
                console.log("Booking already, paid, skipping", bookingId);
                return;
            }

            const paymentIntentId =
            typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id;
                console.log("PaymentIntent:", session.payment_intent);

            if (!paymentIntentId) {
                console.warn("missing paymentIntentId", eventId);
                return;
            }

            await markBookingPaid({
                bookingId,
                paymentIntentId,
            });
            console.log("Booking marked paid:", bookingId);

            // Fetch updated booking
            const updatedBooking = await Booking.findById(bookingId);

            // Send emails
            try {
                await sendCustomerConfirmation(updatedBooking);
                await sendAdminNotification(updatedBooking)
            } catch (emailErr) {
                console.error("email send failed:", emailErr);
            }

            break;
        }

        // Refund Created
        //Send Emails (non-blocking safety)
        case "refund.created": {
            const refund = event.data.object;
            const bookingId = refund.metadata?.bookingId;

            if (!bookingId) {
                console.warn("Refund missing bookingId", eventId);
                break;
            }

            await refundBooking({ bookingId });
            console.log("Booking refunded:", bookingId);
            break;
        }
        //Fallback
       default:
        // Ignore unhandled events
        console.log("Unhandled Stripe event:", event.type);
        break;
    }
}