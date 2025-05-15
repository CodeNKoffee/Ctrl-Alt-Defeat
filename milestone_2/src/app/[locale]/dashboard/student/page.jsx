// View a list of suggested companies based on my job interests, industry and recommendations from past interns

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import InternshipList from '@/components/shared/InternshipList';
import StudentProfile from '@/components/StudentProfile';
import InternshipFilterModal from '@/components/InternshipFilterModal';
import NotificationsList from '@/components/NotificationsList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faXmark, faPlay } from '@fortawesome/free-solid-svg-icons';
import { getRecommendedInternshipsForStudent } from '../../../../../constants/internshipData';
import { getRegularInternships, getRecommendedInternships, getAppliedInternships, getMyInternships } from '../../../../../constants/internshipData';

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
  const [personalizedInternships, setPersonalizedInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const { currentUser, isAuthenticated } = useSelector(state => state.auth);
  const userMajor = currentUser?.major || 'Computer Science';

  useEffect(() => {
    const userData = currentUser || JSON.parse(sessionStorage.getItem('userSession') || localStorage.getItem('userSession') || '{}');
    if (userData) {
      // Add mock job interests and industries if not present in userData
      // In a real app, these would come from the user profile database
      const enhancedUserData = {
        ...userData,
        jobInterests: userData.jobInterests || ['Developer', 'Engineer', 'Data', 'UX'],
        industries: userData.industries || ['Technology', 'Media Engineering']
      };

      const recommendations = getRecommendedInternshipsForStudent(enhancedUserData);

      // Add mock ratings from past interns (in a real app, this would come from the backend)
      const recommendationsWithRatings = recommendations.map(internship => ({
        ...internship,
        pastInternRating: Math.floor(Math.random() * 3) + 3, // Randomly assign 3-5 star ratings
        recommendedReason: internship.industry === enhancedUserData.industries?.[0]
          ? 'industry match'
          : (enhancedUserData.jobInterests?.some(interest =>
            internship.title.toLowerCase().includes(interest.toLowerCase())
          ) ? 'job interest match' : 'recommended by past interns')
      }));

      setPersonalizedInternships(recommendationsWithRatings);
    }
  }, [currentUser]);

  return (
    <div className="w-full px-6 py-4">
      <InternshipList
        title=""
        internships={personalizedInternships}
        type={"recommended"}
        onApplicationCompleted={onApplicationCompleted}
        appliedInternshipIds={appliedInternshipIds}
        showSidebar={true}
        userMajor={userMajor}
        isRecommended={true}
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
  const [filterType, setFilterType] = useState('all');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    industry: '',
    duration: '',
    isPaid: null
  });
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const { currentUser } = useSelector(state => state.auth);
  const userMajor = currentUser?.major || 'Computer Science';

  // Get internships based on "all" or "recommended" filter type
  const baseInternships = filterType === 'all'
    ? getRegularInternships()
    : getRecommendedInternships();

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
  const hasActiveFilters = filters.industry || filters.duration || filters.isPaid !== null;

  // Handle applying filters from modal
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  // Clear individual filters
  const clearIndustryFilter = () => {
    setFilters({
      ...filters,
      industry: ''
    });
  };

  const clearDurationFilter = () => {
    setFilters({
      ...filters,
      duration: ''
    });
  };

  const clearPaidFilter = () => {
    setFilters({
      ...filters,
      isPaid: null
    });
  };

  const clearAllFilters = () => {
    setFilters({
      industry: '',
      duration: '',
      isPaid: null
    });
  };

  return (
    <div className="w-full px-6 py-4">
      <InternshipList
        title=""
        internships={hasActiveFilters ? filteredInternships : baseInternships}
        type="browsing"
        onApplicationCompleted={onApplicationCompleted}
        appliedInternshipIds={appliedInternshipIds}
        showSidebar={true}
        userMajor={userMajor}
        customFilterPanel={
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${filterType === 'all'
                    ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#3298BA]'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('recommended')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${filterType === 'recommended'
                    ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#3298BA]'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  Recommended
                </button>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border flex items-center gap-1 ml-2 
                  ${hasActiveFilters
                    ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#3298BA]'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <FontAwesomeIcon icon={faFilter} className="mr-1" />
                {hasActiveFilters ? 'Filters Applied' : 'Filter'}
                {hasActiveFilters && (
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-[#3298BA] text-white rounded-full text-xs ml-1">
                    {Object.values(filters).filter(f => f !== '' && f !== null).length}
                  </span>
                )}
              </button>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500">Active filters:</span>

                {filters.industry && (
                  <div className="bg-[#D9F0F4] text-[#2a5f74] px-3 py-1 rounded-full text-sm flex items-center">
                    Industry: {filters.industry}
                    <button
                      className="ml-2 text-[#2a5f74] hover:text-[#1a3f54]"
                      onClick={clearIndustryFilter}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                )}

                {filters.duration && (
                  <div className="bg-[#D9F0F4] text-[#2a5f74] px-3 py-1 rounded-full text-sm flex items-center">
                    Duration: {filters.duration}
                    <button
                      className="ml-2 text-[#2a5f74] hover:text-[#1a3f54]"
                      onClick={clearDurationFilter}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                )}

                {filters.isPaid !== null && (
                  <div className="bg-[#D9F0F4] text-[#2a5f74] px-3 py-1 rounded-full text-sm flex items-center">
                    {filters.isPaid ? 'Paid' : 'Unpaid'}
                    <button
                      className="ml-2 text-[#2a5f74] hover:text-[#1a3f54]"
                      onClick={clearPaidFilter}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                )}

                <button
                  className="text-xs text-metallica-blue-600 hover:text-metallica-blue-800 ml-2 underline"
                  onClick={clearAllFilters}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        }
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      {/* Filter Modal */}
      <InternshipFilterModal
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        initialFilters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
}

function AppliedInternshipsView() {
  const { currentUser } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const userMajor = currentUser?.major || 'Computer Science';

  // Mock statuses for AppliedInternshipsView
  const APPLIED_INTERNSHIP_STATUSES = {
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
    }
  };

  return (
    <div className="w-full px-6 py-4">
      <InternshipList
        title=""
        internships={getAppliedInternships()}
        type="applied"
        statuses={['pending', 'accepted', 'finalized', 'rejected']}
        showDatePicker={false}
        showSidebar={true}
        userMajor={userMajor}
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

function MyInternshipsView({ onTriggerReportCreate }) {
  const { currentUser } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const userMajor = currentUser?.major || 'Computer Science';

  // Mock statuses for MyInternshipsView
  const MY_INTERNSHIP_STATUSES = {
    current: {
      label: "CURRENT",
      color: "bg-blue-100 text-blue-800 border border-blue-400",
      badgeColor: "bg-blue-600",
    },
    completed: {
      label: "COMPLETED",
      color: "bg-green-100 text-green-800 border border-green-400",
      badgeColor: "bg-green-600",
    },
    evaluated: {
      label: "EVALUATED",
      color: "bg-purple-100 text-purple-800 border border-purple-400",
      badgeColor: "bg-purple-600",
    }
  };

  return (
    <div className="w-full px-6 py-4">
      <InternshipList
        title=""
        internships={getMyInternships()}
        type="my"
        statuses={['current', 'completed', 'evaluated']}
        onTriggerReportCreate={onTriggerReportCreate}
        showSidebar={true}
        userMajor={userMajor}
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

function NotificationsView() {
  return (
    <div className="w-full px-6 py-4">
      <NotificationsList />
    </div>
  );
}

function ProfileView() {
  return (
    <div className="w-full px-6 py-4">
      <StudentProfile />
    </div>
  );
}

// Define the page components map with all views including profile
const viewComponents = {
  'home': DashboardHomeView,
  'browse': BrowseInternshipsView,
  'applied': AppliedInternshipsView,
  'my-internships': MyInternshipsView,
  'notifications': NotificationsView,
  'profile': ProfileView
};

export default function StudentDashboardPage() {
  const [appliedIdsSet, setAppliedIdsSet] = useState(new Set());
  const [isCreatingReport, setIsCreatingReport] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);

  const handleApplicationCompleted = (internshipId) => {
    setAppliedIdsSet(prevSet => new Set(prevSet).add(internshipId));
  };

  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash && viewComponents[hash]) {
        return hash;
      }
    }
    return 'home';
  });

  const getInitialTitle = (viewId) => {
    switch (viewId) {
      case 'home':
        return "RECOMMENDED OPPORTUNITIES";
      case 'browse':
        return "INTERNSHIP OPPORTUNITIES";
      case 'applied':
        return "APPLIED INTERNSHIPS";
      case 'my-internships':
        return "MY INTERNSHIPS";
      case 'notifications':
        return "NOTIFICATIONS";
      case 'profile':
        return "MY PROFILE";
      default:
        return "RECOMMENDED OPPORTUNITIES";
    }
  };

  // Base title is determined by the current view
  const [currentTitle, setCurrentTitle] = useState(() => getInitialTitle(currentView));

  // Report creation handlers (moved up from MyInternshipsView)
  const handleReportCreation = (internship) => {
    setSelectedInternship(internship);
    setIsCreatingReport(true);
    // Directly set the title here
    setCurrentTitle("Create Internship Report");
  };

  const handleReportCancel = () => {
    setIsCreatingReport(false);
    setSelectedInternship(null);
    // Reset the title when returning to the list
    setCurrentTitle("MY INTERNSHIPS");
  };

  const handleReportSubmit = (reportData) => {
    console.log('Report submitted:', reportData);
    setIsCreatingReport(false);
    setSelectedInternship(null);
    // Reset the title when returning to the list
    setCurrentTitle("MY INTERNSHIPS");
  };

  const handleViewChange = (viewId) => {
    // Only change view if we're not in report creation mode
    // This prevents losing the report form when clicking on sidebar navigation
    if (!isCreatingReport) {
      setCurrentView(viewId);
      setCurrentTitle(getInitialTitle(viewId));
    }
  };

  useEffect(() => {
    // When currentView changes, set the title (but not if we're creating a report)
    if (!isCreatingReport) {
      setCurrentTitle(getInitialTitle(currentView));
    }
  }, [currentView, isCreatingReport]);

  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.replace('#', '');
        // Only change view based on hash if we're not in report creation mode
        if (hash && viewComponents[hash] && hash !== currentView && !isCreatingReport) {
          setCurrentView(hash);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView, isCreatingReport]);

  // Special case: If we're on the My Internships view and creating a report,
  // render the Report component directly instead of the CurrentViewComponent
  if (currentView === 'my-internships' && isCreatingReport) {
    return (
      <DashboardLayout
        userType="student"
        title={currentTitle}
        currentViewId={currentView}
        onViewChange={handleViewChange}
      >
        {/* <Report
          onAddTile={handleReportSubmit}
          onCancel={handleReportCancel}
        /> */}
      </DashboardLayout>
    );
  }

  // Normal case: render the current view based on navigation
  const CurrentViewComponent = viewComponents[currentView];

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
      title={currentTitle}
      currentViewId={currentView}
      onViewChange={handleViewChange}
    >
      {CurrentViewComponent && <CurrentViewComponent {...viewProps} />}
    </DashboardLayout>
  );
}