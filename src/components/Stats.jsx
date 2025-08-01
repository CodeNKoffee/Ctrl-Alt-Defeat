"use client";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';
import { FiDownload, FiFileText } from 'react-icons/fi';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF';
import TopCoursesCard from './charts/TopCoursesCard';
import AverageReviewTimeCard from './charts/AverageReviewTimeCard';
import TopCompaniesCard from './charts/TopCompaniesCard';
import TopInternshipCompaniesChart from './charts/TopInternshipCompaniesChart';
import ReportsPieChart from './charts/ReportsPieChart';
import StatCard from './charts/StatCard';
import WeeklyActivityLineChart from './charts/WeeklyActivityLineChart';
import CustomButton from './shared/CustomButton';

export default function Stats() {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

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
        rating: 4.0,
      },
      {
        name: 'DESN 2200 - Introduction to Graphic Design',
        count: 26,
        testimonial: 'Great hands-on projects that built my design skills.',
        rating: 4.7,
      },

    ],
    topCompanies: [
      { name: 'Ora', rating: 4.9 },
      { name: 'TechCorp', rating: 4.8 },
      { name: 'DesignCo', rating: 4.0 },
      { name: 'Sumerge', rating: 4.6 },
      { name: 'Deloitte', rating: 4.5 },
      { name: 'Pharco', rating: 4.0 },
    ],
    topInternshipCompanies: [
      { name: 'TechCorp', count: 98 },
      { name: 'Sumerge', count: 60 },
      { name: 'DesignCo', count: 76 },
      { name: 'Ora', count: 120 },
      { name: 'Alkan', count: 20 },
      { name: 'Pharco', count: 45 },
      { name: 'ITEC', count: 50 },
      { name: 'Sewedy', count: 30 }
    ],
  };

  return (
    <div className="py-4 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-4">
        <PDFDownloadLink
          document={<ReportPDF data={dashboardData} dateRange={dateRange} />}
          fileName={`stats_report_${dateRange.start.toDateString()}_to_${dateRange.end.toDateString()}.pdf`}
          className="text-white bg-[#2A5F74] px-4 py-3 rounded-full flex items-center gap-2 hover:cursor-pointer transition-all text-sm font-bold hover:translate-y-0.5 shadow-md hover:shadow-lg"
        >
          <FiDownload size={16} />
          {safeT('faculty.dashboard.statistics.generateReport')}
        </PDFDownloadLink>
      </div>

      {/* Charts and Additional Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 min-h-[700px]">
        {/* Left Column */}
        <div className="h-full flex flex-col justify-between">
          <div>
            {dashboardData.topCompanies?.length > 0 ? (
              <TopCompaniesCard companies={dashboardData.topCompanies} />
            ) : (
              <p className="text-sm text-gray-500">No top companies data available.</p>
            )}
          </div>
          <div>
            <WeeklyActivityLineChart data={dashboardData.cycles} cycles={cycles} />
          </div>
        </div>

        {/* Middle Column */}
        <div className="h-full flex flex-col justify-between">
          <div>
            <AverageReviewTimeCard value={dashboardData.avgReviewTime} />
          </div>
          <div>
            <TopCoursesCard courses={dashboardData.topCourses} />
          </div>
        </div>

        {/* Right Column */}
        <div className="h-full flex flex-col justify-between">
          <div>
            <StatCard title="Total Reports" value={dashboardData.totalReports} icon={<FiFileText />} />
          </div>
          <div>
            <ReportsPieChart
              data={dashboardData.cycles}
              selectedCycle={selectedCycle}
              setSelectedCycle={setSelectedCycle}
              cycles={cycles}
            />
          </div>
          <div>
            {dashboardData.topInternshipCompanies?.length > 0 ? (
              <TopInternshipCompaniesChart companies={dashboardData.topInternshipCompanies} />
            ) : (
              <p className="text-sm text-gray-500">No internship companies data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}