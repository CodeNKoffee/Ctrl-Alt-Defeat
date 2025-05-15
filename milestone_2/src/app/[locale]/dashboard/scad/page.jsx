'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { MOCK_COMPANIES, MOCK_EVALUATIONS } from '../../../../../constants/mockData';
import CompanyTable from '@/components/CompanyTable';
import CallModal from '@/components/CallModal';
import CallInterface from '@/components/CallInterface';
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

function ScadDashboardView() {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const isInCall = useSelector((state) => state.call.isInCall);
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

  const openCallModal = () => setIsCallModalOpen(true);
  const closeCallModal = () => setIsCallModalOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-metallica-blue-50 to-white px-8 py-6 relative">
      {isInCall && (
        <div className="fixed inset-0 z-50">
          <CallInterface />
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium text-metallica-blue-900 mb-2 font-ibm-plex-sans">SCAD Dashboard</h1>
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium text-gray-600 hidden sm:inline">
              Call PRO Students
            </span>
            <div className="relative">
              <button
                onClick={openCallModal}
                className="relative p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-md cursor-pointer"
                aria-label="Start a video call with students"
                title="Call PRO Students"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
              <span className="absolute -inset-1 rounded-full animate-ping bg-indigo-300 opacity-75 pointer-events-none" style={{ animationDuration: '3s' }}></span>
            </div>
          </div>
        </div>
        <CompanyTable companies={MOCK_COMPANIES} />
      </div>
      <CallModal isOpen={isCallModalOpen} onClose={closeCallModal} />
    </div>
  );
}

function StudentListView() {
  return (
    <main className="container mx-auto bg-white min-h-screen">
      <StudentList students={mockStudents} />
    </main>
  );
}

function StatisticsView() {
  return (
    <main className="min-h-screen p-8">
      <Stats />
    </main>
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
    <div className="container mx-auto p-4">
      <Header text="Student Reports Review" size="text-4xl" className="mb-6" />
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

function WorkshopsView() {
  return (
    <div className="min-h-screen bg-[#F1F9FB]">
      <WorkshopManager />
    </div>
  );
}

function StudentEvalsView() {
  return (
    <div className="min-h-screen bg-[#f4fafd] py-10 px-4">
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