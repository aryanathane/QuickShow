import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";


//API controller function to get User bookings
export const getUserBooking = async(req,res)=>{
    try {
        const user = req.auth().userId;

        const booking = await Booking.find({user}).populate({
            path:"show",
            populate: {path: "movie"}
        }).sort({createdAt: -1})
        console.log('Retrieved bookings:', JSON.stringify(booking, null, 2))
        res.json({success: true , booking})
    } catch (error) {
        console.error(error.message);
        res.json({success: false , message:error.message})
        
    }
}

//API controller function to update favorite movie in clerk User metadata
export const updateFavorite = async(req,res)=>{
    try {
        const {movieId} = req.body
        const userId = req.auth().userId;

        const user = await clerkClient.users.getUser(userId)

        if(!user.privateMetadata.favorites){
            user.privateMetadata.favorites = []
        }

        if(!user.privateMetadata.favorites.includes(movieId)){
            user.privateMetadata.favorites.push(movieId)
        }else{
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter(item=> item!== movieId)
        }

        await clerkClient.users.updateUserMetadata(userId , {privateMetadata: user.privateMetadata})

        res.json({success:true, message:"Favorite added updated"})
    } catch (error) {
        console.error(error.message);
        res.json({success: false , message:error.message})
        
    }
}

export const getFavorites = async(req,res) =>{
    try {
        const user = await clerkClient.users.getUser(req.auth().userId)
        const favorites = user.privateMetadata.favorites;

        //get movies from database
        const movies = await Movie.find({_id: {$in : favorites}})

        res.json({success:true , movies})
    } catch (error) {
        
        console.error(error.message);
        res.json({success: false , message:error.message})
    }
}