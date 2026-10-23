import stripe from "stripe";
import Booking from '../models/Booking.js'
import { inngest } from "../inngest/index.js";

export const stripeWebhooks = async (request, response) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];

    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        return response.status(400).send(`Webhooks Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                const sessionList = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id
                })
                const session = sessionList.data[0];
                const bookingId = session?.metadata?.bookingId;

                if (!bookingId) {
                    console.log('payment_intent.succeeded without a bookingId, ignoring:', paymentIntent.id);
                    break;
                }

                // Atomic: only flips unpaid -> paid once, even if Stripe delivers the event twice.
                const justPaid = await Booking.findOneAndUpdate(
                    { _id: bookingId, isPaid: false },
                    { isPaid: true, paymentLink: "" },
                    { new: true }
                );

                // Null means: already paid (duplicate delivery) OR booking was cancelled.
                const booking = justPaid || await Booking.findById(bookingId);

                if (booking && booking.isPaid) {
                    // Deterministic event id => Inngest drops duplicates, so a retry
                    // can safely re-send without emailing the customer twice.
                    await inngest.send({
                        id: `show-booked-${bookingId}`,
                        name: "app/show.booked",
                        data: { bookingId }
                    })
                    break;
                }

                // Booking no longer exists: the customer paid after the hold expired.
                // Refund instead of taking money for a ticket that does not exist.
                try {
                    await stripeInstance.refunds.create({ payment_intent: paymentIntent.id });
                    console.log('Refunded payment for cancelled booking:', bookingId);
                } catch (refundError) {
                    if (refundError.code !== 'charge_already_refunded') throw refundError;
                }
                break;
            }
            default:
                console.log('unhandled event type:', event.type);
        }
        response.json({ received: true })
    } catch (error) {
        console.error("Webhook processing error:", error);
        response.status(500).send("Internal server error");
    }
}