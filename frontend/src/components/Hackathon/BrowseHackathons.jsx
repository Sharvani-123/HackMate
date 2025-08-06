import React, { useState, useEffect } from "react";
import { FaCalendar, FaHeart } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import { auth } from "../../firebase";

// Backend API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get Firebase token
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  return await user.getIdToken();
};

const collegeBadge = {
  "Cross College": "bg-red-100 text-red-500",
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
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 6
  });

  // Fetch hackathons from Express backend
  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        setLoading(true);
        
        const token = await getAuthToken();
        
        // Build query parameters for filtering
        const queryParams = new URLSearchParams();
        queryParams.append('page', pagination.currentPage.toString());
        queryParams.append('limit', pagination.itemsPerPage.toString());
        if (search) queryParams.append('search', search);
        if (domain !== "All Domains") queryParams.append('tag', domain);
        if (teamSize !== "Team Size") queryParams.append('teamSize', teamSize);
        if (college !== "All Colleges") queryParams.append('college', college);
        
        const url = `${API_BASE_URL}/hackathons?${queryParams.toString()}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch hackathons:', errorText);
          throw new Error(`Failed to fetch hackathons: ${response.status}`);
        }
        
        const result = await response.json();
        setHackathonsData(result.data || []);
        setPagination(result.pagination || {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 6
        });
      } catch (error) {
        console.error('Error fetching hackathons:', error);
        setHackathonsData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHackathons();
  }, [search, domain, teamSize, college, pagination.currentPage]); // Re-fetch when filters change OR page changes

  // Backend handles pagination, so we display all returned data
  const visible = hackathonsData;

  const handleNext = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        currentPage: prev.currentPage + 1
      }));
    }
  };
  
  const handlePrev = () => {
    if (pagination.currentPage > 1) {
      setPagination(prev => ({
        ...prev,
        currentPage: prev.currentPage - 1
      }));
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  }, [search, domain, teamSize, college]);

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
                Deadline: {h.deadline ? new Date(h.deadline).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }) : "Not specified"}
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
        {/* Server-side Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col items-center gap-2 pb-8">
            <div className="text-sm text-gray-600 mb-2">
              Page {pagination.currentPage} of {pagination.totalPages} 
              ({pagination.totalItems} total hackathons)
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={pagination.currentPage === 1}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  pagination.currentPage === 1 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                    : "bg-[#755fe1] text-white cursor-pointer hover:bg-[#6e36ff]"
                }`}
              >
                Prev
              </button>
              <button
                onClick={handleNext}
                disabled={pagination.currentPage >= pagination.totalPages}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  pagination.currentPage >= pagination.totalPages 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                    : "bg-[#755fe1] text-white cursor-pointer hover:bg-[#6e36ff]"
                }`}
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