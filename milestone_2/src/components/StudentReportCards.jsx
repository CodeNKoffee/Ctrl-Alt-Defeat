import { useState } from "react";
import { facultyScadReports } from "../../constants/mockData";
import ReportViewer from "@/components/ReportViewer";
import { FaEdit, FaTrash } from "react-icons/fa";
import ReportStatistics from "@/components/ReportStatistics";

export default function StudentReportCards() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeTab, setActiveTab] = useState("submitted");
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // Use one accepted and one pending as drafts, rest as submitted
  const reports = Object.values(facultyScadReports);
  const acceptedDraft = reports.find(r => r.status === 'accepted');
  const pendingDraft = reports.find(r => r.status === 'pending');
  const draftReports = [
    acceptedDraft ? { ...acceptedDraft, status: 'draft' } : null,
    pendingDraft ? { ...pendingDraft, status: 'draft' } : null
  ].filter(Boolean);
  const submittedReports = reports.filter(r =>
    !(acceptedDraft && r.id === acceptedDraft.id) &&
    !(pendingDraft && r.id === pendingDraft.id)
  );

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
                    <ReportViewer report={selectedReport} userType="student" />
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
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button className="text-metallica-blue-600 hover:text-metallica-blue-800 bg-metallica-blue-50 hover:bg-metallica-blue-100 p-1 rounded-full transition" title="Edit" onClick={() => setEditIndex(idx)}>
                      <FaEdit size={18} />
                    </button>
                    <button className="text-[#C41E3A] hover:text-white bg-red-100 hover:bg-[#C41E3A] p-1 rounded-full transition" title="Delete" onClick={() => setDeleteIndex(idx)}>
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
                    <ReportViewer report={selectedReport} userType="student-draft" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
