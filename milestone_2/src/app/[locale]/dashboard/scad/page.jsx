'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
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
import { getRegularInternships, getRecommendedInternshipsForStudent, getRecommendedInternships } from '../../../../../constants/internshipData';
import InternshipList from '../../../../components/shared/InternshipList';
import ApplicationsFilterBar from '@/components/shared/ApplicationsFilterBar';
import CustomButton from '@/components/shared/CustomButton';

function ScadDashboardView() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const router = useRouter();

  // Add state for search and industry/size filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');

  // Get unique industries and sizes from MOCK_COMPANIES
  const uniqueIndustries = [
    ...new Set(MOCK_COMPANIES.map(company => company.industry))
  ].filter(Boolean).map(ind => ({ id: ind, title: ind }));
  const uniqueSizes = [
    ...new Set(MOCK_COMPANIES.map(company => company.size))
  ].filter(Boolean).map(size => ({ id: size, title: size }));

  // Filter companies based on search, industry, and size
  const filteredCompanies = MOCK_COMPANIES.filter(company => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;
    const matchesSize = selectedSize === 'all' || company.size === selectedSize;
    return matchesSearch && matchesIndustry && matchesSize;
  });

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

  const CompanyPartnershipReviewPortalInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="w-full max-w-6xl mb-8 mx-auto">
        <h1 className="text-3xl font-bold mb-0 text-left text-[#2a5f74] relative">
          COMPANY APPLICATIONS
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#2a5f74]"></span>
        </h1>

        {/* Moved Filter Controls Container */}
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -left-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform -rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute right-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute left-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        <div className="flex items-start gap-4 w-full md:w-auto relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              MANAGEMENT
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">Company Partnership Review Portal</div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">Efficiently manage and evaluate organization applications for SCAD internship partnerships. Review company profiles, internship offerings, and historical performance data to make informed decisions.</p>

              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  Key Partnership Management Features:
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Comprehensive review of new company applications and profiles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Evaluation of internship quality and alignment with academic requirements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Student feedback integration and satisfaction metrics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Partnership history tracking and renewal management</span>
                  </li>
                </ul>
              </div>

              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                Maintain high-quality internship opportunities by thoroughly assessing each company's offerings, workplace environment, and student development potential.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Filter sections config for ApplicationsFilterBar (Industry & Size)
  const companyFilterSections = [
    {
      name: 'Industry',
      options: [...uniqueIndustries],
      selected: selectedIndustry,
      onChange: (value) => setSelectedIndustry(value),
      resetLabel: 'All Industries',
    },
    {
      name: 'Size',
      options: [...uniqueSizes],
      selected: selectedSize,
      onChange: (value) => setSelectedSize(value),
      resetLabel: 'All Sizes',
    },
  ];

  return (
    <div className="w-full px-6 py-4">
      <div className="px-4 pt-6">
        <CompanyPartnershipReviewPortalInfoCard />
        <ApplicationsFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search companies by name or industry ..."
          onClearFilters={() => { setSearchTerm(''); setSelectedIndustry('all'); setSelectedSize('all'); }}
          filterSections={companyFilterSections}
        />
      </div>
      <CompanyTable companies={filteredCompanies} />
    </div>
  );
}

