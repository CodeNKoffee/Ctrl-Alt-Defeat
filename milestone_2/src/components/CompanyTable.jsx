"use client";
import React, { useState, useMemo } from 'react';
import DataTable from './Table'; // Changed from './Table' to './DataTable' to match the filename
import { mockCompanies } from "../../constants/index"; 

const filterCompanies = (company, searchTerm, selectedIndustry) => {
  const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesIndustry = !selectedIndustry || company.industry === selectedIndustry;
  return matchesSearch && matchesIndustry;
};

const companyColumns = [
  {
    key: 'name',
    label: 'Company',
    span: 6,
    className: 'font-medium text-gray-800'
  },
  {
    key: 'industry',
    label: 'Industry',
    span: 4,
    className: 'text-gray-600'
  },
  {
    key: 'size',
    label: 'Size',
    span: 2,
    align: 'right',
    render: (item) => (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
        item.size === 'Large' ? 'bg-blue-100 text-blue-800' :
        item.size === 'Medium' ? 'bg-purple-100 text-purple-800' :
        item.size === 'Corporate' ? 'bg-amber-100 text-amber-800' :
        'bg-green-100 text-green-800'
      }`}>
        {item.size}
      </span>
    )
  }
];

export default function CompanyTable({ companies = mockCompanies }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');

  const industries = useMemo(() => {
    return companies ? [...new Set(companies.map(c => c.industry))].sort() : [];
  }, [companies]);

  return (
    <DataTable
      title="Company Applications"
      data={companies}
      columns={companyColumns}
      filterFunction={filterCompanies} // Simplified to match the new DataTable implementation
      emptyMessage={
        (searchTerm, selectedFilter) => { // Updated to match the new emptyMessage function signature
          if (selectedFilter) {
            return searchTerm
              ? `No companies found in ${selectedFilter} matching '${searchTerm}'`
              : `No companies found in ${selectedFilter}`;
          }
          return searchTerm
            ? `No companies found matching '${searchTerm}'`
            : "No companies available";
        }
      }
      searchConfig={{
        searchTerm,
        onSearchChange: setSearchTerm,
        placeholder: "Search companies..."
      }}
      filterConfig={{
        showFilter: true,
        filterOptions: industries,
        selectedFilter: selectedIndustry,
        onFilterChange: setSelectedIndustry,
        filterLabel: "Filter by Industry",
        filterPlaceholder: "All Industries" // Added to match the new Filter component
      }}
    />
  );
}