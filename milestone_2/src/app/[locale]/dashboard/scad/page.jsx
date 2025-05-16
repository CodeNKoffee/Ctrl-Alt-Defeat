'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { MOCK_COMPANIES, MOCK_EVALUATIONS } from '../../../../../constants/mockData';
import CompanyTable from '@/components/CompanyTable';
import StudentList from '@/components/StudentList';
import Stats from '@/components/Stats';
import ReportStatistics from '@/components/ReportStatistics';
import ReportsTable from '@/components/ReportsTable';
import ReportViewer from '@/components/ReportViewer';
import WorkshopManager from '@/components/WorkshopManager';
import DashboardLayout from '../../../../components/layouts/DashboardLayout';
import { mockStudents } from '../../../../../constants/mockData';
import Header from '@/components/Header';
import EvaluationsDashboard from '@/components/EvaluationsDashboard';
import { facultyScadReports } from '../../../../../constants/mockData';
import { getRegularInternships } from '../../../../../constants/internshipData';
import InternshipList from '../../../../components/shared/InternshipList';
import ApplicationsFilterBar from '../../../../components/shared/ApplicationsFilterBar';

function ScadDashboardView() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const router = useRouter();

  useEffect(() => {
    const userSessionData = sessionStorage.getItem('userSession') || localStorage.getItem('userSession');
    if (!userSessionData) {
      router.push('/en/auth/login');
      return;
    }
    const effectiveUser = currentUser || JSON.parse(userSessionData);
    if (effectiveUser?.role !== 'scad') {
      router.push(effectiveUser?.role === 'student' ? '/en/dashboard/student' : '/en');
    }
  }, [router, currentUser]);

  return (
    <div className="w-full px-6 py-4">
      <CompanyTable companies={MOCK_COMPANIES} />
    </div>
  );
}

function StudentListView({ sidebarExpanded }) {
  return (
    <div className="w-full px-6 py-4">
      <StudentList students={mockStudents} sidebarExpanded={sidebarExpanded} />
    </div>
  );
}

function StatisticsView() {
  return (
    <div className="w-full px-6 py-4">
      <Stats />
    </div>
  );
}

function ReportsView() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const reportsArray = Object.values(facultyScadReports).map(report => ({
      ...report,
      studentMajor: report.studentMajor || report.major,
      internshipTitle: report.title || report.internshipTitle || 'Internship Report'
    }));
    setReports(reportsArray);
  }, []);

  const handleView = (report) => {
    const detailed = facultyScadReports[report.id];
    setSelectedReport(detailed);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedReport(null);
  };

  const handleSubmitReview = () => {
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 2000);
  };

  return (
    <div className="w-full px-6 py-8">
      <h1 className="text-3xl font-bold text-left text-[#2a5f74] relative mb-6">
        STUDENT REPORTS REVIEW
        <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-metallica-blue-200">
        <h2 className="text-2xl font-semibold text-[#2a5f74] mb-4">SCAD Report Management System</h2>
        <p className="text-gray-700 mb-2">
          Welcome to the SCAD Report Management Dashboard. Here you can:
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
          <li>Monitor all student internship reports in the system</li>
          <li>Track report statuses across all faculty reviewers</li>
          <li>View detailed reports and faculty feedback</li>
          <li>Identify reports that require additional attention</li>
        </ul>
        <p className="text-[#2a5f74] font-medium">
          {reports.filter(r => r.status === 'flagged').length} reports are currently flagged and require attention.
        </p>
      </div>
      <ReportStatistics
        total={reports.length}
        accepted={reports.filter(r => r.status === 'accepted').length}
        pending={reports.filter(r => r.status === 'pending').length}
        flagged={reports.filter(r => r.status === 'flagged').length}
        rejected={reports.filter(r => r.status === 'rejected').length}
      />
      <ReportsTable
        reports={reports}
        userType="scad"
        onView={handleView}
        onEdit={(report) => alert(`Editing report: ${report.reportNumber}`)}
        onDelete={(report) => {
          if (window.confirm(`Delete report ${report.reportNumber}?`)) {
            setReports(prev => prev.filter(r => r.id !== report.id));
          }
        }}
        showStats={false}
      />
      {/* Modal for ReportViewer */}
      {modalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl relative">
            <div className="p-6 max-h-[90vh] flex flex-col">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-metallica-blue-700">{selectedReport.title}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-sm bg-metallica-blue-50 text-metallica-blue-700 px-2 py-1 rounded">
                    Student: {selectedReport.studentName}
                  </span>
                  <span className="text-sm bg-metallica-blue-50 text-metallica-blue-700 px-2 py-1 rounded">
                    Major: {selectedReport.studentMajor}
                  </span>
                  <span className="text-sm bg-metallica-blue-50 text-metallica-blue-700 px-2 py-1 rounded">
                    Company: {selectedReport.companyName}
                  </span>
                </div>
              </div>
              <div className="overflow-y-auto flex-grow" style={{ maxHeight: 'calc(90vh - 140px)' }}>
                <ReportViewer report={selectedReport} userType="scad" />
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="inline-flex items-center justify-center w-32 min-w-[8rem] px-0 py-2 rounded-full font-medium shadow-sm bg-metallica-blue-500 text-metallica-blue-100 border border-metallica-blue-200 hover:bg-metallica-blue-900 hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-metallica-blue-200 focus:ring-offset-2"
                  >
                    Close
                  </button>
                </div>
                {reviewSubmitted && (
                  <div className="mt-4 text-green-700 font-semibold text-center">
                    Review submitted!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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

function WorkshopsView() {
  return (
    <div className="w-full px-6 py-4">
      <WorkshopManager />
    </div>
  );
}

function StudentEvalsView() {
  return (
    <div className="w-full px-6 py-4">
      <EvaluationsDashboard evaluations={MOCK_EVALUATIONS} stakeholder={"other"} />
    </div>
  );
}

const viewComponents = {
  'dashboard': ScadDashboardView,
  'student-list': StudentListView,
  'student-evals': StudentEvalsView,
  'statistics': StatisticsView,
  'reports': ReportsView,
  'workshops': WorkshopsView,
  'browse-internships': BrowseInternshipsView,
};

export default function ScadDashboard() {
  const [currentView, setCurrentView] = useState('dashboard');

  const handleViewChange = (viewId) => {
    setCurrentView(viewId);
  };

  const CurrentViewComponent = viewComponents[currentView];

  return (
    <DashboardLayout
      userType="scad"
      currentViewId={currentView}
      onViewChange={handleViewChange}
    >
      {CurrentViewComponent && <CurrentViewComponent />}
    </DashboardLayout>
  );
}