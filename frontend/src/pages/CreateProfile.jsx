import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiUserPlus } from "react-icons/fi";
import Header from "../components/Header";
import Select from "react-select";
import Footer from "../components/Footer";
import colleges from "../data/colleges.json";

const BRANCHES = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
  "Chemical",
  "Other",
];

const YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Other",
];

const INTERESTS = [
  "Web Development",
  "Mobile Apps",
  "AI/ML",
  "Blockchain",
  "IoT",
  "Game Development",
  "Data Science",
  "Cybersecurity",
  "UI/UX Design",
];

const universityOptions = Array.from(
  new Set(
    colleges
      .filter((item) => item.university) // filter out entries without university
      .map((item) => item.university)
  )
)
  .sort()
  .map((uni) => ({ label: uni, value: uni }))
  .concat([{ label: "Other", value: "Other" }]);

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#fff",
    borderColor: state.isFocused ? "#6e36ff" : "#d1d5db", // Tailwind gray-300
    boxShadow: state.isFocused ? "0 0 0 1.5px #6e36ff" : "none",
    "&:hover": {
      borderColor: "#6e36ff",
    },
    minHeight: "44px",
    borderRadius: "0.5rem", // Tailwind rounded-lg
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#6465F4"
      : state.isFocused
      ? "#f3f4f6"
      : "#fff",
    color: state.isSelected ? "#fff" : "#333",
    fontWeight: state.isSelected ? 600 : 400,
    fontSize: "1rem",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.5rem",
    zIndex: 20,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#333",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9ca3af", // Tailwind gray-400
    fontSize: "1rem",
  }),
  input: (provided) => ({
    ...provided,
    fontSize: "1rem",
    color: "#333",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "#6e36ff" : "#a1a1aa", // Tailwind gray-400
    "&:hover": {
      color: "#6e36ff",
    },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: "#a1a1aa",
    "&:hover": {
      color: "#6e36ff",
    },
  }),
};

const CreateProfile = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    university: "",
    customuniversity: "",
    branch: "",
    year: "",
    skillInput: "",
    skills: ["JavaScript", "Python", "React"],
    interests: [],
    teamingUp: true,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "interests") {
      setForm((prev) => ({
        ...prev,
        interests: checked
          ? [...prev.interests, value]
          : prev.interests.filter((i) => i !== value),
      }));
    } else if (type === "checkbox" && name === "teamingUp") {
      setForm((prev) => ({ ...prev, teamingUp: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  //Handle University
   const handleUniversityChange = (selected) => {
    setForm((prev) => ({
      ...prev,
      university: selected ? selected.value : "",
      customuniversity: "",
    }));
  };

  // Add skill
  const addSkill = () => {
    const skill = form.skillInput.trim();
    if (skill && !form.skills.includes(skill)) {
      setForm((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
        skillInput: "",
      }));
    }
  };

  // Remove skill
  const removeSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  // Add skill on Enter
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here (API call, etc.)
    alert("Profile created!\n" );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
       <main className="flex-grow bg-white px-4 py-7 flex justify-center items-center">
    <div className="bg-white w-full max-w-xl">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-1.5">
        Join <span className="text-[#6465F4]">Hack</span><span className="text-[#7A72F3]">Mate</span>
      </h1>
      <p className="text-gray-600 text-center mb-2">
        Create your profile and start connecting with amazing developers
      </p>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        {/* Full Name */}
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#6e36ff]"
            required
          />
        </div>
        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your.email@college.edu"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#6e36ff]"
            required
          />
        </div>
        {/*University*/}
        <div>
          <label className="block font-medium mb-1">University</label>
           <Select
                options={universityOptions}
                value={
                  form.university
                    ? universityOptions.find(
                        (opt) => opt.value === form.university
                      )
                    : null
                }
                onChange={handleUniversityChange}
                placeholder="Select or search your university"
                isClearable
                styles={customSelectStyles}
                classNamePrefix="react-select"
              />
                {form.university === "Other" && (
                <input
                  type="text"
                  name="customuniversity"
                  value={form.customuniversity}
                  onChange={handleChange}
                  placeholder="Enter your university name"
                  className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#6e36ff]"
                  required
                />
              )}
        </div>
        {/* Branch & Year */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">Branch</label>
            <select
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#6e36ff]"
              required
            >
              <option value="">Select your branch</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">Year of Study</label>
            <select
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#6e36ff]"
              required
            >
              <option value="">Select your year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Skills */}
        <div>
          <label className="block font-medium mb-1">Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center bg-[#e0e0f9] text-[#755fe1] px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-1 text-[#8e8ed9] hover:text-[#755fe1]"
                  aria-label={`Remove ${skill}`}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="skillInput"
              value={form.skillInput}
              onChange={handleChange}
              onKeyDown={handleSkillKeyDown}
              placeholder="Add your skills (press Enter to add)"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#6e36ff]"
            />
            <button
              type="button"
              onClick={addSkill}
              className="bg-[#6c6ce3] cursor-pointer hover:bg-[#6869f5] text-white rounded-lg p-2 transition"
              aria-label="Add skill"
            >
              <FiPlus size={20} />
            </button>
          </div>
        </div>
        {/* Interests */}
        <div>
          <label className="block font-medium mb-1">Interests</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
            {INTERESTS.map((interest) => (
              <label key={interest} className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  name="interests"
                  value={interest}
                  checked={form.interests.includes(interest)}
                  onChange={handleChange}
                  className="accent-[#755fe1]"
                />
                {interest}
              </label>
            ))}
          </div>
        </div>
        {/* Teaming Up */}
        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="font-semibold">Open to teaming up?</div>
            <div className="text-gray-500 text-sm">
              Let others know you&apos;re available for hackathon teams
            </div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="teamingUp"
              checked={form.teamingUp}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#6465F4] transition-all relative">
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></div>
            </div>
          </label>
        </div>
        {/* Submit */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6465F4] to-[#8F6BF9] hover:bg-purple-600 text-white font-semibold py-3 rounded-xl cursor-pointer shadow-md text-lg transition-all transform hover:scale-105"
        >
          <FiUserPlus size={22} />
          Create Account
        </button>
        <div className="text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/signin" className="text-[#755fe1] hover:underline">
            Sign in here
          </Link>
        </div>
      </form>
    </div>
    </main>
    </div>
  );
};

export default CreateProfile;