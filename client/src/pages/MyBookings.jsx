import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const POLL_EVERY_MS = 4000
const MAX_POLLS = 30          // 30 x 4s = stop re-checking after 2 minutes

const MyBookings = () => {
    const { axios , getToken , user , image_base_url} = useAppContext()

  const currency = import.meta.env.VITE_CURRENCY

  const [bookings , setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // silent = background re-check, no error toasts
  const getMyBookings = async (silent = false)=>{
    try {
      const {data} = await axios.get('/api/user/bookings',{headers : {Authorization: `Bearer ${await getToken()}`}})

      if(data.success){
        setBookings(data.booking)
      }else if(!silent){
        toast.error(data.message)
      }

    } catch (error) {
      if(!silent) toast.error(error.response?.data?.message || error.message)
    }
    setIsLoading(false)
  }

  useEffect(()=>{
    if(user){
      getMyBookings()
    }
  },[user])

  // Right after paying, Stripe's webhook may take a few seconds to mark the booking as paid.
  // Keep re-checking while something is unpaid, so a paid booking does not keep its "Pay Now" button.
  const hasUnpaid = bookings.some(item => !item.isPaid)

  useEffect(()=>{
    if(!user || !hasUnpaid) return

    let polls = 0
    const timer = setInterval(()=>{
      polls++
      if(polls > MAX_POLLS){
        clearInterval(timer)
        return
      }
      getMyBookings(true)
    }, POLL_EVERY_MS)

    return ()=> clearInterval(timer)
  },[user, hasUnpaid])

  // A booking whose show or movie no longer exists would crash the whole page
  const visibleBookings = bookings.filter(item => item.show?.movie)

  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>
      <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>
      {visibleBookings.length === 0 ? (
        <div className='text-center text-gray-400 mt-10'>
          <p>No bookings found</p>
        </div>
      ) : (
        visibleBookings.map((item)=>(
          <div key={item._id} className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg p-2 mt-4 max-w-3xl'>
            <div className='flex flex-col md:flex-row'>
              <img src={ image_base_url + item.show.movie.poster_path} alt="" className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded'/>
              <div className='flex flex-col p-4 '>
                <p className='text-lg font-semibold'>{item.show.movie.title}</p>
                <p className='text-gray-400 text-sm'>{timeFormat(item.show.movie.runtime)}</p>
                <p className='text-gray-400 text-sm mt-auto'>
                  {item.show.showDateTime ? dateFormat(item.show.showDateTime) : 'Show time not available'}
                </p>
              </div>
            </div>
            <div className='flex flex-col md:items-end md:text-right justify-between p-4'>
                  <div className='flex items-center gap-4'>
                    <p className='text-2xl font-semibold mb-3'> {currency}{item.amount} </p>
                     {/* Stripe checkout is an external site, so a plain link (not router Link) */}
                     {!item.isPaid && item.paymentLink && <a href={item.paymentLink} className='bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer'>Pay Now</a> }
                  </div>
                  <div className='text-sm'>
                    <p><span className='text-gray-400'>Total tickets:</span> {item.bookedSeats?.length || 'Not available'}</p>
                    <p><span className='text-gray-400'>Seat numbers:</span> {item.bookedSeats?.join(", ") || "Not available"}</p>
                  </div>
            </div>
          </div>
        ))
      )}
    </div>
  ) : <Loading/>
}

export default MyBookings