function StudentListView({ sidebarExpanded }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');

  // Get unique majors from mockStudents
  const uniqueMajors = [
    ...new Set(mockStudents.map(student => student.major))
  ].filter(Boolean).map(major => ({ id: major, title: major }));

  const uniqueStatuses = [
    ...new Set(mockStudents.map(student => student.status))
  ].filter(Boolean).map(status => ({ id: status, title: status }));

  const uniqueSemesters = [
    ...new Set(mockStudents.map(student => student.semester))
  ].filter(Boolean).map(sem => ({ id: sem, title: `Semester ${sem}` }));

  // Filter students by search and major
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.major?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.semester?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMajor = selectedMajor === 'all' || student.major === selectedMajor;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    const matchesSemester = selectedSemester === 'all' || student.semester === selectedSemester;
    return matchesSearch && matchesMajor && matchesStatus && matchesSemester;
  });

  const studentFilterSections = [
    {
      name: 'Major',
      options: [...uniqueMajors],
      selected: selectedMajor,
      onChange: (value) => setSelectedMajor(value),
      resetLabel: 'All Majors',
    },
    {
      name: 'Status',
      options: [...uniqueStatuses],
      selected: selectedStatus,
      onChange: (value) => setSelectedStatus(value),
      resetLabel: 'All Statuses',
    },
    {
      name: 'Semester',
      options: [...uniqueSemesters],
      selected: selectedSemester,
      onChange: (value) => setSelectedSemester(value),
      resetLabel: 'All Semesters',
    },
  ];

  const StudentDirectoryManagementInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="w-full max-w-6xl mb-8 mx-auto">
        <h1 className="text-3xl font-bold mb-0 text-left text-[#2a5f74] relative">
          STUDENT DIRECTORY
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#2a5f74]"></span>
        </h1>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute left-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute right-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        <div className="flex items-start gap-4 w-full md:w-auto relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              DIRECTORY
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">Student Directory Management</div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">Access comprehensive profiles of all SCAD students registered in the internship system for academic support and opportunity matching.</p>

              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  Student Information Available:
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Academic details (major, minor, expected graduation date)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Skills inventory and proficiency levels</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Internship history and evaluation outcomes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Assessment results and career interests</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Contact information and communication preferences</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-[#FFE8E8] to-[#FFF7F7] p-4 rounded-xl border border-[#FFCCD9] transition-all duration-300 hover:shadow-md">
                <p className="text-[#B22247] font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Privacy Notice: Access to student information is restricted to authorized personnel and subject to educational privacy regulations. Use information only for legitimate educational purposes.
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
        <StudentDirectoryManagementInfoCard />
        <ApplicationsFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search students by name, email, or major ..."
          onClearFilters={() => { setSearchTerm(''); setSelectedMajor('all'); setSelectedStatus('all'); setSelectedSemester('all'); }}
          filterSections={studentFilterSections}
        />
      </div>
      <StudentList students={filteredStudents} sidebarExpanded={sidebarExpanded} />
    </div>
  );
}

function StatisticsView() {
  // Define the Statistics Dashboard Info Card
  const StatisticsDashboardInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="w-full max-w-6xl mb-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-left text-[#2a5f74] relative">
          STATISTICS DASHBOARD
          <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
        </h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute left-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute right-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        <div className="flex items-start gap-4 w-full md:w-auto relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              ANALYTICS
            </div>
            <h2 className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">Statistics Dashboard & Reporting</h2>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">Comprehensive analytics platform for monitoring internship program performance metrics and trends.</p>

              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  Key Analytics Features:
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Real-time dashboard with visual reports and metrics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Top companies and courses based on student performance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Internship report status tracking across academic cycles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Faculty review time analysis and efficiency metrics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Exportable PDF reports for academic administration</span>
                  </li>
                </ul>
              </div>

              <p className="text-blue-700 font-medium bg-blue-50 px-4 py-2 rounded-lg border-l-4 border-blue-500 shadow-sm">
                Use this analytics suite to identify trends, measure program effectiveness, and make data-driven decisions to improve internship outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full px-6 py-4">
      <StatisticsDashboardInfoCard />
      <Stats />
    </div>
  );
}

