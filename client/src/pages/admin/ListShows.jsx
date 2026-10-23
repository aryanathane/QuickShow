import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ListShows = () => {

  const currency = import.meta.env.VITE_CURRENCY

  const {axios, getToken , user } = useAppContext()

  const [shows   , setShows ] = useState([]);
  const [loading , setLoading ] = useState(true);

  const getAllShows = async ()=>{
    try{
      const {data} = await axios.get("/api/admin/all-shows",{
        headers : {Authorization: `Bearer ${await getToken()}`}
      });
      if(data.success){
        setShows(data.shows)
      }else{
        toast.error(data.message)
      }
    }catch(error){
      console.error(error);
      toast.error(error.response?.data?.message || error.message)
    }
    // Always stop the spinner, even when the request fails
    setLoading(false)
  }

  useEffect(()=>{
    if(user){

      getAllShows()
    }
  },[user]);


  return !loading ? (
    <>
      <Title text1="List" text2="Shows"></Title>
      <div className='max-w-4xl mt-6 overflow-x-auto'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className='bg-primary/20 text-left text-white pl-2'>
              <th className='font-medium p-2 pl-5' >Movie Name</th>
              <th className='font-medium p-2'>Show Time</th>
              <th className='font-medium p-2'>Seats Sold</th>
              <th className='font-medium p-2'>Earning</th>
            </tr>
          </thead>
          <tbody className='text-sm font-light'>
            {shows.length === 0 && (
              <tr><td colSpan={4} className='p-4 text-center text-gray-400'>No upcoming shows</td></tr>
            )}
            {shows.map((show)=>(
              <tr key={show._id} className='border border-primary/10 bg-primary/5 even:bg-primary/10'>
                <td className='p-2 min-w-45 pl-5'>{show.movie?.title ?? 'Unknown movie'}</td>
                <td className='p-2'>{dateFormat(show.showDateTime)}</td>
                {/* Paid bookings only: seats merely held for unpaid bookings are not sales */}
                <td className='p-2'>{show.seatsSold}</td>
                <td className='p-2'>{currency} {show.earnings} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ): <Loading/>
}

export default ListShows