/* backend/src/controllers/stripeWebhook.js */

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhookHandler = (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBhook_SECRET
        );

    } catch ( err ) {
        console.error("❌ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Event verefied
    console.log(" Webhook recieved:", event.type);

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object

            console.log("💰 Payment Successful:", session.id);

            // TODO: mark booking as paid
            // session.metadata.nookingId
            break;
        }

        case "payment_intent.payment_failed": {
            console.log("❌ Payment failed")
            break;
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ recieved: true });
};