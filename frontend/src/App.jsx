import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react'
import Home from './pages/Home';
import Teams from './pages/Teams';
import Hackathons from './pages/Hackathons';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css'

import React from 'react'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Home/>} />
        <Route path="/teams" element={<Teams/>}/>
        <Route path="/hackathons" element={<Hackathons/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
      </Routes>
    </Router>
  )
}

export default App
