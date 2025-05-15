"use client"

import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PostTiles from '@/components/PostTiles';
import ApplicationsList from '@/components/ApplicationsList';
import ApplicationsFilterBar from '@/components/shared/ApplicationsFilterBar';
import CurrentInterns from '@/components/CurrentInterns';
import EvaluationsDashboard from '@/components/EvaluationsDashboard';
import { MOCK_COMPANY_EVALUATIONS, mockStudents } from '../../../../constants/mockData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSearch, faXmark, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useState as useReactState, useEffect } from 'react';

function CompanyPostsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCombinedFilterPopoverOpen, setIsCombinedFilterPopoverOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    jobType: [],
    jobSetting: [],
    paymentStatus: []
  });
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.combined-filter-popover') && !event.target.closest('.combined-filter-button')) {
        setIsCombinedFilterPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleFilterClick = (category, value) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (value === 'all') {
        newFilters[category] = [];
        return newFilters;
      }
      if (newFilters[category].includes(value)) {
        newFilters[category] = newFilters[category].filter(item => item !== value);
      } else {
        newFilters[category] = [...newFilters[category], value];
      }
      return newFilters;
    });
  };
  const clearAllFilters = () => {
    setActiveFilters({ jobType: [], jobSetting: [], paymentStatus: [] });
    setSearchTerm('');
  };
  const isFilterActive = (category, value) => activeFilters[category].includes(value);
  const hasActiveFilters = () => Object.values(activeFilters).some(arr => arr.length > 0) || searchTerm;
  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-left text-[#2a5f74] relative">
          INTERNSHIP POSTS
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#2a5f74]"></span>
        </h1>
        {/* Modern search and filter bar */}
        <div className="w-full bg-[#D9F0F4]/60 backdrop-blur-md p-6 rounded-xl shadow-lg mb-8 border border-[#B8E1E9]/50 transition-all duration-300 hover:shadow-xl">
          <div className="w-full flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search box */}
            <div className="flex-1 w-full md:w-auto md:max-w-md">
              <div className="relative w-full flex justify-center items-center">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, description, or skills..."
                  className="w-full py-3 pl-10 pr-10 appearance-none bg-white/90 backdrop-blur-sm border-2 border-[#B8E1E9] hover:border-[#5DB2C7] text-sm text-[#1a3f54] rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#5DB2C7] focus:border-[#5DB2C7] transition-all duration-300 placeholder-gray-500"
                />
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-[#5DB2C7]" />
                </div>
                {searchTerm && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3.5 flex items-center p-1 rounded-full hover:bg-[#B8E1E9]/50 transition-colors duration-200"
                    onClick={() => setSearchTerm('')}
                  >
                    <FontAwesomeIcon icon={faXmark} className="w-4 h-4 text-[#5DB2C7] hover:text-[#2a5f74]" />
                  </button>
                )}
              </div>
            </div>
            {/* Combined Filter Button and Popover */}
            <div className="relative w-full md:w-auto">
              <button
                onClick={() => setIsCombinedFilterPopoverOpen(!isCombinedFilterPopoverOpen)}
                className={`appearance-none w-full md:w-auto backdrop-blur-sm border-2 text-sm py-3 px-4 rounded-full shadow-md transition-all duration-300 flex items-center justify-center gap-2 combined-filter-button min-w-[150px]
                  ${hasActiveFilters()
                    ? "bg-[#5DB2C7] text-white border-[#5DB2C7] hover:bg-[#4AA0B5]"
                    : "bg-white/90 text-[#1a3f54] border-[#B8E1E9] hover:border-[#5DB2C7]"
                  }`}
              >
                <FontAwesomeIcon icon={faFilter} className={`h-4 w-4 ${hasActiveFilters() ? "text-white" : "text-[#5DB2C7]"}`} />
                <span>Filters</span>
                {hasActiveFilters() && (
                  <span className="bg-white text-[#5DB2C7] text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {activeFilters.jobType.length + activeFilters.jobSetting.length + activeFilters.paymentStatus.length + (searchTerm ? 1 : 0)}
                  </span>
                )}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`h-4 w-4 ${hasActiveFilters() ? "text-white" : "text-[#5DB2C7]"} transition-transform duration-300 ${isCombinedFilterPopoverOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isCombinedFilterPopoverOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-md border-2 border-[#B8E1E9] rounded-xl shadow-xl z-30 combined-filter-popover animate-dropdown focus:outline-none p-4 space-y-4">
                  {/* Job Type Filter Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#2a5f74] mb-2">Job Type</h4>
                    <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                      <div
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${activeFilters.jobType.length === 0 ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('jobType', 'all')}
                      >
                        All Types
                      </div>
                      <div
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${isFilterActive('jobType', 'Full-time') ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('jobType', 'Full-time')}
                      >
                        Full-time
                      </div>
                      <div
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${isFilterActive('jobType', 'Part-time') ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('jobType', 'Part-time')}
                      >
                        Part-time
                      </div>
                      <div
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${isFilterActive('jobType', 'Internship') ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('jobType', 'Internship')}
                      >
                        Internship
                      </div>
                    </div>
                  </div>
                  {/* Job Setting Filter Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#2a5f74] mb-2">Job Setting</h4>
                    <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                      <div
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${activeFilters.jobSetting.length === 0 ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('jobSetting', 'all')}
                      >
                        All Settings
                      </div>
                      <div
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${isFilterActive('jobSetting', 'Remote') ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('jobSetting', 'Remote')}
                      >
                        Remote
                      </div>
                      <div
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${isFilterActive('jobSetting', 'On-site') ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('jobSetting', 'On-site')}
                      >
                        On-site
                      </div>
                      <div
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${isFilterActive('jobSetting', 'Hybrid') ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('jobSetting', 'Hybrid')}
                      >
                        Hybrid
                      </div>
                    </div>
                  </div>
                  {/* Payment Status Filter Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#2a5f74] mb-2">Payment Status</h4>
                    <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                      <div
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${activeFilters.paymentStatus.length === 0 ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('paymentStatus', 'all')}
                      >
                        All Statuses
                      </div>
                      <div
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${isFilterActive('paymentStatus', 'Paid') ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('paymentStatus', 'Paid')}
                      >
                        Paid
                      </div>
                      <div
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${isFilterActive('paymentStatus', 'Unpaid') ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('paymentStatus', 'Unpaid')}
                      >
                        Unpaid
                      </div>
                    </div>
                  </div>
                  <button
                    className="w-full mt-4 py-2 rounded-full bg-[#5DB2C7] text-white font-semibold hover:bg-[#3298BA] transition-colors duration-200"
                    onClick={clearAllFilters}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Post Tiles */}
        <PostTiles searchTerm={searchTerm} activeFilters={activeFilters} />
      </div>
    </div>
  );
}

function BrowseInternshipsView() {
  // ...copy and tailor logic from student BrowseInternshipsView...
  // For company, this could show all internships posted by the company, or all available internships for management.
  // For now, you can use a placeholder or reuse the InternshipList component with company-specific props.
  return (
    <div className="w-full px-6 py-4">
      {/* TODO: Implement company-specific internships browsing/management */}
      <div className="text-center text-gray-500 py-20">Browse/Manage all internships (Company View) - To be implemented</div>
    </div>
  );
}

function ApplicationsView() {
  // ...copy logic from applications/page.jsx...
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedInternship, setSelectedInternship] = useState('all');
  const STATUS_CONFIG = {
    pending: {
      label: "PENDING",
      color: "bg-yellow-100 text-yellow-800 border border-yellow-400",
      badgeColor: "bg-yellow-600",
    },
    accepted: {
      label: "ACCEPTED",
      color: "bg-green-100 text-green-800 border border-green-400",
      badgeColor: "bg-green-600",
    },
    rejected: {
      label: "REJECTED",
      color: "bg-red-100 text-red-800 border border-red-400",
      badgeColor: "bg-red-600",
    },
    finalized: {
      label: "FINALIZED",
      color: "bg-purple-100 text-purple-800 border border-purple-400",
      badgeColor: "bg-purple-600",
    },
    current: {
      label: "CURRENT INTERN",
      color: "bg-blue-100 text-blue-800 border border-blue-400",
      badgeColor: "bg-blue-600",
    },
    completed: {
      label: "COMPLETED",
      color: "bg-green-100 text-green-800 border border-green-400",
      badgeColor: "bg-green-600",
    }
  };
  const MOCK_INTERNSHIPS = [
    { id: 1, title: "Frontend Developer Intern" },
    { id: 2, title: "UI/UX Design Intern" },
    { id: 3, title: "Backend Developer Intern" },
    { id: 4, title: "Data Analyst Intern" },
    { id: 5, title: "Marketing Intern" }
  ];
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedInternship('all');
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4 isolate">
      <div className="container mx-auto px-4 py-8">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-left text-[#2a5f74] relative">
            APPLICATIONS MANAGEMENT
            <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#2a5f74]"></span>
          </h1>
          <div className="dropdown-overlay">
            <ApplicationsFilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Search by name, email, or position..."
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              statusConfig={STATUS_CONFIG}
              primaryFilterName="Internship Position"
              selectedPrimaryFilter={selectedInternship}
              onPrimaryFilterChange={setSelectedInternship}
              primaryFilterOptions={MOCK_INTERNSHIPS}
              onClearFilters={clearFilters}
            />
          </div>
          <div className="application-list-item">
            <ApplicationsList
              searchTerm={searchTerm}
              selectedStatus={selectedStatus}
              selectedInternship={selectedInternship}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CurrentInternsView() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 font-['IBM_Plex_Sans']">
      <CurrentInterns />
    </div>
  );
}

function MyEvaluationsView() {
  return (
    <div className="min-h-screen bg-[#f4fafd] py-10 px-4">
      <EvaluationsDashboard evaluations={MOCK_COMPANY_EVALUATIONS} stakeholder={"company"} />
    </div>
  );
}

const viewComponents = {
  'companyposts': CompanyPostsView,
  'browse-internships': BrowseInternshipsView,
  'applications': ApplicationsView,
  'current-interns': CurrentInternsView,
  'my-evaluations': MyEvaluationsView,
};

export default function CompanyDashboard() {
  const [currentView, setCurrentView] = useState('companyposts');

  const handleViewChange = (viewId) => {
    setCurrentView(viewId);
  };

  const CurrentViewComponent = viewComponents[currentView];

  return (
    <DashboardLayout
      userType="company"
      currentViewId={currentView}
      onViewChange={handleViewChange}
    >
      {CurrentViewComponent && <CurrentViewComponent />}
    </DashboardLayout>
  );
}