"use client";
import { useState, useEffect } from "react";
import Student from "./Student";
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';
import SearchBar from "./shared/SearchBar";
import StudentProfileSidebar from "./StudentProfileSidebar";
import ApplicationsFilterBar from "./shared/ApplicationsFilterBar";

const statusColors = {
  current: 'bg-blue-100 text-blue-800 border-2 border-blue-400',
  completed: 'bg-green-100 text-green-800 border-2 border-green-400',
  evaluated: 'bg-purple-100 text-purple-800 border-2 border-purple-400',
};

const hoverStatusColors = {
  current: 'hover:bg-blue-100 hover:text-blue-800 hover:border-blue-400',
  completed: 'hover:bg-green-100 hover:text-green-800 hover:border-green-400',
  evaluated: 'hover:bg-purple-100 hover:text-purple-800 hover:border-purple-400',
  all: 'hover:bg-gray-100 hover:text-gray-800 hover:border-gray-400'
};

export default function StudentList({ students, sidebarExpanded = true, selectedStatus = 'all', onStatusChange = () => { } }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tabs = [
    { id: 'all', label: safeT('scad.studentList.tabs.all') },
    { id: 'current', label: safeT('scad.studentList.tabs.current') },
    { id: 'completed', label: safeT('scad.studentList.tabs.completed') },
    { id: 'evaluated', label: safeT('scad.studentList.tabs.evaluated') }
  ];

  const filterStudents = (students) => {
    if (!students) return [];

    let filtered = selectedStatus === 'all'
      ? students
      : students.filter(student =>
        student.internshipStatus?.toLowerCase() === selectedStatus.toLowerCase()
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

  const getTabStatusColor = (tabId) => {
    if (tabId === 'all') {
      return 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#5DB2C7]';
    }
    return statusColors[tabId] || 'bg-white text-gray-600 border-2 border-gray-300';
  };

  // Determine the number of columns based on sidebar states
  const getGridColumns = () => {
    const mainSidebarOpen = sidebarExpanded;
    const profileSidebarOpen = !!selectedStudent;

    // Both sidebars open - 1 card per row
    if (mainSidebarOpen && profileSidebarOpen) {
      return "grid-cols-1";
    }

    // Only main sidebar open - 3 cards per row
    if (mainSidebarOpen && !profileSidebarOpen) {
      if (windowWidth < 768) return "grid-cols-1";
      if (windowWidth < 1280) return "grid-cols-2";
      return "grid-cols-3";
    }

    // Only profile sidebar open - 2 cards per row
    if (!mainSidebarOpen && profileSidebarOpen) {
      if (windowWidth < 1024) return "grid-cols-1";
      return "grid-cols-2";
    }

    // Both sidebars closed - 4 cards per row
    if (windowWidth < 768) return "grid-cols-1";
    if (windowWidth < 1024) return "grid-cols-2";
    if (windowWidth < 1536) return "grid-cols-3";
    return "grid-cols-4";
  };

  // Determine card container width for consistent sizing
  const getCardContainerClass = () => {
    const mainSidebarOpen = sidebarExpanded;
    const profileSidebarOpen = !!selectedStudent;

    if (mainSidebarOpen && profileSidebarOpen) {
      return "w-full"; // Full width for single column
    }
    if ((mainSidebarOpen && !profileSidebarOpen) || (!mainSidebarOpen && profileSidebarOpen)) {
      return "w-full"; // Full width to let grid control sizing
    }
    return "w-full"; // Full width to let grid control sizing
  };

  // Calculate container padding based on sidebar states
  const getContainerPadding = () => {
    const profileSidebarOpen = !!selectedStudent;
    if (profileSidebarOpen) {
      return "md:pr-[33%]"; // Padding when profile sidebar is open
    }
    return "pr-0";
  };

  return (
    <div className="w-full mx-auto relative py-4">
      {/* Title */}

      {/* <ApplicationsFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by student, company or supervisor..."
        selectedStatus={activeTab}
        onStatusChange={setActiveTab}
        primaryFilterName="Filters"
      /> */}
      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pr-[2px]">
        <div className="flex flex-wrap gap-2">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onStatusChange(id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex items-center
                ${selectedStatus === id
                  ? `${getTabStatusColor(id)} text-[#2a5f74]`
                  : `bg-white text-gray-600 border border-gray-300 ${hoverStatusColors[id] || 'hover:bg-gray-50'}`}`}
            >
              <span className={`w-3 h-3 rounded-full mr-2 ${selectedStatus === id ? (
                id === 'all' ? 'bg-[#5DB2C7]' :
                  id === 'current' ? 'bg-blue-600' :
                    id === 'completed' ? 'bg-green-600' :
                      id === 'evaluated' ? 'bg-purple-600' : 'bg-gray-400'
              ) : 'bg-gray-300'
                }`}></span>
              {label}
            </button>
          ))}
        </div>

        {/* <div className="w-full sm:w-[280px]">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search by Student ID ..."
          />
        </div> */}
      </div>

      {/* Responsive Grid for Student Cards */}
      <div className={`transition-all duration-300 w-full ${getContainerPadding()}`}>
        <div className={`flex flex-row justify-start flex-wrap w-full gap-4`}>
          {filteredStudents.map((student) => (
            <div key={student.id} className="w-[245px] mb-6">
              <Student
                student={student}
                onViewProfile={() => handleViewProfile(student)}
                className="w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {(!filteredStudents || filteredStudents.length === 0) && (
        <div className="p-16 text-center">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">{safeT('scad.studentList.emptyState.noStudents')}</p>
          <p className="text-gray-400 text-sm mt-1">{safeT('scad.studentList.emptyState.adjust')}</p>
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