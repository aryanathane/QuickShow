import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import sendEmail from "../configs/nodeMailer.js";
import Show from "../models/Show.js";
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
// Inngest function to cancel booking and release seats of show after 10 minutes of booking created if payment is not made
const releaseSeatsAndDeleteBooking = inngest.createFunction(
    {id: 'release-seats-delete-booking'},
    {event: "app/checkpayment"},
    async ({ event, step }) => {
        const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('wait-for-10-minutes', tenMinutesLater);

        await step.run('check-payment-status', async () => {
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId);

            // If payment is not made, release seats and delete booking
            if(!booking.isPaid){
                const show = await Show.findById(booking.show);
                
                // Release each booked seat
                booking.bookedSeats.forEach((seat) => {
                    delete show.occupiedSeats[seat];
                });
                show.markModified('occupiedSeats')
                // Save the updated show
                await show.save();
                
                // Delete the booking
                await Booking.findByIdAndDelete(bookingId);
                
                return { success: true, message: 'Booking cancelled and seats released' };
            }
            
            return { success: true, message: 'Payment completed, booking retained' };
        });
    }
);

// Inngest function to send email when user books a show
const sendBookingConfirmationEmail = inngest.createFunction(
    { id: "send-booking-confirmation-email" },
    { event: "app/show.booked" },
    async ({ event, step }) => {
        const { bookingId } = event.data;

        const booking = await Booking.findById(bookingId).populate({
            path: 'show',
            populate: { path: "movie", model: "Movie" }
        }).populate('user');

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
    }
)
// Inngest Function to send reminders
const sendShowReminders = inngest.createFunction(
    {id: "send-show-reminders"},
    { cron: "0 */8 * * *" }, // Every 8 hours
    async ({ step }) => {
        const now = new Date();
        const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
        const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 1000);

        // Prepare reminder tasks
        await step.run('send-reminders', async () => {
            // Find all bookings with shows in the next 8 hours (with 10 min buffer)
            const upcomingBookings = await Booking.find({
                isPaid: true,
                reminderSent: { $ne: true }
            }).populate({
                path: 'show',
                match: {
                    showDateTime: {
                        $gte: windowStart,
                        $lte: in8Hours
                    }
                },
                populate: { path: 'movie', model: 'Movie' }
            }).populate('user');

            // Filter out bookings where show is null (didn't match the date criteria)
            const validBookings = upcomingBookings.filter(booking => booking.show !== null);

            // Send reminder emails
            for (const booking of validBookings) {
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

                // Mark reminder as sent
                await Booking.findByIdAndUpdate(booking._id, { reminderSent: true });
            }

            return { success: true, remindersSent: validBookings.length };
        });
    }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation, releaseSeatsAndDeleteBooking, sendBookingConfirmationEmail,sendShowReminders];