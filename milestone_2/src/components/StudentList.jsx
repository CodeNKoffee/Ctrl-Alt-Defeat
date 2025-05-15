"use client";

import { useState } from "react";
import Student from "./Student";
import SearchBar from "./Shared/SearchBar";

export default function StudentList({ students }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'regular', label: 'Regular Students' },
    { id: 'pro', label: 'PRO Students' }
  ];

  const filterStudents = (students) => {
    if (!students) return [];
    
    // First filter by status
    let filtered = activeTab === 'all' 
      ? students 
      : students.filter(student => student.status.toLowerCase() === activeTab.toLowerCase());
    
    // Then filter by student ID
    if (searchTerm.trim()) {
      filtered = filtered.filter(student =>
        student.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredStudents = filterStudents(students);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Title Section */}
      <div className="mb-6">
      <h1 className="text-3xl font-bold text-left text-[#2a5f74] relative">
          STUDENT PROFILES
          <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
        </h1>
      </div>

      {/* Status Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pr-[2px]">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${
                  activeTab === id
                    ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#3298BA]'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="w-full sm:w-[280px]">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search by Student ID ..."
          />
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredStudents.map((student) => (
          <div key={student.id}>
            <Student student={student} />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {(!filteredStudents || filteredStudents.length === 0) && (
        <div className="text-center py-10 text-gray-500">
          No students found
        </div>
      )}
    </div>
  );
}