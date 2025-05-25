"use client"

import { useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PostTiles from '@/components/PostTiles';
import ApplicationsList from '@/components/ApplicationsList';
import ApplicationsFilterBar from '@/components/shared/ApplicationsFilterBar';
import CurrentInterns from '@/components/CurrentInterns';
import EvaluationsDashboard from '@/components/EvaluationsDashboard';
import { MOCK_COMPANY_EVALUATIONS, mockStudents, TawabiryInternships } from '../../../../../constants/mockData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSearch, faXmark, faChevronDown, faBriefcase, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { useState as useReactState, useEffect } from 'react';
import CompanyBrowseInternshipsView from './CompanyBrowseInternshipsView';
import { getRegularInternships, getRecommendedInternships, getRecommendedInternshipsForStudent } from '../../../../../constants/internshipData';
import InternshipList from '../../../../components/shared/InternshipList';
import ApplicationInfoCard from '@/components/ApplicationInfoCard';
import { toast } from 'react-toastify';

// CompanyPostsInfoCard component
const CompanyPostsInfoCard = () => (
  <div className="w-full max-w-6xl mx-auto">
    <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      {/* Decorative elements */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
      <div className="absolute right-20 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
      <div className="absolute left-40 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

      <div className="flex items-start gap-4 w-full md:w-auto relative z-10">
        <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
          <FontAwesomeIcon icon={faBriefcase} className="h-7 w-7 text-white" />
        </div>
        <div className="text-left">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
            EMPLOYER PORTAL
          </div>
          <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">Employer Internship Portal</div>
          <div className="text-gray-700 mb-3 relative">
            <p className="mb-3">Welcome to the Employer Dashboard where you can create and manage internship opportunities for talented SCAD students.</p>

            {/* Card content with improved styling */}
            <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
              <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                Post New Opportunities:
              </p>
              <ul className="space-y-2 mb-2">
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>Create detailed internship listings with custom titles and descriptions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>Specify required skills, qualifications, and preferred majors</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>Set clear timeframes, work settings (remote/hybrid/on-site), and compensation details</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>Add company information and supervisor contacts</span>
                </li>
              </ul>
            </div>

            <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
              Our platform connects you directly with pre-screened, motivated students whose skills and interests align with your organization's needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function CompanyPostsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    jobType: [],
    jobSetting: [],
    paymentStatus: []
  });

  // Handler for ApplicationsFilterBar
  const handleFilterChange = (category, value) => {
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

  return (
    <div className="container mx-auto p-10">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-left text-[#2a5f74] relative">
          INTERNSHIP POSTS
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#2a5f74]"></span>
        </h1>

        <CompanyPostsInfoCard />

        {/* ApplicationsFilterBar replaces custom filter/search bar */}
        <ApplicationsFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search internships by job title, description, skills..."
          primaryFilterName="Filter"
          selectedPrimaryFilter={activeFilters.jobType[0] || 'all'}
          onPrimaryFilterChange={value => handleFilterChange('jobType', value)}
          primaryFilterOptions={[
            { id: 'Full-time', title: 'Full-time' },
            { id: 'Part-time', title: 'Part-time' },
            { id: 'Internship', title: 'Internship' },
          ]}
          statusConfig={{}}
          selectedStatus={'all'}
          onStatusChange={() => { }}
          showDatePicker={false}
          onClearFilters={clearAllFilters}
          // Add more filter sections as needed
          customFilterSections={[
            {
              title: 'Job Setting',
              options: [
                { label: 'Remote', value: 'Remote' },
                { label: 'On-site', value: 'On-site' },
                { label: 'Hybrid', value: 'Hybrid' },
              ],
              isSelected: (option) => activeFilters.jobSetting.includes(option.value),
              onSelect: (option) => handleFilterChange('jobSetting', option.value),
            },
            {
              title: 'Payment Status',
              options: [
                { label: 'Paid', value: 'Paid' },
                { label: 'Unpaid', value: 'Unpaid' },
              ],
              isSelected: (option) => activeFilters.paymentStatus.includes(option.value),
              onSelect: (option) => handleFilterChange('paymentStatus', option.value),
            },
          ]}
        />

        {/* Post Tiles */}
        <PostTiles searchOverride={searchTerm} filterOverride={activeFilters} />
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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Get current user from Redux store or fallback to empty object
  let currentUser = {};
  try {
    const reduxState = useSelector(state => state.auth);
    currentUser = reduxState?.currentUser || {};
  } catch (error) {
    console.warn("Redux store not available:", error);
  }

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

  // Initialize filteredInternships with baseInternships
  const [filteredInternships, setFilteredInternships] = useState(baseInternships);

  // Update filteredInternships when baseInternships changes (without depending on hasActiveFilters)
  useEffect(() => {
    const hasFilters = filters.industry || filters.duration || filters.isPaid !== null || searchTerm;
    if (!hasFilters) {
      setFilteredInternships(baseInternships);
    }
  }, [baseInternships, filters, searchTerm]);

  // Apply additional filters (industry, duration, paid/unpaid, search)
  useEffect(() => {
    let result = [...baseInternships];

    // Apply search term filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(internship =>
        internship.title?.toLowerCase().includes(searchTermLower) ||
        internship.company?.toLowerCase().includes(searchTermLower) ||
        internship.description?.toLowerCase().includes(searchTermLower) ||
        internship.industry?.toLowerCase().includes(searchTermLower) ||
        internship.locationType?.toLowerCase().includes(searchTermLower)
      );
    }

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
  }, [baseInternships, filters, searchTerm]);

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
    <div className="w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-left text-[#2a5f74] relative">
        BROWSE INTERNSHIPS
        <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#2a5f74]"></span>
      </h1>
      <div className="bg-white p-6 rounded-2xl mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
        <div className="absolute right-20 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500 pointer-events-none"></div>
        <div className="absolute left-40 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500 pointer-events-none"></div>
        <div className="flex items-start gap-4 w-full md:w-auto relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <div className="text-left w-full">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              INTERNSHIP EXPLORER
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3">Company Internship Explorer</div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">Browse internship opportunities posted by partner organizations across industries and locations.</p>
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  Why Use This Explorer:
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>This explorer helps you identify potential internship partners and examine their past engagement with SCAD students.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Discover industry leaders and hidden gems that align with your students' career interests.</span>
                  </li>
                </ul>
              </div>
              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                Note: All displayed companies have been vetted by SCAD and maintain active partnerships with our institution.
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
          onSearchChange={(value) => setSearchTerm(value)}
          searchPlaceholder="Search internships by job title or company name ..."
          onClearFilters={clearAllFilters}
          customFilterSections={customFilterSections}
          primaryFilterName="Filters"
        />
      </div>
      <InternshipList
        title=""
        internships={filteredInternships}
        type="company-view"
        onApplicationCompleted={onApplicationCompleted}
        appliedInternshipIds={appliedInternshipIds}
        showSidebar={true}
        showTabs={false}
        userMajor={userMajor}
        customFilterPanel={<></>}
        padding="px-4 pt-2 pb-6"
        videoSidebarProps={{
          videoUrl: 'https://www.youtube.com/embed/1EQIXjvXKjM?si=zOgZsOew62AVOVDn',
          videoTitle: 'Gen-Z are shaping the future',
          isCompany: true
        }}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
}

function ApplicationsView() {
  // ...copy logic from applications/page.jsx...
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedInternship, setSelectedInternship] = useState('all');

  // Show notification toast when component mounts
  useEffect(() => {
    toast.info('A new applicant has applied to one of your internship listings', {
      position: 'bottom-right',
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  }, []);

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
    <div className="min-h-screen p-4 isolate">
      <div className="container mx-auto px-6 py-6">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-left text-[#2a5f74] relative">
            APPLICATIONS MANAGEMENT
            <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#2a5f74]"></span>
          </h1>

          <ApplicationInfoCard />

          <div className="dropdown-overlay">
            <ApplicationsFilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Search by name, email, or position..."
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              statusConfig={STATUS_CONFIG}
              primaryFilterName="Filter"
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
              statuses={['pending', 'accepted', 'finalized', 'rejected', 'current', 'completed']}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CurrentInternsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    department: [], // Example filter category
    position: [],   // Example filter category
    timePeriod: [], // Example filter category
    evaluationStatus: 'all', // Using 'all' as default for a primary-like filter
  });

  const handleFilterChange = (category, value) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      // For multi-select custom filters (like department, position)
      if (Array.isArray(newFilters[category])) {
        if (value === 'all') {
          newFilters[category] = [];
        } else if (newFilters[category].includes(value)) {
          newFilters[category] = newFilters[category].filter(item => item !== value);
        } else {
          newFilters[category] = [...newFilters[category], value];
        }
      } else {
        // For single-select primary-like filters (like evaluationStatus)
        newFilters[category] = value;
      }
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setActiveFilters({
      department: [],
      position: [],
      timePeriod: [],
      evaluationStatus: 'all',
    });
  };

  // Info card for Intern Management Dashboard
  const InternsInfoCard = () => (
    <div className="w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-left text-[#2a5f74] relative">
        INTERN MANAGEMENT DASHBOARD
        <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#2a5f74]"></span>
      </h1>
      <div className="bg-white p-6 rounded-2xl mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
        <div className="absolute right-20 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500 pointer-events-none"></div>
        <div className="absolute left-40 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500 pointer-events-none"></div>
        {/* Fun but subtle design: floating badge */}
        {/* <div className="absolute left-8 top-8 bg-gradient-to-br from-[#B8E1E9] to-[#E8F7FB] rounded-full px-3 py-1 text-xs font-bold text-[#3298BA] shadow-md rotate-6 opacity-80 pointer-events-none">INTERN MANAGEMENT</div> */}
        <div className="flex items-start gap-4 w-full md:w-auto relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <div className="text-left w-full">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              INTERN MANAGEMENT DASHBOARD
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3">Intern Management Dashboard</div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">This comprehensive view displays all SCAD students who have interned with your organization across all programs and time periods.</p>
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  View By Category:
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">•</span>
                    <span><b>Current Interns:</b> Students actively working in their positions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">•</span>
                    <span><b>Completed Internships:</b> Past interns awaiting evaluation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">•</span>
                    <span><b>Evaluated Interns:</b> Students with completed feedback assessments</span>
                  </li>
                </ul>
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center mt-4">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  Management Features:
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Filter students by department, position, time period, or evaluation status</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Identify students with outstanding evaluations</span>
                  </li>
                </ul>
              </div>
              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                Note: Student information is protected and should be handled according to your confidentiality agreement with SCAD.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-10">
      <InternsInfoCard />
      <ApplicationsFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search interns by name, department, position..."

        primaryFilterName="Filter"
        selectedPrimaryFilter={activeFilters.evaluationStatus}
        onPrimaryFilterChange={(value) => handleFilterChange('evaluationStatus', value)}
        primaryFilterOptions={[
          // These should be derived from your actual evaluation statuses
          { id: 'current', title: 'Current Interns' },
          { id: 'completed', title: 'Completed (Needs Evaluation)' },
          { id: 'evaluated', title: 'Evaluated' },
        ]}

        statusConfig={{}} // Not used if primary filter handles status
        selectedStatus={'all'}
        onStatusChange={() => { }}
        showDatePicker={false} // Assuming no date picker needed for this view
        onClearFilters={clearAllFilters}

        marginBottom="mb-0"
      />
      <CurrentInterns searchTerm={searchTerm} activeFilters={activeFilters} />
    </div>
  );
}

