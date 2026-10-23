import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loading from '../components/Loading'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'

const MAX_SEATS = 5               // keep in sync with MAX_SEATS_PER_BOOKING in the server
const SEAT_REFRESH_MS = 15000     // how often seat availability is re-checked

const SeatLayout = () => {

  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]

  const { id, date } = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [show, setShow] = useState(null)
  const [occupiedSeats, setOccupiedSeats] = useState([])
  const [isBooking, setIsBooking] = useState(false)
  const navigate = useNavigate()

  // Refs let the polling timer see current values and ignore stale responses
  const selectedSeatsRef = useRef([])
  selectedSeatsRef.current = selectedSeats
  const activeShowIdRef = useRef(null)

  const { axios, getToken, user } = useAppContext();

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`)
      if (data.success) {
        setShow(data)
      } else {
        toast.error(data.message || 'Could not load this show')
        navigate('/movies')
      }
    } catch (error) {
      toast.error(error.message)
      navigate('/movies')
    }
  }

  const handleTimeSelect = (item) => {
    if (selectedTime?.showId === item.showId) return
    // Seats belong to ONE showtime: never carry them over to another one
    setSelectedTime(item)
    setSelectedSeats([])
    setOccupiedSeats([])
  }

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select time first")
    }
    if (occupiedSeats.includes(seatId)) {
      return toast('This seat is already occupied')
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= MAX_SEATS) {
      return toast(`You can only select ${MAX_SEATS} seats`)
    }

    setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
  }

  const renderSeats = (row, count = 9) => (
    <div key={row} className='flex gap-2 mt-2'>
      <div className='flex flex-wrap items-center justify-center gap-2'>
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isOccupied = occupiedSeats.includes(seatId)
          const isSelected = selectedSeats.includes(seatId)
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              disabled={isOccupied}
              className={`h-8 w-8 rounded border border-primary/60
                ${isOccupied ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${isSelected ? 'bg-primary text-white' : ''}`}
            >
              {seatId}
            </button>
          )
        })}
      </div>
    </div>
  )

  // silent = background refresh (no error toasts)
  const fetchOccupiedSeats = async (showId, silent = false) => {
    try {
      const { data } = await axios.get(`/api/booking/seats/${showId}`)

      // The user switched showtime while this request was in flight: ignore it
      if (activeShowIdRef.current !== showId) return

      if (!data.success) {
        if (!silent) toast.error(data.message)
        return
      }

      setOccupiedSeats(data.occupiedSeats)

      // Someone else took a seat this user had selected: drop it and tell them
      const lostSeats = selectedSeatsRef.current.filter(seat => data.occupiedSeats.includes(seat))
      if (lostSeats.length) {
        setSelectedSeats(prev => prev.filter(seat => !data.occupiedSeats.includes(seat)))
        toast.error(`Seat ${lostSeats.join(', ')} just got booked. Please pick another.`)
      }
    } catch (error) {
      if (!silent) toast.error(error.message)
    }
  }

  const bookTickets = async () => {
    if (isBooking) return
    if (!user) {
      return toast.error('Please login to preceed')
    }
    if (!selectedTime || !selectedSeats.length) return toast.error('Please select a time and seats');

    setIsBooking(true)
    let redirecting = false
    try {
      const { data } = await axios.post(
        '/api/booking/create',
        { showId: selectedTime.showId, selectedSeats },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )

      if (data.success) {
        redirecting = true
        window.location.href = data.url;
      } else {
        toast.error(data.message)
        // Seats may have been taken: refresh so the map matches reality
        await fetchOccupiedSeats(selectedTime.showId)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      if (!redirecting) setIsBooking(false)
    }
  }

  useEffect(() => {
    getShow()
  }, [id])

  // Load seats for the chosen showtime, then keep them fresh
  useEffect(() => {
    if (!selectedTime) return

    activeShowIdRef.current = selectedTime.showId
    fetchOccupiedSeats(selectedTime.showId)

    const timer = setInterval(() => fetchOccupiedSeats(selectedTime.showId, true), SEAT_REFRESH_MS)
    return () => clearInterval(timer)
  }, [selectedTime])

  const timings = show?.dateTime?.[date] ?? []

  return show ? (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30'>

      <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-semibold mx-6'>Avaliable Timings</p>
        <div className='mt-5 space-y-1'>
          {timings.length === 0 && (
            <p className='text-sm text-gray-400 mx-6'>No shows on this date</p>
          )}
          {timings.map((item) => (
            <div key={item.showId} onClick={() => handleTimeSelect(item)} className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${selectedTime?.showId === item.showId ? "bg-primary text-white" : "hover:bg-primary/20"}`}>
              <ClockIcon className='w-4 h-4' />
              <p className='text-sm'> {isoTimeFormat(item.time)} </p>
            </div>
          ))}
        </div>
      </div>

      {/* seat layout */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />
        <h1 className='text-2xl font-semibold mb-4'>Select your seat</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>

        <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
          <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
            {groupRows[0].map(row => renderSeats(row))}
          </div>
          <div className='grid grid-cols-2 gap-11'>
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>
                {group.map(row => renderSeats(row))}
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={bookTickets}
          disabled={isBooking}
          className='flex items-center gap-1 mt-10 px-10 py-3 text-sm bg-primary rounded-full hover:bg-primary-dull cursor-pointer active:scale-95 transition font-medium disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {isBooking ? 'Processing...' : 'Proceed to checkout'}
          {!isBooking && <ArrowRightIcon strokeWidth={3} className='w-4 h-4' />}
        </button>
      </div>
    </div>
  ) : (<Loading />)
}

export default SeatLayout