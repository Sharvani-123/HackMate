import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import logo from '../assets/iconLogo.png';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiBell, FiUser, FiLogOut } from 'react-icons/fi';

const HeaderInside = () => {
  const location = useLocation(); // 👈 Get current route
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const linkClass = (path) =>
    `px-3 py-2 text-md font-medium transition-colors ${
      currentPath === path ? 'text-[#6465F4]' : 'text-gray-600 hover:text-[#6465F4]'
    }`;
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsOpen(false); // close mobile nav if open
      navigate('/'); // redirect to home page
    } catch (error) {
      console.error('Logout error:', error);
      alert("Logout failed. Please try again.");
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
          <Link to="/hackathons" className={linkClass("/hackathons")}>
            Hackathons
          </Link>
          <Link to="/teams" className={linkClass("/teams")}>
            Teams
          </Link>
          <Link to="/messages" className={linkClass("/messages")}>
            Messages
          </Link>
        </nav>

        {/* Icons */}
        <div className="hidden md:flex items-center space-x-6">
          <button className="text-gray-600 hover:text-primary">
            <FiBell size={20} />
          </button>
          <Link to="/profile" className="text-gray-600 hover:text-primary">
            <FiUser size={20} />
          </Link>
          <button onClick={handleLogout} className="text-gray-600 hover:text-red-500">
            <FiLogOut size={20} />
          </button>
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
            <Link to="/hackathons" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary transition-colors">
              Hackathons
            </Link>
            <Link to="/teams" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary transition-colors">
              Teams
            </Link>
            <Link to="/messages" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary transition-colors">
              Messages
            </Link>
            <Link to="/profile" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary transition-colors">
              Profile
            </Link>
            <button onClick={() => { setIsOpen(false); handleLogout(); }} className="text-gray-600 hover:text-red-500 text-left">
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default HeaderInside;
