import React from "react";

const domains = [
  "All Domains",
  "Web Dev",
  "AI/ML",
  "Blockchain",
  "IoT",
  "Game Dev",
  "Data Science",
  "Cybersecurity",
  "UI/UX Design",
  "Healthcare",
  "Space Tech",
  "Cloud",
  "Android",
  "Flutter",
  "React",
  "Azure",
  ".NET",
];

const colleges = [
  "All Colleges",
  "Same College",
  "Cross-College",
];

const teamSizes = [
  "Team Size",
  "1-3",
  "2-4",
  "3-4",
  "5-6",
];

const FilterHack = ({
  search,
  setSearch,
  domain,
  setDomain,
  teamSize,
  setTeamSize,
  college,
  setCollege,
}) => {
  return (
     <div className="w-full bg-white flex justify-center">
    <div className="w-full max-w-6xl px-1">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between py-6 px-2 md:px-6">
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search hackathons..."
        className="w-full md:w-2/3 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#6e36ff] bg-gray-50"
      />
      {/* Domain */}
      <select
        value={domain}
        onChange={e => setDomain(e.target.value)}
        className="w-full md:w-auto border border-gray-200 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#6e36ff]"
      >
        {domains.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      {/* Team Size */}
      <select
        value={teamSize}
        onChange={e => setTeamSize(e.target.value)}
        className="w-full md:w-auto border border-gray-200 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#6e36ff]"
      >
        {teamSizes.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      {/* College */}
      <select
        value={college}
        onChange={e => setCollege(e.target.value)}
        className="w-full md:w-auto border border-gray-200 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#6e36ff]"
      >
        {colleges.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
     </div>
    </div>
  );
};

export default FilterHack;