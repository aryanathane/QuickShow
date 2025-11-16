import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../assets/assets'
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
// import { useAppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'

const MyBookings = () => {
    // const { axios , getToken , user , image_base_url} = useAppContext()

  const currency = import.meta.env.VITE_CURRENCY

  const [bookings , setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getMyBookings = async ()=>{
    setBookings(dummyBookingData)
    setIsLoading(false)

    // try {
    //   const {data} = await axios.get('/api/user/bookings',{headers : {Authorization: `Bearer ${await getToken()} `}})

    //   if(data.success){
    //     setBookings(data.booking)
    //     // Debug: Log the booking data to see the structure
    //     console.log('Booking data:', data.booking)
    //   }

    // } catch (error) {
    //   console.log(error)
    // }
    // setIsLoading(false)
  }

  useEffect(()=>{
    // if(user){
      getMyBookings()
    // }
  },[])

  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>
      <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>
      {bookings.length === 0 ? (
        <div className='text-center text-gray-400 mt-10'>
          <p>No bookings found</p>
        </div>
      ) : (
        bookings.map((item,index)=>(
          <div key={index} className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg p-2 mt-4 max-w-3xl'>
            <div className='flex flex-col md:flex-row'>
              {/* image_base_url + */}
              <img src={  item.show.movie.poster_path} alt="" className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded'/>
              <div className='flex flex-col p-4 '>
                <p className='text-lg font-semibold'>{item.show.movie.title}</p>
                <p className='text-gray-400 text-sm'>{timeFormat(item.show.movie.runtime)}</p>
                <p className='text-gray-400 text-sm mt-auto'>
                  {(() => {
                    // Try different possible date field names
                    const dateToFormat = item.show.showDateTime || item.show.showDataTime || item.show.date;
                    if (dateToFormat && dateToFormat !== 'Invalid Date') {
                      try {
                        return dateFormat(dateToFormat);
                      } catch (error) {
                        console.log('Date format error:', error);
                        return 'Show time not available';
                      }
                    }
                    return 'Show time not available';
                  })()}
                </p>
              </div>
            </div>
            <div className='flex flex-col md:items-end md:text-right justify-between p-4'>
                  <div className='flex items-center gap-4'>
                    <p className='text-2xl font-semibold mb-3'> {currency}{item.amount} </p>
                    {/* {!item.isPaid && <Link to={item.paymentLink} className='bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer'>Pay Now</Link> } */}
                    
                  </div>
                  <div className='text-sm'>
                    {/* Enhanced seat display with better debugging
                    <p><span className='text-gray-400'>Total tickets:</span> {
                      (() => {
                        const seats = item.bookedSeats || item.selectedSeats || item.seats;
                        if (Array.isArray(seats)) {
                          return seats.length;
                        } else if (seats && typeof seats === 'object') {
                          return Object.keys(seats).length;
                        }
                        return 'not Avaliable';
                      })()
                    }</p> */}
                    {/* <p><span className='text-gray-400'>Seat numbers:</span> {
                      (() => {
                        const seats = item.bookedSeats || item.selectedSeats || item.seats;
                        console.log('Processing seats for display:', seats, 'Type:', typeof seats);
                        
                        if (Array.isArray(seats) && seats.length > 0) {
                          return seats.join(", ");
                        } else if (seats && typeof seats === 'object' && !Array.isArray(seats)) {
                          // Handle case where seats might be stored as an object
                          const seatKeys = Object.keys(seats);
                          return seatKeys.length > 0 ? seatKeys.join(", ") : "Not available";
                        }
                        return "Not available";
                      })()
                    }</p> */}
                    
                    
                  </div>
            </div>
          </div>
        ))
      )}
    </div>
  ) : <Loading/>
}

export default MyBookings