import { Inngest } from "inngest";
import stripe from "stripe";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import sendEmail from "../configs/nodeMailer.js";
import releaseSeats from "../utils/releaseSeats.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

//Inngest funtion to save user data to a database
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        }
        await User.create(userData)
    }
)

//Inngest funtion to delete user
const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-from-clerk' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { id } = event.data
        await User.findByIdAndDelete(id);
    }
)

//Inngest funtion to update user
const syncUserUpdation = inngest.createFunction(
    { id: 'update-user-from-clerk' },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        }
        await User.findByIdAndUpdate(id, userData)
    }
)

// Cancel an unpaid booking and release its seats 10 minutes after it was created.
const releaseSeatsAndDeleteBooking = inngest.createFunction(
    { id: 'release-seats-delete-booking' },
    { event: "app/checkpayment" },
    async ({ event, step }) => {
        const { bookingId } = event.data;

        await step.sleep('wait-for-10-minutes', '10m');

        // Step 1: close the payment window, then atomically claim the booking.
        const result = await step.run('expire-session-and-cancel-booking', async () => {
            const booking = await Booking.findById(bookingId);

            if (!booking) return { status: 'already-gone' };
            if (booking.isPaid) return { status: 'paid' };

            // Stripe sessions live at least 30 min, so expire it ourselves.
            // After this, the customer can no longer pay for this booking.
            if (booking.stripeSessionId) {
                const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
                try {
                    await stripeInstance.checkout.sessions.expire(booking.stripeSessionId);
                } catch (error) {
                    // Expire fails if the session was already completed or expired.
                    const session = await stripeInstance.checkout.sessions.retrieve(booking.stripeSessionId);
                    if (session.status === 'complete') {
                        // Paid at the last second: keep the booking, the webhook will mark it paid.
                        return { status: 'paid-awaiting-webhook' };
                    }
                    if (session.status !== 'expired') throw error; // unknown problem: let Inngest retry
                }
            }

            // Atomic: deletes only if still unpaid. The webhook uses the matching
            // "update only if unpaid" guard, so exactly one of them wins.
            const deleted = await Booking.findOneAndDelete({ _id: bookingId, isPaid: false });
            if (!deleted) return { status: 'paid' };

            return {
                status: 'cancelled',
                showId: deleted.show,
                userId: deleted.user,
                seats: deleted.bookedSeats,
            };
        });

        // Step 2: free the seats (separate step so a failure here retries only this part).
        if (result.status === 'cancelled') {
            await step.run('release-seats', async () => {
                await releaseSeats(result.showId, result.seats, result.userId);
            });
        }

        return { status: result.status };
    }
);

// Send email when user books a show
const sendBookingConfirmationEmail = inngest.createFunction(
    { id: "send-booking-confirmation-email" },
    { event: "app/show.booked" },
    async ({ event, step }) => {
        const { bookingId } = event.data;

        await step.run('send-confirmation-email', async () => {
            const booking = await Booking.findById(bookingId).populate({
                path: 'show',
                populate: { path: "movie", model: "Movie" }
            }).populate('user');

            if (!booking || !booking.show || !booking.user) {
                return { skipped: true, reason: 'booking, show or user not found' };
            }

            await sendEmail({
                to: booking.user.email,
                subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
                body: `<div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.5;">
                        <h2>Hi ${booking.user.name},</h2>
                        <p>Your booking for <strong style="color: #F84565;">"${booking.show.movie.title}"</strong> is confirmed.</p>
                        <p>
                            <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString('en-us', { timeZone: 'Asia/Kolkata' })} <br/>
                            <strong>Time:</strong> ${new Date(booking.show.showDateTime).toLocaleTimeString('en-us', { timeZone: 'Asia/Kolkata' })}
                        </p>
                        <p>Enjoy the show!!</p>
                        <p>Thanks for booking with us! <br/>--QuickShow Team--</p>
                    </div>`
            })
            return { sent: true };
        });
    }
)

// Send reminders for shows starting within the next 8 hours (job runs every 8 hours)
const sendShowReminders = inngest.createFunction(
    { id: "send-show-reminders" },
    { cron: "0 */8 * * *" },
    async ({ step }) => {
        await step.run('send-reminders', async () => {
            const now = new Date();
            const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);

            // Window now matches the cron interval (it used to be only 10 minutes wide).
            const upcomingShows = await Show.find({
                showDateTime: { $gt: now, $lte: in8Hours }
            }).select('_id');

            if (upcomingShows.length === 0) return { remindersSent: 0 };

            const showIds = upcomingShows.map((show) => show._id.toString());

            const bookings = await Booking.find({
                isPaid: true,
                reminderSent: { $ne: true },
                show: { $in: showIds }
            }).populate({
                path: 'show',
                populate: { path: 'movie', model: 'Movie' }
            }).populate('user');

            let remindersSent = 0;

            for (const booking of bookings) {
                if (!booking.user || !booking.show || !booking.show.movie) continue;

                try {
                    await sendEmail({
                        to: booking.user.email,
                        subject: `Reminder: "${booking.show.movie.title}" show is coming up soon!`,
                        body: `<div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.5;">
                                <h2>Hi ${booking.user.name},</h2>
                                <p>This is a friendly reminder that your show <strong style="color: #F84565;">"${booking.show.movie.title}"</strong> is coming up soon!</p>
                                <p>
                                    <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString('en-us', { timeZone: 'Asia/Kolkata' })} <br/>
                                    <strong>Time:</strong> ${new Date(booking.show.showDateTime).toLocaleTimeString('en-us', { timeZone: 'Asia/Kolkata' })}
                                </p>
                                <p><strong>Seats:</strong> ${booking.bookedSeats.join(', ')}</p>
                                <p>Don't forget to arrive 15 minutes early!</p>
                                <p>See you at the show! <br/>--QuickShow Team--</p>
                            </div>`
                    });

                    await Booking.findByIdAndUpdate(booking._id, { reminderSent: true });
                    remindersSent++;
                } catch (error) {
                    // One bad email must not block everyone else's reminder.
                    console.error(`Reminder failed for booking ${booking._id}:`, error.message);
                }
            }

            return { remindersSent };
        });
    }
);

// Export all Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation, releaseSeatsAndDeleteBooking, sendBookingConfirmationEmail, sendShowReminders];