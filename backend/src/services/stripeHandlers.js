/* backend/src/services/stripeHandlers.js */

import { markBookingPaid,
         refundBooking } from "./bookingActions.js";

export async function handleStripeEvent(event) {
    switch ( event.type ) {

        case "checkout.session.completed": {
            const session = event.data.object;

            if (session.payment_status !== "paid") return;

            const bookingId = session.metadata?.bookingId;
            if (!bookingId) return;

            const paymentIntentId =
            typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id;

            await markBookingPaid({
                bookingId,
                paymentIntentId,
            });
            break;
        }

        case "charge.refunded": {
            const charge = event.data.object;
            const bookingId = charge.metadata?.bookingId;

            if (!bookingId) return;

            await refundBooking({ bookingId });
            break;
        }
       default:
        // Ignore unhandled events
        console.log("Unhandled Stripe event:", event.type);

        break;
    }
}