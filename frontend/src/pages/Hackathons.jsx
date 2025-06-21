import React from 'react'
import HeaderInside from '../components/HeaderInside'
import Footer from '../components/Footer'
import SubHeading from '../components/Hackathon/SubHeading'
import FilterHack from '../components/Hackathon/FilterHack'
import BrowseHackathons from '../components/Hackathon/BrowseHackathons'
const Hackathons = () => {
  return (
    <div>
    <HeaderInside/>
    <SubHeading/>
    <FilterHack/>
    <BrowseHackathons/>
    <Footer/>
    </div>
  )
}

export default Hackathons
