"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export default function FacultyDashboard() {
  const [reports, setReports] = useState([
    {
      id: 1,
      studentName: "David Lee",
      studentMajor: "Computer Science",
      internshipTitle: "Backend Developer Internship",
      companyName: "TechCorp Inc.",
      submissionDate: "2025-04-15",
      status: "pending"
    },
    {
      id: 2,
      studentName: "Sarah Wilson",
      studentMajor: "Computer Engineering",
      internshipTitle: "Frontend Developer Internship",
      companyName: "Web Solutions Ltd.",
      submissionDate: "2025-04-10",
      status: "reviewed"
    },
    {
      id: 3,
      studentName: "Michael Brown",
      studentMajor: "Computer Science",
      internshipTitle: "Full Stack Developer Internship",
      companyName: "Digital Innovations",
      submissionDate: "2025-04-05",
      status: "pending"
    },
    {
      id: 4,
      studentName: "Emma Johnson",
      studentMajor: "Information Systems",
      internshipTitle: "Data Analysis Internship",
      companyName: "Data Insights Corp",
      submissionDate: "2025-04-12",
      status: "flagged"
    },
    {
      id: 5,
      studentName: "James Rodriguez",
      studentMajor: "Software Engineering",
      internshipTitle: "Mobile App Developer Internship",
      companyName: "AppWorks Inc.",
      submissionDate: "2025-04-08",
      status: "rejected"
    },
    {
      id: 6,
      studentName: "Olivia Chen",
      studentMajor: "Information Systems",
      internshipTitle: "UX/UI Design Internship",
      companyName: "Creative Solutions",
      submissionDate: "2025-04-17",
      status: "accepted"
    }
  ]);

  // Filter states
  const [majorOptions, setMajorOptions] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filteredReports, setFilteredReports] = useState(reports);
  const [isFiltersActive, setIsFiltersActive] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique majors from reports for the filter dropdown
  useEffect(() => {
    const uniqueMajors = [...new Set(reports.map(report => report.studentMajor))];
    setMajorOptions(uniqueMajors);
    setFilteredReports(reports);
  }, [reports]);

  // Apply filters when filter selections change
  useEffect(() => {
    let results = [...reports];
    
    if (selectedMajor) {
      results = results.filter(report => report.studentMajor === selectedMajor);
    }
    
    if (selectedStatus) {
      results = results.filter(report => report.status === selectedStatus);
    }
    
    setFilteredReports(results);
    setIsFiltersActive(selectedMajor !== '' || selectedStatus !== '');
  }, [selectedMajor, selectedStatus, reports]);

  // Reset all filters
  const clearFilters = () => {
    setSelectedMajor('');
    setSelectedStatus('');
    setIsFiltersActive(false);
  };

  // Format the display of the status
  const formatStatus = (status) => {
    const statusMap = {
      'pending': 'PENDING',
      'flagged': 'FLAGGED',
      'rejected': 'REJECTED',
      'accepted': 'ACCEPTED',
      'reviewed': 'REVIEWED'
    };
    return statusMap[status] || status.toUpperCase();
  };

  // Get appropriate CSS classes for the status badge
  const getStatusBadgeClasses = (status) => {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'flagged': 'bg-orange-100 text-orange-800',
      'rejected': 'bg-red-100 text-red-800',
      'accepted': 'bg-green-100 text-green-800',
      'reviewed': 'bg-blue-100 text-blue-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <DashboardLayout userType="faculty">
      <div className="container mx-auto px-4 py-8">
        <Header text="Faculty Dashboard" size="text-6xl" />
        
        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl text-metallica-blue-800 font-semibold mb-4 md:mb-0">Student Reports</h2>
            
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${isFiltersActive ? 'bg-metallica-blue-600 text-white' : 'bg-metallica-blue-100 text-metallica-blue-800'}`}
              >
                <FontAwesomeIcon icon={faFilter} className="mr-2" />
                <span>Filter Reports</span>
                {isFiltersActive && (
                  <span className="ml-2 bg-white text-metallica-blue-800 rounded-full w-5 h-5 inline-flex items-center justify-center text-xs font-bold">
                    {(selectedMajor ? 1 : 0) + (selectedStatus ? 1 : 0)}
                  </span>
                )}
              </button>
              
              {isFiltersActive && (
                <button 
                  onClick={clearFilters}
                  className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Filter panel */}
          {showFilters && (
            <div className="mb-6 p-4 bg-metallica-blue-50 rounded-lg border border-metallica-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="majorFilter" className="block text-sm font-medium text-metallica-blue-800 mb-1">
                    Filter by Major
                  </label>
                  <select
                    id="majorFilter"
                    value={selectedMajor}
                    onChange={(e) => setSelectedMajor(e.target.value)}
                    className="w-full px-3 py-2 border border-metallica-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-metallica-blue-500"
                  >
                    <option value="">All Majors</option>
                    {majorOptions.map((major, index) => (
                      <option key={index} value={major}>{major}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="statusFilter" className="block text-sm font-medium text-metallica-blue-800 mb-1">
                    Filter by Status
                  </label>
                  <select
                    id="statusFilter"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-metallica-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-metallica-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">PENDING</option>
                    <option value="flagged">FLAGGED</option>
                    <option value="rejected">REJECTED</option>
                    <option value="accepted">ACCEPTED</option>
                    <option value="reviewed">REVIEWED</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Active filters display */}
          {isFiltersActive && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedMajor && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-metallica-blue-100 text-metallica-blue-800 text-sm">
                  Major: {selectedMajor}
                </span>
              )}
              {selectedStatus && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-metallica-blue-100 text-metallica-blue-800 text-sm">
                  Status: {formatStatus(selectedStatus)}
                </span>
              )}
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-metallica-blue-100 text-metallica-blue-800">
                  <th className="py-3 px-4 text-left">Student Name</th>
                  <th className="py-3 px-4 text-left">Major</th>
                  <th className="py-3 px-4 text-left">Internship</th>
                  <th className="py-3 px-4 text-left">Company</th>
                  <th className="py-3 px-4 text-left">Submission Date</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length > 0 ? (
                  filteredReports.map(report => (
                    <tr key={report.id} className="border-b border-gray-200 hover:bg-metallica-blue-50">
                      <td className="py-3 px-4">{report.studentName}</td>
                      <td className="py-3 px-4">{report.studentMajor}</td>
                      <td className="py-3 px-4">{report.internshipTitle}</td>
                      <td className="py-3 px-4">{report.companyName}</td>
                      <td className="py-3 px-4">{new Date(report.submissionDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClasses(report.status)}`}>
                          {formatStatus(report.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <a 
                          href={`/en/dashboard/faculty/report-viewer?id=${report.id}`}
                          className="inline-block bg-metallica-blue-600 text-white px-3 py-1 rounded hover:bg-metallica-blue-700 transition"
                        >
                          View & Annotate
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      No reports match the selected filters
                      <button 
                        onClick={clearFilters}
                        className="ml-2 text-metallica-blue-600 hover:text-metallica-blue-800 underline"
                      >
                        Clear all filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}