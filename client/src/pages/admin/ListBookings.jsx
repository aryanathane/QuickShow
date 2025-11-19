import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import Loading from '../../components/Loading'

const ListBookings = () => {
  const { axios, getToken } = useAppContext()
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getAllBookings = async () => {
    try {
      const { data } = await axios.get('/api/admin/bookings', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      
      if (data.success) {
        setBookings(data.bookings)
        console.log('Admin bookings data:', data.bookings)
      }
    } catch (error) {
      console.log('Error fetching admin bookings:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    getAllBookings()
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>All Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className='text-center text-gray-500 mt-10'>
          <p>No bookings found</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {bookings.map((booking, index) => (
            <div key={booking._id || index} className='border border-gray-200 rounded-lg p-4 bg-white shadow-sm'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                
                {/* User Info */}
                <div>
                  <h3 className='font-semibold text-gray-800'>User Details</h3>
                  <p className='text-sm text-gray-600'>ID: {booking.user}</p>
                  <p className='text-sm text-gray-600'>
                    Booking ID: {booking._id ? booking._id.slice(-6) : 'N/A'}
                  </p>
                </div>

                {/* Movie Info */}
                <div>
                  <h3 className='font-semibold text-gray-800'>Movie</h3>
                  <p className='text-sm text-gray-600'>
                    {booking.show?.movie?.title || 'Movie not found'}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Show Date: {booking.show?.showDateTime 
                      ? new Date(booking.show.showDateTime).toLocaleDateString()
                      : 'N/A'
                    }
                  </p>
                </div>

                {/* Booking Details */}
                <div>
                  <h3 className='font-semibold text-gray-800'>Booking Details</h3>
                  <p className='text-sm text-gray-600'>
                    Amount: ₹{booking.amount || 0}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Total Seats: {
                      booking.bookedSeats && Array.isArray(booking.bookedSeats) 
                        ? booking.bookedSeats.length 
                        : 0
                    }
                  </p>
                  <p className='text-sm text-gray-600'>
                    Payment: {booking.isPaid ? 'Paid' : 'Pending'}
                  </p>
                </div>

                {/* Seat Info */}
                <div>
                  <h3 className='font-semibold text-gray-800'>Seats</h3>
                  <p className='text-sm text-gray-600'>
                    {booking.bookedSeats && Array.isArray(booking.bookedSeats) && booking.bookedSeats.length > 0
                      ? booking.bookedSeats.join(', ')
                      : 'No seats data'
                    }
                  </p>
                  <p className='text-sm text-gray-600'>
                    Booked: {booking.createdAt 
                      ? new Date(booking.createdAt).toLocaleDateString()
                      : 'N/A'
                    }
                  </p>
                </div>

              </div>

              {/* Show occupied seats info if available */}
              {booking.show?.occupiedSeats && (
                <div className='mt-4 pt-4 border-t border-gray-200'>
                  <h4 className='font-medium text-gray-700 mb-2'>Show Occupied Seats Info</h4>
                  <p className='text-sm text-gray-600'>
                    Total occupied in show: {
                      typeof booking.show.occupiedSeats === 'object' && booking.show.occupiedSeats !== null
                        ? Object.keys(booking.show.occupiedSeats).length
                        : 0
                    }
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ListBookings