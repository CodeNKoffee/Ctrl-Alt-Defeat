"use client";
import DataTable from "./Table";
import { reports } from '../../constants/mockData';
import { useState } from "react";

export default function ReportsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    major: '',
    status: ''
  });
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
      <DataTable
        title="Submitted Reports"
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