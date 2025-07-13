"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';

export default function ReportsTable({
  reports: initialReports = [],
  userType = "scad",
  onView,
  onEdit,
  onDelete
}) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

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
      'pending': safeT('faculty.reports.table.statuses.pending'),
      'flagged': safeT('faculty.reports.table.statuses.flagged'),
      'rejected': safeT('faculty.reports.table.statuses.rejected'),
      'accepted': safeT('faculty.reports.table.statuses.accepted')
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
        <h2 className="text-2xl text-metallica-blue-800 font-semibold mb-4 md:mb-0">{safeT('faculty.reports.table.title')}</h2>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${isFiltersActive ? 'bg-metallica-blue-600 text-white' : 'bg-metallica-blue-100 text-metallica-blue-800'}`}
          >
            <FontAwesomeIcon icon={faFilter} className="mr-2" />
            <span>{safeT('faculty.reports.table.filterReports')}</span>
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
              <span>{safeT('faculty.reports.table.clearFilters')}</span>
            </button>
          )}
        </div>
      </div>
      {showFilters && (
        <div className="mb-6 p-4 bg-metallica-blue-50 rounded-lg border border-metallica-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="majorFilter" className="block text-sm font-medium text-metallica-blue-800 mb-1">{safeT('faculty.reports.table.filterByMajor')}</label>
              <select
                id="majorFilter"
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                className="w-full px-3 py-2 border border-metallica-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-metallica-blue-500"
              >
                <option value="">{safeT('faculty.reports.table.allMajors')}</option>
                {majorOptions.map((major, index) => (
                  <option key={index} value={major}>{major}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-metallica-blue-800 mb-1">{safeT('faculty.reports.table.filterByStatus')}</label>
              <select
                id="statusFilter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-metallica-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-metallica-blue-500"
              >
                <option value="">{safeT('faculty.reports.table.allStatus')}</option>
                <option value="pending">{safeT('faculty.reports.table.statuses.pending')}</option>
                <option value="flagged">{safeT('faculty.reports.table.statuses.flagged')}</option>
                <option value="rejected">{safeT('faculty.reports.table.statuses.rejected')}</option>
                <option value="accepted">{safeT('faculty.reports.table.statuses.accepted')}</option>
              </select>
            </div>
          </div>
        </div>
      )}
      {isFiltersActive && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedMajor && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-metallica-blue-100 text-metallica-blue-800 text-sm">
              {safeT('faculty.reports.table.major')} {selectedMajor}
            </span>
          )}
          {selectedStatus && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-metallica-blue-100 text-metallica-blue-800 text-sm">
              {safeT('faculty.reports.table.status')} {formatStatus(selectedStatus)}
            </span>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-metallica-blue-100 text-metallica-blue-800">
              <th className="py-4 px-5 text-left">{safeT('faculty.reports.table.headers.reportNumber')}</th>
              <th className="py-4 px-5 text-left">{safeT('faculty.reports.table.headers.studentName')}</th>
              <th className="py-4 px-5 text-left">{safeT('faculty.reports.table.headers.major')}</th>
              <th className="py-4 px-5 text-left">{safeT('faculty.reports.table.headers.internship')}</th>
              <th className="py-4 px-5 text-left">{safeT('faculty.reports.table.headers.company')}</th>
              <th className="py-4 px-5 text-left">{safeT('faculty.reports.table.headers.submissionDate')}</th>
              <th className="py-4 px-5 text-left">{safeT('faculty.reports.table.headers.status')}</th>
              <th className="py-4 px-5 text-center">{safeT('faculty.reports.table.headers.actions')}</th>
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
                        title={safeT('faculty.reports.table.actions.viewReport')}
                      >
                        <span className="w-full text-center">{safeT('faculty.reports.table.actions.viewReport')}</span>
                      </button>
                    ) : userType === "faculty" ? (
                      <button
                        onClick={() => onView && onView(report)}
                        className="inline-flex items-center justify-center w-32 min-w-[9rem] px-0 py-2 rounded-full font-medium shadow-sm bg-metallica-blue-500 text-metallica-blue-100 border border-metallica-blue-200 hover:bg-metallica-blue-900  hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-metallica-blue-200 focus:ring-offset-2"
                        title={report.status === 'pending' ? safeT('faculty.reports.table.actions.evaluateReport') : safeT('faculty.reports.table.actions.viewReport')}
                      >
                        <span className="w-full text-center">
                          {report.status === 'pending' ? safeT('faculty.reports.table.actions.evaluateReport') : safeT('faculty.reports.table.actions.viewReport')}
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onView && onView(report)}
                        className="inline-flex items-center px-4 py-2 bg-[var(--metallica-blue-600)] text-white rounded-lg hover:bg-[var(--metallica-blue-700)] transition shadow-sm hover:shadow-md"
                        title={safeT('faculty.reports.table.actions.viewReport')}
                      >
                        <span className="font-medium">{safeT('faculty.reports.table.actions.viewReport')}</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-8 text-center text-gray-500">
                  {reports.length > 0
                    ? safeT('faculty.reports.table.noResults.noReportsMatch')
                    : safeT('faculty.reports.table.noResults.noReportsAvailable')}
                  {isFiltersActive && (
                    <button
                      onClick={clearFilters}
                      className="ml-2 text-metallica-blue-600 hover:text-metallica-blue-800 underline"
                    >
                      {safeT('faculty.reports.table.noResults.clearAllFilters')}
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