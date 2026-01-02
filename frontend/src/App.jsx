import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState,useEffect } from 'react'
import { auth } from './firebase'
import Home from './pages/Home';
import Teams from './pages/Teams';
import Hackathons from './pages/Hackathons';
import About from './pages/About';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import CreateProfile from './pages/CreateProfile';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'

import React from 'react'

const App = () => {
  useEffect(() => {
    // Expose auth for development/testing
    window.auth = auth;
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Home/>} />
        <Route path="/teams" element={<ProtectedRoute><Teams/></ProtectedRoute>}/>
        <Route path="/hackathons" element={<ProtectedRoute><Hackathons/></ProtectedRoute>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path= "/signin" element= {<SignIn/>}/>
        <Route path="/createprofile" element={<CreateProfile />} />
      </Routes>
    </Router>
  )
}

export default App
