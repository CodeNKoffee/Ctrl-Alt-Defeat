import React, { useState } from 'react';

export default function IndustryFilter({ selectedIndustry, setSelectedIndustry, industries }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  // Filter industries based on search
  const filteredIndustries = industries.filter((industry) =>
    industry.toLowerCase().includes(search.toLowerCase())
  );

  // Handle selection
  const handleSelect = (value) => {
    setSelectedIndustry(value);
    setSearch('');
    setOpen(false);
  };

  return (
    <div className="relative min-w-[200px]">
      <div
        className="w-full"
        tabIndex={0}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
      >
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={selectedIndustry || 'All Industries'}
          className="appearance-none w-full bg-white/80 backdrop-blur-sm border-2 hover:border-metallica-blue-300 hover:cursor-pointer text-sm text-gray-800 py-2 px-4 pr-8 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-metallica-blue-300 focus:border-metallica-blue-400 transition-all duration-300"
          onClick={() => setOpen(true)}
        />
        {/* Dropdown Arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
        {open && (
          <div className="absolute left-0 right-0 mt-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
            <div
              className={`px-4 py-2 text-sm text-gray-700 hover:bg-metallica-blue-100 rounded-xl cursor-pointer ${selectedIndustry === '' ? 'bg-metallica-blue-100' : ''}`}
              onMouseDown={() => handleSelect('')}
            >
              All Industries
            </div>
            {filteredIndustries.map((industry) => (
              <div
                key={industry}
                className={`px-4 py-2 text-sm text-gray-700 hover:bg-metallica-blue-100 rounded-xl cursor-pointer ${selectedIndustry === industry ? 'bg-metallica-blue-100' : ''}`}
                onMouseDown={() => handleSelect(industry)}
              >
                {industry}
              </div>
            ))}
            {filteredIndustries.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-400">No matches</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 