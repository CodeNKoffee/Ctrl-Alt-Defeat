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

  const RecommendedOpportunitiesInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-md mb-2 border border-metallica-blue-200">
        <div className="flex items-start gap-4 w-full md:w-auto">
          <div className="flex-shrink-0 bg-[var(--metallica-blue-100)] rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[var(--metallica-blue-700)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-400"></p>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-4">Your Personalized Internship Matches</div>
            <div className="text-gray-700 mb-2">This page showcases internship opportunities specifically curated for you based on your unique profile and preferences.
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                <p className="text-metallica-blue-700 font-medium">How These Recommendations Work:</p>
                <li>Matched to your specified job interests and career goals</li>
                <li>Filtered by your preferred industries and work environments</li>
                <li>Includes positions highly rated by previous SCAD interns</li>
                <li>Updated regularly as new opportunities become available</li>
              </ul>
              <p className="text-metallica-blue-700 font-medium">
                Take time to explore these tailored suggestions—they represent opportunities where your specific talents and interests could truly shine.
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
        <RecommendedOpportunitiesInfoCard />
      </div>
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
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border border-metallica-blue-200">
        <div className="flex items-start gap-4 w-full md:w-auto">
          <div className="flex-shrink-0 bg-[var(--metallica-blue-100)] rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[var(--metallica-blue-700)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-400"></p>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-4">Browse Career-Building Internships</div>
            <div className="text-gray-700 mb-2"> Explore curated internship opportunities provided by SCAD and our partner companies. These positions are designed to give you real-world experience while building your professional portfolio.
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                <p className="text-metallica-blue-700 font-medium">Why These Opportunities Matter:</p>
                <li>Potential for academic credit and professional references</li>
                <li>Networking connections that could lead to full-time employment</li>
                <li>Portfolio-building projects to showcase your skills</li>
              </ul>
              <p className="text-metallica-blue-700 font-medium">
                Remember to watch our informational video "What Makes Your Internship Count" to learn how to maximize your internship experience and ensure it contributes meaningfully to your academic requirements.
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

  const MyInternshipsInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-md mb-2 border border-metallica-blue-200">
        <div className="flex items-start gap-4 w-full md:w-auto">
          <div className="flex-shrink-0 bg-[var(--metallica-blue-100)] rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[var(--metallica-blue-700)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-400"></p>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-4">Your Internships Dashboard</div>
            <div className="text-gray-700 mb-2"> Manage all your internships in one place.
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                <li> Current internships are ongoing</li>
                <li> Completed internships are awaiting your report and evaluation submissions</li>
                <li> Evaluated ones have been reviewed by your supervisor</li>
              </ul>
              <p className="text-metallica-blue-700 font-medium">
                Use the filters to sort through your internship history or search for specific opportunities.
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
      </div>
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

function WorkshopsView({ sidebarExpanded }) {
  const [selectedLiveWorkshop, setSelectedLiveWorkshop] = useState(null);

  const handleWorkshopSelection = (workshop) => {
    if (workshop && workshop.type === 'live') {
      setSelectedLiveWorkshop(workshop);
    }
  };

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
              Back to Workshops
            </button>
          </div>
          <WorkshopInterface workshop={selectedLiveWorkshop} onBack={() => setSelectedLiveWorkshop(null)} />
        </>
      ) : (
        <WorkshopList onSelectLive={handleWorkshopSelection} sidebarExpanded={sidebarExpanded} />
      )}
    </div>
  );
}

function OnlineAssessmentsView({ sidebarExpanded }) {
  return (
    <div className="w-full h-full px-6 py-4">
      <AssessmentList sidebarExpanded={sidebarExpanded} />
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
      {({ sidebarExpanded }) => (
        <>
          {CurrentViewComponent &&
            (currentView === 'workshops' ?
              <WorkshopsView sidebarExpanded={sidebarExpanded} /> :
              currentView === 'online-assessments' ?
                <OnlineAssessmentsView sidebarExpanded={sidebarExpanded} /> :
                <CurrentViewComponent {...viewProps} />
            )
          }
        </>
      )}
    </DashboardLayout>
  );
}