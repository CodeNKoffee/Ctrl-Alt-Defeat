"use client";

import { useState, useEffect } from "react";
import ReportViewer from "@/components/ReportViewer";
import Header from "@/components/Header";
import StatusBadge from "@/components/shared/StatusBadge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave, faCheckCircle, faExclamationTriangle, faThumbsUp, faThumbsDown, faFlag, faClock } from "@fortawesome/free-solid-svg-icons";
import { facultyScadReports } from '../../../../../../constants/mockData';

export default function FacultyReportViewer({ reportId, onBack, reportData }) {
  const [isSaving, setIsSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [reports, setReports] = useState(facultyScadReports);
  const [report, setReport] = useState(null);
  const [overallFeedback, setOverallFeedback] = useState('');
  const [reportStatus, setReportStatus] = useState('');
  const [statusChangeReason, setStatusChangeReason] = useState('');
  const [showStatusReasonField, setShowStatusReasonField] = useState(false);

  useEffect(() => {
    // Use reportData if provided, otherwise look up by reportId
    const currentReport = reportData || (reportId && reports[reportId]);
    if (currentReport) {
      setReport(currentReport);
      setReportStatus(currentReport.status);
      setShowStatusReasonField(currentReport.status === 'flagged' || currentReport.status === 'rejected');
    }
  }, [reportId, reportData, reports]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setReportStatus(newStatus);
    setShowStatusReasonField(newStatus === 'flagged' || newStatus === 'rejected');
    if (newStatus === 'accepted' || newStatus === 'pending') {
      setStatusChangeReason('');
    }
  };

  const handleSaveFeedback = () => {
    setIsSaving(true);
    if ((reportStatus === 'flagged' || reportStatus === 'rejected') && !statusChangeReason.trim()) {
      alert('Please provide a reason for flagging or rejecting the report.');
      setIsSaving(false);
      return;
    }
    const updatedReports = { ...reports };
    if (updatedReports[reportId]) {
      updatedReports[reportId] = {
        ...updatedReports[reportId],
        status: reportStatus,
        statusReason: statusChangeReason,
        feedback: overallFeedback,
        reviewedOn: new Date().toISOString()
      };
      setReports(updatedReports);
    }
    setTimeout(() => {
      setIsSaving(false);
      setSavedFeedback(true);
      if (reportStatus !== 'pending') {
        setTimeout(() => {
          if (onBack) onBack();
        }, 1500);
      } else {
        setTimeout(() => {
          setSavedFeedback(false);
        }, 3000);
      }
    }, 1000);
  };

  const getButtonText = () => {
    if (isSaving) return 'Saving...';
    if (savedFeedback) return 'Saved!';
    switch (reportStatus) {
      case 'pending': return 'Save Review';
      case 'accepted':
      case 'rejected':
      case 'flagged': return 'Submit Review';
      default: return 'Save Review';
    }
  };

  const getStatusBadgeClasses = (status) => {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'flagged': 'bg-orange-100 text-orange-800',
      'rejected': 'bg-red-100 text-red-800',
      'accepted': 'bg-green-100 text-green-800',
      'reviewed': 'bg-blue-100 text-blue-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      'pending': faClock,
      'flagged': faFlag,
      'rejected': faThumbsDown,
      'accepted': faThumbsUp,
      'reviewed': faCheckCircle
    };
    return statusIcons[status] || faExclamationTriangle;
  };

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-metallica-blue-600 text-xl">Loading report...</p>
        <p className="text-gray-500 mt-2">If this persists, the report may not exist</p>
      </div>
    );
  }

  const isEditable = report.status === 'pending';
  const mockFeedback = report.feedback || 'Faculty feedback: This report demonstrates strong technical skills and clear documentation.';
  const mockReason = report.statusReason || (report.status === 'flagged' ? 'Reason: Needs clarification on project scope.' : report.status === 'rejected' ? 'Reason: Did not meet the minimum requirements.' : '');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex flex-col mb-4 md:mb-0">
          <button
            onClick={onBack}
            className="mb-6 flex items-center text-metallica-blue-700 hover:text-metallica-blue-900 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            <span>Back to Reports</span>
          </button>
          <Header text="Report Review & Annotation" size="text-3xl md:text-4xl" className="mb-2 mt-0" />
        </div>
        <div className="flex items-center">
          <span className="text-metallica-blue-700 mr-2 text-sm">Student: <strong>{report.studentName}</strong></span>
          <span className="bg-metallica-blue-100 text-metallica-blue-800 px-2 py-1 rounded text-xs mr-2">
            Submitted: {new Date(report.submissionDate).toLocaleDateString()}
          </span>
          <StatusBadge color={getStatusBadgeClasses(report.status)}>
            <div className="flex items-center">
              <FontAwesomeIcon icon={getStatusIcon(report.status)} className="mr-1" />
              <span>{report.status.toUpperCase()}</span>
            </div>
          </StatusBadge>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="bg-metallica-blue-50 border-l-4 border-metallica-blue-600 p-4 mb-6 rounded-r">
          <h3 className="text-metallica-blue-800 font-semibold mb-1">Evaluation Mode</h3>
          <p className="text-metallica-blue-700">
            You're evaluating this student's report. Select any text to highlight key sections or add comments.
            Your annotations help provide constructive feedback and assess the report quality.
          </p>
        </div>
        <p className="text-metallica-blue-800 mb-6">
          Select any text in the report below to highlight important sections or add comments. Your annotations will appear in the sidebar.
        </p>
        <div className="min-h-[600px]">
          <ReportViewer report={report} />
        </div>
        {isEditable ? (
          <div className="mt-8 pt-6 border-t border-metallica-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-metallica-blue-800 mb-3">Overall Feedback</h3>
                <textarea
                  value={overallFeedback}
                  onChange={(e) => setOverallFeedback(e.target.value)}
                  placeholder="Provide overall feedback on the student's report..."
                  className="w-full min-h-[150px] p-3 border border-metallica-blue-300 rounded focus:ring-2 focus:ring-metallica-blue-500 focus:border-metallica-blue-500 outline-none"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-metallica-blue-800 mb-3">Report Status</h3>
                <div className="p-4 bg-metallica-blue-50 rounded-lg border border-metallica-blue-100">
                  <p className="text-sm text-metallica-blue-800 mb-3">
                    Choose the final status for this report after your review:
                  </p>
                  <div className="mb-4">
                    <label htmlFor="reportStatus" className="block text-sm font-medium text-metallica-blue-800 mb-1">
                      Status
                    </label>
                    <select
                      id="reportStatus"
                      value={reportStatus}
                      onChange={handleStatusChange}
                      className="w-full px-3 py-2 border border-metallica-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-metallica-blue-500"
                    >
                      <option value="pending">PENDING</option>
                      <option value="accepted">ACCEPTED</option>
                      <option value="rejected">REJECTED</option>
                      <option value="flagged">FLAGGED</option>
                    </select>
                  </div>
                  {showStatusReasonField && (
                    <div className="mb-2">
                      <label htmlFor="statusReason" className="block text-sm font-medium text-metallica-blue-800 mb-1">
                        Reason for {reportStatus === 'flagged' ? 'Flagging' : 'Rejecting'}
                      </label>
                      <textarea
                        id="statusReason"
                        value={statusChangeReason}
                        onChange={(e) => setStatusChangeReason(e.target.value)}
                        placeholder={`Please explain why this report is being ${reportStatus === 'flagged' ? 'flagged' : 'rejected'}...`}
                        className="w-full p-3 border border-metallica-blue-300 rounded focus:ring-2 focus:ring-metallica-blue-500 focus:border-metallica-blue-500 outline-none min-h-[80px]"
                        required={reportStatus === 'flagged' || reportStatus === 'rejected'}
                      />
                      <p className="text-xs text-metallica-blue-600 mt-1">
                        {reportStatus === 'flagged'
                          ? 'Flagging a report indicates issues that need resolution before acceptance.'
                          : 'Please provide specific reasons why this report does not meet requirements.'}
                      </p>
                    </div>
                  )}
                  <StatusBadge color={getStatusBadgeClasses(reportStatus)} className="p-3 w-full flex items-center justify-center mt-4">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={getStatusIcon(reportStatus)} className="mr-2" />
                      <span className="font-medium">
                        {reportStatus === 'pending' && 'Report will remain under review'}
                        {reportStatus === 'accepted' && 'Report will be marked as accepted'}
                        {reportStatus === 'rejected' && 'Report will be returned to student with feedback'}
                        {reportStatus === 'flagged' && 'Report will be flagged for specific issues'}
                      </span>
                    </div>
                  </StatusBadge>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSaveFeedback}
                disabled={isSaving || (showStatusReasonField && !statusChangeReason.trim())}
                className={`flex items-center px-4 py-2 rounded ${isSaving || savedFeedback || (showStatusReasonField && !statusChangeReason.trim())
                    ? 'bg-metallica-blue-400 cursor-not-allowed'
                    : 'bg-metallica-blue-600 hover:bg-metallica-blue-700'
                  } text-white transition-colors`}
              >
                <FontAwesomeIcon icon={savedFeedback ? faCheckCircle : faSave} className="mr-2" />
                <span>{getButtonText()}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 pt-6 border-t border-metallica-blue-200">
            <div className="max-w-lg mx-auto p-6 border-2 border-dashed border-metallica-blue-300 rounded-lg bg-transparent">
              <StatusBadge color={getStatusBadgeClasses(report.status)} className="mb-4 w-full flex items-center justify-center">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={getStatusIcon(report.status)} className="mr-2" />
                  <span className="font-medium text-lg">{report.status.toUpperCase()}</span>
                </div>
              </StatusBadge>
              <div className="mb-3 p-3 border border-metallica-blue-200 rounded bg-white/40">
                <div className="text-metallica-blue-800 font-semibold mb-1">Faculty Feedback</div>
                <div className="text-metallica-blue-700 text-sm">{mockFeedback}</div>
              </div>
              {mockReason && (
                <div className="p-3 border border-metallica-blue-200 rounded bg-white/40">
                  <div className="text-metallica-blue-800 font-semibold mb-1">Reason</div>
                  <div className="text-metallica-blue-700 text-sm">{mockReason}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}