"use client";
import { useState, useEffect } from "react";
import Image from 'next/image';
import Filter from './Filter';
import CardTable from './CardTable';

// Add status colors configuration at the top level
const statusColors = {
  current: 'bg-blue-100 text-blue-800 border-blue-400',
  completed: 'bg-green-100 text-green-800 border-green-400',
  evaluated: 'bg-purple-100 text-purple-800 border-purple-400',
};

// Mock data for interns (replace with API call or database data)
const initialInterns = [
  { 
    id: 1, 
    name: "John Doe", 
    jobTitle: "Software Engineer", 
    status: "current", 
    company: "Tech Corp",
    profilePic: "/public/icons8-avatar-50.png",
    gender: "male"
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    jobTitle: "Marketing Intern", 
    status: "completed", 
    company: "Marketing Co",
    profilePic: "/public/icons8-avatar-50 (1).png",
    gender: "female"
  },
  { 
    id: 3, 
    name: "Bob Johnson", 
    jobTitle: "Data Analyst", 
    status: "current", 
    company: "Data Inc",
    profilePic: "/public/icons8-avatar-50.png",
    gender: "male"
  },
  { 
    id: 4, 
    name: "Alice Brown", 
    jobTitle: "UI/UX Designer", 
    status: "evaluated", 
    company: "Design Studio",
    profilePic: "/public/icons8-avatar-50 (1).png",
    gender: "female"
  },
  { 
    id: 5, 
    name: "Charlie Wilson", 
    jobTitle: "DevOps Intern", 
    status: "current", 
    company: "Cloud Tech",
    profilePic: "/public/icons8-avatar-50.png",
    gender: "male"
  },
  { 
    id: 6, 
    name: "Emma Davis", 
    jobTitle: "Product Manager", 
    status: "evaluated", 
    company: "Product Co",
    profilePic: "/public/icons8-avatar-50 (1).png",
    gender: "female"
  },
];

const AvatarImage = ({ gender }) => {
  return (
    <div className="w-10 h-10 rounded-full bg-[#D9F0F4] p-0.5 flex items-center justify-center shadow-sm">
      <Image
        src={gender === "female" ? "/images/icons8-avatar-50 (1).png" : "/images/icons8-avatar-50.png"}
        alt="Profile"
        width={40}
        height={40}
        className="rounded-full object-cover"
        priority
      />
    </div>
  );
};

export default function CurrentInterns() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("current");
  const [interns, setInterns] = useState(initialInterns);

  // Update filter options to remove duplicate "All"
  const filterOptions = ['Current', 'Completed', 'Evaluated'];

  const handleFilterChange = (value) => {
    setFilter(value ? value.toLowerCase() : 'all');
  };

  const handleSelectIntern = (id) => {
    console.log(`Selected intern with id: ${id}`);
  };

  // Filter logic
  const filteredInterns = interns.filter(intern => {
    const matchesSearch = 
      intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ||
      intern.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#2A5F74] mb-6">My Interns</h1>
      
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search interns by name or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-4 pr-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#318FA8] focus:border-transparent text-sm"
          />
        </div>
        
        <div className="min-w-[200px]">
          <Filter
            options={filterOptions}
            selectedValue={filter === 'all' ? '' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            onChange={handleFilterChange}
            label="Status"
            placeholder="All"  // Changed from "All Interns" to just "All"
            id="status-filter"
          />
        </div>
      </div>

      {/* Interns List */}
      <div className="space-y-4">
        {filteredInterns.map((intern) => (
          <div 
            key={intern.id} 
            className="bg-white p-6 rounded-xl border-2 border-[#318FA8] flex justify-between items-center hover:shadow-lg hover:transform hover:translate-y-[-2px] transition-all duration-300 hover:bg-gray-50"
            onClick={() => handleSelectIntern(intern.id)}
          >
            <div className="flex items-center gap-4">
              <AvatarImage gender={intern.gender} />
              <div>
                <h3 className="text-lg font-semibold text-[#2A5F74]">{intern.name}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-gray-600 text-sm">{intern.jobTitle}</p>
                </div>
              </div>
            </div>

            {/* Right side: Status and Action */}
            <div className="flex flex-col items-end gap-2">
              <span className={`
                px-3 py-1.5 rounded-full text-xs font-medium border
                ${statusColors[intern.status]}
              `}>
                {intern.status.toUpperCase()}
              </span>

              {intern.status === "completed" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Evaluating intern with id: ${intern.id}`);
                  }}
                  className="px-4 py-1.5 bg-[#318FA8] text-white text-xs font-medium
                  rounded-full hover:bg-[#2A5F74] transition-all duration-300
                  border-2 border-[#318FA8] hover:border-[#2A5F74] shadow-sm
                  hover:shadow-md hover:transform hover:translate-y-[-1px]"
                >
                  EVALUATE
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredInterns.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No interns found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}