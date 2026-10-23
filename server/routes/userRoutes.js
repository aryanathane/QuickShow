import express from 'express';
import { getFavorites, getUserBooking, updateFavorite } from '../controllers/userController.js';
import { requireUser } from '../middleware/auth.js';

const userRouter = express.Router();

// Every user route needs a signed-in user
userRouter.use(requireUser);

userRouter.get('/bookings', getUserBooking)
userRouter.post('/update-favorite', updateFavorite)
userRouter.get('/favorites', getFavorites)

export default userRouter;