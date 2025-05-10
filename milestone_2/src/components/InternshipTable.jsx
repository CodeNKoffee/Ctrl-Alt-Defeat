"use client";
import { useState } from 'react';
import InternshipRow from './InternshipRow';
import Filter from './Filter';
import SearchBar from './SearchBar';
import { mockInternships } from '../../constants/index';

export default function InternshipTable({ internships = mockInternships }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    industry: '',
    duration: '',
    paid: ''
  });

  const filteredInternships = internships.filter(internship => {
    const matchesSearch =
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIndustry =
      !filters.industry || internship.industry === filters.industry;

    const matchesDuration =
      !filters.duration || internship.duration === filters.duration;

    const matchesPaidStatus =
      filters.paid === '' ||
      (filters.paid === 'paid' && internship.paid) ||
      (filters.paid === 'unpaid' && !internship.paid);

    return matchesSearch && matchesIndustry && matchesDuration && matchesPaidStatus;
  });

  const industryOptions = [...new Set(internships.map(i => i.industry))].sort();
  const durationOptions = [...new Set(internships.map(i => i.duration))].sort();
  const paidOptions = ['Both', 'Paid', 'Unpaid'];

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setFilters({
      industry: '',
      duration: '',
      paid: ''
    });
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Main container with consistent width */}
      <div className="w-full max-w-3xl mx-auto px-4">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-left text-[#2a5f74] relative">
            INTERNSHIP OPPORTUNITIES
            <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
          </h1>

        {/* Search and Filter Button Row */}
        <div className="flex gap-4 w-full mb-4">
          {/* Search Bar - takes remaining space */}
          <div className="flex-1">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search by job title or company..."
            />
          </div>
          
          <button
            onClick={toggleFilters}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>{showFilters ? 'Hide Filters' : 'Filters'}</span>
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="w-full mb-4 p-2 ">
            <div className="flex flex-wrap gap-4 w-full max-w-3xl mx-auto">
              <div className="flex-1 min-w-[200px]">
                <Filter
                  options={industryOptions}
                  selectedValue={filters.industry}
                  onChange={(value) => setFilters({ ...filters, industry: value })}
                  label="Industry"
                  placeholder="Industry"
                  id="industry-filter"
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <Filter
                  options={durationOptions}
                  selectedValue={filters.duration}
                  onChange={(value) => setFilters({ ...filters, duration: value })}
                  label="Duration"
                  placeholder="Duration"
                  id="duration-filter"
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <Filter
                  options={paidOptions}
                  selectedValue={
                    filters.paid === '' ? '' :
                      filters.paid === 'paid' ? 'Paid' : 'Unpaid'
                  }
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      paid: value === 'Both' ? '' :
                        value === '' ? '' :
                          value === 'Paid' ? 'paid' : 'unpaid'
                    });
                  }}
                  label="Compensation"
                  placeholder="Paid/Unpaid"
                  id="paid-filter"
                />
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <button
                onClick={clearFilters}
                className="text-xs text-gray-700 hover:text-gray-800 hover:underline"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Internship Cards */}
        <div className="w-full space-y-3">
          {filteredInternships.map(internship => (
            <InternshipRow key={internship.id} internship={internship} />
          ))}

          {filteredInternships.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              {searchTerm || Object.values(filters).some(Boolean)
                ? "No internships match your search criteria"
                : "No internships available at the moment"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}