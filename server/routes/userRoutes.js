import express from 'express';
import { getFavorites, getUserBooking, updateFavorite } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/bookings',getUserBooking)
userRouter.post('/update-favorite', updateFavorite)
userRouter.get('/favorites',getFavorites)

export default userRouter;
