import Show from "../models/Show.js";

// Frees seats on a show, but ONLY the ones still owned by this user.
// Safe to run more than once: if someone else has booked a seat since, it is left alone.
const releaseSeats = async (showId, seats, userId) => {
    if (!showId || !Array.isArray(seats) || seats.length === 0) return;

    await Show.bulkWrite(
        seats.map((seat) => ({
            updateOne: {
                filter: { _id: showId, [`occupiedSeats.${seat}`]: userId },
                update: { $unset: { [`occupiedSeats.${seat}`]: "" } },
            },
        }))
    );
};

export default releaseSeats;