import React from 'react'
import {Link} from 'react-router-dom';
import { FaSearch,FaRocket, FaUsers, FaTrophy } from 'react-icons/fa';
import { FaArrowRightToBracket } from "react-icons/fa6";
const HeroSection = () => {
  return (
   <section  className='px-4 pb-4 bg-gradient-to-bl from-gray-200 via-white to-gray-250 py-16 text-center'>
    <h1 className='text-4xl sm:text-6xl font-bold mb-4'>
      Find your perfect <span className='text-[#4D4FF6]'>hackathon </span>
      <br />
       <span className='text-[#7A72F3]'> teammates</span>
    </h1>
    <p className='text-2xl font-semibold text-gray-600 max-w-3xl mx-auto mb-10'>
      Join Hands with passionate coders in your college.
    </p>
    {/*Feature Cards*/}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 border border-gray-100">
          <div className="text-3xl text-[#4D4FF6] mb-4 mx-auto w-fit"><FaSearch /></div>
          <h3 className="font-semibold mb-3 text-lg text-gray-700">Discover hackathons</h3>
          <p className=" text-gray-500">
            Find exciting hackathons happening in your area and beyond
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 border border-gray-100">
          <div className="text-3xl text-[#4D4FF6] mb-4 mx-auto w-fit"><FaUsers /></div>
          <h3 className="font-semibold mb-3 text-lg text-gray-700">Match with teammates</h3>
          <p className=" text-gray-500">
            Connect with like-minded developers who share your passion
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 ease-in-out  transform hover:scale-105 border border-gray-100">
          <div className="text-3xl text-[#4D4FF6] mb-4 mx-auto w-fit"><FaTrophy /></div>
          <h3 className="font-semibold mb-3 text-lg text-gray-700">Build & Win</h3>
          <p className=" text-gray-500">
            Create amazing projects together and compete for prizes
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <Link
          to="/signup"
          className="px-6 py-3 rounded-xl flex items-center gap-3 text-lg bg-[#6465F4] text-white font-semibold hover:bg-[#7A72F3] transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
        <FaRocket /> Get Started
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 rounded-xl font-semibold flex items-center border-gray-200 gap-3 border-2 text-lg text-gray-900 hover:border-primary transition-all"
        >
          <FaArrowRightToBracket /> Login
        </Link>
      </div>
   </section>
  )
}

export default HeroSection
