import { useState } from "react";
import { facultyScadReports } from "../../constants/mockData";
import ReportViewer from "@/components/ReportViewer";
import { FaEdit, FaTrash } from "react-icons/fa";
import ReportStatistics from "@/components/ReportStatistics";
import ReportCreationDashboard from "./ReportCreationDashboard";
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomButton from "./shared/CustomButton";
import { Tooltip } from 'react-tooltip';

export default function StudentReportCards() {
  const reportStatusTooltipMessages = {
  accepted: "Your report has been reviewed and approved by the faculty member. No further action is required for this submission.",
  pending: "Your report has been submitted but not yet reviewed by the responsible faculty member. No action is required at this time.",
  flagged: "Your report requires revisions based on faculty feedback. Review the comments provided and resubmit your updated report.",
  rejected: "Your report did not meet the requirements and cannot be resubmitted. See faculty comments for explanation and guidance on next steps.",
};
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeTab, setActiveTab] = useState("submitted");
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [editingDraftIndex, setEditingDraftIndex] = useState(null);
  const [editingDraftData, setEditingDraftData] = useState(null);
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealMessage, setAppealMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Use one accepted and one pending as drafts, rest as submitted
  const reports = Object.values(facultyScadReports);
  const acceptedDraft = reports.find(r => r.status === 'accepted');
  const pendingDraft = reports.find(r => r.status === 'pending');
  const [draftReports, setDraftReports] = useState([
    acceptedDraft ? { ...acceptedDraft, status: 'draft' } : null,
    pendingDraft ? { ...pendingDraft, status: 'draft' } : null
  ].filter(Boolean));
  const submittedReports = reports.filter(r =>
    !(acceptedDraft && r.id === acceptedDraft.id) &&
    !(pendingDraft && r.id === pendingDraft.id)
  );

  // Handler for saving edited draft
  const handleSaveDraft = (updatedDraft) => {
    setDraftReports(prev => prev.map((r, i) => i === editingDraftIndex ? updatedDraft : r));
    setEditingDraftIndex(null);
    setEditingDraftData(null);
  };

  // Handler for canceling edit
  const handleCancelEdit = () => {
    setEditingDraftIndex(null);
    setEditingDraftData(null);
  };
  
  // Handler for opening appeal modal
  const handleAppeal = (report) => {
    setSelectedReport(report);
    setShowAppealModal(true);
  };

  // Handler for submitting appeal
  const handleSubmitAppeal = () => {
    console.log(`Submitting appeal for report ${selectedReport.id}:`, appealMessage);
    
    // Update report status locally
    const updatedSubmittedReports = submittedReports.map(report => {
      if (report.id === selectedReport.id) {
        return {
          ...report,
          appealStatus: 'pending'
        };
      }
      return report;
    });
    
    setShowAppealModal(false);
    setAppealMessage("");
    setSelectedReport(prev => ({...prev, appealStatus: 'pending'}));
  };

  // Handler for deleting a report
  const handleDeleteReport = () => {
    setDraftReports(prev => prev.filter((_, i) => i !== deleteIndex));
    setDeleteIndex(null);
    setShowDeleteConfirm(false);
  };

  if (editingDraftIndex !== null && editingDraftData) {
    return (
      <ReportCreationDashboard
        onAddTile={handleSaveDraft}
        onCancel={handleCancelEdit}
        initialReport={editingDraftData}
        hideTitle={true}
        showSaveDraftButton={true}
        isEditMode={true}
      />
    );
  }

  return (
    <div className="w-full mx-auto">
      <div className="w-full">
        {/* System info box like SCAD reports */}
      
        {/* Statistics (no background) */}
        <ReportStatistics
          total={submittedReports.length}
          accepted={submittedReports.filter(r => r.status === 'accepted').length}
          pending={submittedReports.filter(r => r.status === 'pending').length}
          flagged={submittedReports.filter(r => r.status === 'flagged').length}
          rejected={submittedReports.filter(r => r.status === 'rejected').length}
        />
        <div className="rounded-2xl shadow-md p-6" style={{ background: '#f4fafd' }}>
          <div className="mb-6 flex gap-4">
            <button
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${activeTab === 'submitted' ? 'bg-metallica-blue-600 text-white' : 'bg-[#eaf3f7] text-metallica-blue-700'}`}
              onClick={() => setActiveTab('submitted')}
            >
              Submitted Reports
            </button>
            <button
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${activeTab === 'drafts' ? 'bg-metallica-blue-600 text-white' : 'bg-[#eaf3f7] text-metallica-blue-700'}`}
              onClick={() => setActiveTab('drafts')}
            >
              Saved as Drafts
            </button>
          </div>
          {activeTab === 'submitted' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 mt-0">
              {submittedReports.map((report, idx) => (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-2 border border-gray-100 hover:shadow-lg transition relative min-h-[180px] w-full max-w-[320px] mx-auto"
                  style={{ minHeight: '200px', width: '100%' }}
                >
                  <div className="pt-8" />
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-metallica-blue-800 truncate max-w-[70%]">{report.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        report.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        report.status === 'flagged' ? 'bg-orange-100 text-orange-700' :
                        report.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}
                      data-tooltip-id={`report-status-tooltip-${report.id}`}
                      data-tooltip-content={reportStatusTooltipMessages[report.status]}
                      style={{ cursor: 'pointer' }}
                    >
                      {report.status?.toUpperCase()}
                    </span>
                    <Tooltip
                      id={`report-status-tooltip-${report.id}`}
                      className="!bg-[#2a5f74] !text-white !border-0 !rounded-xl !shadow-xl !px-4 !py-2 !text-sm !font-normal !leading-snug !min-w-[200px] !max-w-[260px] !transition-all"
                      style={{
                        background: '#2a5f74',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '0.75rem',
                        boxShadow: '0 8px 32px 0 rgba(42,95,116,0.18)',
                        padding: '0.5rem 1rem',
                        fontSize: '0.95rem',
                        minWidth: '200px',
                        maxWidth: '260px',
                        fontWeight: 400,
                        zIndex: 9999
                      }}
                      arrowColor="#2a5f74"
                      render={({ content }) => (
                        <div className="flex flex-col">
                          <span className="font-semibold text-base mb-1">Status Info</span>
                          <span className="text-white text-sm font-normal">{content}</span>
                        </div>
                      )}
                    />
                  </div>
                  <div className="text-xs text-gray-600 mb-0.5">
                    <span className="font-medium">Company:</span> {report.companyName}
                  </div>
                  <div className="text-xs text-gray-600 mb-0.5">
                    <span className="font-medium">Major:</span> {report.studentMajor}
                  </div>
                  <div className="text-xs text-gray-600 mb-0.5">
                    <span className="font-medium">Submitted:</span> {new Date(report.submissionDate).toLocaleDateString()}
                  </div>
                  <div className="text-gray-700 text-xs mt-1 line-clamp-2 whitespace-pre-line">
                    {report.introduction}
                  </div>
                  <button
                    className="mt-2 self-end px-4 py-1 bg-metallica-blue-600 text-white rounded-full text-xs font-semibold hover:bg-metallica-blue-700 transition hover:-translate-y-0.5"
                    onClick={() => setSelectedReport(report)}
                  >
                    See More
                  </button>
                </div>
              ))}
              {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative">
                    <button
                      className="absolute top-4 right-4 text-gray-500 hover:text-metallica-blue-700 text-2xl font-bold"
                      onClick={() => setSelectedReport(null)}
                    >
                      &times;
                    </button>
                    <div>
                      <ReportViewer report={selectedReport} userType="student" />
                      
                      {/* Add Make an Appeal button for flagged or rejected reports */}
                      {(selectedReport.status === "flagged" || selectedReport.status === "rejected") && !selectedReport.appealStatus && (
                        <div className="mt-6 flex justify-end">
                          <CustomButton
                            onClick={() => handleAppeal(selectedReport)}
                            variant="danger"
                            text="Make an Appeal"
                            fullWidth={false}
                          />
                        </div>
                      )}
                      {selectedReport.appealStatus === 'pending' && (
                        <div className="mt-6 text-center">
                          <span className="text-metallica-blue-600 font-semibold italic">Appeal Pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'drafts' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 mt-0">
              {draftReports.map((report, idx) => (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-2 border border-gray-100 hover:shadow-lg transition relative min-h-[180px] w-full max-w-[320px] mx-auto"
                  style={{ minHeight: '200px', width: '100%' }}
                >
                  {/* Draft badge at top-left */}
                  <div className="absolute top-0 left-0 bg-amber-100 text-amber-800 px-3 py-1 text-xs font-semibold z-20 rounded-tl-xl rounded-br-xl shadow-sm select-none">
                    Draft
                  </div>
                  {/* Edit/Delete icons at top-right, styled like evaluation cards */}
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button className="text-[#3298BA] hover:text-[#65bedc] p-1" title="Edit" onClick={() => { setEditingDraftIndex(idx); setEditingDraftData(report); }}>
                      <FaEdit size={18} />
                    </button>
                    <button className="text-red-500 hover:text-red-700 p-1" title="Delete" onClick={() => setShowDeleteConfirm(true)}>
                      <FaTrash size={18} />
                    </button>
                  </div>
                  <div className="pt-8" />
                  <div className="flex items-center mb-1">
                    <h3 className="text-lg font-bold text-metallica-blue-800 truncate max-w-full">{report.title}</h3>
                  </div>
                  <div className="text-xs text-gray-600 mb-0.5">
                    <span className="font-medium">Company:</span> {report.companyName}
                  </div>
                  <div className="text-xs text-gray-600 mb-0.5">
                    <span className="font-medium">Major:</span> {report.studentMajor}
                  </div>
                  <div className="text-xs text-gray-600 mb-0.5">
                    <span className="font-medium">Saved:</span> {new Date(report.submissionDate).toLocaleDateString()}
                  </div>
                  <div className="text-gray-700 text-xs mt-1 line-clamp-2 whitespace-pre-line">
                    {report.introduction}
                  </div>
                  <button
                    className="mt-2 self-end px-4 py-1 bg-metallica-blue-600 text-white rounded-full text-xs font-semibold hover:bg-metallica-blue-700 transition hover:-translate-y-0.5"
                    onClick={() => setSelectedReport({ ...report, _draft: true })}
                  >
                    See More
                  </button>
                </div>
              ))}
              {selectedReport && selectedReport._draft && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative">
                    <button
                      className="absolute top-4 right-4 text-gray-500 hover:text-metallica-blue-700 text-2xl font-bold"
                      onClick={() => setSelectedReport(null)}
                    >
                      &times;
                    </button>
                    <div>
                      <ReportViewer report={selectedReport} userType="student-draft" />
                      
                      {/* Add Make an Appeal button for flagged or rejected draft reports */}
                      {(selectedReport.status === "flagged" || selectedReport.status === "rejected") && !selectedReport.appealStatus && (
                        <div className="mt-6 flex justify-end">
                          <CustomButton
                            onClick={() => handleAppeal(selectedReport)}
                            variant="danger"
                            text="Make an Appeal"
                            fullWidth={false}
                          />
                        </div>
                      )}
                      {selectedReport.appealStatus === 'pending' && (
                        <div className="mt-6 text-center">
                          <span className="text-metallica-blue-600 font-semibold italic">Appeal Pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Appeal Modal */}
      {showAppealModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-metallica-blue-700 text-2xl font-bold"
              onClick={() => {
                setShowAppealModal(false);
                setAppealMessage("");
              }}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-[#2A5F74] mb-4">Submit Appeal</h2>
            <textarea
              value={appealMessage}
              onChange={(e) => setAppealMessage(e.target.value)}
              placeholder="Enter your appeal message..."
              rows="4"
              className="w-full p-4 border-2 border-metallica-blue-300 rounded-lg mb-4 resize-vertical min-h-[100px] focus:outline-none focus:ring-2 focus:ring-metallica-blue-500"
            />
            <div className="flex justify-end gap-3">
              <CustomButton
                onClick={() => {
                  setShowAppealModal(false);
                  setAppealMessage("");
                }}
                variant="danger"
                text="Cancel"
                fullWidth={false}
              />
              <CustomButton
                onClick={handleSubmitAppeal}
                disabled={!appealMessage.trim()}
                variant="primary"
                text="Submit Appeal"
                fullWidth={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl transform text-left p-6">
            {/* Close button - styled like CallModal */}
            <button
              className="absolute top-3 right-3 z-20 flex items-center justify-center w-8 h-8 rounded-full shadow-sm bg-gray-100 hover:bg-gray-200/90 transition-colors"
              onClick={() => setShowDeleteConfirm(false)}
              aria-label="Close modal"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl text-gray-500 font-normal" />
            </button>
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Confirm Delete</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this report draft? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <CustomButton
                variant="primary"
                text="Cancel"
                onClick={() => setShowDeleteConfirm(false)}
              />
              <CustomButton
                variant="danger"
                text="Delete"
                onClick={handleDeleteReport}
                icon={faTrash}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
