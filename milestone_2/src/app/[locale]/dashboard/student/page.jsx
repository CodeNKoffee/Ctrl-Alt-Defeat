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
  const [selectedStatus, setSelectedStatus] = useState('all');
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
    setSearchTerm('');
    setSelectedStatus('all');
  };

  return (
    <div className='w-full px-6 py-4'>
      <InternshipList
        title=""
        internships={hasActiveFilters ? filteredInternships : baseInternships}
        type="browsing"
        onApplicationCompleted={onApplicationCompleted}
        appliedInternshipIds={appliedInternshipIds}
        showSidebar={true}
        showTabs={true}
        userMajor={userMajor}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        // customFilterPanel={null}
      />

      {/* <InternshipFilterModal
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        initialFilters={filters}
        onApplyFilters={handleApplyFilters}
      /> */}
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

function WorkshopsView() {
  return (
    <div className="w-full px-6 py-4">
      <WorkshopList />
    </div>
  );
}

function OnlineAssessmentsView() {
  return (
    <div className="w-full px-6 py-4">
      <AssessmentList />
    </div>
  );
}

function MyReportsView() {
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
  return (
    <div className="min-h-screen bg-[#f4fafd] py-10 px-4">
      <EvaluationsDashboard evaluations={MOCK_EVALUATIONS} stakeholder={"student"} />
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
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "30px", fontWeight: "bold", textAlign: "left", color: "#2a5f74", position: "relative" }}>
              UPCOMING WORKSHOPS
              <span style={{ position: "absolute", bottom: "0", left: "0", width: "96px", height: "4px", backgroundColor: "#2a5f74" }}></span>
            </h1>
          </div>
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
        <WorkshopInterface workshop={selectedWorkshop} />
      )}
    </div>
  );
}

// Define the page components map with all views including profile
const viewComponents = {
  'home': DashboardHomeView,
  'browse': BrowseInternshipsView,
  'applied': AppliedInternshipsView,
  'my-internships': MyInternshipsView,
  'my-reports': MyReportsView,
  'my-evaluations': MyEvaluationsView,
  'workshops': WorkshopsView,
  'live-workshops': LiveWorkshopsView,
  'online-assessments': OnlineAssessmentsView,
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
      case 'workshops':
        return "WORKSHOPS";
      case 'online-assessments':
        return "ONLINE ASSESSMENTS";
      case 'my-reports':
        return "MY REPORTS";
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