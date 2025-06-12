import React from 'react';

const stats = [
  { value: '1000+', label: 'Active Students' },
  { value: '250+', label: 'Teams Formed' },
  { value: '50+', label: 'Hackathons' },
  { value: '100+', label: 'Projects Built' },
];

const Stats = () => {
  return (
    <section className="bg-[#F9FAFB] mt-16 py-16 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl py-13 m-3 hover:shadow-lg transition"
          >
            <h2 className="text-3xl font-bold text-[#4D4FF6]">{stat.value}</h2>
            <p className=" text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
