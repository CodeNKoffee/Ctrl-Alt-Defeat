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
import CompanyBrowseInternshipsView from './CompanyBrowseInternshipsView';
import { getRegularInternships } from '../../../../../constants/internshipData';
import InternshipList from '../../../../components/shared/InternshipList';
import ApplicationsFilterBar from '../../../../components/shared/ApplicationsFilterBar';

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

// Using the actual page components for each view
function BrowseInternshipsView({ onApplicationCompleted, appliedInternshipIds }) {
  const [filters, setFilters] = useState({
    industry: '',
    duration: '',
    isPaid: null
  });
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { currentUser } = useSelector(state => state.auth);
  const userMajor = currentUser?.major || 'Computer Science';

  const internshipDataForFilters = getRegularInternships();
  const uniqueIndustries = [...new Set(internshipDataForFilters.map(internship => internship.industry))];
  const uniqueDurations = [...new Set(internshipDataForFilters.map(internship => internship.duration))];

  // Get internships based on active tab
  const baseInternships = activeTab === 'all'
    ? getRegularInternships()
    : (() => {
      const userData = currentUser || JSON.parse(sessionStorage.getItem('userSession') || localStorage.getItem('userSession') || '{}');
      const enhancedUserData = {
        ...userData,
        jobInterests: userData.jobInterests || ['Developer', 'Engineer', 'Data', 'UX'],
        industries: userData.industries || ['Technology', 'Media Engineering'],
        recommendedCompanies: userData.recommendedCompanies || [1, 2, 3, 4, 5]
      };
      const recommendations = getRecommendedInternshipsForStudent(enhancedUserData);
      if (!recommendations || recommendations.length === 0) {
        console.log('No personalized recommendations found, falling back to default recommendations for Browse tab');
        return getRecommendedInternships();
      }
      return recommendations.map(internship => ({
        ...internship,
        pastInternRating: Math.floor(Math.random() * 3) + 3,
        recommendedReason: internship.industry === enhancedUserData.industries?.[0]
          ? 'industry match'
          : (enhancedUserData.jobInterests?.some(interest =>
            internship.title.toLowerCase().includes(interest.toLowerCase())
          ) ? 'job interest match' : 'recommended by past interns')
      }));
    })();

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

  // Define the info card JSX/Component here for clarity
  const BrowseInternshipsInfoCard = () => (
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
              OPPORTUNITIES
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">Browse Career-Building Internships</div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">Explore curated internship opportunities provided by SCAD and our partner companies. These positions are designed to give you real-world experience while building your professional portfolio.</p>

              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  Why These Opportunities Matter:
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Potential for academic credit and professional references</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Networking connections that could lead to full-time employment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Portfolio-building projects to showcase your skills</span>
                  </li>
                </ul>
              </div>

              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                Remember to watch our informational video "What Makes Your Internship Count" to learn how to maximize your internship experience!
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
        <BrowseInternshipsInfoCard />

        <ApplicationsFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search internships by job title or company name ..."
          onClearFilters={clearAllFilters}
          customFilterSections={customFilterSections}
          primaryFilterName="Filters"
        />

        {/* ALL / RECOMMENDED Tabs */}
        <div className="w-full mx-auto">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'all'
                ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#5DB2C7]'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              ALL
            </button>
            <button
              onClick={() => setActiveTab('recommended')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'recommended'
                ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#5DB2C7]'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              RECOMMENDED
            </button>
          </div>
        </div>
      </div>

      <InternshipList
        title=""
        internships={hasActiveFilters ? filteredInternships : baseInternships}
        type="browsing"
        onApplicationCompleted={onApplicationCompleted}
        appliedInternshipIds={appliedInternshipIds}
        showSidebar={true}
        showTabs={false}
        userMajor={userMajor}
        customFilterPanel={<></>}
        padding="px-4 pt-2 pb-6"
      />
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
  'company-browse-internships': CompanyBrowseInternshipsView,
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