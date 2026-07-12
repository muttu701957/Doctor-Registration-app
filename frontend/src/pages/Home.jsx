import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import BloodDonationSection from '../components/BloodDonationSection'

const Home = () => {
  return (
    <div>
   
     <Header />
     <SpecialityMenu />
     <BloodDonationSection />
     <TopDoctors />
     <Banner />
    </div>
  )
}

export default Home
