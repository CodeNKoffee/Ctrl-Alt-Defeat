"use client";
import { useState } from 'react';
import SearchBar from './SearchBar';
import InternshipRow from './InternshipRow';
import Filter from './Filter'; // Import the new Filter component

export const mockInternships = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechVision",
    type: "Full-time",
    locationType: "REMOTE",
    paid: true,
    postedDate: "2 days ago",
    industry: "Technology",
    duration: "3 months"
  },
  {
    id: 2,
    title: "Marketing Coordinator",
    company: "BrandBoost",
    type: "Part-time",
    locationType: "HYBRID",
    paid: false,
    postedDate: "1 week ago",
    industry: "Marketing",
    duration: "6 months"
  },
  {
    id: 3,
    title: "Data Science Intern",
    company: "Thndr",
    type: "Full-time",
    locationType: "ON-SITE",
    paid: true,
    postedDate: "3 days ago",
    industry: "Technology",
    duration: "4 months"
  },
  {
    id: 4,
    title: "UX Design Intern",
    company: "CreativeMinds",
    type: "Contract",
    locationType: "REMOTE",
    paid: true,
    postedDate: "5 days ago",
    industry: "Design",
    duration: "4 months"
  },
  {
    id: 5,
    title: "Biomedical Research Assistant",
    company: "HealthInnovate",
    type: "Full-time",
    locationType: "ON-SITE",
    paid: false,
    postedDate: "2 weeks ago",
    industry: "Healthcare",
    duration: "6 months"
  }
];

export default function InternshipTable({ internships = mockInternships }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    industry: '',
    duration: '',
    paid: '' // Changed to string to match Filter component
  });

  const filteredInternships = internships.filter(internship => {
    // Search filter (title or company)
    const matchesSearch = 
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Industry filter
    const matchesIndustry = 
      !filters.industry || internship.industry === filters.industry;
    
    // Duration filter
    const matchesDuration = 
      !filters.duration || internship.duration === filters.duration;
    
    // Paid/unpaid filter
    const matchesPaidStatus = 
      filters.paid === '' || 
      (filters.paid === 'paid' && internship.paid) || 
      (filters.paid === 'unpaid' && !internship.paid);
    
    return matchesSearch && matchesIndustry && matchesDuration && matchesPaidStatus;
  });

  // Get unique filter options from data
  const industryOptions = [...new Set(internships.map(i => i.industry))].sort();
  const durationOptions = [...new Set(internships.map(i => i.duration))].sort();
  const paidOptions = ['Both','Paid', 'Unpaid'];

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl mb-8">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--metallica-blue-600)' }}>
          Internship Opportunities
        </h1>
        
        {/* Search Bar */}
        <div className="mb-4">
          <SearchBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search by job title or company..."
          />
        </div>
        
        {/* Filter Row */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Industry Filter */}
          <div className="flex-1 min-w-[200px]">
            <Filter
              options={industryOptions}
              selectedValue={filters.industry}
              onChange={(value) => setFilters({...filters, industry: value})}
              label="Industry"
              placeholder="All Industries"
              id="industry-filter"
            />
          </div>
          
          {/* Duration Filter */}
          <div className="flex-1 min-w-[200px]">
            <Filter
              options={durationOptions}
              selectedValue={filters.duration}
              onChange={(value) => setFilters({...filters, duration: value})}
              label="Duration"
              placeholder="Any Duration"
              id="duration-filter"
            />
          </div>
          
          {/* Paid/Unpaid Filter */}
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
                    value ===  '' ? '' : 
                    value === 'Paid' ? 'paid' : 'unpaid'
            });
          }}
          label="Compensation"
          placeholder="Paid/Unpaid" // This will be shown when no value is selected
          id="paid-filter"
        />
      </div>
        </div>
      </div>
      
      {/* Internship Cards */}
      <div className="w-full max-w-4xl space-y-3">
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
  );
}