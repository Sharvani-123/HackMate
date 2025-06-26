import React, { useState } from "react";
import { FaCalendar,FaHeart } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";

const hackathonsData = [
  {
    name: "TechCrunch Disrupt",
    deadline: "Dec 15, 2024",
    tags: ["Web Dev", "AI/ML", "Blockchain"],
    teamSize: "3-4",
    college: "Cross-College",
    link: "https://techcrunch.com/events/disrupt/",
  },
  {
    name: "Smart India Hackathon",
    deadline: "Jan 20, 2025",
    tags: ["IoT", "Healthcare"],
    teamSize: "5-6",
    college: "Same College",
    link: "https://www.sih.gov.in/",
  },
  {
    name: "NASA Space Apps",
    deadline: "Oct 5, 2024",
    tags: ["Space Tech", "Data Science"],
    teamSize: "2-5",
    college: "Cross-College",
    link: "https://www.spaceappschallenge.org/",
  },
  {
    name: "Google Developer Challenge",
    deadline: "Nov 30, 2024",
    tags: ["Android", "Flutter", "Cloud"],
    teamSize: "1-3",
    college: "Cross-College",
    link: "https://developers.google.com/community/gdsc-solution-challenge",
  },
  {
    name: "Facebook Hackathon",
    deadline: "Feb 14, 2025",
    tags: ["Social Media", "React"],
    teamSize: "2-4",
    college: "Same College",
    link: "https://www.facebook.com/hackathon/",
  },
  {
    name: "Microsoft Imagine Cup",
    deadline: "Mar 10, 2025",
    tags: ["Azure", "AI", ".NET"],
    teamSize: "3-4",
    college: "Cross-College",
    link: "https://imaginecup.microsoft.com/",
  },
];

const collegeBadge = {
  "Cross-College": "bg-red-100 text-red-500",
  "Same College": "bg-green-100 text-green-500",
};

const BrowseHackathons = ({
  search = "",
  domain = "All Domains",
  teamSize = "Team Size",
  college = "All Colleges",
}) => {
  // Filtering logic
  const filtered = hackathonsData.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase());
    const matchesDomain =
      domain === "All Domains" || h.tags.includes(domain);
    const matchesTeam =
      teamSize === "Team Size" || h.teamSize === teamSize;
    const matchesCollege =
      college === "All Colleges" || h.college === college;
    return matchesSearch && matchesDomain && matchesTeam && matchesCollege;
  });

  // Pagination logic
  const PAGE_SIZE = 6;
  const [page, setPage] = useState(1);
  const total = filtered.length;
  const start = (page - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, total);
  const visible = filtered.slice(start, end);

  const handleNext = () => {
    if (end < total) setPage(page + 1);
  };
  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-6xl px-2 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {visible.map(h => (
            <div
              key={h.name}
              className="bg-white rounded-xl shadow p-5 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <a
              href={h.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-lg cursor-pointer text-black hover:underline transition">
              {h.name}
            </a>
               <span
  className={`w-28 text-center truncate px-3 py-1 rounded-full text-xs font-semibold ${collegeBadge[h.college] || "bg-gray-100 text-gray-500"}`}
>
  {h.college}
</span>
              </div>
              <div className="text-gray-600 text-sm flex items-center gap-2">
                <span role="img" aria-label="calendar"><FaCalendar className="text-gray-590"/></span>
                Deadline: {h.deadline}
              </div>
              <div className="flex flex-wrap gap-2 my-1">
                {h.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-gray-600 text-sm flex items-center gap-2">
                <span role="img" aria-label="team"><HiUserGroup  size={18} className="text-gray-590" /></span>
                Team Size: {h.teamSize} members
              </div>
              <div className="flex gap-2 mt-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-[#6465F4] cursor-pointer hover:bg-[#6e36ff] text-white rounded-lg py-2 font-semibold text-sm shadow transition">
                 <FaHeart /> I'm Interested
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg py-2 font-semibold text-sm shadow transition">
                  <HiUserGroup  size={18} className="text-gray-590" /> Find Team
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination/Load More */}
        {total > PAGE_SIZE && (
          <div className="flex flex-col items-center gap-2 pb-8">
            {/* <div className="text-gray-500 text-sm">
              {end}/{total} shown
            </div> */}
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg font-semibold ${page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#755fe1] text-white cursor-pointer hover:bg-[#6e36ff]"}`}
              >
                Prev
              </button>
              <button
                onClick={handleNext}
                disabled={end >= total}
                className={`px-4 py-2 rounded-lg font-semibold ${end >= total ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#755fe1] text-white cursor-pointer hover:bg-[#6e36ff]"}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseHackathons;