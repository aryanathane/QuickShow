import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UserIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import BlurCircle from '../../components/BlurCircle';
// import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  // const {axios, getToken , user , image_base_url } = useAppContext()

  const currency = import.meta.env.VITE_CURRENCY

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0
  });
  const [loading , setLoading ] = useState(true);

  const dashboardCards = [
    {title: "Total Bookings" , value: dashboardData.totalBookings || "0", icon:ChartLineIcon},
    {title: "Total Revenue" , value: `${currency || '$'}     ${dashboardData.totalRevenue || "0"}`, icon:CircleDollarSignIcon},
    {title: "Active Shows" , value: dashboardData.activeShows.length || "0", icon:PlayCircleIcon},
    {title: "Total users" , value: dashboardData.totalUser || "0", icon:UserIcon}
  ]

  const fetchDashboardData = async ()=>{
    setDashboardData(dummyDashboardData)
    setLoading(false)
    // try {
    //   const {data} = await axios.get("/api/admin/dashboard",{headers : {Authorization: `Bearer ${await getToken()} `}})
      
    //   if(data.success){
    //     setDashboardData(data.dashboardData)
    //     setLoading(false)
    //   }else{
    //   toast.error(data.message)
    //   }
    
    // } catch (error) {
    //   toast.error("Error fetching dashboard data:",error)
    // }
  }

  useEffect(()=>{
    // if(user){
      fetchDashboardData();
    // }
  },[]);

  return !loading ? (
    <>
      <Title text1="Admin" text2="Dashboard" />

      <div className='relative flex flex-wrap gap-4 mt-6'>
        <BlurCircle top="-100px" left="0" />
        <div className='flex flex-wrap gap-4 w-full'>
          {dashboardCards.map((card,index)=>{
            const IconComponent = card.icon;
            return (<div key={index} className='flex items-center justify-between px-4 py-3 border-y-primary/10 border border-primary/20 rounded-md max-w-50 w-full'>
              <div>
                <h1 className='text-sm'>{card.title}</h1>
                <p className='text-xl font-medium mt-1'>{card.value}</p>
              </div>
              <IconComponent className='w-6 h-6' />
            </div>)
          })}
        </div>
      </div>

      <p className='mt-10 text-lg font-medium' >Active Shows</p>
      <div className='relative flex flex-wrap gap-6 mt-4 max-w-5xl'>
        <BlurCircle top="-100px" left="-10%" />
        {dashboardData.activeShows.map((show)=>(
          <div key={show._id} className='w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300'>
           {/* image_base_url +  */}
            <img src={ show.movie.poster_path} alt="" className='h-60 w-full object-cover' />
            <p className='truncate font-medium p-2'>{show.movie.title}</p>
            <div className='flex items-center justify-between px-2'>
              <p className='text-lg font-medium'>{currency}{show.showPrice}</p>
              <p>
                <StarIcon className='' />
              </p>
            </div>

          </div>
        ))}

      </div>



    </>
      
  ) : <Loading />
}

export default Dashboard
