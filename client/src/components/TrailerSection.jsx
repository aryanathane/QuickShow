import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import BlurCircle from './BlurCircle'
import ReactPlayer from 'react-player'
import { PlayCircleIcon } from 'lucide-react'

const TrailerSection = () => {
    const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])
    const [isPlaying, setIsPlaying] = useState(false)

    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>
            <p className='text-gray-300 font-medium text-lg max-w-[960px] mx-auto'>Trailers</p>
            <div className='relative mt-6 max-w-[960px] mx-auto'>
                <BlurCircle top="-100px" right='-100px' />
                <div className='relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden'>
                    {!isPlaying && (
                        <div className='absolute inset-0 z-10'>
                            <img 
                                src={currentTrailer.image} 
                                alt="trailer thumbnail" 
                                className='w-full h-full object-cover brightness-75'
                            />
                            <button 
                                onClick={() => setIsPlaying(true)}
                                className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20'
                            >
                                <PlayCircleIcon 
                                    strokeWidth={1.5} 
                                    className='w-16 h-16 md:w-20 md:h-20 text-white hover:scale-110 transition-transform cursor-pointer' 
                                />
                            </button>
                        </div>
                    )}
                    <ReactPlayer 
                        url={currentTrailer.videoUrl} 
                        controls={true}
                        playing={isPlaying}
                        width='100%'
                        height='100%'
                        onEnded={() => setIsPlaying(false)}
                    />
                </div>
            </div>

            <div className='grid grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto group'>
                {dummyTrailers.map((trailer) => (
                    <div 
                        key={trailer.image} 
                        className='relative hover:opacity-100 group-hover:opacity-50 hover:-translate-y-1 transition duration-300 max-md:h-60 cursor-pointer' 
                        onClick={() => {
                            setCurrentTrailer(trailer)
                            setIsPlaying(false)
                        }}
                    >
                        <img 
                            src={trailer.image} 
                            alt="trailer" 
                            className='rounded-lg w-full h-full object-cover brightness-75' 
                        />
                        <PlayCircleIcon 
                            strokeWidth={1.6} 
                            className='absolute top-1/2 left-1/2 w-5 h-5 md:w-12 md:h-12 transform -translate-x-1/2 -translate-y-1/2 text-white' 
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TrailerSection