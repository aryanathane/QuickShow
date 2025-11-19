import React from 'react'
import HeroSection from '../components/HeroSection'
import FeatureSelection from '../components/FeatureSelection'
import TrailerSection from '../components/TrailerSection'

const Home = () => {
  return (
    <div>
      {/* console.log('Home component rendering'); */}
      <HeroSection/>
      <FeatureSelection/>
      <TrailerSection/>
    </div>
  )
}

export default Home
