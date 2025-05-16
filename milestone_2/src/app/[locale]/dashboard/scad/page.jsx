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

function StudentListView() {
  return (
    <div className="w-full px-6 py-4">
      <StudentList students={mockStudents} />
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
    <div className="w-full px-6 py-4">
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