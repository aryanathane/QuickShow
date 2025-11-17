import { Inngest } from "inngest";

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
            subject: `Payment Confirmation: "${booking.show.movie.title} " booked! `,
            body: `<div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.5;">
                        <h2>Hi ${booking.user.name},</h2>
                         <p>Your booking for <strong style="color: #F84565;"> "${booking.show.movie.title}" </strong> is confirmed.</p>
                            <p>
                                <strong>Date:</strong>${new Date(booking.show.showDateTime).toLocalDateString('en-us', { timeZone: 'Asia/Kolkata' })} <br/>
                                 Date(booking.show.showDateTime).toLocaleTimeString('en-us', { timeZone: 'Asia/Kolkata' })
                             </p>
                        <p>Enjoy the show!!</p>
                        <p>Thanks for booking with us! <br/>--QuickShow Team--</p>
                    </div>`
        })
    }
)


// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation, sendBookingConfirmationEmail];


