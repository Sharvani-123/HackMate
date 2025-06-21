import React from 'react'

const SubHeading = () => {
  return (
    <main className="flex-grow bg-gradient-to-r from-[#f5f3ff] via-white to-[#f6f4ff] px-4 py-10 flex justify-center items-center ">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-1.5">
          Explore <span className="text-[#6465F4]">Hack</span><span className="text-[#7A72F3]">athons</span>
        </h1>
        <p className="text-gray-600 text-center mt-3 mb-2">
          Discover amazing hackathons and find your perfect teammates
        </p>
      </div>
    </main>
  )
}

export default SubHeading
