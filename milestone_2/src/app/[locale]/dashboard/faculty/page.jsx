"use client";

import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ReportStatistics from '@/components/ReportStatistics';
import ReportsTable from '@/components/ReportsTable';
import { facultyScadReports, MOCK_EVALUATIONS } from '../../../../../constants/mockData';
import EvaluationsDashboard from '@/components/EvaluationsDashboard';
import Stats from '@/components/Stats';
import FacultyReportViewer from './report-viewer/page';
import ViewSection from '@/components/ViewSection';

function FacultyDashboardView() {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  const [reports, setReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);

  useEffect(() => {
    const reportsArray = Object.values(facultyScadReports).map(report => ({
      ...report,
      studentMajor: report.studentMajor || report.major,
      internshipTitle: report.title || report.internshipTitle || 'Internship Report'
    }));
    setReports(reportsArray);
  }, []);

  const handleViewReport = (report) => {
    setSelectedReportId(report.id);
  };

  const handleBackToDashboard = () => {
    setSelectedReportId(null);
  };

  if (selectedReportId) {
    return (
      <FacultyReportViewer reportId={selectedReportId} onBack={handleBackToDashboard} />
    );
  }

  const ReportReviewCard = () => {
    return (
      <div className="w-full">
        <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          {/* Decorative background bubbles */}
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="absolute left-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
          <div className="absolute right-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

          {/* Content */}
          <div className="flex items-start gap-4 flex-row rtl:flex-row relative z-10">
            <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6h6v6m-3-12a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            </div>

            <div className="text-left rtl:text-right w-full">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2 rtl:text-right">
                {safeT('faculty.dashboard.reportReview.badge')}
              </div>

              <h2 className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300 rtl:text-right">
                {safeT('faculty.dashboard.reportReview.title')}
              </h2>

              <p className="text-gray-700 mb-3 rtl:text-right">
                {safeT('faculty.dashboard.reportReview.welcome')}
              </p>

              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2 rtl:ml-2 rtl:mr-0">✓</span>
                    <span>{safeT('faculty.dashboard.reportReview.features.reviewReports')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2 rtl:ml-2 rtl:mr-0">✓</span>
                    <span>{safeT('faculty.dashboard.reportReview.features.provideFeedback')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2 rtl:ml-2 rtl:mr-0">✓</span>
                    <span>{safeT('faculty.dashboard.reportReview.features.trackEvaluated')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2 rtl:ml-2 rtl:mr-0">✓</span>
                    <span>{safeT('faculty.dashboard.reportReview.features.flagReports')}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#D9F0F4] text-metallica-blue-700 font-medium px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm w-full rtl:text-right">
                {safeT('faculty.dashboard.reportReview.pendingReports').replace('{count}', reports.filter(r => r.status === 'pending').length)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      <ViewSection title={safeT('faculty.dashboard.title')}>
        <ReportReviewCard />
      </ViewSection>
      <ReportStatistics
        total={reports.length}
        accepted={reports.filter(r => r.status === 'accepted').length}
        pending={reports.filter(r => r.status === 'pending').length}
        flagged={reports.filter(r => r.status === 'flagged').length}
        rejected={reports.filter(r => r.status === 'rejected').length}
      />

      <ReportsTable
        reports={reports}
        userType="faculty"
        onView={handleViewReport}
      />
    </div>
  );
}

function StudentEvalsView() {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  // Define the Evaluations Info Card
  const StudentEvaluationsInfoCard = () => (
    <div className="w-full">
      <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative circles */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute left-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute right-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        <div className="flex items-start gap-4 flex-row rtl:flex-row w-full relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="text-left rtl:text-right w-full">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2 rtl:text-right">
              {safeT('faculty.dashboard.studentEvaluations.badge')}
            </div>
            <h2 className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300 rtl:text-right">
              {safeT('faculty.dashboard.studentEvaluations.title')}
            </h2>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3 rtl:text-right">
                {safeT('faculty.dashboard.studentEvaluations.description')}
              </p>

              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">{safeT('faculty.dashboard.studentEvaluations.features.filterTitle')}</span>
                      <h3 className="font-medium text-blue-700 rtl:text-right">{safeT('faculty.dashboard.studentEvaluations.features.searchSortTitle')}</h3>
                    </div>
                    <p className="text-sm text-gray-600 rtl:text-right">{safeT('faculty.dashboard.studentEvaluations.features.searchSortDescription')}</p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-[#146C80] text-white px-3 py-0.5 rounded-full text-xs font-semibold shadow-sm">{safeT('faculty.dashboard.studentEvaluations.features.seeMoreButton')}</span>
                      <h3 className="font-medium text-[#146C80] rtl:text-right">{safeT('faculty.dashboard.studentEvaluations.features.fullReportTitle')}</h3>
                    </div>
                    <p className="text-sm text-gray-600 rtl:text-right">
                      {safeT('faculty.dashboard.studentEvaluations.features.fullReportDescription')}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm rtl:text-right">
                {safeT('faculty.dashboard.studentEvaluations.qualityNote')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4fafd] px-6 py-10">
      <ViewSection title={safeT('faculty.dashboard.studentEvaluations.badge')}>
        <StudentEvaluationsInfoCard />
      </ViewSection>
      <div>
        <EvaluationsDashboard evaluations={MOCK_EVALUATIONS} stakeholder={"other"} />
      </div>
    </div>
  );
}


function StatisticsView() {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  const ReportStatsCard = () => (
    <div className="w-full">
      <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative bubbles */}
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute right-24 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        {/* Content */}
        <div className="flex items-start gap-4 relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17a4 4 0 004 0m4-2a4 4 0 00-8 0m4-6v2m0 4h.01M12 11a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          </div>

          <div className="text-left w-full">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              {safeT('faculty.dashboard.statistics.badge')}
            </div>

            <h2 className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">
              {safeT('faculty.dashboard.statistics.title')}
            </h2>

            <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4 text-gray-700">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>{safeT('faculty.dashboard.statistics.features.trackReports')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>{safeT('faculty.dashboard.statistics.features.monitorReviewTime')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>{safeT('faculty.dashboard.statistics.features.viewTopCourses')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>{safeT('faculty.dashboard.statistics.features.discoverTopCompanies')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>{safeT('faculty.dashboard.statistics.features.identifyParticipation')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#D9F0F4] text-metallica-blue-700 font-medium px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm w-fit">
              {safeT('faculty.dashboard.statistics.strategicNote')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen px-6 py-6">
      <ViewSection title={safeT('faculty.dashboard.statistics.sectionTitle')}>
        <ReportStatsCard />
      </ViewSection>
      <div>
        <Stats />
      </div>
    </main>
  );
}

const viewComponents = {
  'dashboard': FacultyDashboardView,
  'student-evals': StudentEvalsView,
  'statistics': StatisticsView,
  // Add more views here as needed
};

export default function FacultyDashboard() {
  const [currentView, setCurrentView] = useState('dashboard');

  const handleViewChange = (viewId) => {
    setCurrentView(viewId);
  };

  const CurrentViewComponent = viewComponents[currentView];

  return (
    <DashboardLayout
      userType="faculty"
      currentViewId={currentView}
      onViewChange={handleViewChange}
    >
      {CurrentViewComponent && <CurrentViewComponent />}
    </DashboardLayout>
  );
}