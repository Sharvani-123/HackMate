import React, { useState, useEffect } from "react";
import { FaCalendar, FaHeart } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import { db } from "../../firebase"; 
import { collection, getDocs } from "firebase/firestore";

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
  const [hackathonsData, setHackathonsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch hackathons from Firestore
  useEffect(() => {
    const fetchHackathons = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "hackathons"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHackathonsData(data);
      setLoading(false);
    };
    fetchHackathons();
  }, []);

  // Filtering logic
  const filtered = hackathonsData.filter(h => {
    const matchesSearch = h.name?.toLowerCase().includes(search.toLowerCase());
    const matchesDomain =
      domain === "All Domains" || (h.tags && h.tags.includes(domain));
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

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-16">
        <span className="text-lg text-gray-500">Loading hackathons...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-6xl px-2 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {visible.map(h => (
            <div
              key={h.id || h.name}
              className="bg-white rounded-xl shadow p-5 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <a
                  href={h.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-lg cursor-pointer text-black hover:underline transition"
                >
                  {h.name}
                </a>
                <span
                  className={`w-28 text-center truncate px-3 py-1 rounded-full text-xs font-semibold ${collegeBadge[h.college] || "bg-gray-100 text-gray-500"}`}
                >
                  {h.college}
                </span>
              </div>
              <div className="text-gray-600 text-sm flex items-center gap-2">
                <FaCalendar className="text-gray-590" />
                Deadline: {h.deadline ? new Date(h.deadline).toLocaleDateString("en-GB",{
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }) : ""}
              </div>
              <div className="flex flex-wrap gap-2 my-1">
                {h.tags &&
                  h.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
              <div className="text-gray-600 text-sm flex items-center gap-2">
                <HiUserGroup size={18} className="text-gray-590" />
                Team Size: {h.teamSize} members
              </div>
              <div className="flex gap-2 mt-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-[#6465F4] cursor-pointer hover:bg-[#6e36ff] text-white rounded-lg py-2 font-semibold text-sm shadow transition">
                  <FaHeart /> I'm Interested
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg py-2 font-semibold text-sm shadow transition">
                  <HiUserGroup size={18} className="text-gray-590" /> Find Team
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination/Load More */}
        {total > PAGE_SIZE && (
          <div className="flex flex-col items-center gap-2 pb-8">
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