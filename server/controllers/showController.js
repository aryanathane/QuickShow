import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

// ---------------------------------------------------------------------------
// Timezone handling
// The admin types showtimes as local cinema time (IST). The server (e.g. Vercel)
// runs in UTC, so a bare "2026-10-24T18:00" would be read as 18:00 UTC and show
// up 5h30m late. We therefore pin every showtime to IST explicitly.
// ---------------------------------------------------------------------------
const SHOW_TZ_OFFSET = "+05:30";                    // IST
const SHOW_TZ_OFFSET_MS = 5.5 * 60 * 60 * 1000;

// ("2026-10-24", "18:00") -> Date for 18:00 IST, regardless of server timezone
const parseShowDateTime = (date, time) => {
    const normalizedTime = /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : time;
    const parsed = new Date(`${date}T${normalizedTime}${SHOW_TZ_OFFSET}`);
    if (Number.isNaN(parsed.getTime())) {
        throw new Error(`Invalid show date/time: "${date}" "${time}"`);
    }
    return parsed;
};

// Date -> "YYYY-MM-DD" of the calendar day in IST (not UTC), used to group shows by day
const toShowDateKey = (dateTime) =>
    new Date(new Date(dateTime).getTime() + SHOW_TZ_OFFSET_MS).toISOString().split("T")[0];


export const getNowPlayingMovies = async(req, res)=>{
    try {
        const {data} =  await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: {Authorization: `Bearer ${process.env.TMDB_API_KEY}`}
        })
        const movies = data.results;
        res.json({success:true , movies: movies})
        
    } catch (error) {
        console.error(error);
        res.json({success: false , message:error.message})
    }
}

//API to add a new show to the database
export const addShow = async(req, res)=>{
    try {
        const {movieId , showsInput , showPrice} = req.body
        let movie = await Movie.findById(movieId)
        if(!movie){
            //Fetch the movie details and credits from TMDB API
            const [movieDetailsResponse , movieCreditResponse ] = await Promise.all([axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {headers: {Authorization: `Bearer ${process.env.TMDB_API_KEY}`}}),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {headers: {Authorization: `Bearer ${process.env.TMDB_API_KEY}`}})
            ]);
            const movieApiData = movieDetailsResponse.data;
            const movieCreditsData = movieCreditResponse.data;

            const movieDetails = {
                _id: movieId,
                title : movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                genres: movieApiData.genres,
                // TMDB's credits endpoint returns the list under "cast" (not "casts")
                casts: movieCreditsData.cast,
                release_date : movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline || "",
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime,
                
            }
            //add movie to the database
            movie = await Movie.create(movieDetails);
        }
        const showsToCreate = [];
        showsInput.forEach(show=>{
            const showDate = show.date;
            show.time.forEach((time)=>{
                showsToCreate.push({
                    movie: movieId,
                    showDateTime: parseShowDateTime(showDate, time),
                    showPrice,
                    occupiedSeats:{}
                })
            })
        });
        if(showsToCreate.length > 0){
            await Show.insertMany(showsToCreate);
        }
        
        res.json({success: true , message:'Show added successfully'})
    } catch (error) {
        console.error(error);
        res.json({success: false , message:error.message})
        
    }
}

//API to get all shows from the database
export const getShows = async (req, res)=>{
    try {
        const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({showDateTime:1});

        //filter unique shows
        const uniqueShows = new Set(shows.map(show => show.movie))
        res.json({success:true , shows:Array.from(uniqueShows)})
    } catch (error) {
        console.error(error);
        res.json({success: false , message:error.message})
    }
}

//API to get a single show from the database
export const getShow = async(req , res)=>{
    try {
        const {movieId} = req.params;
        //get all upcoming shows for the movie
        const shows = await Show.find({movie: movieId , showDateTime:{$gte: new Date()}}).sort({showDateTime:1})
        
        const movie = await Movie.findById(movieId)
        if(!movie){
            return res.status(404).json({success:false , message:'Movie not found'})
        }
        const dateTime= {};
        shows.forEach((show)=>{
            // Group by the calendar day in IST, so a 12:30 AM show is not filed under the previous day
            const date = toShowDateKey(show.showDateTime);
            if(!dateTime[date]){
                dateTime[date] = []
            }
            dateTime[date].push({time: show.showDateTime, showId: show._id})
        })
        res.json({success:true , movie, dateTime})
    } catch (error) {
        console.error(error);
        res.json({success:false , message: error.message})
        
    }
}