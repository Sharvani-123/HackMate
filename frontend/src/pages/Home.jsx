import React from 'react'
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Features from '../components/Features';
import Stats from '../components/Stats';
import Footer from '../components/Footer';
const Home = () => {
  return (
    <div>
      <Header/>
      <HeroSection/>
      <Features/>
      <Stats/>
      <Footer/>
    </div>
  )
}

export default Home
