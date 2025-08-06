import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/iconLogo.png';
import { HiMenu, HiX } from 'react-icons/hi';

const Header = ({ footerRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const scrollToFooter = () => {
    if (footerRef && footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false); // close mobile nav if open
    }
  };
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 w-full">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center text-2xl font-bold text-black">
          <img src={logo} alt="HackMate Logo" className="h-10 w-12 mr-1" />
          HackMate
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-12">
          <Link to="/" className="text-gray-600 px-3 py-2 text-md font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-gray-600 px-3 py-2 text-md font-medium hover:text-primary transition-colors">
            About
          </Link>
          <button
            onClick={scrollToFooter}
            className="text-gray-600 px-3 py-2 text-md font-medium hover:text-primary cursor-pointer transition-colors"
          >
            Contact
          </button>
        </nav>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/signin" className="px-4 py-2 text-md font-medium text-gray-600 hover:text-primary transition-colors">
            Log in
          </Link>
          <Link to="/signin" className="px-4 py-2 rounded bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700 focus:outline-none cursor-pointer">
          {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4">
          <nav className="flex flex-col space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary transition-colors">
              About
            </Link>
            <button onClick={scrollToFooter} className="text-gray-600 hover:text-primary transition-colors text-left">
              Contact
            </button>
            <Link to="/signin" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary transition-colors pt-2 border-t mt-2">
              Log in
            </Link>
            <Link to="/signin" onClick={() => setIsOpen(false)} className="text-white bg-primary py-2 rounded text-center hover:bg-primary/90 transition">
              Sign Up
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
