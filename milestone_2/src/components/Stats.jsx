import { useState } from 'react';
import { FiDownload, FiFileText, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF';
import TopCoursesCard from './charts/TopCoursesCard';
import AverageReviewTimeCard from './charts/AverageReviewTimeCard';
import TopCompaniesCard from './charts/TopCompaniesCard';
import TopInternshipCompaniesChart from './charts/TopInternshipCompaniesChart';
import ReportsPieChart from './charts/ReportsPieChart';
import StatCard from './charts/StatCard';
import WeeklyActivityLineChart from './charts/WeeklyActivityLineChart';

export default function Stats() {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date(),
  });

  const cycles = ['Winter 2023', 'Spring 2023', 'Winter 2024', 'Spring 2024', 'Winter 2025', 'Spring 2025'];
  const [selectedCycle, setSelectedCycle] = useState(cycles[0]);

  const dashboardData = {
    cycles: {
      'Winter 2023': { accepted: 40, flagged: 20, rejected: 5 },
      'Spring 2023': { accepted: 55, flagged: 22, rejected: 7 },
      'Winter 2024': { accepted: 48, flagged: 18, rejected: 6 },
      'Spring 2024': { accepted: 50, flagged: 25, rejected: 8 },
      'Winter 2025': { accepted: 60, flagged: 20, rejected: 10 },
      'Spring 2025': { accepted: 45, flagged: 30, rejected: 5 },
    },
    totalReports: 100,
    avgReviewTime: '2.5 days',
    topCourses: [
      {
        name: 'ITEC 3100 - Systems Analysis',
        count: 42,
        testimonial: 'This course provided great insights into system design.',
        rating: 4.8,
      },
      {
        name: 'ITEC 3200 - Database Design',
        count: 38,
        testimonial: 'Helped me understand database structures effectively.',
        rating: 4.6,
      },
      {
        name: 'ITEC 3300 - Web Development',
        count: 35,
        testimonial: 'A must-have course for aspiring web developers.',
        rating: 4.7,
      },
      {
        name: 'ITEC 3400 - Networking',
        count: 28,
        testimonial: 'Networking concepts were explained thoroughly.',
        rating: 4.5,
      },
      {
        name: 'ITEC 3500 - Cybersecurity',
        count: 22,
        testimonial: 'Essential for understanding modern security practices.',
        rating: 4.9,
      },
    ],
    topCompanies: [
      { name: 'Ora', rating: 4.9 },
      { name: 'TechCorp', rating: 4.8 },
      { name: 'DesignCo', rating: 4.6 },
      { name: 'Sumerge', rating: 4.6 },
      { name: 'Pharco', rating: 4.6 },
    ],
    topInternshipCompanies: [
      { name: 'Ora', count: 120 },
      { name: 'TechCorp', count: 98 },
      { name: 'DesignCo', count: 76 },
      { name: 'Sumerge', count: 60 },
      { name: 'Pharco', count: 45 },
    ],
  };

  return (
    <div className="p-0 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-4">
        <h1 className="text-2xl font-bold">Statistics Dashboard</h1>
        <PDFDownloadLink
          document={<ReportPDF data={dashboardData} dateRange={dateRange} />}
          fileName={`stats_report_${dateRange.start.toDateString()}_to_${dateRange.end.toDateString()}.pdf`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <FiDownload />
          Export PDF
        </PDFDownloadLink>
      </div>

      {/* Charts and Additional Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4">
        {/* Left Column */}
        <div className="space-y-6">
          {dashboardData.topCompanies?.length > 0 ? (
            <TopCompaniesCard companies={dashboardData.topCompanies} />
          ) : (
            <p className="text-sm text-gray-500">No top companies data available.</p>
          )}
          <WeeklyActivityLineChart data={dashboardData.cycles} cycles={cycles} />
        </div>

        {/* Middle Column */}
        <div className="space-y-6">
          <AverageReviewTimeCard value={dashboardData.avgReviewTime} />
          <TopCoursesCard courses={dashboardData.topCourses} />
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <StatCard title="Total Reports" value={dashboardData.totalReports} icon={<FiFileText />} />
          <ReportsPieChart
            data={dashboardData.cycles}
            selectedCycle={selectedCycle}
            setSelectedCycle={setSelectedCycle}
            cycles={cycles}
          />
          {dashboardData.topInternshipCompanies?.length > 0 ? (
            <TopInternshipCompaniesChart companies={dashboardData.topInternshipCompanies} />
          ) : (
            <p className="text-sm text-gray-500">No internship companies data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}