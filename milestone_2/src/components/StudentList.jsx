"use client";
import { useState } from "react";
import Student from "./Student";
import SearchBar from "./shared/SearchBar";
import StudentProfileSidebar from "./StudentProfileSidebar";

export default function StudentList({ students }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Updated tabs to filter by internshipStatus
  const tabs = [
    { id: 'all', label: 'ALL' },
    { id: 'Current', label: 'CURRENT' },
    { id: 'Completed', label: 'COMPLETED' }
  ];

  const filterStudents = (students) => {
    if (!students) return [];

    let filtered = activeTab === 'all' 
      ? students 
      : students.filter(student => 
          student.internshipStatus?.toLowerCase() === activeTab.toLowerCase()
        );

    if (searchTerm.trim()) {
      filtered = filtered.filter(student =>
        student.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredStudents = filterStudents(students);

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
  };

  const closeSidebar = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 relative">
      {/* Title Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-left text-[#2a5f74] relative">
          STUDENT PROFILES
          <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
        </h1>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pr-[2px]">
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

        <div className="w-full sm:w-[280px]">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search by Student ID ..."
          />
        </div>
      </div>

      {/* Grid */}
      <div className={`transition-all duration-300 ${
        selectedStudent ? 'w-[calc(100%-33%)]' : 'w-full'
      }`}>
        <div className={`grid gap-8 ${
          selectedStudent
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
        }`}>
          {filteredStudents.map((student) => (
            <div key={student.id}>
              <Student 
                student={student} 
                onViewProfile={() => handleViewProfile(student)} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {(!filteredStudents || filteredStudents.length === 0) && (
        <div className="text-center py-10 text-gray-500">
          No students found
        </div>
      )}

      {/* Sidebar */}
      <StudentProfileSidebar
        student={selectedStudent}
        onClose={closeSidebar}
      />
    </div>
  );
}
