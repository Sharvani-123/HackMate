import React from 'react'
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';
import logo from '../assets/iconLogo.png';
const Footer = ({footerRef}) => {
  return (
    <footer ref={footerRef} className="bg-[#0E1320] text-gray-400 py-10">
  <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-4">
    {/* Logo + tagline */}
    <div className="flex items-center gap-1">
      <img src={logo} alt="HackMate Logo" className="h-8 w-10" />
      <span className="text-white font-semibold text-xl">HackMate</span>
    </div>
    <p>Connecting passionate developers to build amazing projects together.</p>

    {/* Social Icons */}
    <div className="flex space-x-4 text-xl">
      <a href="#" className="hover:text-white"><FaTwitter /></a>
      <a href="#" className="hover:text-white"><FaGithub /></a>
      <a href="#" className="hover:text-white"><FaLinkedin /></a>
    </div>

    {/* Copyright */}
    <p className="text-sm text-gray-500 pt-4">© 2025 HackMate. All rights reserved.</p>
  </div>
</footer>
  )
}

export default Footer
