"use client";

import { useState, useEffect } from 'react';
import { getRegularInternships } from '../../../../../constants/internshipData'
import InternshipList from '../../../../components/shared/InternshipList';
import ApplicationsFilterBar from '../../../../components/shared/ApplicationsFilterBar';

export default function CompanyBrowseInternshipsView() {
  const [filters, setFilters] = useState({
    industry: '',
    duration: '',
    isPaid: null
  });
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const internshipDataForFilters = getRegularInternships();
  const uniqueIndustries = [...new Set(internshipDataForFilters.map(internship => internship.industry))];
  const uniqueDurations = [...new Set(internshipDataForFilters.map(internship => internship.duration))];

  // Get base internships
  const baseInternships = getRegularInternships();

  // Apply additional filters (industry, duration, paid/unpaid)
  useEffect(() => {
    let result = [...baseInternships];

    // Filter by industry
    if (filters.industry) {
      result = result.filter(internship =>
        internship.industry === filters.industry
      );
    }

    // Filter by duration
    if (filters.duration) {
      result = result.filter(internship => {
        // Parse the duration value from the filter (e.g., "3 months" -> 3)
        const filterDurationMatch = filters.duration.match(/(\d+)/);
        const filterDurationMonths = filterDurationMatch ? parseInt(filterDurationMatch[1]) : 0;

        // Parse the internship duration (e.g., "3 months", "6-8 months", etc.)
        const internshipDurationMatch = internship.duration.match(/(\d+)/);
        const internshipDurationMonths = internshipDurationMatch ? parseInt(internshipDurationMatch[1]) : 0;

        // If we have valid numbers for both, compare them
        if (filterDurationMonths > 0 && internshipDurationMonths > 0) {
          return internshipDurationMonths === filterDurationMonths;
        }

        return true;
      });
    }

    // Filter by paid status
    if (filters.isPaid !== null) {
      result = result.filter(internship =>
        internship.paid === filters.isPaid
      );
    }

    setFilteredInternships(result);
  }, [baseInternships, filters]);

  // Check if any filters are active
  const hasActiveFilters = filters.industry || filters.duration || filters.isPaid !== null || searchTerm;

  const clearAllFilters = () => {
    setFilters({
      industry: '',
      duration: '',
      isPaid: null
    });
    setSearchTerm('');
  };

  const customFilterSections = [
    {
      title: "Industry",
      options: uniqueIndustries.map(ind => ({ label: ind, value: ind })),
      isSelected: (option) => filters.industry === option.value,
      onSelect: (option) => {
        setFilters(prev => ({ ...prev, industry: prev.industry === option.value ? '' : option.value }));
      }
    },
    {
      title: "Duration",
      options: uniqueDurations.map(dur => ({ label: dur, value: dur })),
      isSelected: (option) => filters.duration === option.value,
      onSelect: (option) => {
        setFilters(prev => ({ ...prev, duration: prev.duration === option.value ? '' : option.value }));
      }
    },
    {
      title: "Payment",
      options: [{ label: "Paid", value: true }, { label: "Unpaid", value: false }],
      isSelected: (option) => filters.isPaid === option.value,
      onSelect: (option) => {
        setFilters(prev => ({ ...prev, isPaid: prev.isPaid === option.value ? null : option.value }));
      }
    }
  ];

  // Define the info card JSX/Component for company view
  const CompanyInternshipsInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute right-20 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute left-40 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        <div className="flex items-start gap-4 w-full md:w-auto relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <div className="text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              OPPORTUNITIES OVERVIEW
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">Available Internship Positions</div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">Browse the current internship positions available to SCAD students. This view allows you to see what opportunities students can discover and apply to through the platform.</p>

              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  Key Benefits for Partner Companies:
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Access to talented students with specialized skills</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Fresh perspectives and innovative approaches</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Potential to develop future full-time talent</span>
                  </li>
                </ul>
              </div>

              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                To add your own internship listing, use the "Post New Internship" option in your company dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className='w-full px-6 py-4'>
      <div className="px-4 pt-6">
        <CompanyInternshipsInfoCard />

        <ApplicationsFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search internships by job title or skills..."
          onClearFilters={clearAllFilters}
          customFilterSections={customFilterSections}
          primaryFilterName="Filters"
        />
      </div>

      <InternshipList
        title=""
        internships={hasActiveFilters ? filteredInternships : baseInternships}
        type="company-view" // Custom type that won't show the Apply button
        showSidebar={true}
        showTabs={false}
        padding="px-4 pt-2 pb-6"
      />
    </div>
  );
} 