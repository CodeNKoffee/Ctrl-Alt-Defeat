"use client"

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { createSafeT, translateFilterValue } from '@/lib/translationUtils';
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
import StatusPills from '../../../../components/shared/StatusPills';

// CompanyPostsInfoCard component
const CompanyPostsInfoCard = () => {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute right-20 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute left-40 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        <div className="flex items-start flex-row gap-4 w-full md:w-full relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <FontAwesomeIcon icon={faBriefcase} className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1 text-left rtl:text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              {safeT('company.posts.badge')}
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">{safeT('company.posts.heading')}</div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">{safeT('company.posts.description')}</p>

              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  {safeT('company.posts.postOpportunities')}
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>{safeT('company.posts.features.createListings')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>{safeT('company.posts.features.specifySkills')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>{safeT('company.posts.features.setTimeframes')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>{safeT('company.posts.features.addCompanyInfo')}</span>
                  </li>
                </ul>
              </div>

              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                {safeT('company.posts.connectionNote')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function CompanyPostsView() {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

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

  const filterSectionsConfig = [
    {
      name: safeT('company.posts.filters.jobType'),
      options: [
        { id: 'Full-time', title: safeT('company.posts.filters.fullTime') },
        { id: 'Part-time', title: safeT('company.posts.filters.partTime') },
        { id: 'Internship', title: safeT('company.posts.filters.internship') },
      ],
      selected: activeFilters.jobType[0] || 'all',
      onChange: (value) => handleFilterChange('jobType', value),
      resetLabel: safeT('company.posts.filters.allJobTypes'),
    },
    {
      name: safeT('company.posts.filters.jobSetting'),
      options: [
        { id: 'Remote', title: safeT('company.posts.filters.remote') },
        { id: 'On-site', title: safeT('company.posts.filters.onSite') },
        { id: 'Hybrid', title: safeT('company.posts.filters.hybrid') },
      ],
      selected: activeFilters.jobSetting[0] || 'all',
      onChange: (value) => handleFilterChange('jobSetting', value),
      resetLabel: safeT('company.posts.filters.allSettings'),
    },
    {
      name: safeT('company.posts.filters.paymentStatus'),
      options: [
        { id: 'Paid', title: safeT('company.posts.filters.paid') },
        { id: 'Unpaid', title: safeT('company.posts.filters.unpaid') },
      ],
      selected: activeFilters.paymentStatus[0] || 'all',
      onChange: (value) => handleFilterChange('paymentStatus', value),
      resetLabel: safeT('company.posts.filters.allPaymentStatuses'),
    },
  ];

  return (
    <div className="container mx-auto p-10">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-left rtl:text-right text-[#2a5f74] relative">
          {safeT('company.posts.title')}
          <span className="absolute bottom-0 ltr:left-0 rtl:right-0 w-16 h-1 bg-[#2a5f74]"></span>
        </h1>

        <CompanyPostsInfoCard />

        {/* ApplicationsFilterBar replaces custom filter/search bar */}
        <ApplicationsFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={safeT('company.posts.searchPlaceholder')}
          primaryFilterName={safeT('company.common.filter')}
          selectedPrimaryFilter={activeFilters.jobType[0] || 'all'}
          onPrimaryFilterChange={value => handleFilterChange('jobType', value)}
          primaryFilterOptions={[
            { id: 'Full-time', title: safeT('company.posts.filters.fullTime') },
            { id: 'Part-time', title: safeT('company.posts.filters.partTime') },
            { id: 'Internship', title: safeT('company.posts.filters.internship') },
          ]}
          statusConfig={{}}
          selectedStatus={'all'}
          onStatusChange={() => { }}
          showDatePicker={false}
          onClearFilters={clearAllFilters}
          filterSections={filterSectionsConfig}
        />

        {/* Post Tiles */}
        <PostTiles searchOverride={searchTerm} filterOverride={activeFilters} />
      </div>
    </div>
  );
}

function BrowseInternshipsView({ onApplicationCompleted, appliedInternshipIds }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  const [filters, setFilters] = useState({
    position: '',
    jobType: '',
    jobSetting: '',
    company: '',
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
  const uniquePositions = [...new Set(internshipDataForFilters.map(internship => internship.title))];
  const uniqueJobTypes = [...new Set(internshipDataForFilters.map(internship => internship.type))];
  const uniqueJobSettings = [...new Set(internshipDataForFilters.map(internship => internship.jobSetting))];
  const uniqueCompanies = [...new Set(internshipDataForFilters.map(internship => internship.company))];

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
    const hasFilters = filters.position || filters.jobType || filters.jobSetting || filters.company || searchTerm;
    if (!hasFilters) {
      setFilteredInternships(baseInternships);
    }
  }, [baseInternships, filters, searchTerm]);

  // Apply additional filters (position, jobType, jobSetting, company, search)
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

    // Filter by position
    if (filters.position) {
      result = result.filter(internship => internship.title === filters.position);
    }
    // Filter by job type
    if (filters.jobType) {
      result = result.filter(internship => internship.type === filters.jobType);
    }
    // Filter by job setting
    if (filters.jobSetting) {
      result = result.filter(internship => internship.jobSetting === filters.jobSetting);
    }
    // Filter by company
    if (filters.company) {
      result = result.filter(internship => internship.company === filters.company);
    }

    setFilteredInternships(result);
  }, [baseInternships, filters, searchTerm]);

  // Check if any filters are active
  const hasActiveFilters = filters.position || filters.jobType || filters.jobSetting || filters.company || searchTerm;

  const clearAllFilters = () => {
    setFilters({
      position: '',
      jobType: '',
      jobSetting: '',
      company: '',
    });
    setSearchTerm('');
  };

  // Build filter sections for the new filter bar API
  const filterSections = [
    {
      name: safeT('company.browse.filters.position'),
      options: uniquePositions.map(pos => ({ id: pos, title: pos })), // Keep position titles as-is (job titles)
      selected: filters.position || 'all',
      onChange: (value) => setFilters(prev => ({ ...prev, position: value === 'all' ? '' : value })),
      resetLabel: safeT('company.browse.filters.allPositions'),
    },
    {
      name: safeT('company.posts.filters.jobType'),
      options: uniqueJobTypes.map(type => ({
        id: type,
        title: translateFilterValue(safeT, type, 'jobType')
      })),
      selected: filters.jobType || 'all',
      onChange: (value) => setFilters(prev => ({ ...prev, jobType: value === 'all' ? '' : value })),
      resetLabel: safeT('company.posts.filters.allJobTypes'),
    },
    {
      name: safeT('company.posts.filters.jobSetting'),
      options: uniqueJobSettings.map(setting => ({
        id: setting,
        title: translateFilterValue(safeT, setting, 'jobSetting')
      })),
      selected: filters.jobSetting || 'all',
      onChange: (value) => setFilters(prev => ({ ...prev, jobSetting: value === 'all' ? '' : value })),
      resetLabel: safeT('company.posts.filters.allSettings'),
    },
    {
      name: safeT('company.browse.filters.company'),
      options: uniqueCompanies.map(company => ({ id: company, title: company })), // Keep company names in English as requested
      selected: filters.company || 'all',
      onChange: (value) => setFilters(prev => ({ ...prev, company: value === 'all' ? '' : value })),
      resetLabel: safeT('company.browse.filters.allCompanies'),
    },
  ];

  // Define the info card JSX/Component here for clarity
  const BrowseInternshipsInfoCard = () => (
    <div className="w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-left rtl:text-right text-[#2a5f74] relative">
        {safeT('company.browse.title')}
        <span className="absolute bottom-0 ltr:left-0 rtl:right-0 w-16 h-1 bg-[#2a5f74]"></span>
      </h1>
      <div className="bg-white p-6 rounded-2xl mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
        <div className="absolute right-20 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500 pointer-events-none"></div>
        <div className="absolute left-40 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500 pointer-events-none"></div>
        <div className="flex items-start flex-row gap-4 w-full md:w-full relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <div className="flex-1 text-left rtl:text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              {safeT('company.browse.badge')}
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3">{safeT('company.browse.heading')}</div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">{safeT('company.browse.description')}</p>
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  {safeT('company.browse.whyUse')}
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>{safeT('company.browse.benefitsPlus.identifyPartners')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>{safeT('company.browse.benefitsPlus.discoverLeaders')}</span>
                  </li>
                </ul>
              </div>
              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                {safeT('company.browse.note')}
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
          searchPlaceholder={safeT('company.browse.searchPlaceholder')}
          onClearFilters={clearAllFilters}
          filterSections={filterSections}
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
          videoTitle: safeT('internship.videoSidebar.genZFuture'),
          isCompany: true
        }}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
}

function ApplicationsView() {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedInternship, setSelectedInternship] = useState('all');

  // Show notification toast when component mounts
  // useEffect(() => {
  //   toast.info('A new applicant has applied to one of your internship listings', {
  //     position: 'top-right',
  //     autoClose: 6000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true
  //   });
  // }, []);

  const STATUS_CONFIG = {
    pending: {
      label: safeT('company.applications.statuses.pending'),
      color: "bg-yellow-100 text-yellow-800 border border-yellow-400",
      badgeColor: "bg-yellow-600",
    },
    accepted: {
      label: safeT('company.applications.statuses.accepted'),
      color: "bg-green-100 text-green-800 border border-green-400",
      badgeColor: "bg-green-600",
    },
    rejected: {
      label: safeT('company.applications.statuses.rejected'),
      color: "bg-red-100 text-red-800 border border-red-400",
      badgeColor: "bg-red-600",
    },
    finalized: {
      label: safeT('company.applications.statuses.finalized'),
      color: "bg-purple-100 text-purple-800 border border-purple-400",
      badgeColor: "bg-purple-600",
    },
    current: {
      label: safeT('company.applications.statuses.current'),
      color: "bg-blue-100 text-blue-800 border border-blue-400",
      badgeColor: "bg-blue-600",
    },
    completed: {
      label: safeT('company.applications.statuses.completed'),
      color: "bg-green-100 text-green-800 border border-green-400",
      badgeColor: "bg-green-600",
    }
  };
  const STATUS_CONFIG_HOVER = {
    // For applied internships
    pending: {
      label: safeT('company.applications.statuses.pending'),
      color: "bg-white text-gray-600 border border-gray-300 hover:bg-yellow-100 hover:text-yellow-800 hover:border-yellow-400",
      badgeColor: "bg-yellow-600",
    },
    accepted: {
      label: safeT('company.applications.statuses.accepted'),
      color: "bg-white text-gray-600 border border-gray-300 hover:bg-green-100 hover:text-green-800 hover:border-green-400",
      badgeColor: "bg-green-600",
    },
    rejected: {
      label: safeT('company.applications.statuses.rejected'),
      color: "bg-white text-gray-600 border border-gray-300 hover:bg-red-100 hover:text-red-800 hover:border-red-400",
      badgeColor: "bg-red-600",
    },
    finalized: {
      label: safeT('company.applications.statuses.finalized'),
      color: "bg-white text-gray-600 border border-gray-300 hover:bg-purple-100 hover:text-purple-800 hover:border-purple-400",
      badgeColor: "bg-purple-600",
    },
    // For my internships
    current: {
      label: safeT('company.applications.statuses.current'),
      color: "bg-white text-gray-600 border border-gray-300 hover:bg-blue-200 hover:text-blue-900 hover:border-blue-500",
      badgeColor: "bg-blue-600",
    },
    completed: {
      label: safeT('company.applications.statuses.completed'),
      color: "bg-white text-gray-600 border border-gray-300 hover:bg-green-100 hover:text-green-800 hover:border-green-400",
      badgeColor: "bg-green-600",
    },
    evaluated: {
      label: safeT('company.applications.statuses.evaluated'),
      color: "bg-white text-gray-600 border border-gray-300 hover:bg-purple-100 hover:text-purple-800 hover:border-purple-400",
      badgeColor: "bg-purple-600",
    }
  };
  const MOCK_INTERNSHIPS = [
    { id: 1, title: "Frontend Developer Intern" },
    { id: 2, title: "UI/UX Design Intern" },
    { id: 3, title: "Backend Developer Intern" },
    { id: 4, title: "Data Analyst Intern" },
    { id: 5, title: "Marketing Intern" }
  ];
  const statusPills = [
    { value: 'pending', label: safeT('company.applications.statuses.pending'), color: 'bg-yellow-100 text-yellow-800 border-2 border-yellow-400', badgeColor: 'bg-yellow-600' },
    { value: 'accepted', label: safeT('company.applications.statuses.accepted'), color: 'bg-green-100 text-green-800 border-2 border-green-400', badgeColor: 'bg-green-600' },
    { value: 'finalized', label: safeT('company.applications.statuses.finalized'), color: 'bg-purple-100 text-purple-800 border-2 border-purple-400', badgeColor: 'bg-purple-600' },
    { value: 'rejected', label: safeT('company.applications.statuses.rejected'), color: 'bg-red-100 text-red-800 border-2 border-red-400', badgeColor: 'bg-red-600' },
    { value: 'current', label: safeT('company.applications.statuses.current'), color: 'bg-blue-100 text-blue-800 border-2 border-blue-400', badgeColor: 'bg-blue-600' },
    { value: 'completed', label: safeT('company.applications.statuses.completed'), color: 'bg-green-100 text-green-800 border-2 border-green-400', badgeColor: 'bg-green-600' },
  ];
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedInternship('all');
  };

  // Build filter sections for the new filter bar API
  const positionOptions = [
    { id: 'all', title: safeT('company.applications.filters.allPositions') },
    ...MOCK_INTERNSHIPS.map(pos => ({ id: pos.id.toString(), title: pos.title }))
  ];
  const statusOptions = [
    { id: 'all', title: safeT('company.applications.filters.allStatus') },
    ...Object.entries(STATUS_CONFIG).map(([key, val]) => ({ id: key, title: val.label }))
  ];

  return (
    <div className="min-h-screen p-4 isolate">
      <div className="container mx-auto px-6 py-6">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-left rtl:text-right text-[#2a5f74] relative">
            {safeT('company.applications.title')}
            <span className="absolute bottom-0 ltr:left-0 rtl:right-0 w-16 h-1 bg-[#2a5f74]"></span>
          </h1>

          <ApplicationInfoCard />

          <div className="dropdown-overlay">
            <ApplicationsFilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder={safeT('company.applications.searchPlaceholder')}
              filterSections={[
                {
                  name: safeT('company.applications.filters.position'),
                  options: positionOptions.slice(1),
                  selected: selectedInternship,
                  onChange: setSelectedInternship,
                  resetLabel: safeT('company.applications.filters.allPositions')
                },
                {
                  name: safeT('company.applications.filters.status'),
                  options: statusOptions.slice(1),
                  selected: selectedStatus,
                  onChange: setSelectedStatus,
                  resetLabel: safeT('company.applications.filters.allStatus')
                }
              ]}
              onClearFilters={clearFilters}
            />
            <div className="w-full max-w-6xl mx-auto my-4">
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  onClick={() => setSelectedStatus('all')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium h-[38px] transition-all flex items-center ${selectedStatus === 'all'
                    ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#5DB2C7]'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-[#D9F0F4] hover:text-[#2a5f74] hover:border-[#5DB2C7]'
                    }`}
                >
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${selectedStatus === 'all' ? 'bg-[#5DB2C7]' : 'bg-gray-300'
                    }`}></span>
                  {safeT('company.applications.filters.allStatus')}
                </button>
                {statusPills.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => setSelectedStatus(status.value)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium h-[38px] transition-all flex items-center ${selectedStatus === status.value
                      ? status.color
                      : status.value === 'pending'
                        ? 'bg-white text-gray-600 border-2 border-gray-300 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700'
                        : status.value === 'accepted'
                          ? 'bg-white text-gray-600 border-2 border-gray-300 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                          : status.value === 'finalized'
                            ? 'bg-white text-gray-600 border-2 border-gray-300 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700'
                            : status.value === 'rejected'
                              ? 'bg-white text-gray-600 border-2 border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-700'
                              : status.value === 'current'
                                ? 'bg-white text-gray-600 border-2 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                                : status.value === 'completed'
                                  ? 'bg-white text-gray-600 border-2 border-gray-300 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${selectedStatus === status.value ? status.badgeColor : 'bg-gray-300'
                      }`}></span>
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
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
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const statusPills = [
    { value: 'current', label: safeT('company.interns.statuses.current'), color: 'bg-blue-100 text-blue-800 border-2 border-blue-400', badgeColor: 'bg-blue-600' },
    { value: 'completed', label: safeT('company.interns.statuses.completed'), color: 'bg-green-100 text-green-800 border-2 border-green-400', badgeColor: 'bg-green-600' },
    { value: 'evaluated', label: safeT('company.interns.statuses.evaluated'), color: 'bg-purple-100 text-purple-800 border-2 border-purple-400', badgeColor: 'bg-purple-600' },
  ];

  // Evaluation status filter options for the filter bar
  const evaluationStatusOptions = [
    { id: 'current', title: safeT('company.interns.statuses.current') },
    { id: 'completed', title: safeT('company.interns.statuses.completed') },
    { id: 'evaluated', title: safeT('company.interns.statuses.evaluated') },
  ];

  // Info card for Intern Management Dashboard
  const InternsInfoCard = () => (
    <div className="w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-left rtl:text-right text-[#2a5f74] relative">
        {safeT('company.interns.title')}
        <span className="absolute bottom-0 ltr:left-0 rtl:right-0 w-16 h-1 bg-[#2a5f74]"></span>
      </h1>
      <div className="bg-white p-6 rounded-2xl mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
        <div className="absolute right-20 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500 pointer-events-none"></div>
        <div className="absolute left-40 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500 pointer-events-none"></div>
        {/* Fun but subtle design: floating badge */}
        {/* <div className="absolute left-8 top-8 bg-gradient-to-br from-[#B8E1E9] to-[#E8F7FB] rounded-full px-3 py-1 text-xs font-bold text-[#3298BA] shadow-md rotate-6 opacity-80 pointer-events-none">INTERN MANAGEMENT</div> */}
        <div className="flex items-start flex-row gap-4 w-full md:w-full relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <div className="flex-1 text-left rtl:text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              {safeT('company.interns.badge')}
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3">{safeT('company.interns.heading')}</div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">{safeT('company.interns.description')}</p>
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  {safeT('company.interns.viewByCategory')}
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">•</span>
                    <span>{safeT('company.interns.categories.current')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">•</span>
                    <span>{safeT('company.interns.categories.completed')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">•</span>
                    <span>{safeT('company.interns.categories.evaluated')}</span>
                  </li>
                </ul>
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center mt-4">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  {safeT('company.interns.managementFeatures')}
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>{safeT('company.interns.features.filter')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>{safeT('company.interns.features.identify')}</span>
                  </li>
                </ul>
              </div>
              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                {safeT('company.interns.note')}
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
      <div className="dropdown-overlay">
        <ApplicationsFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={safeT('company.interns.searchPlaceholder')}
          filterSections={[
            {
              name: safeT('company.applications.filters.status'),
              options: evaluationStatusOptions,
              selected: selectedStatus,
              onChange: setSelectedStatus,
              resetLabel: safeT('company.applications.filters.allStatus')
            }
          ]}
          onClearFilters={() => {
            setSearchTerm('');
            setSelectedStatus('all');
          }}
        />
        <div className="w-full max-w-6xl mx-auto my-4">
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium h-[38px] transition-all flex items-center ${selectedStatus === 'all'
                ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#5DB2C7]'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-[#D9F0F4] hover:text-[#2a5f74] hover:border-[#5DB2C7]'
                }`}
            >
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${selectedStatus === 'all' ? 'bg-[#5DB2C7]' : 'bg-gray-300'
                }`}></span>
              {safeT('company.interns.statuses.all')}
            </button>
            {statusPills.map((status) => (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium h-[38px] transition-all flex items-center ${selectedStatus === status.value
                  ? status.color
                  : status.value === 'current'
                    ? 'bg-white text-gray-600 border-2 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                    : status.value === 'completed'
                      ? 'bg-white text-gray-600 border-2 border-gray-300 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                      : status.value === 'evaluated'
                        ? 'bg-white text-gray-600 border-2 border-gray-300 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700'
                        : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${selectedStatus === status.value ? status.badgeColor : 'bg-gray-300'
                  }`}></span>
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <CurrentInterns
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />
    </div>
  );
}

function MyEvaluationsView() {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  // StudentEvaluationsInfoCard component
  const StudentEvaluationsInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="w-full max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 text-left rtl:text-right text-[#2a5f74] relative">
          {safeT('company.evaluations.title')}
          <span className="absolute bottom-0 ltr:left-0 rtl:right-0 w-16 h-1 bg-[#2a5f74]"></span>
        </h1>
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          {/* Decorative elements */}
          <div className="absolute -left-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform -rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="absolute left-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
          <div className="absolute right-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

          <div className="flex items-start flex-row gap-4 w-full md:w-full relative z-10">
            <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
              <FontAwesomeIcon icon={faClipboardCheck} className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 text-left rtl:text-right">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
                {safeT('company.evaluations.badge')}
              </div>
              <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">{safeT('company.evaluations.heading')}</div>
              <div className="text-gray-700 mb-3 relative">
                <p className="mb-3">{safeT('company.evaluations.description')}</p>

                {/* Card content with improved styling */}
                <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                  <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                    <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                    {safeT('company.evaluations.components')}
                  </p>
                  <ul className="space-y-2 mb-2">
                    <li className="flex items-start">
                      <span className="text-[#3298BA] mr-2">✓</span>
                      <span>{safeT('company.evaluations.features.rateProfessional')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#3298BA] mr-2">✓</span>
                      <span>{safeT('company.evaluations.features.assessTechnical')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#3298BA] mr-2">✓</span>
                      <span>{safeT('company.evaluations.features.provideExamples')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#3298BA] mr-2">✓</span>
                      <span>{safeT('company.evaluations.features.answerQuestions')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#3298BA] mr-2">✓</span>
                      <span>{safeT('company.evaluations.features.addComments')}</span>
                    </li>
                  </ul>
                </div>

                <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                  {safeT('company.evaluations.confidentialityNote')}
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