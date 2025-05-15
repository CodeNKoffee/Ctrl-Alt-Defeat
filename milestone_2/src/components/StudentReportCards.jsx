import { useState } from "react";
import { facultyScadReports } from "../../constants/mockData";
import ReportViewer from "@/components/ReportViewer";
import { FaEdit, FaTrash } from "react-icons/fa";
import ReportStatistics from "@/components/ReportStatistics";
import ReportCreationDashboard from "./ReportCreationDashboard";

export default function StudentReportCards() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeTab, setActiveTab] = useState("submitted");
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [editingDraftIndex, setEditingDraftIndex] = useState(null);
  const [editingDraftData, setEditingDraftData] = useState(null);
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealMessage, setAppealMessage] = useState("");

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

  if (editingDraftIndex !== null && editingDraftData) {
    return (
      <ReportCreationDashboard
        onAddTile={handleSaveDraft}
        onCancel={handleCancelEdit}
        initialReport={editingDraftData}
        hideTitle={true}
        showSaveDraftButton={true}
      />
    );
  }

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-6xl">
        {/* System info box like SCAD reports */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-metallica-blue-200">
          <h2 className="text-2xl font-semibold text-[#2a5f74] mb-4">Student Report Management System</h2>
          <p className="text-gray-700 mb-2">
            Welcome to your Student Report Dashboard. Here you can:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>View all your submitted and draft internship reports</li>
            <li>Track the status of your submitted reports</li>
            <li>Preview, update, or delete your draft reports</li>
            <li>Open submitted reports to see details and feedback</li>
          </ul>
          <p className="text-[#2a5f74] font-medium">
            {submittedReports.filter(r => r.status === 'flagged').length} of your reports are currently flagged and {submittedReports.filter(r => r.status === 'rejected').length} are rejected and require attention.
          </p>
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
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      report.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      report.status === 'flagged' ? 'bg-orange-100 text-orange-700' :
                      report.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {report.status?.toUpperCase()}
                    </span>
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
                    className="mt-2 self-end px-4 py-1 bg-metallica-blue-600 text-white rounded-full text-xs font-semibold hover:bg-metallica-blue-700 transition"
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
                          <button
                            onClick={() => handleAppeal(selectedReport)}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition shadow-sm hover:shadow-md flex items-center"
                          >
                            Make an Appeal
                          </button>
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
                    <button className="text-red-500 hover:text-red-700 p-1" title="Delete" onClick={() => setDeleteIndex(idx)}>
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
                    className="mt-2 self-end px-4 py-1 bg-metallica-blue-600 text-white rounded-full text-xs font-semibold hover:bg-metallica-blue-700 transition"
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
                          <button
                            onClick={() => handleAppeal(selectedReport)}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition shadow-sm hover:shadow-md flex items-center"
                          >
                            Make an Appeal
                          </button>
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
              <button 
                onClick={() => {
                  setShowAppealModal(false);
                  setAppealMessage("");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitAppeal}
                disabled={!appealMessage.trim()}
                className="px-4 py-2 bg-metallica-blue-600 text-white rounded-lg font-semibold hover:bg-metallica-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Appeal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
