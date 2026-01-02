import React from 'react'
import { FaSearch, FaCode, FaHandshake } from 'react-icons/fa'
import teamWorkIllustration from '../../assets/Team work-rafiki.svg'

const SubHeader = () => {
  return (
    <main className="flex-grow bg-gradient-to-r from-[#eaeafa] via-[#f2f2fa] to-[#e3f1f7] px-4 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Text Content */}
        <div className="text-center lg:text-left">
          <h3 className="text-3xl md:text-4xl font-bold mb-3">
            Find Your Perfect Team
          </h3>
          <p className="text-gray-600 text-lg mb-6">
            Join hands with passionate coders and innovators to build amazing projects together.
          </p>
          
          {/* Feature highlights */}
          <div className="space-y-3">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="bg-[#6465F4] p-2 rounded-lg">
                <FaSearch className="text-white text-lg" />
              </div>
              <span className="text-gray-700">Search teams by hackathon and skills</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="bg-[#7A72F3] p-2 rounded-lg">
                <FaCode className="text-white text-lg" />
              </div>
              <span className="text-gray-700">Match with developers sharing your interests</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="bg-[#8E86F5] p-2 rounded-lg">
                <FaHandshake className="text-white text-lg" />
              </div>
              <span className="text-gray-700">Join teams or recruit members for yours</span>
            </div>
          </div>
        </div>
        
        {/* Right side - Illustration */}
        <div className="flex justify-center lg:justify-end">
          <img 
            src={teamWorkIllustration} 
            alt="Team Work Illustration" 
            className="w-full max-w-xs lg:max-w-sm animate-float"
          />
        </div>
      </div>
    </main>
  )
}

export default SubHeader
