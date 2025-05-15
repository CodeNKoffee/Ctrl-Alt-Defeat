"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ReportStatistics from '@/components/ReportStatistics';
import ReportsTable from '@/components/ReportsTable';
import { facultyScadReports } from '../../../../../constants/mockData';

export default function FacultyDashboard() {
  const [reports, setReports] = useState([]);
  
  // Convert the facultyScadReports object to an array on component mount
  // and add missing fields or map existing ones correctly
  useEffect(() => {
    const reportsArray = Object.values(facultyScadReports).map(report => ({
      ...report,
      studentMajor: report.studentMajor || report.major, // Use studentMajor if it exists, otherwise use major
      internshipTitle: report.title || report.internshipTitle || 'Internship Report' // Use title as internshipTitle if needed
    }));
    setReports(reportsArray);
    console.log("Faculty reports loaded:", reportsArray); // Debug log
  }, []);

  return (
    <DashboardLayout userType="faculty">
      <div className="container mx-auto px-4 py-8">
        <Header text="Faculty Dashboard" size="text-4xl" className="mb-6" />
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-metallica-blue-200">
          <h2 className="text-2xl font-semibold text-metallica-blue-800 mb-4">Report Review System</h2>
          <p className="text-gray-700 mb-2">
            Welcome to the Faculty Report Review Dashboard. Here you can:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>Review student internship reports pending evaluation</li>
            <li>Provide feedback and annotations on student submissions</li>
            <li>Track reports you've already evaluated</li>
            <li>Flag reports that require additional attention</li>
          </ul>
          <p className="text-metallica-blue-700 font-medium">
            {reports.filter(r => r.status === 'pending').length} reports are currently awaiting your review.
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
          userType="faculty"
        />
      </div>
    </DashboardLayout>
  );
}