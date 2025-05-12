"use client";
import DataTable from "./Table";
import { reports } from '../../constants/mockData';
import { useState } from "react";
import { 
  FiFileText, 
  FiClock, 
  FiCheckCircle, 
  FiFlag 
} from 'react-icons/fi';

export default function ReportsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    major: '',
    status: ''
  });
  // Calculate statistics
  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status === "PENDING").length;
  const acceptedReports = reports.filter(r => r.status === "ACCEPTED").length;
  const flaggedReports = reports.filter(r => r.status === "FLAGGED").length;
  const rejectedReports = reports.filter(r => r.status === "REJECTED").length;

  const columns = [
    {
      key: "id",
      label: "Report ID",
      span: 2,
      className: "font-medium text-gray-900"
    },
    {
      key: "studentName",
      label: "Student Name",
      span: 2
    },
    {
      key: "major",
      label: "Major",
      span: 2
    },
    {
      key: "reportTitle",
      label: "Report Title",
      span: 3,
      render: (item) => (
        <div className="truncate max-w-[160px] hover:whitespace-normal hover:max-w-none">
          {item.reportTitle}
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      span: 2,
      render: (item) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          item.status === "ACCEPTED" ? "bg-green-100 text-green-700" :
          item.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
          item.status === "FLAGGED" ? "bg-orange-100 text-orange-700" :
          "bg-red-100 text-red-700"
        }`}>
          {item.status}
        </span>
      )
    },
    {
      key: "submissionDate",
      label: "Submission",
      span: 1,
      align: "right",
      className: "whitespace-nowrap"
    }
  ];
  
  const filterFunction = (item, term) => {
    const matchesSearch = !term || 
      item.reportTitle.toLowerCase().includes(term.toLowerCase()) ||
      item.id.toLowerCase().includes(term.toLowerCase()) ||
      item.studentName.toLowerCase().includes(term.toLowerCase());
    
    const matchesMajor = !filters.major || item.major === filters.major;
    const matchesStatus = !filters.status || item.status === filters.status;
    
    return matchesSearch && matchesMajor && matchesStatus;
  };

  const filteredData = reports.filter(item => filterFunction(item, searchTerm));

  // Get unique majors and statuses for filter options
  const majorOptions = [...new Set(reports.map(r => r.major))];
  const statusOptions = ['ACCEPTED', 'PENDING', 'FLAGGED', 'REJECTED'];

  const clearFilters = () => {
    setFilters({ major: '', status: '' });
  };

 return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="mb-2">
        {/* Title with custom styling */}
        <h1 className="text-3xl font-bold text-left text-[#2a5f74] relative pb-2 mb-4">
          Submitted Reports
          <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
        </h1>
        
        {/* Statistics Cards with circular icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
          {/* Total Reports Card */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center h-full">
            <div className="flex-shrink-0 rounded-full bg-blue-50 text-blue-600 p-3 mr-3 h-12 w-12 flex items-center justify-center">
              <FiFileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider truncate">Total Reports</h3>
              <p className="text-2xl font-semibold mt-1 truncate">{totalReports}</p>
            </div>
          </div>

          {/* Accepted Reports Card */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center h-full">
            <div className="flex-shrink-0 rounded-full bg-green-50 text-green-600 p-3 mr-3 h-12 w-12 flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider truncate">Accepted Reports</h3>
              <p className="text-2xl font-semibold mt-1 text-green-600 truncate">{acceptedReports}</p>
            </div>
          </div>
          
          {/* Pending Reports Card */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center h-full">
            <div className="flex-shrink-0 rounded-full bg-yellow-50 text-yellow-600 p-3 mr-3 h-12 w-12 flex items-center justify-center">
              <FiClock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider truncate">Pending Reports</h3>
              <p className="text-2xl font-semibold mt-1 text-yellow-600 truncate">{pendingReports}</p>
            </div>
          </div>
          
          {/* Flagged Reports Card */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center h-full">
            <div className="flex-shrink-0 rounded-full bg-orange-50 text-orange-600 p-3 mr-3 h-12 w-12 flex items-center justify-center">
              <FiFlag className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider truncate">Flagged Reports</h3>
              <p className="text-2xl font-semibold mt-1 text-orange-600 truncate">{flaggedReports}</p>
            </div>
          </div>
        </div>
      </div>


      <DataTable
        data={filteredData}
        columns={columns}
        emptyMessage="No reports found"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchConfig={{
          placeholder: "Find a report...",
        }}
        filterConfig={{
          showFilters,
          setShowFilters,
          filters,
          setFilters,
          majorOptions,
          statusOptions,
          clearFilters
        }}
        rowClassName="border-b border-gray-100 hover:bg-gray-50 transition-colors"
        headerClassName="uppercase text-xs text-gray-500 font-semibold tracking-wide bg-gray-50"
        cellClassName="py-4"
      />
    </div>
  );
}