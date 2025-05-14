"use client";
import { useState } from "react";
import InternRow from './InternRow';
//import { mockStudents } from '../../../../constants/mockData';

// Helper to infer internship status from period
const inferStatus = (period) => {
  if (!period) return 'current';
  const is2023 = period.includes('2023');
  const isEvaluated = Math.random() < 0.3; // Randomly mark some completed as evaluated
  if (is2023) return isEvaluated ? 'evaluated' : 'completed';
  return 'current';
};

// Transform mockStudents into intern data
const transformStudentsToInterns = (students) => {
  return students
    .filter(student => student.internships && student.internships.length > 0)
    .map(student => {
      const internship = student.internships[0]; // Use first internship
      return {
        id: student.id,
        name: student.name,
        jobTitle: internship.title,
        status: inferStatus(internship.period),
        company: internship.company,
        profilePic: student.photo,
        gender: student.photo.includes('girl') ? 'female' : 'male',
        skills: student.skills,
        startDate: internship.period,
        description: internship.description,
      };
    });
};

export default function CurrentInterns() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [interns, setInterns] = useState(transformStudentsToInterns(mockStudents));

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
    <div className="max-w-4xl mx-auto p-4 mb-4">
      <h1 className="text-3xl font-bold text-left text-[#2a5f74] relative mb-6">
        My Interns
        <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
      </h1>
      
      {/* Search and Tabs Section */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search interns by name or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-4 pr-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#318FA8] focus:border-transparent text-sm"
          />
        </div>
        
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {['all', 'current', 'completed', 'evaluated'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${activeTab === tab
                  ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#3298BA]'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Interns List */}
      <div className="space-y-4">
        {filteredInterns.map((intern) => (
          <InternRow
            key={intern.id}
            intern={intern}
            onSelect={handleSelectIntern}
            onEvaluate={handleEvaluateIntern}
          />
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