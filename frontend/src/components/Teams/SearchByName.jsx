import React from "react";

const SearchByName = ({
  search,
  setSearch,
  collegeType,
  setCollegeType,
  showMyCollegeOnly,
  setShowMyCollegeOnly,
  myUniversity,
}) => (
  <div className="w-full flex justify-center mb-8">
    <div className="w-full max-w-4xl flex flex-col md:flex-row gap-4 items-center bg-white rounded-xl shadow px-6 py-4">
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search teams by hackathon name..."
        className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#6e36ff] bg-gray-50"
      />
      {/* College Type Filter */}
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-lg font-semibold border ${
            collegeType === "Same College"
              ? "bg-[#6465F4] text-white border-[#6465F4]"
              : "bg-white text-gray-700 border-gray-200"
          }`}
          onClick={() => setCollegeType("Same College")}
        >
          Same College
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold border ${
            collegeType === "Cross College"
              ? "bg-[#6465F4] text-white border-[#6465F4]"
              : "bg-white text-gray-700 border-gray-200"
          }`}
          onClick={() => setCollegeType("Cross College")}
        >
          Cross College
        </button>
      </div>
      {/* Show My College Only Toggle */}
      {myUniversity && (
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showMyCollegeOnly}
            onChange={e => setShowMyCollegeOnly(e.target.checked)}
            className="accent-[#6465F4]"
          />
          <span className="text-gray-700 text-sm">Show My College Only</span>
        </label>
      )}
    </div>
  </div>
);

export default SearchByName;