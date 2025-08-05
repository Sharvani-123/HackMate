import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import logo from '../assets/iconLogo.png';
import { HiMenu, HiX } from 'react-icons/hi';

const Header = ({ footerRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  const scrollToFooter = () => {
    if (footerRef && footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false); // close mobile nav if open
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsOpen(false); // close mobile nav if open
      navigate('/'); // redirect to home page
    } catch (error) {
      console.error('Logout error:', error);
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
          {user && (
            <>
              <Link to="/teams" className="text-gray-600 px-3 py-2 text-md font-medium hover:text-primary transition-colors">
                Teams
              </Link>
              <Link to="/hackathons" className="text-gray-600 px-3 py-2 text-md font-medium hover:text-primary transition-colors">
                Hackathons
              </Link>
            </>
          )}
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
          {user ? (
            // Show logout button when user is signed in
            <>
              <span className="text-gray-600 text-sm">
                Welcome, {user.displayName || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            // Show login/signup buttons when user is not signed in
            <>
              <Link to="/signin" className="px-4 py-2 text-md font-medium text-gray-600 hover:text-primary transition-colors">
                Log in
              </Link>
              <Link to="/signin" className="px-4 py-2 rounded bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
                Sign Up
              </Link>
            </>
          )}
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
            {user && (
              <>
                <Link to="/teams" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary transition-colors">
                  Teams
                </Link>
                <Link to="/hackathons" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary transition-colors">
                  Hackathons
                </Link>
              </>
            )}
            <Link to="/about" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary transition-colors">
              About
            </Link>
            <button onClick={scrollToFooter} className="text-gray-600 hover:text-primary transition-colors text-left">
              Contact
            </button>
            
            {user ? (
              // Show logout for authenticated users
              <>
                <div className="text-gray-600 text-sm pt-2 border-t mt-2">
                  Welcome, {user.displayName || user.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white bg-red-500 py-2 rounded text-center hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              // Show login/signup for non-authenticated users
              <>
                <Link to="/signin" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary transition-colors pt-2 border-t mt-2">
                  Log in
                </Link>
                <Link to="/signin" onClick={() => setIsOpen(false)} className="text-white bg-primary py-2 rounded text-center hover:bg-primary/90 transition">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
