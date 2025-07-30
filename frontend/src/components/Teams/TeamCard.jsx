import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaLinkedin, FaGithub, FaDiscord, FaEnvelope, FaTrophy } from "react-icons/fa";

const badgeColors = {
  "Cross College": "bg-red-100 text-red-600",
  "Same College": "bg-green-100 text-green-600",
};

const getContactIcon = (url) => {
  if (url.includes("linkedin.com")) return <FaLinkedin />;
  if (url.includes("github.com")) return <FaGithub />;
  if (url.includes("discord.gg") || url.includes("discord.com")) return <FaDiscord />;
  if (url.includes("@")) return <FaEnvelope />;
  return null;
};

const TeamCard = ({
  search = "",
  collegeType = "",
  showMyCollegeOnly = false,
  myUniversity = "",
  onCreateTeam, // callback for create team button
}) => {
  const [teams, setTeams] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const PAGE_SIZE = 4;
  const [page, setPage] = useState(1);

  // Fetch teams from Firestore
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "teams"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(data);
      setLoading(false);
    };
    fetchTeams();
  }, []);

  // Fetch all user profiles and map by email
  useEffect(() => {
    const fetchProfiles = async () => {
      const userDocs = await getDocs(collection(db, "users"));
      const profileMap = {};
      userDocs.forEach((docu) => {
        const data = docu.data();
        if (data.email) profileMap[data.email] = data;
      });
      setProfiles(profileMap);
    };
    fetchProfiles();
  }, []);

  // Filtering logic
  const filtered = teams.filter((team) => {
    const profile = profiles[team.creatorEmail] || {};
    const matchesSearch = team.hackathonName?.toLowerCase().includes(search.toLowerCase());
    const matchesType = !collegeType || team.hackathonType === collegeType;
    const matchesMyCollege = !showMyCollegeOnly || (profile.university === myUniversity);
    return matchesSearch && matchesType && matchesMyCollege;
  });

  // Pagination logic
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
        <span className="text-lg text-gray-500">Loading teams...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {visible.map((team) => {
          const profile = profiles[team.creatorEmail] || {};
          // Members badge color: green if <50%, yellow if <80%, red otherwise
          // let memberColor = memberColors[0];
          // let curr = 1, max = 4;
          // if (team.members) {
          //   const parts = team.members.split("/");
          //   curr = Number(parts[0]) || 1;
          //   max = Number(parts[1]) || 4;
          // }
          // if (curr / max < 0.5) memberColor = memberColors[0];
          // else if (curr / max < 0.8) memberColor = memberColors[1];
          // else memberColor = memberColors[2];

          return (
            <div
              key={team.id}
              className="bg-white rounded-xl shadow p-6 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
  src={
    profile.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profile.name || "U N"
    )}&background=6465F4&color=fff`
  }
  alt={profile.name}
  className="w-10 h-10 rounded-full object-cover"
/>

                  <div>
                    <div className="font-semibold text-base">{profile.name || "Unknown"}</div>
                    <div className="text-xs text-gray-500">
                      {profile.university || ""}
                      {profile.branch ? ` • ${profile.branch}` : ""}
                      {profile.year ? ` • ${profile.year}` : ""}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColors[team.hackathonType] || "bg-gray-100 text-gray-500"}`}
                >
                  {team.hackathonType}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 font-semibold text-lg text-[#6465F4]">
                  <FaTrophy /><span className="text-black">{team.hackathonName}</span>
                  
                </div>
                {/* <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${memberColor}`}
                >
                  {team.members || "1/4"} Members
                </span> */}
              </div>
              <div className="text-gray-700 text-sm mt-1 mb-2">
                {team.description}
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {team.skills &&
                  team.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-3 text-gray-500 text-lg">
                  {team.contact &&
                    team.contact.map((c, i) => (
                      <a
                        key={i}
                        href={c.startsWith("http") ? c : `mailto:${c}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#6465F4] transition"
                      >
                        {getContactIcon(c)}
                      </a>
                    ))}
                </div>
                <button className="bg-[#6465F4] hover:bg-[#6e36ff] cursor-pointer text-white rounded-lg px-6 py-2 font-semibold text-base shadow transition">
                  Request to Join
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div className="flex flex-col items-center gap-2 pb-8">
          <div className="text-gray-500 text-sm">
            {end}/{total} shown
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg font-semibold ${page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#755fe1] text-white hover:bg-[#6e36ff]"}`}
            >
              Prev
            </button>
            <button
              onClick={handleNext}
              disabled={end >= total}
              className={`px-4 py-2 rounded-lg font-semibold ${end >= total ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#755fe1] text-white hover:bg-[#6e36ff]"}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
      {/* Create your own team button */}
      <button
        onClick={onCreateTeam}
        className="mt-4 mb-8 px-6 py-3  cursor-pointer bg-[#6465F4] hover:bg-[#6e36ff] text-white rounded-xl font-semibold text-lg shadow transition"
      >
        Create your own team
      </button>
    </div>
  );
};

export default TeamCard;