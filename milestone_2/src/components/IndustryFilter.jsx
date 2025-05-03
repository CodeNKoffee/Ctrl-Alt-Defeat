import React from 'react';

export default function IndustryFilter({ selectedIndustry, setSelectedIndustry, industries }) {
  return (
    <div className="relative min-w-[200px]">
      <select
        value={selectedIndustry}
        onChange={(e) => setSelectedIndustry(e.target.value)}
        className="appearance-none w-full bg-white/80 backdrop-blur-sm border-2 hover:border-metallica-blue-300 hover:cursor-pointer text-sm text-gray-800 py-2 px-4 pr-8 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-metallica-blue-300 focus:border-metallica-blue-400 transition-all duration-300"
      >
        <option value="">All Industries</option>
        {industries.map((industry) => (
          <option key={industry} value={industry}>
            {industry}
          </option>
        ))}
      </select>

      {/* Dropdown Arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
} 