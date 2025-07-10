// View a list of suggested companies based on my job interests, industry and recommendations from past interns

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import InternshipList from '@/components/shared/InternshipList';
import StudentProfile from '@/components/StudentProfile';
import NotificationsList from '@/components/NotificationsList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faXmark, faPlay, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import {
  getRecommendedInternshipsForStudent,
  getRegularInternships,
  getRecommendedInternships,
  getAppliedInternships,
  getMyInternships
} from '../../../../../constants/internshipData';
import WorkshopList from '@/components/WorkshopList';
import AssessmentList from '@/components/AssessmentList';
import Report from '@/components/Report';
import Header from '@/components/Header';
import ReportTiles from '@/components/ReportTiles';
import ReportEdit from '@/components/ReportEdit';
import DeleteTileConfirmation from '@/components/DeleteTileConfirmation';
import StatusBadge from '@/components/shared/StatusBadge';
import ReportCreationDashboard from '@/components/ReportCreationDashboard';
import StudentReportCards from '@/components/StudentReportCards';
import { MOCK_EVALUATIONS } from '../../../../../constants/mockData';
import EvaluationsDashboard from '@/components/EvaluationsDashboard';
import WorkshopInterface from '@/components/WorkshopInterface';
import ApplicationsFilterBar from '@/components/shared/ApplicationsFilterBar';
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';

