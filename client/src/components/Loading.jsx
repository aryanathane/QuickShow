import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Loading = () => {
    const {nextUrl} = useParams()
    const navigate = useNavigate()

    useEffect(()=>{
      if(!nextUrl) return

      // Redirect after payment. The bookings page keeps re-checking until the
      // webhook has marked the booking as paid, so this can stay short.
      const timer = setTimeout(()=>{
        navigate('/'+ nextUrl)
      },3000)

      // Clear the timer if the user leaves first
      return ()=> clearTimeout(timer)
    },[nextUrl])

  return (
    <div className='flex justify-center items-center h-[80vh]'>
        <div className='animate-spin rounded-full h-14 w-14 border-2 border-t-primary'></div>
      
    </div>
  )
}

export default Loading