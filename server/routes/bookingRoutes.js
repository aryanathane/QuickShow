import express from 'express';
import { createBooking, getOccupiedSeats } from "../controllers/bookingController.js";
import { requireUser } from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post('/create', requireUser, createBooking);
// Public on purpose: the seat map is visible before login
bookingRouter.get('/seats/:showId', getOccupiedSeats);

export default bookingRouter;