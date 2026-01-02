import React from 'react'
import { FaCalendarAlt, FaFilter, FaUsers } from 'react-icons/fa'
import collegeProjectIllustration from '../../assets/college project-cuate.svg'

const SubHeading = () => {
  return (
    <main className="flex-grow bg-gradient-to-r from-[#f5f3ff] via-white to-[#f6f4ff] px-4 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Text Content */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Explore <span className="text-[#6465F4]">Hack</span><span className="text-[#7A72F3]">athons</span>
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Discover amazing hackathons and find your perfect teammates
          </p>
          
          {/* Feature highlights */}
          <div className="space-y-3">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="bg-[#6465F4] p-2 rounded-lg">
                <FaCalendarAlt className="text-white text-lg" />
              </div>
              <span className="text-gray-700">Browse upcoming hackathons in your college</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="bg-[#7A72F3] p-2 rounded-lg">
                <FaFilter className="text-white text-lg" />
              </div>
              <span className="text-gray-700">Filter by domain, team size, and more</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="bg-[#8E86F5] p-2 rounded-lg">
                <FaUsers className="text-white text-lg" />
              </div>
              <span className="text-gray-700">Connect with potential teammates instantly</span>
            </div>
          </div>
        </div>
        
        {/* Right side - Illustration */}
        <div className="flex justify-center lg:justify-end">
          <img 
            src={collegeProjectIllustration} 
            alt="College Project Illustration" 
            className="w-full max-w-xs lg:max-w-sm animate-float"
          />
        </div>
      </div>
    </main>
  )
}

export default SubHeading