function ReportsView() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleExportPDF = () => {
    toast.info('PDF export started. Your document will be downloaded shortly.', {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

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
      <div className="w-full max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-0 text-left text-[#2a5f74] relative">
          STUDENT REPORTS REVIEW
          <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
        </h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -left-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform -rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute right-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute left-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        <div className="flex items-start gap-4 w-full md:w-auto relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              ACADEMIC
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">Student Report Review Portal</div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">Manage and distribute student internship reports to appropriate faculty members for academic evaluation and feedback.</p>

              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  Report Management Features:
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Access all submitted student internship reports organized by department and date</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>View report status (pending, flagged, rejected, accepted)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Assign reports to specific faculty reviewers based on expertise</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Monitor faculty review timelines and completion rates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Track report revision cycles and resubmissions</span>
                  </li>
                </ul>
              </div>

              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                These reports represent the academic culmination of students' internship experiences, connecting professional practice with classroom learning.
              </p>
            </div>
          </div>
        </div>
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
                <div className="flex flex-col gap-2">
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
                  <div className="flex flex-col">
                    <CustomButton
                      variant="primary"
                      text={`Export as PDF`}
                      icon={faFilePdf}
                      //   (nextStatus === 'completed' ? faCheckCircle : faClock)}
                      onClick={handleExportPDF}
                      width="w-60"
                    />
                  </div>
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
  const uniqueIndustries = [...new Set(internshipDataForFilters.map(internship => internship.industry))]
    .filter(Boolean)
    .map(ind => ({ id: ind, title: ind }));

  const uniqueDurations = [...new Set(internshipDataForFilters.map(internship => internship.duration))]
    .filter(Boolean)
    .map(dur => ({ id: dur, title: dur }));

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

  // Apply additional filters (industry, duration, paid/unpaid, search)
  useEffect(() => {
    let result = [...baseInternships];

    // Filter by search term
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

  const filterSectionsConfig = [
    {
      name: 'Industry',
      options: [...uniqueIndustries],
      selected: filters.industry || 'all',
      onChange: (value) => setFilters(prev => ({ ...prev, industry: value === 'all' ? '' : value })),
      resetLabel: 'All Industries',
    },
    {
      name: 'Duration',
      options: [...uniqueDurations],
      selected: filters.duration || 'all',
      onChange: (value) => setFilters(prev => ({ ...prev, duration: value === 'all' ? '' : value })),
      resetLabel: 'All Durations',
    },
    {
      name: 'Payment',
      options: [
        { id: 'true', title: 'Paid' },
        { id: 'false', title: 'Unpaid' },
      ],
      selected: filters.isPaid === null ? 'all' : filters.isPaid.toString(),
      onChange: (value) => {
        if (value === 'all') {
          setFilters(prev => ({ ...prev, isPaid: null }));
        } else {
          setFilters(prev => ({ ...prev, isPaid: value === 'true' }));
        }
      },
      resetLabel: 'All Payment',
    },
  ];

  // Define the info card JSX/Component here for clarity
  const InternshipListingsManagementInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="w-full max-w-6xl mb-8 mx-auto">
        <h1 className="text-3xl font-bold mb-0 text-left text-[#2a5f74] relative">
          INTERNSHIP LISTINGS
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#2a5f74]"></span>
        </h1>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -left-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform -rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute right-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute left-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        <div className="flex items-start gap-4 w-full md:w-auto relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div className="text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              OVERSIGHT
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">Internship Listings Management</div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">Monitor and oversee all active internship opportunities posted by approved partner companies across the platform.</p>

              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  Oversight Features:
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>View complete details of all current internship listings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Filter opportunities by company, industry, location, or status</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Verify compliance with posting guidelines and requirements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Review compensation details and working conditions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Ensure appropriate skill level requirements and educational alignment</span>
                  </li>
                </ul>
              </div>

              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                This dashboard enables SCAD administrators to maintain the quality and integrity of all internship opportunities available to students, ensuring they align with educational objectives and professional standards.
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
        <InternshipListingsManagementInfoCard />
        <ApplicationsFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search internships by job title, company, or skills..."
          onClearFilters={clearAllFilters}
          filterSections={filterSectionsConfig}
        />
        {/* ALL / RECOMMENDED Tabs */}
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
      />
    </div>
  );
}

function WorkshopsView() {
  const WorkshopManagementPortalInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="w-full max-w-6xl mb-8 mx-auto">
        <h1 className="text-3xl font-bold mb-0 text-left text-[#2a5f74] relative">
          WORKSHOP MANAGEMENT
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#2a5f74]"></span>
        </h1>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -left-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform -rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute right-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute left-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        <div className="flex items-start gap-4 w-full md:w-auto relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m2 4h-10a2 2 0 01-2-2v-4a2 2 0 012-2h10a2.5 2.5 0 012.5 2.5V18a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              PROFESSIONAL DEVELOPMENT
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">Workshop Management Portal</div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">Create, schedule, and manage professional development workshops that enhance student career readiness and industry preparation.</p>

              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  Workshop Creation Tools:
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Design new workshop listings with detailed descriptions and learning objectives</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Schedule sessions with flexible timing options (live, recurring, or on-demand)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Upload materials, presentations, and supplementary resources</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Set capacity limits and registration requirements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Designate workshops for specific student segments or Pro membership</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  Content Control:
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Ensure workshop content aligns with industry standards and emerging trends</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Maintain quality and consistency across all professional development offerings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Coordinate with industry presenters and faculty facilitators</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Update content as needed based on student feedback and industry changes</span>
                  </li>
                </ul>
              </div>

              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                This centralized system streamlines the entire workshop lifecycle from creation through evaluation, ensuring valuable professional development opportunities for all students.
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
        <WorkshopManagementPortalInfoCard />
      </div>
      <WorkshopManager />
    </div>
  );
}

function StudentEvalsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Get unique statuses from MOCK_EVALUATIONS
  const uniqueStatuses = [
    ...new Set(MOCK_EVALUATIONS.map(evalObj => evalObj.status))
  ].filter(Boolean).map(status => ({ id: status, title: status }));

  // Filter evaluations by search and status
  const filteredEvals = MOCK_EVALUATIONS.filter(evalObj => {
    const matchesSearch =
      evalObj.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evalObj.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evalObj.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || evalObj.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const customFilterSections = [
    {
      title: 'Status',
      options: [{ label: 'All Statuses', value: 'all' }, ...uniqueStatuses.map(s => ({ label: s.title, value: s.id }))],
      isSelected: (option) => selectedStatus === option.value,
      onSelect: (option) => setSelectedStatus(option.value)
    }
  ];

  const InternshipsEvaluationAnalyticsInfoCard = () => (
    <div className="w-full mx-auto">
      <div className="w-full max-w-6xl mb-8 mx-auto">
        <h1 className="text-3xl font-bold mb-0 text-left text-[#2a5f74] relative">
          EVALUATION ANALYTICS
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#2a5f74]"></span>
        </h1>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -left-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform -rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute right-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute left-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        <div className="flex items-start gap-4 w-full md:w-auto relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              ANALYTICS
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">Internships Evaluation Analytics</div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">Access and analyze student feedback on internship experiences to maintain quality partnerships and inform faculty advisors.</p>

              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  Evaluation Insights:
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>View comprehensive student assessments of partner companies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Monitor ratings across key metrics (mentorship, learning environment, workload)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Track recurring themes in qualitative feedback</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Identify standout companies and those requiring intervention</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Compare evaluation trends across industries and time periods</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                <p className="text-metallica-blue-700 font-medium">
                  Important: Student evaluations play a critical role in determining future partnership renewals and informing curriculum development.
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
        <InternshipsEvaluationAnalyticsInfoCard />
        <ApplicationsFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search evaluations by student, company, or title ..."
          onClearFilters={() => { setSearchTerm(''); setSelectedStatus('all'); }}
          customFilterSections={customFilterSections}
        />
      </div>
      <EvaluationsDashboard evaluations={filteredEvals} stakeholder={"other"} />
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