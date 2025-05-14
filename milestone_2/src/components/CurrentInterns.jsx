"use client";
import { useState } from "react";
import { mockStudents } from '../../constants/mockData';
import InternRow from './InternRow';

// Status colors
const statusColors = {
  current: 'bg-blue-100 text-blue-800 border-2 border-blue-400',
  completed: 'bg-green-100 text-green-800 border-2 border-green-400',
  evaluated: 'bg-purple-100 text-purple-800 border-2 border-purple-400',
};
const hoverStatusColors = {
  current: 'hover:bg-blue-100 hover:text-blue-800 border-2 hover:border-blue-400',
  completed: 'hover:bg-green-100 hover:text-green-800 border-2 hover:border-green-400',
  evaluated: 'hover:bg-purple-100 hover:text-purple-800 border-2 hover:border-purple-400',
};


// Helper to infer internship status from period
const inferStatus = (period) => {
  if (!period) return 'current';
  const is2023 = period.includes('2023');
  const isEvaluated = Math.random() < 0.3; // Randomly mark some completed as evaluated
  if (is2023) return isEvaluated ? 'evaluated' : 'completed';
  return 'current';
};

// Calculate end date (3 months after start date)
const calculateEndDate = (period) => {
  if (!period) return null;
  const yearMatch = period.match(/\d{4}/);
  if (!yearMatch) return null;
  const year = parseInt(yearMatch[0], 10);
  const month = period.toLowerCase().includes('summer') ? 6 : 0; // July (6) or January (0)
  const startDate = new Date(year, month, 1);
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 3); // Add 3 months
  return `${endDate.getMonth() + 1} ${endDate.getFullYear()}`; // Format as "Month Year"
};

// Transform mockStudents into intern data
const transformStudentsToInterns = (students) => {
  if (!Array.isArray(students)) {
    console.error('transformStudentsToInterns: students is not an array', students);
    return [];
  }
  return students
    .filter(student => student.internships && student.internships.length > 0)
    .map(student => {
      const internship = student.internships[0]; // Use first internship
      const status = inferStatus(internship.period);
      return {
        id: student.id,
        name: student.name,
        jobTitle: internship.title,
        status: status,
        company: internship.company,
        profilePic: student.photo,
        skills: student.skills,
        degree: student.education[0]?.degree,
        period: student.education[0]?.period,
        jobInterests: student.jobInterests,
        startDate: internship.period,
        endDate: (status === 'completed' || status === 'evaluated') ? calculateEndDate(internship.period) : null,
        description: internship.description,
      };
    });
};

export default function CurrentInterns() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [interns, setInterns] = useState(mockStudents ? transformStudentsToInterns(mockStudents) : []);

  const handleSelectIntern = (id) => {
    console.log(`Selected intern with id: ${id}`);
  };

  const handleEvaluateIntern = (id) => {
    console.log(`Evaluating intern with id: ${id}`);
  };

  // Filter logic
  const filteredInterns = interns.filter(intern => {
    const matchesSearch = 
      intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      activeTab === 'all' ||
      intern.status === activeTab;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-3xl mx-auto p-4 mb-4 flex flex-col items-start">
      <h1 className="text-3xl font-bold text-left text-[#2a5f74] relative mb-6 w-full">
        MY INTERNS
        <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
      </h1>
      <div className="flex flex-col gap-4 mb-6 w-full">
        <div className="w-full">
          <input
            type="text"
            placeholder="Search interns by name or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-4 pr-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#318FA8] focus:border-transparent text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full">
          {['all', 'current', 'completed', 'evaluated'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
  ${activeTab === tab
    ? `${statusColors[tab]}`
    : `bg-white text-gray-600 border border-gray-300 ${hoverStatusColors[tab] || ''}`}`}

            >
              {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full space-y-4">
        {filteredInterns.map((intern) => (
          <InternRow
            key={intern.id}
            intern={intern}
            onSelect={handleSelectIntern}
            onEvaluate={handleEvaluateIntern}
          />
        ))}
        {filteredInterns.length === 0 && (
          <div className="text-center text-gray-500 py-8 w-full">
            No interns found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}
