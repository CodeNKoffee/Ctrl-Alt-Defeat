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
import DeleteTileConfirmation from "./DeleteTileConfirmation";
import { useTranslation } from "react-i18next";
import { createSafeT } from "@/lib/translationUtils";
import { motion, AnimatePresence } from 'framer-motion';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export default function StudentReportCards() {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const reportStatusTooltipMessages = {
    accepted: safeT('student.dashboard.reportCards.statusTooltips.accepted'),
    pending: safeT('student.dashboard.reportCards.statusTooltips.pending'),
    flagged: safeT('student.dashboard.reportCards.statusTooltips.flagged'),
    rejected: safeT('student.dashboard.reportCards.statusTooltips.rejected'),
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
  const [showAppealSuccess, setShowAppealSuccess] = useState(false);

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
    setSelectedReport(prev => ({ ...prev, appealStatus: 'pending' }));
    setShowAppealSuccess(true);
    setTimeout(() => setShowAppealSuccess(false), 1500);
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
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-6xl px-2">
        <div className="w-full max-w-6xl mb-8 mx-auto">
          <h1 className="text-3xl font-bold mb-0 ltr:text-left rtl:text-right text-[#2a5f74] relative">
            {safeT('student.dashboard.titles.my-reports')}
            <span className="absolute bottom-0 ltr:left-0 rtl:right-0 w-16 h-1 bg-[#2a5f74]"></span>
          </h1>
        </div>
        {/* System info box like SCAD reports */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border border-metallica-blue-200">
          <h2 className="text-2xl font-semibold text-[#2a5f74] mb-4">
            {safeT('student.dashboard.myReportsPersonalizedCard.title')}
          </h2>
          <p className="text-gray-700 mb-3">
            {safeT('student.dashboard.myReportsPersonalizedCard.description')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.pending')}
                </span>
                <h3 className="font-medium text-yellow-700">
                  {safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.pendingDescription1')}
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                {safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.pendingDescription2')}
              </p>
            </div>

            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.flagged')}
                </span>
                <h3 className="font-medium text-orange-700">
                  {safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.flaggedDescription1')}
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                {safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.flaggedDescription2')}
              </p>
            </div>

            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.rejected')}
                </span>
                <h3 className="font-medium text-red-700">
                  {safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.rejectedDescription1')}
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                {safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.rejectedDescription2')}
              </p>
            </div>

            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.accepted')}
                </span>
                <h3 className="font-medium text-green-700">
                  {safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.acceptedDescription1')}
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                {safeT('student.dashboard.myReportsPersonalizedCard.howItWorks.acceptedDescription2')}
              </p>
            </div>
          </div>

          <div className="flex items-center mt-2">
            <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mr-2"></div>
            <p className="text-[#2a5f74] font-medium">
              {submittedReports.filter(r => r.status === 'flagged').length} {safeT('student.dashboard.myReportsPersonalizedCard.footer1')} {submittedReports.filter(r => r.status === 'rejected').length} {safeT('student.dashboard.myReportsPersonalizedCard.footer2')}
            </p>
          </div>
        </div>
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
              {safeT('student.dashboard.reportCards.tabs.submitted')}
            </button>
            <button
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${activeTab === 'drafts' ? 'bg-metallica-blue-600 text-white' : 'bg-[#eaf3f7] text-metallica-blue-700'}`}
              onClick={() => setActiveTab('drafts')}
            >
              {safeT('student.dashboard.reportCards.tabs.drafts')}
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
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${report.status === 'accepted' ? 'bg-green-100 text-green-700' :
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
                          <span className="font-semibold text-base mb-1">{safeT('student.dashboard.reportCards.statusInfo')}</span>
                          <span className="text-white text-sm font-normal">{content}</span>
                        </div>
                      )}
                    />
                  </div>
                  <div className="text-xs text-gray-600 mb-0.5">
                    <span className="font-medium">{safeT('student.dashboard.reportCards.company')}:</span> {report.companyName}
                  </div>
                  <div className="text-xs text-gray-600 mb-0.5">
                    <span className="font-medium">{safeT('student.dashboard.reportCards.major')}:</span> {report.studentMajor}
                  </div>
                  <div className="text-xs text-gray-600 mb-0.5">
                    <span className="font-medium">{safeT('student.dashboard.reportCards.submitted')}:</span> {new Date(report.submissionDate).toLocaleDateString()}
                  </div>
                  <div className="text-gray-700 text-xs mt-1 line-clamp-2 whitespace-pre-line">
                    {report.introduction}
                  </div>
                  <button
                    className="mt-2 self-end px-4 py-1 bg-metallica-blue-600 text-white rounded-full text-xs font-semibold hover:bg-metallica-blue-700 transition hover:-translate-y-0.5"
                    onClick={() => setSelectedReport(report)}
                  >
                    {safeT('student.dashboard.reportCards.seeMore')}
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
                            text={safeT('student.dashboard.reportCards.makeAnAppeal')}
                            fullWidth={false}
                          />
                        </div>
                      )}
                      {selectedReport.appealStatus === 'pending' && (
                        <div className="mt-6 text-center">
                          <span className="text-metallica-blue-600 font-semibold italic">{safeT('student.dashboard.reportCards.appealPending')}</span>
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
                            text={safeT('student.dashboard.reportCards.makeAnAppeal')}
                            fullWidth={false}
                          />
                        </div>
                      )}
                      {selectedReport.appealStatus === 'pending' && (
                        <div className="mt-6 text-center">
                          <span className="text-metallica-blue-600 font-semibold italic">{safeT('student.dashboard.reportCards.appealPending')}</span>
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
            <h2 className="text-xl font-bold text-[#2A5F74] mb-4">{safeT('student.dashboard.reportCards.submitAppeal')}</h2>
            <textarea
              value={appealMessage}
              onChange={(e) => setAppealMessage(e.target.value)}
              placeholder={safeT('student.dashboard.reportCards.enterYourAppealMessage')}
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
                text={safeT('student.dashboard.reportCards.cancel')}
                fullWidth={false}
              />
              <CustomButton
                onClick={handleSubmitAppeal}
                disabled={!appealMessage.trim()}
                variant="primary"
                text={safeT('student.dashboard.reportCards.submitAppeal')}
                fullWidth={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Appeal Success Feedback Modal */}
      <AnimatePresence>
        {showAppealSuccess && (
          <motion.div
            className="fixed inset-0 z-[10001] flex items-center justify-center bg-[rgba(42,95,116,0.18)] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <motion.div
                style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: '#22C55E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ fontSize: 32, color: 'white' }}
                  />
                </div>
              </motion.div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2A5F74', marginBottom: '10px' }}>
                {safeT('student.dashboard.reportCards.appealSuccessTitle', 'Appeal Submitted!')}
              </div>
              <div style={{ color: '#333', textAlign: 'center' }}>
                {safeT('student.dashboard.reportCards.appealSuccessMessage', 'Your appeal has been submitted and is pending review.')}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteTileConfirmation
          type="report"
          onConfirm={handleDeleteReport}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
