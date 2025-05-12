"use client"
import { useState } from "react";
import ReportStatistics from '@/components/ReportStatistics';
import ReportTable from '@/components/ReportsTable';
import ReportViewer from '@/components/ReportViewer';
import { reportsMockData, reportDetailsMockData } from '../../../../../../constants/mockData';

export default function ReportsPage() {
  const [reports, setReports] = useState(reportsMockData);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const flagged = reports.filter(r => r.status === 'flagged' || r.status === 'FLAGGED').length;

  const handleView = (report) => {
    // Find the detailed report data (with highlights/comments) by reportNumber
    const detailed = reportDetailsMockData.find(r => r.reportNumber === report.reportNumber);
    setSelectedReport({ ...report, ...detailed });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedReport(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-left text-[#2a5f74] relative pb-2 mb-4">
        Submitted Reports
        <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
      </h1>
      <ReportStatistics
        total={reports.length}
        accepted={reports.filter(r => r.status === 'accepted' || r.status === 'ACCEPTED').length}
        pending={reports.filter(r => r.status === 'pending' || r.status === 'PENDING').length}
        flagged={flagged}
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
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full relative p-6">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              &times;
            </button>
            <ReportViewer report={selectedReport} userType="scad" />
          </div>
        </div>
      )}
    </div>
  );
}