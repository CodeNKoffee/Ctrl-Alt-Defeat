"use client";
import { useState } from 'react';
import Filter from './Filter'; // Add this import

export default function InternshipReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealMessage, setAppealMessage] = useState("");

  const [reports] = useState([
    {
      id: 1,
      internName: "David Lee",
      internshipTitle: "Backend Developer",
      status: "flagged",
      comments: "Report needs more detailed documentation of implemented features."
    },
    {
      id: 2, 
      internName: "Sarah Wilson",
      internshipTitle: "Frontend Developer",
      status: "rejected",
      comments: "Missing essential project milestones and outcomes."
    },
    {
      id: 3,
      internName: "John Smith",
      internshipTitle: "Full Stack Developer",
      status: "accepted",
      comments: "Excellent work and detailed documentation."
    }
  ]);

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.internName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.internshipTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ||
      filter === report.status;
    
    return matchesSearch && matchesFilter;
  });

  const handleViewComments = (report) => {
    setSelectedReport(report);
    setShowCommentsModal(true);
  };

  const handleAppeal = (report) => {
    setSelectedReport(report);
    setShowAppealModal(true);
  };

  const handleSubmitAppeal = () => {
    console.log(`Submitting appeal for report ${selectedReport.id}:`, appealMessage);
    
    // Update report status locally
    const updatedReports = reports.map(report => {
      if (report.id === selectedReport.id) {
        return {
          ...report,
          appealStatus: 'pending'
        };
      }
      return report;
    });

    setReports(updatedReports);
    setAppealMessage("");
    setShowAppealModal(false);
    setSelectedReport(null);
  };

  // Modify the filter options array to remove duplicate "All" option
  const filterOptions = [
    'Flagged',
    'Rejected',
    'Accepted'
  ];

  // Modify the filter handler to work with the placeholder as the "All" option
  const handleFilterChange = (value) => {
    setFilter(value ? value.toLowerCase() : 'all');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#2A5F74] mb-6">Internship Reports</h1>
      
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search Bar */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-4 pr-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#318FA8] focus:border-transparent text-sm"
          />
        </div>
        
        {/* Filter Component */}
        <div className="min-w-[200px]">
          <Filter
            options={filterOptions}
            selectedValue={filter === 'all' ? '' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            onChange={handleFilterChange}
            label="Status"
            placeholder="All Reports"
            id="status-filter"
          />
        </div>
      </div>

      {/* Comments Modal */}
      {showCommentsModal && selectedReport && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="text-xl font-bold text-[#2A5F74] mb-4">Report Comments</h2>
            <div className="comment-box">
              {selectedReport.comments}
            </div>
            <div className="modal-actions">
              <button 
                onClick={() => setShowCommentsModal(false)}
                className="button-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appeal Modal */}
      {showAppealModal && selectedReport && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="text-xl font-bold text-[#2A5F74] mb-4">Submit Appeal</h2>
            <textarea
              value={appealMessage}
              onChange={(e) => setAppealMessage(e.target.value)}
              placeholder="Enter your appeal message..."
              rows="4"
              className="appeal-textarea"
            />
            <div className="modal-actions">
              <button 
                onClick={handleSubmitAppeal}
                disabled={!appealMessage.trim()}
                className="button-primary"
              >
                Submit Appeal
              </button>
              <button 
                onClick={() => {
                  setShowAppealModal(false);
                  setAppealMessage("");
                }}
                className="button-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="reports-list">
        {filteredReports.map((report) => (
          <div key={report.id} className="report-card">
            <div className="report-info">
              <h3 className="text-lg font-semibold text-[#2A5F74]">{report.internName}</h3>
              <p className="text-gray-600">{report.internshipTitle}</p>
              <p className={`status ${report.status}`}>
                {report.status.toUpperCase()}
              </p>
            </div>
            <div className="report-actions">
              {(report.status === "flagged" || report.status === "rejected") && (
                <button
                  onClick={() => handleViewComments(report)}
                  className="view-comments-btn"
                >
                  View Comments
                </button>
              )}
              {(report.status === "flagged" || report.status === "rejected") && !report.appealStatus && (
                <button
                  onClick={() => handleAppeal(report)}
                  className="appeal-btn"
                >
                  Appeal Report
                </button>
              )}
              {report.appealStatus === 'pending' && (
                <span className="appeal-pending">Appeal Pending</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 24px;
          border-radius: 16px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .modal-content:hover {
          transform: translateY(-2px);
        }

        .comment-box {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .appeal-textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #318FA8;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 14px;
          resize: vertical;
          min-height: 100px;
          transition: border-color 0.3s ease;
        }

        .appeal-textarea:focus {
          outline: none;
          border-color: #2A5F74;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .button-primary, .button-secondary {
          padding: 10px 20px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .button-primary {
          background-color: #318FA8;
          color: white;
        }

        .button-primary:hover {
          background-color: #2A7A8C;
          transform: translateY(-1px);
        }

        .button-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .button-secondary {
          background-color: #C41E3A;
          color: white;
        }

        .button-secondary:hover {
          background-color: #A01830;
          transform: translateY(-1px);
        }

        .reports-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .report-card {
          background: white;
          padding: 20px;
          border-radius: 16px;
          border: 2px solid #318FA8;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .report-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          background-color: #f8f9fa;
        }

        .status {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          margin-top: 8px;
          transition: all 0.3s ease;
        }

        .status.flagged {
          background-color: #318FA8;
          color: white;
        }

        .status.rejected {
          background-color: #C41E3A;
          color: white;
        }

        .status.accepted {
          background-color: #4CAF50;
          color: white;
        }

        .view-comments-btn, .appeal-btn {
          padding: 8px 16px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .view-comments-btn {
          background-color: #318FA8;
          margin-right: 8px;
        }

        .view-comments-btn:hover {
          background-color: #2A7A8C;
          transform: translateY(-1px);
        }

        .appeal-btn {
          background-color: #C41E3A;
        }

        .appeal-btn:hover {
          background-color: #A01830;
          transform: translateY(-1px);
        }

        .appeal-pending {
          color: #318FA8;
          font-style: italic;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}