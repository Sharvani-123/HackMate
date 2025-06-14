import React, { useRef } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Stats from '../components/Stats';
import Footer from '../components/Footer';

const Home = () => {
  const footerRef = useRef(null);

  return (
    <div>
      <Header footerRef={footerRef} />
      <HeroSection />
      <Stats />
      <Footer footerRef={footerRef} />
    </div>
  );
};

export default Home;
