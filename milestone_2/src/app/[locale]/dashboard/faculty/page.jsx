"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ReportStatistics from '@/components/ReportStatistics';
import ReportsTable from '@/components/ReportsTable';
import { facultyScadReports, MOCK_EVALUATIONS } from '../../../../../constants/mockData';
import EvaluationsDashboard from '@/components/EvaluationsDashboard';
import Stats from '@/components/Stats';
import FacultyReportViewer from './report-viewer/page';

function ViewSection({ title, children }) {
  return (
    <section className="mb-10">
      <h1 className="text-3xl font-bold text-[#2a5f74] mb-6 relative inline-block">
        {title}
        <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
      </h1>
      <div>{children}</div>
    </section>
  );
}

function FacultyDashboardView() {
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

  const ReportReviewCard = () => (
    <div className="w-full">
      <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative background bubbles */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute left-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute right-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        {/* Content */}
        <div className="flex items-start gap-4 relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6h6v6m-3-12a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          </div>

          <div className="text-left w-full">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              REPORT REVIEW
            </div>

            <h2 className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">
              Faculty Report Review Dashboard
            </h2>

            <p className="text-gray-700 mb-3">
              Welcome to the Faculty Report Review Dashboard. Here you can:
            </p>

            <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>Review student internship reports pending evaluation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>Provide feedback and annotations on student submissions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>Track reports you've already evaluated</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>Flag reports that require additional attention</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#D9F0F4] text-metallica-blue-700 font-medium px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm w-fit">
              {reports.filter(r => r.status === 'pending').length} reports are currently awaiting your review.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      <ViewSection title="FACULTY DASHBOARD">
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
  // Define the Evaluations Info Card
  const StudentEvaluationsInfoCard = () => (
    <div className="w-full">
      <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative circles */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute left-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute right-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        <div className="flex items-start gap-4 w-full relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="text-left w-full">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              STUDENT EVALUATIONS
            </div>
            <h2 className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">
              Review Internship Evaluation Reports
            </h2>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">
                Browse and access evaluations submitted by students regarding their internship experiences. View ratings, company information, and detailed feedback per student.
              </p>

              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">FILTER</span>
                      <h3 className="font-medium text-blue-700">Search & Sort</h3>
                    </div>
                    <p className="text-sm text-gray-600">Easily search evaluations by student name, company, or supervisor to quickly access relevant reports.</p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-[#146C80] text-white px-3 py-0.5 rounded-full text-xs font-semibold shadow-sm">See more</span>
                      <h3 className="font-medium text-[#146C80]">Full Evaluation Report</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      View the student's full evaluation including their feedback, company details, main supervisor, and internship duration.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                These evaluations contribute to enhancing internship quality and guide future students in making informed choices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4fafd] px-6 py-10">
      <ViewSection title="STUDENT EVALUATIONS">
        <StudentEvaluationsInfoCard />
      </ViewSection>
      <div>
        <EvaluationsDashboard evaluations={MOCK_EVALUATIONS} stakeholder={"other"} />
      </div>
    </div>
  );
}


function StatisticsView() {
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
              INSIGHTS & REPORTS
            </div>

            <h2 className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">
              Real-Time Statistics & Reporting
            </h2>

            <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4 text-gray-700">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>Track accepted, rejected, and flagged reports per internship cycle</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>Monitor average review time across faculty</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>View top courses most used in internships</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>Discover top-rated companies based on student evaluations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>Identify companies with highest internship participation</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#D9F0F4] text-metallica-blue-700 font-medium px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm w-fit">
              Generate comprehensive reports based on real-time statistics for strategic decision making.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen px-6 py-6">
      <ViewSection title="STATISTICS DASHBOARD">
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