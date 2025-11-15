import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
    const navigate = useNavigate()
  return (
    <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/backgroundImage.jpg")] bg-cover bg-center h-screen'>
      <img src={assets.marvelLogo} alt="" className='max-h-11 lg:h-11 mt-20'/>

      <h1 className='text-5xl md:text-[70px] md:leading-tight font-semibold max-w-2xl'>Avengers:Age of ultron</h1>
      <div className='flex items-center gap-4 text-gray-300'>
        <span>Action | Sci-fi | Adventure | Superhero</span>
        <div className='flex items-center gap-1'>
            <CalendarIcon className='w-5 h-5' />2015
        </div>
        <div className='flex items-center gap-1'>
            <ClockIcon className='w-5 h-5' />2h 21m
        </div>
      </div>
      <p className='max-w-md text-gray-300'>When Tony Stark and Bruce Banner try to jump-start a dormant peacekeeping program called Ultron, things go horribly wrong and it's up to Earth's mightiest heroes to stop the villainous Ultron from enacting his terrible plan.</p>

      <button onClick={()=>navigate('/movies')} className='flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>Explore Movies
        <ArrowRight className='w-5 h-5' />
      </button>
    </div>
  )
}

export default HeroSection