function MyEvaluationsView() {
  // StudentEvaluationsInfoCard component
  const StudentEvaluationsInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="w-full max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 text-left text-[#2a5f74] relative">
          EVALUATION PORTAL
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#2a5f74]"></span>
        </h1>
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          {/* Decorative elements */}
          <div className="absolute -left-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform -rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="absolute left-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
          <div className="absolute right-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

          <div className="flex items-start gap-4 w-full md:w-auto relative z-10">
            <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
              <FontAwesomeIcon icon={faClipboardCheck} className="h-7 w-7 text-white" />
            </div>
            <div className="text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
                EVALUATION PORTAL
              </div>
              <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">Your Student Evaluation Portal</div>
              <div className="text-gray-700 mb-3 relative">
                <p className="mb-3">Provide valuable feedback on interns who have completed positions at your organization. Your assessments help shape students' professional development and inform future placements.</p>

                {/* Card content with improved styling */}
                <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                  <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                    <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                    Evaluation Components:
                  </p>
                  <ul className="space-y-2 mb-2">
                    <li className="flex items-start">
                      <span className="text-[#3298BA] mr-2">✓</span>
                      <span>Rate professional competencies (adaptability, communication, problem-solving)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#3298BA] mr-2">✓</span>
                      <span>Assess technical skills relevant to the position</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#3298BA] mr-2">✓</span>
                      <span>Provide specific examples of achievements and areas for growth</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#3298BA] mr-2">✓</span>
                      <span>Answer structured questions about performance and potential</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#3298BA] mr-2">✓</span>
                      <span>Add private comments for school administrators (optional)</span>
                    </li>
                  </ul>
                </div>

                <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                  Evaluations remain confidential between your company and authorized faculty and SCAD members.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4fafd] py-10 px-4">
      <StudentEvaluationsInfoCard />
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