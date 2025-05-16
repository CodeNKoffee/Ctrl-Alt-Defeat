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
      <div className="bg-white p-6 rounded-2xl shadow-md mb-2 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -left-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform -rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute left-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute right-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>
        
        <div className="flex items-start gap-4 w-full md:w-auto relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <div className="text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              PERSONALIZED
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">Your Personalized Internship Matches</div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">This page showcases internship opportunities specifically curated for you based on your unique profile and preferences.</p>
              
              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  How These Recommendations Work:
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Matched to your specified job interests and career goals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Filtered by your preferred industries and work environments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Includes positions highly rated by previous SCAD interns</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Updated regularly as new opportunities become available</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
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

  // Define the Applied Internships Info Card
  const AppliedInternshipsInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute left-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute right-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>
        
        <div className="flex items-start gap-4 w-full relative z-10 max-w-5xl mx-auto">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-left flex-grow">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              APPLICATIONS
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">Your Internship Applications</div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">Track and manage all your internship applications in one centralized dashboard.</p>
              
              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <div className="flex justify-center space-x-4 mb-2 mx-auto">
                  <div className="flex-1 p-2 bg-yellow-50 rounded-lg border border-yellow-100 text-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                    <p className="text-xs font-medium text-yellow-800">Pending</p>
                  </div>
                  <div className="flex-1 p-2 bg-green-50 rounded-lg border border-green-100 text-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                    <p className="text-xs font-medium text-green-800">Accepted</p>
                  </div>
                  <div className="flex-1 p-2 bg-purple-50 rounded-lg border border-purple-100 text-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-1"></div>
                    <p className="text-xs font-medium text-purple-800">Finalized</p>
                  </div>
                  <div className="flex-1 p-2 bg-red-50 rounded-lg border border-red-100 text-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
                    <p className="text-xs font-medium text-red-800">Rejected</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <span>Pending applications are still being reviewed by companies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Accepted applications mean you've qualified for the next steps</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>Finalized applications are confirmed and ready to start</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>Rejected applications weren't successful this time</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                Use the filters to sort through your applications by company, position, or status!
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
      </div>
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
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-45 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute right-40 top-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute left-20 top-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>
        
        <div className="flex items-start gap-4 w-full relative z-10 max-w-5xl mx-auto">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-left flex-grow">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              DASHBOARD
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">Your Internships Dashboard</div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">Manage all your internships in one place.</p>
              
              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <div className="flex space-x-4 mb-2">
                  <div className="flex-1 p-2 bg-blue-50 rounded-lg border border-blue-100 text-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                    <p className="text-xs font-medium text-blue-800">Current</p>
                  </div>
                  <div className="flex-1 p-2 bg-green-50 rounded-lg border border-green-100 text-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                    <p className="text-xs font-medium text-green-800">Completed</p>
                  </div>
                  <div className="flex-1 p-2 bg-purple-50 rounded-lg border border-purple-100 text-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-1"></div>
                    <p className="text-xs font-medium text-purple-800">Evaluated</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Current internships are ongoing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Completed internships are awaiting your report and evaluation submissions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>Evaluated ones have been reviewed by your supervisor</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
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
              ALERTS
            </div>
            <h2 className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">Notifications Center</h2>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">Stay informed and never miss important updates related to your professional development journey.</p>
              
              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <h3 className="font-medium text-[#2a5f74] mb-2">Your Notification Hub:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border border-blue-200 bg-blue-50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">1</span>
                      </div>
                      <span className="font-medium text-blue-700">Application Updates</span>
                    </div>
                    <p className="text-sm text-gray-600">Status changes and feedback on your internship applications</p>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-green-200 bg-green-50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">2</span>
                      </div>
                      <span className="font-medium text-green-700">Report Alerts</span>
                    </div>
                    <p className="text-sm text-gray-600">New comments or status changes on your submitted reports</p>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-purple-200 bg-purple-50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex-shrink-0 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">3</span>
                      </div>
                      <span className="font-medium text-purple-700">Workshop Reminders</span>
                    </div>
                    <p className="text-sm text-gray-600">Upcoming sessions you've registered for and last-minute availabilities</p>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-orange-200 bg-orange-50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex-shrink-0 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">4</span>
                      </div>
                      <span className="font-medium text-orange-700">Deadline Notifications</span>
                    </div>
                    <p className="text-sm text-gray-600">Important dates for application submissions and report due dates</p>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-indigo-200 bg-indigo-50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex-shrink-0 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">5</span>
                      </div>
                      <span className="font-medium text-indigo-700">Personalized Opportunities</span>
                    </div>
                    <p className="text-sm text-gray-600">New internships or workshops matching your profile</p>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex-shrink-0 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">6</span>
                      </div>
                      <span className="font-medium text-yellow-700">Premium Content</span>
                    </div>
                    <p className="text-sm text-gray-600">Exclusive workshops and events for Pro students only</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">Note:</span> Some workshop notifications are exclusively for students with Pro membership. Upgrade your account to access these premium professional development opportunities.
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
      </div>
      <div className="px-4">
        <NotificationsList />
      </div>
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
      <div className="px-4">
        <StudentProfile />
      </div>
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
              PROFESSIONAL DEVELOPMENT
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">
              Workshops & Professional Development Hub
            </div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">Enhance your skills and expand your professional knowledge through our comprehensive workshop center.</p>
              
              {/* Workshop Types */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  Available Workshop Types:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="font-medium text-blue-700 mb-1 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Upcoming Workshops
                    </div>
                    <p className="text-sm text-gray-600">Browse and register for scheduled future sessions</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="font-medium text-green-700 mb-1 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Live Now
                    </div>
                    <p className="text-sm text-gray-600">Join active workshops happening in real-time</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="font-medium text-purple-700 mb-1 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      On-Demand Library
                    </div>
                    <p className="text-sm text-gray-600">Access pre-recorded sessions available anytime</p>
                  </div>
                </div>

                {/* Workshop Benefits */}
                <p className="text-metallica-blue-700 font-medium mt-4 mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  Workshop Benefits:
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Build industry-specific skills valued by employers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Learn practical techniques from working professionals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Network with industry representatives and peers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Receive certificates of completion for your portfolio</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                Each workshop is carefully designed to address critical skills and knowledge areas that complement your academic learning and prepare you for professional success.
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
              Back to Workshops
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
  // Define the Online Assessments Info Card
  const OnlineAssessmentsInfoCard = () => (
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
              SELF-DISCOVERY
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">
              Online Assessments Center
            </div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">Discover your professional strengths and preferences through our comprehensive assessment tools.</p>
              
              {/* Assessment Benefits */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  Assessment Benefits:
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Gain valuable insights into your natural strengths and work preferences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Receive personalized internship and workshop recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Better articulate your unique qualities to potential employers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Identify career paths that align with your personality and aptitudes</span>
                  </li>
                </ul>

                {/* Assessment Types */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="font-medium text-blue-700 mb-1 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Personality Assessment
                    </div>
                    <p className="text-sm text-gray-600">Understand your work style and team dynamics preferences</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="font-medium text-green-700 mb-1 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Skills Proficiency
                    </div>
                    <p className="text-sm text-gray-600">Measure your technical and soft skills competency levels</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="font-medium text-purple-700 mb-1 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Career Interest Inventory
                    </div>
                    <p className="text-sm text-gray-600">Discover fields and roles that match your interests</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="font-medium text-yellow-700 mb-1 flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      Aptitude Indicators
                    </div>
                    <p className="text-sm text-gray-600">Identify your natural abilities across different domains</p>
                  </div>
                </div>
              </div>
              
              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                Results are analyzed to create your personalized profile that helps tailor recommendations throughout the platform.
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
              DOCUMENTATION
            </div>
            <h2 className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">Student Report Management System</h2>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">Welcome to your Student Report Dashboard. Here you can monitor and manage all your internship reports in one place.</p>
              
              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-semibold">PENDING</span>
                      <h3 className="font-medium text-yellow-700">Awaiting Review</h3>
                    </div>
                    <p className="text-sm text-gray-600">Your report has been submitted but not yet reviewed. No action required.</p>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-semibold">FLAGGED</span>
                      <h3 className="font-medium text-orange-700">Needs Revision</h3>
                    </div>
                    <p className="text-sm text-gray-600">Review faculty feedback and resubmit your updated report.</p>
                  </div>
                  
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold">REJECTED</span>
                      <h3 className="font-medium text-red-700">Not Approved</h3>
                    </div>
                    <p className="text-sm text-gray-600">Did not meet requirements. See faculty comments for guidance.</p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">ACCEPTED</span>
                      <h3 className="font-medium text-green-700">Approved</h3>
                    </div>
                    <p className="text-sm text-gray-600">Your report has been approved. No further action is needed.</p>
                  </div>
                </div>
              </div>
              
              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                Remember to review feedback from faculty on your submitted reports to improve future submissions!
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
    <div className="w-full px-6 py-4">
      <div className="px-4 pt-6">
        <ReportInfoCard />
      </div>
      <div className="px-4">
        <StudentReportCards />
      </div>
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
    </div>
  );
}

function MyEvaluationsView() {
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
              FEEDBACK
            </div>
            <h2 className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">Company Evaluation Management</h2>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">Manage your evaluations for companies where you completed internships. Track both submitted and draft evaluations here.</p>
              
              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">SUBMITTED</span>
                      <h3 className="font-medium text-blue-700">Published Evaluations</h3>
                    </div>
                    <p className="text-sm text-gray-600">Evaluations you have completed and submitted for your internship experiences.</p>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-semibold">DRAFT</span>
                      <h3 className="font-medium text-purple-700">Work in Progress</h3>
                    </div>
                    <p className="text-sm text-gray-600">Evaluations you've started but haven't submitted yet. Continue working on these.</p>
                  </div>
                </div>
              </div>
              
              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                Your evaluations provide valuable feedback to companies and help future students make informed decisions.
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
        <EvaluationsInfoCard />
      </div>
      <div className="px-4">
        <EvaluationsDashboard evaluations={MOCK_EVALUATIONS} stakeholder={"student"} />
      </div>
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
      case 'my-evaluations':
        return "MY COMPANY EVALUATIONS";
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
              <CurrentViewComponent {...viewProps} />
            )
          }
        </>
      )}
    </DashboardLayout>
  );
}