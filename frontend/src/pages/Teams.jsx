import React from 'react'
import HeaderInside from '../components/HeaderInside'
import Footer from '../components/Footer'
import SubHeader from '../components/Teams/SubHeader'
import SearchByName from '../components/Teams/SearchByName'
import TeamCard from '../components/Teams/TeamCard'

const Teams = () => {
  return (
    <div>
    <HeaderInside/>
    <SubHeader/>
    <SearchByName/>
    <TeamCard/>
    <Footer/>
    </div>
  )
}

export default Teams
