import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import { inngest } from "../inngest/index.js";
import releaseSeats from "../utils/releaseSeats.js";
import stripe from "stripe";

const MAX_SEATS_PER_BOOKING = 5; // keep in sync with MAX_SEATS in client SeatLayout.jsx
// Seat ids become MongoDB field paths, so never allow "." or "$" in them.
const SEAT_ID_PATTERN = /^[A-Za-z0-9]{1,6}$/;

const isValidSeatSelection = (seats) =>
    Array.isArray(seats) &&
    seats.length > 0 &&
    seats.length <= MAX_SEATS_PER_BOOKING &&
    new Set(seats).size === seats.length &&
    seats.every((seat) => typeof seat === "string" && SEAT_ID_PATTERN.test(seat));

// Atomically lock seats: the update only matches if EVERY requested seat is still free.
// Check + write happen in one MongoDB operation, so two users can never both win a seat.
// Also refuses shows that have already started. Returns the updated show (movie populated),
// or null if any seat was already taken or the show is in the past.
const lockSeats = async (showId, seats, userId) => {
    const seatsAreFree = {};
    const markSeatsTaken = {};
    for (const seat of seats) {
        seatsAreFree[`occupiedSeats.${seat}`] = { $exists: false };
        markSeatsTaken[`occupiedSeats.${seat}`] = userId;
    }

    return Show.findOneAndUpdate(
        { _id: showId, showDateTime: { $gt: new Date() }, ...seatsAreFree },
        { $set: markSeatsTaken },
        { new: true }
    ).populate("movie");
};

export const createBooking = async (req, res) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    let userId;
    let showId;
    let selectedSeats;
    let seatsLocked = false;
    let booking = null;
    let session = null;

    // Undo everything this request created, so a failure never leaves seats stuck.
    const rollback = async () => {
        try {
            if (session) {
                await stripeInstance.checkout.sessions.expire(session.id).catch(() => {});
            }
            if (booking) {
                await Booking.findOneAndDelete({ _id: booking._id, isPaid: false });
            }
            if (seatsLocked) {
                await releaseSeats(showId, selectedSeats, userId);
            }
        } catch (rollbackError) {
            // The 10-minute Inngest cleanup is the safety net if this fails.
            console.error("Booking rollback failed:", rollbackError.message);
        }
    };

    try {
        ({ userId } = req.auth());
        ({ showId, selectedSeats } = req.body);
        const { origin } = req.headers;

        if (!userId) {
            return res.json({ success: false, message: "Please sign in to book tickets" });
        }
        if (typeof showId !== "string" || !isValidSeatSelection(selectedSeats)) {
            return res.json({ success: false, message: "Invalid show or seat selection" });
        }

        // 1. Atomically lock the seats (fixes the double-booking race)
        const show = await lockSeats(showId, selectedSeats, userId);
        if (!show) {
            // Tell the user WHY: show already started/ended vs. seats taken
            const stillBookable = await Show.exists({ _id: showId, showDateTime: { $gt: new Date() } });
            return res.json({
                success: false,
                message: stillBookable
                    ? "selected seats are not avaliable"
                    : "This show is no longer available for booking",
            });
        }
        seatsLocked = true;

        // 2. Create the booking
        booking = await Booking.create({
            user: userId,
            show: showId,
            amount: show.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats,
        });

        // 3. Schedule the 10-minute cleanup NOW, before talking to Stripe,
        //    so seats can never stay locked without a cleanup job pending.
        await inngest.send({
            name: "app/checkpayment",
            data: { bookingId: booking._id.toString() },
        });

        // 4. Create the Stripe Checkout session
        const line_items = [
            {
                price_data: {
                    currency: "inr",
                    product_data: { name: show.movie.title },
                    unit_amount: Math.floor(booking.amount) * 100,
                },
                quantity: 1,
            },
        ];

        session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            line_items,
            mode: "payment",
            metadata: { bookingId: booking._id.toString() },
            // Stripe's minimum is 30 minutes. The Inngest job expires the session
            // explicitly at 10 minutes, so nobody can pay for a released booking.
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        });

        booking.paymentLink = session.url;
        booking.stripeSessionId = session.id;
        await booking.save();

        res.json({ success: true, url: session.url, bookingId: booking._id });
    } catch (error) {
        console.log(error.message);
        await rollback();
        res.json({ success: false, message: error.message });
    }
};

export const getOccupiedSeats = async (req, res) => {
    try {
        const { showId } = req.params;
        const showData = await Show.findById(showId);
        if (!showData) {
            return res.json({ success: false, message: "Show not found" });
        }

        const occupiedSeats = Object.keys(showData.occupiedSeats);
        res.json({ success: true, occupiedSeats });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};