// Video Sidebar Component
function InternshipVideoSidebar({ userMajor }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 h-fit sticky top-4">
      <h3 className="text-lg font-semibold text-[#2a5f74] mb-3">Internship Requirements</h3>
      <div className="space-y-3">
        <div className="relative bg-[#D9F0F4] rounded-lg overflow-hidden aspect-video flex items-center justify-center cursor-pointer group">
          <FontAwesomeIcon icon={faPlay} className="text-[#3298BA] text-3xl group-hover:scale-110 transition-transform" />
          <div className="absolute bottom-0 left-0 right-0 bg-[#2a5f74]/70 text-white text-xs py-2 px-3">
            Watch: Internships for {userMajor || 'Your Major'}
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Learn which internships count toward your graduation requirements based on your major and academic plan.
        </p>
        <div className="border-t pt-3">
          <h4 className="font-medium text-[#2a5f74] mb-2">Quick Resources</h4>
          <ul className="text-sm space-y-2">
            <li>
              <a href="#" className="text-[#3298BA] hover:underline">Academic Requirements Guide</a>
            </li>
            <li>
              <a href="#" className="text-[#3298BA] hover:underline">Contact Academic Advisor</a>
            </li>
            <li>
              <a href="#" className="text-[#3298BA] hover:underline">FAQs About Internships</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Dashboard Home View Component
function DashboardHomeView({ onApplicationCompleted, appliedInternshipIds }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const [personalizedInternships, setPersonalizedInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const { currentUser, isAuthenticated } = useSelector(state => state.auth);
  const userMajor = currentUser?.major || 'Computer Science';
  const [filters, setFilters] = useState({
    jobType: '',
    jobSetting: '',
    isPaid: null,
  });

  useEffect(() => {
    const userData = currentUser || JSON.parse(sessionStorage.getItem('userSession') || localStorage.getItem('userSession') || '{}');
    if (userData) {
      const enhancedUserData = {
        ...userData,
        jobInterests: userData.jobInterests || ['Developer', 'Engineer', 'Data', 'UX'],
        industries: userData.industries || ['Technology', 'Media Engineering']
      };
      const recommendations = getRecommendedInternshipsForStudent(enhancedUserData);
      const recommendationsWithRatings = recommendations.map(internship => ({
        ...internship,
        pastInternRating: Math.floor(Math.random() * 3) + 3,
        recommendedReason: internship.industry === enhancedUserData.industries?.[0]
          ? 'industry match'
          : (enhancedUserData.jobInterests?.some(interest =>
            internship.title.toLowerCase().includes(interest.toLowerCase())
          ) ? 'job interest match' : 'recommended by past interns')
      }));
      setPersonalizedInternships(recommendationsWithRatings);
    }
  }, [currentUser]);

  const internshipDataForFilters = personalizedInternships;
  const uniqueJobTypes = [...new Set(internshipDataForFilters.map(i => i.type))].filter(Boolean);
  const uniqueJobSettings = [...new Set(internshipDataForFilters.map(i => i.jobSetting))].filter(Boolean);

  const filterSections = [
    {
      name: safeT('student.dashboard.filterSections.jobType'),
      options: [
        { id: 'fullTime', title: safeT('student.dashboard.filterSections.fullTime') },
        { id: 'partTime', title: safeT('student.dashboard.filterSections.partTime') },
        { id: 'contract', title: safeT('student.dashboard.filterSections.contract') },
      ],
      selected: filters.jobType || 'all',
      onChange: (value) => setFilters(prev => ({ ...prev, jobType: value === 'all' ? '' : value })),
      resetLabel: safeT('student.dashboard.filterSections.allJobTypes'),
    },
    {
      name: safeT('student.dashboard.filterSections.jobSetting'),
      options: [
        { id: 'remote', title: safeT('student.dashboard.filterSections.remote') },
        { id: 'hybrid', title: safeT('student.dashboard.filterSections.hybrid') },
        { id: 'onSite', title: safeT('student.dashboard.filterSections.onSite') },
      ],
      selected: filters.jobSetting || 'all',
      onChange: (value) => setFilters(prev => ({ ...prev, jobSetting: value === 'all' ? '' : value })),
      resetLabel: safeT('student.dashboard.filterSections.allJobSettings'),
    },
    {
      name: safeT('student.dashboard.filterSections.paymentStatus'),
      options: [
        { id: 'paid', title: safeT('student.dashboard.filterSections.paid') },
        { id: 'unpaid', title: safeT('student.dashboard.filterSections.unpaid') }
      ],
      selected: filters.isPaid === true ? 'paid' : filters.isPaid === false ? 'unpaid' : 'all',
      onChange: (value) => setFilters(prev => ({
        ...prev,
        isPaid: value === 'paid' ? true : value === 'unpaid' ? false : null
      })),
      resetLabel: safeT('student.dashboard.filterSections.allPaymentTypes'),
    }
  ];

  const filteredPersonalizedInternships = personalizedInternships.filter(internship => {
    const term = searchTerm.toLowerCase();
    return (
      (searchTerm === '' ||
        internship.title.toLowerCase().includes(term) ||
        internship.company.toLowerCase().includes(term)) &&
      (filters.jobType === '' || internship.type === filters.jobType) &&
      (filters.jobSetting === '' || internship.jobSetting === filters.jobSetting) &&
      (filters.isPaid === null || internship.paid === filters.isPaid)
    );
  });

  const RecommendedOpportunitiesInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="w-full max-w-6xl mb-8 mx-auto">
        <h1 className="text-3xl font-bold mb-0 ltr:text-left rtl:text-right text-[#2a5f74] relative">
          {safeT('student.dashboard.titles.home')}
          <span className="absolute bottom-0 ltr:left-0 rtl:right-0 w-16 h-1 bg-[#2a5f74]"></span>
        </h1>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-md mb-2 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -left-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform -rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute left-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute right-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        <div className="flex items-start gap-4 w-full md:w-auto relative z-10 flex-row rtl:flex-row">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <div className="text-left rtl:text-right w-full">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2 rtl:text-right">
              {safeT('student.dashboard.personalizedCard.badge')}
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300 rtl:text-right">
              {safeT('student.dashboard.personalizedCard.title')}
            </div>
            <div className="text-gray-700 mb-3 relative w-full">
              <p className="mb-3 rtl:text-right">{safeT('student.dashboard.personalizedCard.description')}</p>

              {/* Card content with improved styling */}
              <div className="w-full bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center w-full">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2 rtl:ml-2 rtl:mr-0"></span>
                  {safeT('student.dashboard.personalizedCard.howItWorks.title')}
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>{safeT('student.dashboard.personalizedCard.howItWorks.jobInterests')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>{safeT('student.dashboard.personalizedCard.howItWorks.industries')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>{safeT('student.dashboard.personalizedCard.howItWorks.ratings')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>{safeT('student.dashboard.personalizedCard.howItWorks.updates')}</span>
                  </li>
                </ul>
              </div>

              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                {safeT('student.dashboard.personalizedCard.footer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getInitialTitle = (view) => {
    const titleKey = view === 'recommended'
      ? 'student.dashboard.titles.recommended'
      : view === 'applied'
        ? 'student.dashboard.titles.applied'
        : 'student.dashboard.titles.current';
    return safeT(titleKey);
  };

  const [currentTitle, setCurrentTitle] = useState(() => getInitialTitle('recommended'));

  return (
    <div className="w-full px-6 py-4">
      <div className="px-4 pt-6">
        <RecommendedOpportunitiesInfoCard />
        <ApplicationsFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={safeT('student.dashboard.searchPlaceholder')}
          filterSections={filterSections}
          marginTop={"mt-6"}
          marginBottom="mb-0"
          onClearFilters={() => {
            setSearchTerm('');
            setFilters({ jobType: '', jobSetting: '', isPaid: null });
          }}
        />
      </div>
      <InternshipList
        title={currentTitle}
        internships={filteredPersonalizedInternships}
        type={"recommended"}
        onApplicationCompleted={onApplicationCompleted}
        appliedInternshipIds={appliedInternshipIds}
        showSidebar={true}
        userMajor={userMajor}
        isRecommended={true}
        customFilterPanel={<></>}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
}

// Using the actual page components for each view
function BrowseInternshipsView({ onApplicationCompleted, appliedInternshipIds }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const [filters, setFilters] = useState({
    industry: '',
    duration: '',
    isPaid: null,
    position: '',
    jobType: '',
    jobSetting: '',
    company: '',
    contentType: 'all',
  });
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const { currentUser } = useSelector(state => state.auth);
  const userMajor = currentUser?.major || 'Computer Science';

  const internshipDataForFilters = getRegularInternships();
  const uniqueIndustries = [...new Set(internshipDataForFilters.map(internship => internship.industry))];
  const uniqueDurations = [...new Set(internshipDataForFilters.map(internship => internship.duration))];
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

  // Apply additional filters (position, jobType, jobSetting, company, industry, duration, paid/unpaid)
  useEffect(() => {
    let result = [...baseInternships];

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
        const filterDurationMatch = filters.duration.match(/(\\d+)/);
        const filterDurationMonths = filterDurationMatch ? parseInt(filterDurationMatch[1]) : 0;

        // Parse the internship duration (e.g., "3 months", "6-8 months", etc.)
        const internshipDurationMatch = internship.duration.match(/(\\d+)/);
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

    // Filter by start date
    if (selectedDate) {
      console.log('Selected date for filtering:', selectedDate);

      let filterDateString;

      // Handle different possible date formats from DatePicker
      if (selectedDate instanceof Date) {
        // If it's a Date object
        filterDateString = selectedDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
      } else if (typeof selectedDate === 'string') {
        // If it's already a string, try to parse and format it
        const dateObj = new Date(selectedDate);
        if (!isNaN(dateObj.getTime())) {
          filterDateString = dateObj.toISOString().split('T')[0];
        } else {
          filterDateString = selectedDate; // Use as-is if it can't be parsed
        }
      } else {
        console.warn('Unexpected date format:', selectedDate);
        return true; // Skip filtering if format is unknown
      }

      console.log('Formatted filter date string:', filterDateString);

      result = result.filter(internship => {
        console.log(`Checking internship "${internship.title}" with startDate: "${internship.startDate}"`);
        if (!internship.startDate) {
          console.log(`No startDate for internship: ${internship.title}`);
          return false;
        }

        // Normalize internship start date to YYYY-MM-DD format
        let internshipDateString;
        if (internship.startDate instanceof Date) {
          internshipDateString = internship.startDate.toISOString().split('T')[0];
        } else {
          internshipDateString = internship.startDate.split('T')[0]; // Remove time part if present
        }

        console.log(`Comparing: filter="${filterDateString}" vs internship="${internshipDateString}"`);
        const matches = internshipDateString === filterDateString;
        console.log(`Match result: ${matches}`);
        return matches;
      });

      console.log('Filtered internships by date:', result.length);
    }

    setFilteredInternships(result);
  }, [baseInternships, filters, selectedDate]);

  // Check if any filters are active
  const hasActiveFilters = filters.position || filters.jobType || filters.jobSetting || filters.company || filters.industry || filters.duration || filters.isPaid !== null || searchTerm || selectedDate;

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    // Sync with activeTab when content type filter changes
    if (filterName === 'contentType') {
      setActiveTab(value);
    }
  };

  const clearAllFilters = () => {
    setFilters({
      position: '',
      jobType: '',
      jobSetting: '',
      company: '',
      industry: '',
      duration: '',
      isPaid: null,
      contentType: 'all',
    });
    setSearchTerm('');
    setSelectedDate(null);
    // Reset to "ALL" tab when clearing all filters for consistency
    setActiveTab('all');
  };

  const filterSections = [
    {
      name: safeT('student.dashboard.filterSections.contentType'),
      options: [
        // { id: 'all', title: safeT('student.dashboard.filterSections.allInternships') },
        { id: 'recommended', title: safeT('student.dashboard.filterSections.recommended') }
      ],
      selected: filters.contentType,
      onChange: (value) => handleFilterChange('contentType', value),
      resetLabel: safeT('student.dashboard.filterSections.allContent'),
    },
    {
      name: safeT('student.dashboard.filterSections.position'),
      options: uniquePositions.map(pos => ({ id: pos, title: pos })),
      selected: filters.position || 'all',
      onChange: (value) => setFilters(prev => ({ ...prev, position: value === 'all' ? '' : value })),
      resetLabel: safeT('student.dashboard.filterSections.allPositions'),
    },
    {
      name: safeT('student.dashboard.filterSections.jobType'),
      options: [
        { id: 'fullTime', title: safeT('student.dashboard.filterSections.fullTime') },
        { id: 'partTime', title: safeT('student.dashboard.filterSections.partTime') },
        { id: 'contract', title: safeT('student.dashboard.filterSections.contract') },
      ],
      selected: filters.jobType || 'all',
      onChange: (value) => setFilters(prev => ({ ...prev, jobType: value === 'all' ? '' : value })),
      resetLabel: safeT('student.dashboard.filterSections.allJobTypes'),
    },
    {
      name: safeT('student.dashboard.filterSections.jobSetting'),
      options: [
        { id: 'remote', title: safeT('student.dashboard.filterSections.remote') },
        { id: 'hybrid', title: safeT('student.dashboard.filterSections.hybrid') },
        { id: 'onSite', title: safeT('student.dashboard.filterSections.onSite') },
      ],
      selected: filters.jobSetting || 'all',
      onChange: (value) => setFilters(prev => ({ ...prev, jobSetting: value === 'all' ? '' : value })),
      resetLabel: safeT('student.dashboard.filterSections.allJobSettings'),
    },
    {
      name: safeT('student.dashboard.filterSections.company'),
      options: uniqueCompanies.map(company => ({ id: company, title: company })),
      selected: filters.company || 'all',
      onChange: (value) => setFilters(prev => ({ ...prev, company: value === 'all' ? '' : value })),
      resetLabel: safeT('student.dashboard.filterSections.allCompanies'),
    },
    {
      name: safeT('student.dashboard.filterSections.industry'),
      options: [
        { id: 'technology', title: safeT('student.dashboard.filterSections.technology') },
        { id: 'design', title: safeT('student.dashboard.filterSections.design') },
        { id: 'marketing', title: safeT('student.dashboard.filterSections.marketing') },
        { id: 'healthcare', title: safeT('student.dashboard.filterSections.healthcare') },
      ],
      selected: filters.industry || 'all',
      onChange: (value) => setFilters(prev => ({ ...prev, industry: value === 'all' ? '' : value })),
      resetLabel: 'All Industries',
    },
    {
      name: safeT('student.dashboard.filterSections.duration'),
      options: [
        { id: '3 months', title: safeT('student.dashboard.filterSections.3 months') },
        { id: '4 months', title: safeT('student.dashboard.filterSections.4 months') },
        { id: '6 months', title: safeT('student.dashboard.filterSections.6 months') },
        { id: '12 months', title: safeT('student.dashboard.filterSections.12 months') },
      ],
      selected: filters.duration || 'all',
      onChange: (value) => setFilters(prev => ({ ...prev, duration: value === 'all' ? '' : value })),
      resetLabel: safeT('student.dashboard.filterSections.allDurations'),
    },
    {
      name: safeT('student.dashboard.filterSections.paymentStatus'),
      options: [
        { id: 'paid', title: safeT('student.dashboard.filterSections.paid') },
        { id: 'unpaid', title: safeT('student.dashboard.filterSections.unpaid') }
      ],
      selected: filters.isPaid === true ? 'paid' : filters.isPaid === false ? 'unpaid' : 'all',
      onChange: (value) => setFilters(prev => ({
        ...prev,
        isPaid: value === 'paid' ? true : value === 'unpaid' ? false : null
      })),
      resetLabel: safeT('student.dashboard.filterSections.allPaymentTypes'),
    }
  ];

  // Define the info card JSX/Component here for clarity
  const BrowseInternshipsInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="bg-white p-6 rounded-2xl mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
        <div className="absolute right-20 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500 pointer-events-none"></div>
        <div className="absolute left-40 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500 pointer-events-none"></div>
        <div className="flex items-start flex-row gap-4 w-full md:w-full relative z-10 rtl:flex-row">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <div className="flex-1 text-left rtl:text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2 rtl:text-right">
              {safeT('company.browse.badge')}
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300 rtl:text-right">{safeT('company.browse.heading')}</div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3 rtl:text-right">{safeT('company.browse.description')}</p>
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center w-full">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2 rtl:ml-2 rtl:mr-0"></span>
                  {safeT('company.browse.whyUse')}
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2 rtl:ml-2 rtl:mr-0">✓</span>
                    <span>{safeT('company.browse.benefitsPlus.identifyPartners')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2 rtl:ml-2 rtl:mr-0">✓</span>
                    <span>{safeT('company.browse.benefitsPlus.discoverLeaders')}</span>
                  </li>
                </ul>
              </div>
              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm rtl:text-right">
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
          onSearchChange={setSearchTerm}
          searchPlaceholder={safeT('student.dashboard.browseInternshipsSearchPlaceholder')}
          onClearFilters={clearAllFilters}
          filterSections={filterSections}
          // showDatePicker={true}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {/* ALL / RECOMMENDED Tabs */}
        <div className="w-full mx-auto">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setActiveTab('all');
                setFilters(prev => ({ ...prev, contentType: 'all' }));
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex rtl:mr-2 items-center ${activeTab === 'all'
                ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#5DB2C7]'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-[#D9F0F4] hover:text-[#2a5f74] hover:border-[1px] hover:border-[#5DB2C7]'
                }`}
            >
              <span className={`w-3 h-3 rounded-full mr-2 ${activeTab === 'all' ? 'bg-[#5DB2C7]' : 'bg-gray-300'
                }`}></span>
              {safeT('student.dashboard.statusPills.all')}
            </button>
            <button
              onClick={() => {
                setActiveTab('recommended');
                setFilters(prev => ({ ...prev, contentType: 'recommended' }));
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center ${activeTab === 'recommended'
                ? 'bg-pink-100 text-pink-800 border-pink-800 border-2'
                : 'bg-white text-gray-600 border border-gray-300 hover:text-pink-800 hover:border-[1px] hover:border-pink-800 hover:bg-pink-100'
                }`}
            >
              <span className={`w-3 h-3 rounded-full mr-2 ${activeTab === 'recommended' ? 'bg-pink-800' : 'bg-gray-300'
                }`}></span>
              {safeT('student.dashboard.statusPills.recommended')}
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
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
}

function AppliedInternshipsView() {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const { currentUser } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    company: 'all',
    position: 'all',
    jobType: 'all',
  });
  const userMajor = currentUser?.major || 'Computer Science';

  const appliedInternships = getAppliedInternships();
  const uniqueCompanies = [...new Set(appliedInternships.map(internship => internship.company))];
  const uniquePositions = [...new Set(appliedInternships.map(internship => internship.title))];
  const uniqueJobTypes = [...new Set(appliedInternships.map(internship => internship.type))];

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    // Sync with activeTab when status filter changes
    if (filterName === 'status') {
      setActiveTab(value);
    }
  };

  const filterSections = [
    {
      name: safeT('student.dashboard.filterSections.status'),
      options: [
        { id: 'pending', title: safeT('student.dashboard.statusPills.pending') },
        { id: 'accepted', title: safeT('student.dashboard.statusPills.accepted') },
        { id: 'finalized', title: safeT('student.dashboard.statusPills.finalized') },
        { id: 'rejected', title: safeT('student.dashboard.statusPills.rejected') }
      ],
      selected: filters.status,
      onChange: (value) => handleFilterChange('status', value),
      resetLabel: safeT('student.dashboard.filterSections.allStatuses'),
    },
    {
      name: safeT('student.dashboard.filterSections.company'),
      options: uniqueCompanies.map(company => ({ id: company, title: company })),
      selected: filters.company,
      onChange: (value) => handleFilterChange('company', value),
      resetLabel: safeT('student.dashboard.filterSections.allCompanies'),
    },
    {
      name: safeT('student.dashboard.filterSections.position'),
      options: uniquePositions.map(pos => ({ id: pos, title: pos })),
      selected: filters.position,
      onChange: (value) => handleFilterChange('position', value),
      resetLabel: safeT('student.dashboard.filterSections.allPositions'),
    },
    {
      name: safeT('student.dashboard.filterSections.jobType'),
      options: [
        { id: 'fullTime', title: safeT('student.dashboard.filterSections.fullTime') },
        { id: 'partTime', title: safeT('student.dashboard.filterSections.partTime') },
        { id: 'contract', title: safeT('student.dashboard.filterSections.contract') },
      ],
      selected: filters.jobType,
      onChange: (value) => handleFilterChange('jobType', value),
      resetLabel: safeT('student.dashboard.filterSections.allJobTypes'),
    }
  ];

  const filteredAppliedInternships = appliedInternships.filter(internship => {
    const term = searchTerm.toLowerCase();
    return (
      (searchTerm === '' || internship.title.toLowerCase().includes(term) || internship.company.toLowerCase().includes(term)) &&
      (filters.status === 'all' || internship.status === filters.status) &&
      (filters.company === 'all' || internship.company === filters.company) &&
      (filters.position === 'all' || internship.title === filters.position) &&
      (filters.jobType === 'all' || internship.type === filters.jobType)
    );
  });

  // Mock statuses for AppliedInternshipsView
  const APPLIED_INTERNSHIP_STATUSES = {
    pending: {
      label: safeT('student.dashboard.statusPills.pending'),
      color: "bg-yellow-100 text-yellow-800 border border-yellow-400",
      badgeColor: "bg-yellow-600",
    },
    accepted: {
      label: safeT('student.dashboard.statusPills.accepted'),
      color: "bg-green-100 text-green-800 border border-green-400",
      badgeColor: "bg-green-600",
    },
    rejected: {
      label: safeT('student.dashboard.statusPills.rejected'),
      color: "bg-red-100 text-red-800 border border-red-400",
      badgeColor: "bg-red-600",
    },
    finalized: {
      label: safeT('student.dashboard.statusPills.finalized'),
      color: "bg-purple-100 text-purple-800 border border-purple-400",
      badgeColor: "bg-purple-600",
    }
  };

  // Define the Applied Internships Info Card
  const AppliedInternshipsInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute left-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute right-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        <div className="flex rtl:flex-row items-start gap-4 w-full relative z-10 max-w-5xl mx-auto">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-left rtl:text-right flex-grow">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              {safeT('student.dashboard.appliedInternshipsPersonalizedCard.badge')}
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">
              {safeT('student.dashboard.appliedInternshipsPersonalizedCard.title')}
            </div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">{safeT('student.dashboard.appliedInternshipsPersonalizedCard.description')}</p>

              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <div className="flex justify-center space-x-4 mb-2 mx-auto">
                  <div className="flex-1 p-2 bg-yellow-50 rounded-lg border border-yellow-100 text-center rtl:mr-4">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                    <p className="text-xs font-medium text-yellow-800">{safeT('student.dashboard.appliedInternshipsPersonalizedCard.howItWorks.pending')}</p>
                  </div>
                  <div className="flex-1 p-2 bg-green-50 rounded-lg border border-green-100 text-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                    <p className="text-xs font-medium text-green-800">{safeT('student.dashboard.appliedInternshipsPersonalizedCard.howItWorks.accepted')}</p>
                  </div>
                  <div className="flex-1 p-2 bg-purple-50 rounded-lg border border-purple-100 text-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-1"></div>
                    <p className="text-xs font-medium text-purple-800">{safeT('student.dashboard.appliedInternshipsPersonalizedCard.howItWorks.finalized')}</p>
                  </div>
                  <div className="flex-1 p-2 bg-red-50 rounded-lg border border-red-100 text-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
                    <p className="text-xs font-medium text-red-800">{safeT('student.dashboard.appliedInternshipsPersonalizedCard.howItWorks.rejected')}</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <span>{safeT('student.dashboard.appliedInternshipsPersonalizedCard.howItWorks.pendingDescription')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>{safeT('student.dashboard.appliedInternshipsPersonalizedCard.howItWorks.acceptedDescription')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>{safeT('student.dashboard.appliedInternshipsPersonalizedCard.howItWorks.finalizedDescription')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>{safeT('student.dashboard.appliedInternshipsPersonalizedCard.howItWorks.rejectedDescription')}</span>
                  </li>
                </ul>
              </div>

              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                {safeT('student.dashboard.appliedInternshipsPersonalizedCard.footer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full px-6 py-4">
      <div className="px-4 pt-6">
        <AppliedInternshipsInfoCard />

        <ApplicationsFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={safeT('student.dashboard.appliedInternshipsSearchPlaceholder')}
          filterSections={filterSections}
          // showDatePicker={true}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          marginBottom='mt-4'
          onClearFilters={() => {
            setFilters({ status: 'all', company: 'all', position: 'all', jobType: 'all' });
            setActiveTab('all');
          }}
        />
      </div>
      <InternshipList
        title=""
        internships={filteredAppliedInternships}
        type="applied"
        statuses={['pending', 'accepted', 'finalized', 'rejected']}
        showSidebar={true}
        userMajor={userMajor}
        customFilterPanel={<></>}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={(value) => {
          setActiveTab(value);
          setFilters(prev => ({ ...prev, status: value }));
        }}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
}

function MyInternshipsView({ onTriggerReportCreate }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const { currentUser } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    company: 'all',
    position: 'all'
  });
  const userMajor = currentUser?.major || 'Computer Science';

  const myInternships = getMyInternships();
  const uniqueCompanies = [...new Set(myInternships.map(internship => internship.company))];
  const uniquePositions = [...new Set(myInternships.map(internship => internship.title))];

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    // Sync with activeTab when status filter changes
    if (filterName === 'status') {
      setActiveTab(value);
    }
  };

  const filterSections = [
    {
      name: safeT('student.dashboard.filterSections.status'),
      options: [
        { id: 'current', title: safeT('student.dashboard.statusPills.current') },
        { id: 'completed', title: safeT('student.dashboard.statusPills.completed') },
        { id: 'evaluated', title: safeT('student.dashboard.statusPills.evaluated') }
      ],
      selected: filters.status,
      onChange: (value) => handleFilterChange('status', value),
      resetLabel: safeT('student.dashboard.filterSections.allStatuses'),
    },
    {
      name: safeT('student.dashboard.filterSections.company'),
      options: uniqueCompanies.map(company => ({ id: company, title: company })),
      selected: filters.company,
      onChange: (value) => handleFilterChange('company', value),
      resetLabel: safeT('student.dashboard.filterSections.allCompanies'),
    },
    {
      name: safeT('student.dashboard.filterSections.position'),
      options: uniquePositions.map(pos => ({ id: pos, title: pos })),
      selected: filters.position,
      onChange: (value) => handleFilterChange('position', value),
      resetLabel: safeT('student.dashboard.filterSections.allPositions'),
    },
  ];

  const filteredMyInternships = myInternships.filter(internship => {
    const term = searchTerm.toLowerCase();
    return (
      (searchTerm === '' || internship.title.toLowerCase().includes(term) || internship.company.toLowerCase().includes(term)) &&
      (filters.status === 'all' || internship.status === filters.status) &&
      (filters.company === 'all' || internship.company === filters.company) &&
      (filters.position === 'all' || internship.title === filters.position)
    );
  });

  // Mock statuses for MyInternshipsView
  const MY_INTERNSHIP_STATUSES = {
    current: {
      label: safeT('student.dashboard.statusPills.current'),
      color: "bg-blue-100 text-blue-800 border border-blue-400",
      badgeColor: "bg-blue-600",
    },
    completed: {
      label: safeT('student.dashboard.statusPills.completed'),
      color: "bg-green-100 text-green-800 border border-green-400",
      badgeColor: "bg-green-600",
    },
    evaluated: {
      label: safeT('student.dashboard.statusPills.evaluated'),
      color: "bg-purple-100 text-purple-800 border border-purple-400",
      badgeColor: "bg-purple-600",
    }
  };

  const MyInternshipsInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-45 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute right-40 top-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute left-20 top-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        <div className="flex rtl:flex-row items-start gap-4 w-full relative z-10 max-w-5xl mx-auto">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-left rtl:text-right flex-grow">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              {safeT('student.dashboard.myInternshipsPersonalizedCard.badge')}
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">
              {safeT('student.dashboard.myInternshipsPersonalizedCard.title')}
            </div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">{safeT('student.dashboard.myInternshipsPersonalizedCard.description')}</p>

              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <div className="flex space-x-4 mb-2">
                  <div className="flex-1 p-2 bg-blue-50 rounded-lg border border-blue-100 text-center rtl:mr-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                    <p className="text-xs font-medium text-blue-800">{safeT('student.dashboard.myInternshipsPersonalizedCard.howItWorks.current')}</p>
                  </div>
                  <div className="flex-1 p-2 bg-green-50 rounded-lg border border-green-100 text-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                    <p className="text-xs font-medium text-green-800">{safeT('student.dashboard.myInternshipsPersonalizedCard.howItWorks.completed')}</p>
                  </div>
                  <div className="flex-1 p-2 bg-purple-50 rounded-lg border border-purple-100 text-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-1"></div>
                    <p className="text-xs font-medium text-purple-800">{safeT('student.dashboard.myInternshipsPersonalizedCard.howItWorks.evaluated')}</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>{safeT('student.dashboard.myInternshipsPersonalizedCard.howItWorks.currentDescription')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>{safeT('student.dashboard.myInternshipsPersonalizedCard.howItWorks.completedDescription')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>{safeT('student.dashboard.myInternshipsPersonalizedCard.howItWorks.evaluatedDescription')}</span>
                  </li>
                </ul>
              </div>

              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                {safeT('student.dashboard.myInternshipsPersonalizedCard.footer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full px-6 py-4">
      <div className="px-4 pt-6">
        <MyInternshipsInfoCard />

        <ApplicationsFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={safeT('student.dashboard.myInternshipsSearchPlaceholder')}
          filterSections={filterSections}
          // showDatePicker={true}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          marginBottom='mb-2'
          onClearFilters={() => {
            setFilters({ status: 'all', company: 'all', position: 'all' });
            setActiveTab('all');
          }}
        />

        {/* Status Tabs with Colored Dots */}
        <div className="w-full max-w-6xl mx-auto !mt-10 !mb-0">
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={() => {
                setActiveTab('all');
                setFilters(prev => ({ ...prev, status: 'all' }));
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium h-[38px] transition-all flex items-center ${activeTab === 'all'
                ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#5DB2C7]'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-[#D9F0F4] hover:text-[#2a5f74] hover:border-[#5DB2C7]'
                }`}
            >
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${activeTab === 'all' ? 'bg-[#5DB2C7]' : 'bg-gray-300'
                }`}></span>
              {safeT('student.dashboard.statusPills.all')}
            </button>
            <button
              onClick={() => {
                setActiveTab('current');
                setFilters(prev => ({ ...prev, status: 'current' }));
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium h-[38px] transition-all flex items-center ${activeTab === 'current'
                ? 'bg-blue-100 text-blue-800 border-2 border-blue-400'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-blue-100 hover:text-blue-800 hover:border-blue-400'
                }`}
            >
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${activeTab === 'current' ? 'bg-blue-600' : 'bg-gray-300'
                }`}></span>
              {safeT('student.dashboard.statusPills.current')}
            </button>
            <button
              onClick={() => {
                setActiveTab('completed');
                setFilters(prev => ({ ...prev, status: 'completed' }));
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium h-[38px] transition-all flex items-center ${activeTab === 'completed'
                ? 'bg-green-100 text-green-800 border-2 border-green-400'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-green-100 hover:text-green-800 hover:border-green-400'
                }`}
            >
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${activeTab === 'completed' ? 'bg-green-600' : 'bg-gray-300'
                }`}></span>
              {safeT('student.dashboard.statusPills.completed')}
            </button>
            <button
              onClick={() => {
                setActiveTab('evaluated');
                setFilters(prev => ({ ...prev, status: 'evaluated' }));
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium h-[38px] transition-all flex items-center ${activeTab === 'evaluated'
                ? 'bg-purple-100 text-purple-800 border-2 border-purple-400'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-purple-100 hover:text-purple-800 hover:border-purple-400'
                }`}
            >
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${activeTab === 'evaluated' ? 'bg-purple-600' : 'bg-gray-300'
                }`}></span>
              {safeT('student.dashboard.statusPills.evaluated')}
            </button>
          </div>
        </div>
      </div>
      <InternshipList
        title=""
        internships={filteredMyInternships}
        type="mine"
        onTriggerReportCreate={onTriggerReportCreate}
        showSidebar={true}
        userMajor={userMajor}
        statuses={['current', 'completed', 'evaluated']}
        customFilterPanel={<></>}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={(value) => {
          setActiveTab(value);
          setFilters(prev => ({ ...prev, status: value }));
        }}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        padding="pt-3"
      />
    </div>
  );
}

function NotificationsView() {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const [filters, setFilters] = useState({ category: 'all', read: 'all' });

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const filterSections = [
    {
      name: 'Category',
      options: [
        { id: 'Application', title: 'Application' },
        { id: 'Report', title: 'Report' },
        { id: 'Workshop', title: 'Workshop' },
        { id: 'Deadline', title: 'Deadline' },
        { id: 'Opportunity', title: 'Opportunity' }
      ],
      selected: filters.category,
      onChange: (value) => handleFilterChange('category', value),
      resetLabel: 'All Categories'
    },
    {
      name: 'Status',
      options: [
        { id: 'read', title: 'Read' },
        { id: 'unread', title: 'Unread' }
      ],
      selected: filters.read,
      onChange: (value) => handleFilterChange('read', value),
      resetLabel: 'All'
    }
  ];

  // Define the Notifications Info Card similar to other pages
  const NotificationsInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute left-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute right-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        <div className="flex items-start gap-4 w-full md:w-auto relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div className="text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              {safeT('student.dashboard.notificationsPersonalizedInfoCard.badge')}
            </div>
            <h2 className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">
              {safeT('student.dashboard.notificationsPersonalizedInfoCard.title')}
            </h2>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">{safeT('student.dashboard.notificationsPersonalizedInfoCard.description')}</p>

              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <h3 className="font-medium text-[#2a5f74] mb-2">{safeT('student.dashboard.notificationsPersonalizedInfoCard.notificationHub.title')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border border-blue-200 bg-blue-50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">1</span>
                      </div>
                      <span className="font-medium text-blue-700">{safeT('student.dashboard.notificationsPersonalizedInfoCard.notificationHub.type1')}</span>
                    </div>
                    <p className="text-sm text-gray-600">{safeT('student.dashboard.notificationsPersonalizedInfoCard.notificationHub.type1Description')}</p>
                  </div>

                  <div className="p-3 rounded-lg border border-green-200 bg-green-50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">2</span>
                      </div>
                      <span className="font-medium text-green-700">{safeT('student.dashboard.notificationsPersonalizedInfoCard.notificationHub.type2')}</span>
                    </div>
                    <p className="text-sm text-gray-600">{safeT('student.dashboard.notificationsPersonalizedInfoCard.notificationHub.type2Description')}</p>
                  </div>

                  <div className="p-3 rounded-lg border border-purple-200 bg-purple-50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex-shrink-0 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">3</span>
                      </div>
                      <span className="font-medium text-purple-700">{safeT('student.dashboard.notificationsPersonalizedInfoCard.notificationHub.type3')}</span>
                    </div>
                    <p className="text-sm text-gray-600">{safeT('student.dashboard.notificationsPersonalizedInfoCard.notificationHub.type3Description')}</p>
                  </div>

                  <div className="p-3 rounded-lg border border-orange-200 bg-orange-50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex-shrink-0 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">4</span>
                      </div>
                      <span className="font-medium text-orange-700">{safeT('student.dashboard.notificationsPersonalizedInfoCard.notificationHub.type4')}</span>
                    </div>
                    <p className="text-sm text-gray-600">{safeT('student.dashboard.notificationsPersonalizedInfoCard.notificationHub.type4Description')}</p>
                  </div>

                  <div className="p-3 rounded-lg border border-indigo-200 bg-indigo-50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex-shrink-0 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">5</span>
                      </div>
                      <span className="font-medium text-indigo-700">{safeT('student.dashboard.notificationsPersonalizedInfoCard.notificationHub.type5')}</span>
                    </div>
                    <p className="text-sm text-gray-600">{safeT('student.dashboard.notificationsPersonalizedInfoCard.notificationHub.type5Description')}</p>
                  </div>

                  <div className="p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex-shrink-0 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">6</span>
                      </div>
                      <span className="font-medium text-yellow-700">{safeT('student.dashboard.notificationsPersonalizedInfoCard.notificationHub.type6')}</span>
                    </div>
                    <p className="text-sm text-gray-600">{safeT('student.dashboard.notificationsPersonalizedInfoCard.notificationHub.type6Description')}</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">{safeT('student.dashboard.notificationsPersonalizedInfoCard.footerLabel')}</span> {safeT('student.dashboard.notificationsPersonalizedInfoCard.footer')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full px-6 py-4">
      <div className="px-4 pt-6">
        <NotificationsInfoCard />
        {/* <ApplicationsFilterBar
          filterSections={filterSections}
          onClearFilters={() => setFilters({ category: 'all', read: 'all' })}
        /> */}
      </div>
      <NotificationsList filters={filters} hideFilters={true} />
    </div>
  );
}

function ProfileView() {
  // Define the Profile Info Card in the same way as other pages
  const ProfileInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute left-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute right-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        <div className="flex items-start gap-4 w-full md:w-auto relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              PORTFOLIO
            </div>
            <h2 className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">Student Profile Management</h2>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">Your professional profile is your digital portfolio and the foundation of your career development journey.</p>

              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <h3 className="font-medium text-[#2a5f74] mb-2">Why Your Profile Matters:</h3>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Powers the personalized recommendation engine for internships and workshops</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Visible to potential employers when you apply for positions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Helps faculty provide more targeted guidance and support</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Creates a foundation for your professional brand development</span>
                  </li>
                </ul>
              </div>

              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                Remember: Update your profile regularly to reflect new skills, experiences, and career goals as you grow professionally.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full px-6 py-4">
      <div className="px-4 pt-6">
        <ProfileInfoCard />
      </div>
      <StudentProfile />
    </div>
  );
}

function WorkshopsView({ sidebarExpanded }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const [selectedLiveWorkshop, setSelectedLiveWorkshop] = useState(null);

  const handleWorkshopSelection = (workshop) => {
    if (workshop && workshop.type === 'live') {
      setSelectedLiveWorkshop(workshop);
    }
  };

  // Define the Workshops Info Card
  const WorkshopsInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -left-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform -rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute right-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute left-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        <div className="flex items-start gap-4 w-full relative z-10 max-w-5xl mx-auto">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
          <div className="text-left flex-grow">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              {safeT('student.dashboard.workshopsInfoPersonalizedCard.badge')}
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">
              {safeT('student.dashboard.workshopsInfoPersonalizedCard.title')}
            </div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">{safeT('student.dashboard.workshopsInfoPersonalizedCard.description')}</p>

              {/* Workshop Types */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  {safeT('student.dashboard.workshopsInfoPersonalizedCard.availableWorkshops.title')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="font-medium text-blue-700 mb-1 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {safeT('student.dashboard.workshopsInfoPersonalizedCard.availableWorkshops.type1')}
                    </div>
                    <p className="text-sm text-gray-600">{safeT('student.dashboard.workshopsInfoPersonalizedCard.availableWorkshops.type1Description')}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="font-medium text-green-700 mb-1 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {safeT('student.dashboard.workshopsInfoPersonalizedCard.availableWorkshops.type2')}
                    </div>
                    <p className="text-sm text-gray-600">{safeT('student.dashboard.workshopsInfoPersonalizedCard.availableWorkshops.type2Description')}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="font-medium text-purple-700 mb-1 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      {safeT('student.dashboard.workshopsInfoPersonalizedCard.availableWorkshops.type3')}
                    </div>
                    <p className="text-sm text-gray-600">{safeT('student.dashboard.workshopsInfoPersonalizedCard.availableWorkshops.type3Description')}</p>
                  </div>
                </div>

                {/* Workshop Benefits */}
                <p className="text-metallica-blue-700 font-medium mt-4 mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  {safeT('student.dashboard.workshopsInfoPersonalizedCard.workshopBenefits.title')}
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>{safeT('student.dashboard.workshopsInfoPersonalizedCard.workshopBenefits.benefit1')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>{safeT('student.dashboard.workshopsInfoPersonalizedCard.workshopBenefits.benefit2')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>{safeT('student.dashboard.workshopsInfoPersonalizedCard.workshopBenefits.benefit3')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>{safeT('student.dashboard.workshopsInfoPersonalizedCard.workshopBenefits.benefit4')}</span>
                  </li>
                </ul>
              </div>

              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                {safeT('student.dashboard.workshopsInfoPersonalizedCard.footer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full px-6 py-4">
      {selectedLiveWorkshop ? (
        <>
          <div className="mb-4">
            <button
              onClick={() => setSelectedLiveWorkshop(null)}
              className="flex items-center text-[#2a5f74] hover:text-[#3298BA] transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {safeT('student.dashboard.workshops.backToWorkshops')}
            </button>
          </div>
          <WorkshopInterface workshop={selectedLiveWorkshop} onBack={() => setSelectedLiveWorkshop(null)} />
        </>
      ) : (
        <>
          <div className="px-4 pt-6">
            <WorkshopsInfoCard />
          </div>
          <WorkshopList onSelectLive={handleWorkshopSelection} sidebarExpanded={sidebarExpanded} />
        </>
      )}
    </div>
  );
}

function OnlineAssessmentsView() {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  // Define the Online Assessments Info Card
  const OnlineAssessmentsInfoCard = ({ t }) => (
    <div className="w-full mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-45 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute left-40 top-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute right-20 top-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        <div className="flex items-start gap-4 w-full relative z-10 max-w-5xl mx-auto">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div className="text-left flex-grow">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              {safeT('student.dashboard.onlineAssessmentsInfoCard.badge')}
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">
              {safeT('student.dashboard.onlineAssessmentsInfoCard.title')}
            </div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">{safeT('student.dashboard.onlineAssessmentsInfoCard.description')}</p>

              {/* Assessment Benefits */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  {safeT('student.dashboard.onlineAssessmentsInfoCard.assessmentBenefits.title')}
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>{safeT('student.dashboard.onlineAssessmentsInfoCard.assessmentBenefits.benefit1')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>{safeT('student.dashboard.onlineAssessmentsInfoCard.assessmentBenefits.benefit2')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>{safeT('student.dashboard.onlineAssessmentsInfoCard.assessmentBenefits.benefit3')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>{safeT('student.dashboard.onlineAssessmentsInfoCard.assessmentBenefits.benefit4')}</span>
                  </li>
                </ul>

                {/* Assessment Types */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="font-medium text-blue-700 mb-1 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {safeT('student.dashboard.onlineAssessmentsInfoCard.assessmentTypes.personalityAssessment.title')}
                    </div>
                    <p className="text-sm text-gray-600">{safeT('student.dashboard.onlineAssessmentsInfoCard.assessmentTypes.personalityAssessment.description')}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="font-medium text-green-700 mb-1 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {safeT('student.dashboard.onlineAssessmentsInfoCard.assessmentTypes.skillsProficiency.title')}
                    </div>
                    <p className="text-sm text-gray-600">{safeT('student.dashboard.onlineAssessmentsInfoCard.assessmentTypes.skillsProficiency.description')}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="font-medium text-purple-700 mb-1 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      {safeT('student.dashboard.onlineAssessmentsInfoCard.assessmentTypes.careerInterestInventory.title')}
                    </div>
                    <p className="text-sm text-gray-600">{safeT('student.dashboard.onlineAssessmentsInfoCard.assessmentTypes.careerInterestInventory.description')}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="font-medium text-yellow-700 mb-1 flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      {safeT('student.dashboard.onlineAssessmentsInfoCard.assessmentTypes.aptitudeIndicators.title')}
                    </div>
                    <p className="text-sm text-gray-600">{safeT('student.dashboard.onlineAssessmentsInfoCard.assessmentTypes.aptitudeIndicators.description')}</p>
                  </div>
                </div>
              </div>

              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                {safeT('student.dashboard.onlineAssessmentsInfoCard.footer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full px-6 py-4">
      <div className="px-4 pt-6">
        <OnlineAssessmentsInfoCard />
      </div>
      <AssessmentList />
    </div>
  );
}

function MyReportsView() {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const [reports, setReports] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleAddReport = (newReport) => {
    setReports((prev) => [...prev, newReport]);
  };

  const handleUpdateReport = (updatedReport) => {
    setReports((prev) =>
      prev.map((Report, i) => (i === editIndex ? updatedReport : Report))
    );
    setEditIndex(null);
  };

  const handleDeleteReport = () => {
    setReports((prev) => prev.filter((_, i) => i !== deleteIndex));
    setDeleteIndex(null);
  };

  // Define the Report Info Card in the same way as other pages
  const ReportInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute left-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute right-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        <div className="flex items-start gap-4 w-full md:w-auto relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              {safeT('student.dashboard.myReportsPersonalizedCard.badge')}
            </div>
            <h2 className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">
              {safeT('student.dashboard.myReportsPersonalizedCard.title')}
            </h2>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">{safeT('student.dashboard.myReportsPersonalizedCard.description')}</p>

              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-semibold">{safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.pending')}</span>
                      <h3 className="font-medium text-yellow-700">{safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.pending')}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.pendingDescription')}</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-semibold">{safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.flagged')}</span>
                      <h3 className="font-medium text-orange-700">{safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.flagged')}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.flaggedDescription')}</p>
                  </div>

                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold">{safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.rejected')}</span>
                      <h3 className="font-medium text-red-700">{safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.rejected')}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.rejectedDescription')}</p>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">{safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.accepted')}</span>
                      <h3 className="font-medium text-green-700">{safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.accepted')}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.acceptedDescription')}</p>
                  </div>
                </div>
              </div>

              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                {safeT('student.dashboard.myReportsPersonalizedCard.footer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isCreating) {
    return <ReportCreationDashboard
      onAddTile={(newReport) => {
        handleAddReport(newReport);
        setIsCreating(false);
      }}
      onCancel={() => setIsCreating(false)}
      initialReport={{}}
      isEditMode={false}
    />;
  }

  return (
    <>
      <StudentReportCards />
      {editIndex !== null && (
        <ReportCreationDashboard
          initialReport={reports[editIndex]}
          onAddTile={handleUpdateReport}
          onCancel={() => setEditIndex(null)}
          isEditMode={true}
        />
      )}
      {deleteIndex !== null && (
        <DeleteTileConfirmation
          type="report"
          onConfirm={handleDeleteReport}
          onCancel={() => setDeleteIndex(null)}
        />
      )}
    </>
  );
}

function MyEvaluationsView() {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState('all');

  const filterSections = [
    {
      name: 'Rating',
      options: [
        { id: '5', title: '5 Stars' },
        { id: '4', title: '4 Stars' },
        { id: '3', title: '3 Stars' },
        { id: '2', title: '2 Stars' },
        { id: '1', title: '1 Star' }
      ],
      selected: selectedRating,
      onChange: setSelectedRating,
      resetLabel: 'All Ratings',
    }
  ];

  // Define the Evaluations Info Card in the same way as other pages
  const EvaluationsInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute left-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute right-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        <div className="flex items-start gap-4 w-full md:w-auto relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div className="text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              {safeT('student.dashboard.evaluationsPersonalizedCard.badge')}
            </div>
            <h2 className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">
              {safeT('student.dashboard.evaluationsPersonalizedCard.title')}
            </h2>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">{safeT('student.dashboard.evaluationsPersonalizedCard.description')}</p>

              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">{safeT('student.dashboard.evaluationsPersonalizedCard.howItWorks.submitted')}</span>
                      <h3 className="font-medium text-blue-700">{safeT('student.dashboard.evaluationsPersonalizedCard.howItWorks.submitted')}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{safeT('student.dashboard.evaluationsPersonalizedCard.howItWorks.submitted')}</p>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-semibold">{safeT('student.dashboard.evaluationsPersonalizedCard.howItWorks.draft')}</span>
                      <h3 className="font-medium text-purple-700">{safeT('student.dashboard.evaluationsPersonalizedCard.howItWorks.draft')}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{safeT('student.dashboard.evaluationsPersonalizedCard.howItWorks.draftDescription')}</p>
                  </div>
                </div>
              </div>

              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                {safeT('student.dashboard.evaluationsPersonalizedCard.footer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4fafd] py-10 px-4">
      <div className="px-4 pt-6">
        <EvaluationsInfoCard />

        {/* <ApplicationsFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search evaluations by student or company name..."

          filterSections={filterSections}
        /> */}
      </div>
      <EvaluationsDashboard
        evaluations={MOCK_EVALUATIONS}
        stakeholder={"student"}
        searchTerm={searchTerm}
        selectedRating={selectedRating}
      />
    </div>
  );
}

function LiveWorkshopsView() {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  const sampleWorkshops = [
    {
      id: 1,
      title: "Introduction to Web Design",
      imageUrl: "/images/Workshop1.jpeg",
      instructor: "Natalie Storm",
      instructorImage: "/images/icons8-avatar-50 (1).png",
      instructorBio: "Freelance designer, motion and graphic design enthusiast",
      date: new Date(),
      time: "10:00 AM - 12:00 PM",
      location: "Online",
      seatsAvailable: 15,
      description: "Learn the basics of web design and user experience.",
      prerequisites: "Basic computer skills",
    },
    {
      id: 2,
      title: "Advanced React Techniques",
      imageUrl: "/images/Workshop2.jpeg",
      instructor: "Alex Johnson",
      instructorImage: "/images/icons8-avatar-50.png",
      instructorBio: "Senior developer with 10+ years of experience",
      date: new Date(),
      time: "2:00 PM - 4:00 PM",
      location: "Online",
      seatsAvailable: 20,
      description: "Deep dive into React hooks and performance optimization.",
      prerequisites: "Intermediate React knowledge",
    },
  ];

  if (typeof window === "undefined") {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      {/* Workshop List - Shown when no workshop is selected */}
      {!selectedWorkshop && (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 16px" }}>
          {/* <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "30px", fontWeight: "bold", textAlign: "left", color: "#2a5f74", position: "relative" }}>
              UPCOMING WORKSHOPS
              <span style={{ position: "absolute", bottom: "0", left: "0", width: "96px", height: "4px", backgroundColor: "#2a5f74" }}></span>
            </h1>
          </div> */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {sampleWorkshops.map((workshop) => (
              <div
                key={workshop.id}
                onClick={() => setSelectedWorkshop(workshop)}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #86CBDA",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "all 0.3s",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "relative", height: "160px" }}>
                  <img
                    src={workshop.imageUrl}
                    alt={workshop.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px"
                    }}
                  />
                </div>
                <div style={{ padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                    <img
                      src={workshop.instructorImage}
                      alt={workshop.instructor}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "8px",
                        border: "2px solid #318FA8"
                      }}
                    />
                    <span style={{ fontSize: "14px", color: "#2A5F74", fontWeight: "500" }}>
                      {workshop.instructor}
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#2A5F74",
                    marginBottom: "8px"
                  }}>
                    {workshop.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workshop Interface - Shown when a workshop is selected */}
      {selectedWorkshop && (
        <WorkshopInterface workshop={selectedWorkshop} onBack={() => setSelectedWorkshop(null)} />
      )}
    </div>
  );
}

// Map view keys to their respective components and translation keys
const viewComponents = {
  'home': { component: DashboardHomeView, titleKey: 'home' },
  'browse': { component: BrowseInternshipsView, titleKey: 'browse' },
  'applied': { component: AppliedInternshipsView, titleKey: 'applied' },
  'my-internships': { component: MyInternshipsView, titleKey: 'my-internships' },
  'my-reports': { component: MyReportsView, titleKey: 'my-reports' },
  'my-evaluations': { component: MyEvaluationsView, titleKey: 'my-evaluations' },
  'workshops': { component: WorkshopsView, titleKey: 'workshops' },
  'live-workshops': { component: LiveWorkshopsView, titleKey: 'live-workshops' },
  'online-assessments': { component: OnlineAssessmentsView, titleKey: 'online-assessments' },
  'notifications': { component: NotificationsView, titleKey: 'notifications' },
  'profile': { component: ProfileView, titleKey: 'profile' }
};

export default function StudentDashboardPage() {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const [appliedIdsSet, setAppliedIdsSet] = useState(new Set());
  const [isCreatingReport, setIsCreatingReport] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);

  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash && viewComponents[hash]) {
        return hash;
      }
    }
    return 'home';
  });

  const handleApplicationCompleted = (internshipId) => {
    setAppliedIdsSet(prevSet => new Set(prevSet).add(internshipId));
  };

  // Report creation handlers (moved up from MyInternshipsView)
  const handleReportCreation = (internship) => {
    setSelectedInternship(internship);
    setIsCreatingReport(true);
  };

  const handleReportCancel = () => {
    setIsCreatingReport(false);
    setSelectedInternship(null);
  };

  const handleReportSubmit = (reportData) => {
    console.log('Report submitted:', reportData);
    setIsCreatingReport(false);
    setSelectedInternship(null);
  };

  const handleViewChange = (viewId) => {
    if (!isCreatingReport) {
      setCurrentView(viewId);
    }
  };

  // Special case: If we're on the My Internships view and creating a report,
  // render the ReportCreationDashboard component directly instead of the CurrentViewComponent
  if (currentView === 'my-internships' && isCreatingReport) {
    return (
      <DashboardLayout
        userType="student"
        title={safeT('student.dashboard.titles.my-internships')}
        currentViewId={currentView}
        onViewChange={handleViewChange}
      >
        <ReportCreationDashboard
          onAddTile={handleReportSubmit}
          onCancel={handleReportCancel}
          initialReport={selectedInternship}
          hideTitle={false}
          showSaveDraftButton={true}
          isEditMode={false}
        />
      </DashboardLayout>
    );
  }

  // Normal case: render the current view based on navigation
  const viewConfig = viewComponents[currentView];
  const CurrentViewComponent = viewConfig?.component;
  const titleKey = viewConfig?.titleKey;

  let viewProps = {};
  if (currentView === 'home' || currentView === 'browse') {
    viewProps = {
      onApplicationCompleted: handleApplicationCompleted,
      appliedInternshipIds: appliedIdsSet,
    };
  }

  // For My Internships view, pass the report trigger function
  if (currentView === 'my-internships') {
    viewProps.onTriggerReportCreate = handleReportCreation;
  }

  return (
    <DashboardLayout
      userType="student"
      // title={safeT(`student.dashboard.titles.${titleKey}`)}
      currentViewId={currentView}
      onViewChange={handleViewChange}
    >
      {({ sidebarExpanded }) => (
        <>
          {CurrentViewComponent &&
            (currentView === 'workshops' ?
              <WorkshopsView sidebarExpanded={sidebarExpanded} /> :
              <CurrentViewComponent {...viewProps} />
            )
          }
        </>
      )}
    </DashboardLayout>
  );
}