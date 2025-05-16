"use client"
import { useState, useEffect } from "react";
import ReportStatistics from '@/components/ReportStatistics';
import ReportTable from '@/components/ReportsTable';
import ReportViewer from '@/components/ReportViewer';
import Header from "@/components/Header";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { facultyScadReports } from '../../../../../../constants/mockData';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  
  // Convert the facultyScadReports object to an array on component mount
  // and add missing fields or map existing ones correctly
  useEffect(() => {
    const reportsArray = Object.values(facultyScadReports).map(report => ({
      ...report,
      studentMajor: report.studentMajor || report.major, // Use studentMajor if it exists, otherwise use major
      internshipTitle: report.title || report.internshipTitle || 'Internship Report' // Use title as internshipTitle if needed
    }));
    setReports(reportsArray);
    console.log("SCAD reports loaded:", reportsArray); // Debug log
  }, []);

  const handleView = (report) => {
    // Find the detailed report in facultyScadReports by id
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
    <DashboardLayout userType="scad">
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
        
        <ReportTable
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
                      CTEMOlose
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
    </DashboardLayout>
  );
}