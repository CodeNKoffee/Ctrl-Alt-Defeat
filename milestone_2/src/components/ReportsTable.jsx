"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export default function ReportsTable({
  reports: initialReports = [],
  userType = "scad",
  onView,
  onEdit,
  onDelete
}) {
  const [reports, setReports] = useState([]);
  const [majorOptions, setMajorOptions] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filteredReports, setFilteredReports] = useState([]);
  const [isFiltersActive, setIsFiltersActive] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Initialize reports from props when component mounts or props change
  useEffect(() => {
    setReports(initialReports);
  }, [initialReports]);

  useEffect(() => {
    if (reports.length > 0) {
      const uniqueMajors = [...new Set(reports.map(report => report.studentMajor))];
      setMajorOptions(uniqueMajors);
      setFilteredReports(reports);
    }
  }, [reports]);

  useEffect(() => {
    if (reports.length === 0) return;
    
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

  const clearFilters = () => {
    setSelectedMajor('');
    setSelectedStatus('');
    setIsFiltersActive(false);
  };

  const formatStatus = (status) => {
    const statusMap = {
      'pending': 'PENDING',
      'flagged': 'FLAGGED',
      'rejected': 'REJECTED',
      'accepted': 'ACCEPTED'
    };
    return statusMap[status] || status.toUpperCase();
  };

  const getStatusBadgeClasses = (status) => {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'flagged': 'bg-orange-100 text-orange-800',
      'rejected': 'bg-red-100 text-red-800',
      'accepted': 'bg-green-100 text-green-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  };

  // For debugging
  useEffect(() => {
    console.log("Initial Reports:", initialReports);
    console.log("Reports in state:", reports);
    console.log("Filtered Reports:", filteredReports);
  }, [initialReports, reports, filteredReports]);

  return (
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
              </select>
            </div>
          </div>
        </div>
      )}
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
              <th className="py-4 px-5 text-left">Report #</th>
              <th className="py-4 px-5 text-left">Student Name</th>
              <th className="py-4 px-5 text-left">Major</th>
              <th className="py-4 px-5 text-left">Internship</th>
              <th className="py-4 px-5 text-left">Company</th>
              <th className="py-4 px-5 text-left">Submission Date</th>
              <th className="py-4 px-5 text-left">Status</th>
              <th className="py-4 px-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map(report => (
                <tr key={report.id} className="border-b border-gray-200 hover:bg-metallica-blue-50">
                  <td className="py-4 px-5 font-mono text-sm text-gray-700">{report.reportNumber || `RPT-${report.id.toString().padStart(3, '0')}`}</td>
                  <td className="py-4 px-5">{report.studentName}</td>
                  <td className="py-4 px-5">{report.studentMajor}</td>
                  <td className="py-4 px-5">{report.internshipTitle || report.title}</td>
                  <td className="py-4 px-5">{report.companyName}</td>
                  <td className="py-4 px-5">{new Date(report.submissionDate).toLocaleDateString()}</td>
                  <td className="py-4 px-5">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClasses(report.status)}`}>
                      {formatStatus(report.status)}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-center">
                    {userType === "scad" ? (
                      <button
                        onClick={() => onView && onView(report)}
                        className="inline-flex items-center justify-center w-32 min-w-[8rem] px-0 py-2 rounded-full font-medium shadow-sm bg-metallica-blue-500 text-metallica-blue-100 border border-metallica-blue-200 hover:bg-metallica-blue-900 hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-metallica-blue-200 focus:ring-offset-2"
                        title="View report"
                      >
                        <span className="w-full text-center">View Report</span>
                      </button>
                    ) : userType === "faculty" ? (
                      <a
                        href={`/en/dashboard/faculty/report-viewer?id=${report.id}`}
                        className="inline-flex items-center justify-center w-32 min-w-[9rem] px-0 py-2 rounded-full font-medium shadow-sm bg-metallica-blue-500 text-metallica-blue-100 border border-metallica-blue-200 hover:bg-metallica-blue-900  hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-metallica-blue-200 focus:ring-offset-2"
                        title={report.status === 'pending' ? 'Evaluate this report' : 'View this report'}
                      >
                        <span className="w-full text-center">
                          {report.status === 'pending' ? 'Evaluate Report' : 'View Report'}
                        </span>
                      </a>
                    ) : (
                      <button
                        onClick={() => onView && onView(report)}
                        className="inline-flex items-center px-4 py-2 bg-[var(--metallica-blue-600)] text-white rounded-lg hover:bg-[var(--metallica-blue-700)] transition shadow-sm hover:shadow-md"
                        title="View report"
                      >
                        <span className="font-medium">View</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-8 text-center text-gray-500">
                  {reports.length > 0 
                    ? "No reports match the selected filters" 
                    : "No reports available at the moment"}
                  {isFiltersActive && (
                    <button 
                      onClick={clearFilters}
                      className="ml-2 text-metallica-blue-600 hover:text-metallica-blue-800 underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}