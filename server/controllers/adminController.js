import User from "../models/User.js"
import Booking from "../models/Booking.js"
import Show from "../models/Show.js"


// APiI to check if user is admin
export const isAdmin = async (req,res)=>{
    res.json({success:true , isAdmin:true})
}

// API to get dashboard data
export const getDashBoardData = async(req,res)=>{
    try {
        const bookings = await Booking.find({isPaid: true})
        const activeShows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie');

        const totalUser = await User.countDocuments();

        const dashboardData = {
            // Named totalBookings to match what Dashboard.jsx reads
            totalBookings : bookings.length,
            totalRevenue : bookings.reduce((acc,booking)=> acc + booking.amount,0),
            activeShows,
            totalUser,
        }
        res.json({success:true , dashboardData})
    } catch (error) {
        console.error(error);
        res.json({success:false , message:error.message})
    }
}

//API to get all shows
export const getAllShows = async (req, res)=>{
    try {
        const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({showDateTime:1}).lean()

        // occupiedSeats also contains seats that are only HELD for unpaid bookings,
        // so sales and earnings must come from PAID bookings only.
        const showIds = shows.map(show => show._id.toString())
        const paidStats = await Booking.aggregate([
            { $match: { isPaid: true, show: { $in: showIds } } },
            { $group: {
                _id: '$show',
                seatsSold: { $sum: { $size: '$bookedSeats' } },
                earnings: { $sum: '$amount' },
            } }
        ])
        const statsByShow = new Map(paidStats.map(stat => [stat._id, stat]))

        const showsWithStats = shows.map(show => {
            const stats = statsByShow.get(show._id.toString())
            return {
                ...show,
                seatsSold: stats?.seatsSold ?? 0,
                earnings: stats?.earnings ?? 0,
            }
        })

        res.json({success:true , shows: showsWithStats})
    } catch (error) {
        console.error(error);
        res.json({success:false , message:error.message})
        
    }
}

// API to get all bookings
export const getAllBookings = async (req, res)=>{
    try {
        const bookings = await Booking.find({}).populate('user').populate({
            path: "show",
            populate: {path: "movie"}
        }).sort({createdAt:-1})
        res.json({success:true ,bookings})
        
    } catch (error) {
        console.error(error);
        res.json({success:false , message:error.message})
        
    }
}