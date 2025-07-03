"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSearch, faUser, faBuilding, faXmark, faChevronDown, faChevronUp, faEnvelope, faPhone, faCalendarAlt, faMapMarkerAlt, faGraduationCap, faLink, faCheckCircle, faTimesCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import StatusBadge from './shared/StatusBadge';
import CustomButton from './shared/CustomButton';
import { toast } from 'react-toastify';

// Mock applications data
const MOCK_APPLICATIONS = [
  {
    id: 1,
    internshipId: 1,
    internshipTitle: "Frontend Developer Intern",
    studentName: "Sarah Johnson",
    studentEmail: "sarah.johnson@example.com",
    studentPhone: "+20 123 456 7890",
    studentUniversity: "German University in Cairo",
    studentMajor: "Media Engineering & Technology",
    studentSemester: "Spring 2024",
    appliedDate: "2024-04-10",
    resumeLink: "https://example.com/resume",
    coverLetterLink: "https://example.com/coverletter",
    portfolioLink: "https://example.com/portfolio",
    status: "pending" // pending, accepted, rejected, finalized, current, completed
  },
  {
    id: 2,
    internshipId: 2,
    internshipTitle: "UI/UX Design Intern",
    studentName: "Mohammed Ahmed",
    studentEmail: "mohammed.ahmed@example.com",
    studentPhone: "+20 123 456 7891",
    studentUniversity: "American University in Cairo",
    studentMajor: "Computer Science",
    studentSemester: "Fall 2023",
    appliedDate: "2024-04-05",
    resumeLink: "https://example.com/resume",
    coverLetterLink: "https://example.com/coverletter",
    portfolioLink: "https://example.com/portfolio",
    status: "accepted"
  },
  {
    id: 3,
    internshipId: 1,
    internshipTitle: "Frontend Developer Intern",
    studentName: "Omar Farouq",
    studentEmail: "omar.farouq@example.com",
    studentPhone: "+20 123 456 7892",
    studentUniversity: "Cairo University",
    studentMajor: "Software Engineering",
    studentSemester: "Spring 2024",
    appliedDate: "2024-04-08",
    resumeLink: "https://example.com/resume",
    coverLetterLink: "https://example.com/coverletter",
    portfolioLink: null,
    status: "finalized"
  },
  {
    id: 4,
    internshipId: 3,
    internshipTitle: "Backend Developer Intern",
    studentName: "Fatma Mostafa",
    studentEmail: "fatma.mostafa@example.com",
    studentPhone: "+20 123 456 7893",
    studentUniversity: "Ain Shams University",
    studentMajor: "Computer Engineering",
    studentSemester: "Fall 2023",
    appliedDate: "2024-04-02",
    resumeLink: "https://example.com/resume",
    coverLetterLink: "https://example.com/coverletter",
    portfolioLink: "https://example.com/portfolio",
    status: "rejected"
  },
  {
    id: 5,
    internshipId: 4,
    internshipTitle: "Data Analyst Intern",
    studentName: "Ali Hassan",
    studentEmail: "ali.hassan@example.com",
    studentPhone: "+20 123 456 7894",
    studentUniversity: "GUC",
    studentMajor: "Data Science",
    studentSemester: "Spring 2023",
    appliedDate: "2024-04-01",
    resumeLink: "https://example.com/resume",
    coverLetterLink: "https://example.com/coverletter",
    portfolioLink: "https://example.com/portfolio",
    status: "current"
  },
  {
    id: 6,
    internshipId: 5,
    internshipTitle: "Marketing Intern",
    studentName: "Nour Mohamed",
    studentEmail: "nour.mohamed@example.com",
    studentPhone: "+20 123 456 7895",
    studentUniversity: "British University in Egypt",
    studentMajor: "Marketing",
    studentSemester: "Fall 2022",
    appliedDate: "2024-03-28",
    resumeLink: "https://example.com/resume",
    coverLetterLink: "https://example.com/coverletter",
    portfolioLink: null,
    status: "completed"
  }
];

// Mock internships data
const MOCK_INTERNSHIPS = [
  { id: 1, title: "Frontend Developer Intern" },
  { id: 2, title: "UI/UX Design Intern" },
  { id: 3, title: "Backend Developer Intern" },
  { id: 4, title: "Data Analyst Intern" },
  { id: 5, title: "Marketing Intern" }
];

// Status configuration with colors and available transitions
const STATUS_CONFIG = {
  pending: {
    label: "PENDING",
    color: "bg-yellow-100 text-yellow-800 border border-yellow-400",
    badgeColor: "bg-yellow-600",
    transitions: ["accepted", "rejected"]
  },
  accepted: {
    label: "ACCEPTED",
    color: "bg-green-100 text-green-800 border border-green-400",
    badgeColor: "bg-green-600",
    transitions: ["finalized", "rejected"]
  },
  rejected: {
    label: "REJECTED",
    color: "bg-red-100 text-red-800 border border-red-400",
    badgeColor: "bg-red-600",
    transitions: []
  },
  finalized: {
    label: "FINALIZED",
    color: "bg-purple-100 text-purple-800 border border-purple-400",
    badgeColor: "bg-purple-600",
    transitions: ["current"]
  },
  current: {
    label: "CURRENT INTERN",
    color: "bg-blue-100 text-blue-800 border border-blue-400",
    badgeColor: "bg-blue-600",
    transitions: ["completed"]
  },
  completed: {
    label: "COMPLETED",
    color: "bg-green-100 text-green-800 border border-green-400",
    badgeColor: "bg-green-600",
    transitions: []
  }
};

export default function ApplicationsList({
  searchTerm = '',
  selectedStatus = 'all',
  selectedInternship = 'all'
}) {
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedStatusLocal, setSelectedStatusLocal] = useState(selectedStatus);

  // Update local state if prop changes
  useEffect(() => {
    setSelectedStatusLocal(selectedStatus);
  }, [selectedStatus]);

  // Statuses to display (all 6 for ApplicationsList)
  const displayStatuses = [
    'pending', 'accepted', 'finalized', 'rejected', 'current', 'completed'
  ];

  // Filter applications based on search term, status, and internship
  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.internshipTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatusLocal === 'all' || app.status === selectedStatusLocal;
    const matchesInternship = selectedInternship === 'all' || app.internshipId === parseInt(selectedInternship);

    return matchesSearch && matchesStatus && matchesInternship;
  });

  // Handle application selection
  const handleSelectApplication = (application) => {
    if (selectedApplication && selectedApplication.id === application.id) {
      setSelectedApplication(null);
    } else {
      setSelectedApplication(application);
    }
  };

  // Handle status change
  const handleStatusChange = (applicationId, newStatus) => {
    setApplications(prevApplications =>
      prevApplications.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    );

    // Update the selected application if it's currently selected
    if (selectedApplication && selectedApplication.id === applicationId) {
      setSelectedApplication(prev => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Filter Pills */}
      {/* <div className="w-full max-w-6xl mx-auto mb-6">
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setSelectedStatusLocal('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium h-[38px] transition-all ${selectedStatusLocal === 'all'
              ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#5DB2C7]'
              : 'bg-white text-gray-600 border-2 border-gray-300 hover:bg-gray-50'
              }`}
          >
            ALL
          </button>
          {displayStatuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatusLocal(status)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium h-[38px] transition-all ${selectedStatusLocal === status
                ? STATUS_CONFIG[status].color.replace('border ', 'border-2 ') // ensure border thickness matches
                : 'bg-white text-gray-600 border-2 border-gray-300 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center">
                {selectedStatusLocal === status && (
                  <span className={`inline-block w-2 h-2 rounded-full ${STATUS_CONFIG[status].badgeColor} mr-1.5`}></span>
                )}
                {STATUS_CONFIG[status].label}
              </div>
            </button>
          ))}
        </div>
      </div> */}
      {filteredApplications.length === 0 ? (
        <div className="p-16 text-center">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No applications found matching your criteria</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        filteredApplications.map(application => (
          <div
            key={application.id}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden
              transition-[background,border,box-shadow,backdrop-filter] duration-300 ease-in-out 
              group hover:border-metallica-blue-300 hover:backdrop-blur-sm hover:bg-white/90 
              ${selectedApplication?.id === application.id
                ? 'ring-2 ring-[#5DB2C7] shadow-md'
                : 'hover:shadow-md'
              }`}
          >
            {/* Application summary row */}
            <div
              className="p-4 cursor-pointer flex flex-wrap md:flex-nowrap items-center gap-4 transition-all duration-300 ease-in-out group-hover:bg-gray-50"
              onClick={() => handleSelectApplication(application)}
            >
              {/* Student icon/avatar */}
              <div className="w-12 h-12 rounded-full bg-metallica-blue-100 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
                <FontAwesomeIcon icon={faUser} className="text-metallica-blue-700 text-xl" />
              </div>

              {/* Student info */}
              <div className="flex-1 min-w-0 md:w-1/3 lg:w-2/5">
                <h3 className="font-semibold text-gray-800 truncate group-hover:text-metallica-blue-800 transition-all duration-300">
                  {application.studentName}
                </h3>
                <p className="text-sm text-gray-600 truncate group-hover:text-gray-700 transition-colors duration-300">
                  {application.internshipTitle}
                </p>
              </div>

              {/* University - HIDDEN as per user request */}
              <div className="hidden md:hidden lg:hidden w-0 md:w-1/4 lg:w-1/5 flex-shrink-0"> {/* Effectively hidden across all sizes */}
                <p className="text-sm text-gray-600 truncate">{application.studentUniversity}</p>
                <p className="text-xs text-gray-500 truncate">{application.studentMajor}</p>
              </div>

              {/* Applied date - Adjusting width since University is hidden */}
              <div className="hidden md:block md:w-1/3 lg:w-1/4 flex-shrink-0">
                <p className="text-xs text-gray-500">Applied on</p>
                <p className="text-sm text-gray-600">
                  {new Date(application.appliedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {/* Status badge - Adjusting width since University is hidden */}
              <div className="flex-shrink-0 md:w-auto lg:w-1/4 text-right"> {/* Added text-right for better alignment of badge content */}
                <StatusBadge color={STATUS_CONFIG[application.status].color}>
                  <span className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${STATUS_CONFIG[application.status].badgeColor} mr-1.5`}></span>
                    {STATUS_CONFIG[application.status].label}
                  </span>
                </StatusBadge>
              </div>

              {/* Expand/Collapse icon */}
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-gray-400 ml-2 flex-shrink-0 transition-transform duration-500 ease-in-out 
                  ${selectedApplication?.id === application.id ? 'rotate-180' : 'rotate-0'}`}
              />
            </div>

            {/* Expanded application details - NEW outer wrapper for accordion animation */}
            <div
              className={`
                overflow-hidden transition-all duration-[1100ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                transform-gpu
                ${selectedApplication?.id === application.id ? 'max-h-[1000px]' : 'max-h-0'}
              `}
            >
              <div
                className={`
                  px-4 pt-4 pb-6 
                  bg-gray-50 border-t border-gray-200 
                  flex flex-col md:flex-row 
                  transition-opacity duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                  ${selectedApplication?.id === application.id ? 'opacity-100 delay-500' : 'opacity-0'}
                `}
              >
                {/* Left column - Student details (removed animate-slideInFromLeft and py-4) */}
                <div className="flex-1 md:pr-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Applicant Details</h4>

                  <div className="space-y-2">
                    <div className="flex items-center group">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 transition-transform duration-300 group-hover:scale-110">
                        <FontAwesomeIcon icon={faEnvelope} className="text-blue-500" />
                      </div>
                      <a href={`mailto:${application.studentEmail}`} className="text-sm text-metallica-blue-600 hover:underline transition-colors duration-300 hover:text-metallica-blue-800">
                        {application.studentEmail}
                      </a>
                    </div>

                    <div className="flex items-center group">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2 transition-transform duration-300 group-hover:scale-110">
                        <FontAwesomeIcon icon={faPhone} className="text-green-500" />
                      </div>
                      <p className="text-sm text-gray-700">{application.studentPhone}</p>
                    </div>

                    <div className="flex items-center group">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2 transition-transform duration-300 group-hover:scale-110">
                        <FontAwesomeIcon icon={faGraduationCap} className="text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">Major: {application.studentMajor}</p>
                        <p className="text-xs text-gray-500">Semester: {application.studentSemester || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-gray-700 mb-3 mt-4">Application Documents</h4>

                  <div className="space-y-2">
                    <a
                      href={application.resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-metallica-blue-600 hover:text-metallica-blue-800 group"
                      onClick={e => {
                        e.preventDefault();
                        toast.success('PDF download has started for the resume of the applicant', {
                          position: 'top-right',
                          autoClose: 3000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: 'light',
                        });
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2 transition-transform duration-300 group-hover:scale-110">
                        <FontAwesomeIcon icon={faLink} className="text-amber-500" />
                      </div>
                      <span className="text-sm group-hover:underline transition-all duration-300">Resume</span>
                    </a>

                    <a
                      href={application.coverLetterLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-metallica-blue-600 hover:text-metallica-blue-800 group"
                      onClick={e => {
                        e.preventDefault();
                        toast.success('PDF download has started for the cover letter of the applicant', {
                          position: 'top-right',
                          autoClose: 3000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: 'light',
                        });
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2 transition-transform duration-300 group-hover:scale-110">
                        <FontAwesomeIcon icon={faLink} className="text-amber-500" />
                      </div>
                      <span className="text-sm group-hover:underline transition-all duration-300">Cover Letter</span>
                    </a>

                    {application.portfolioLink && (
                      <a
                        href={application.portfolioLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-metallica-blue-600 hover:text-metallica-blue-800 group"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2 transition-transform duration-300 group-hover:scale-110">
                          <FontAwesomeIcon icon={faLink} className="text-amber-500" />
                        </div>
                        <span className="text-sm group-hover:underline transition-all duration-300">Portfolio</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Right column - Status management (removed animate-slideInFromRight and adjusted padding/borders) */}
                <div className="w-full md:w-72 flex-shrink-0 md:border-l border-gray-200 md:pl-4 mt-6 md:mt-0 border-t md:border-t-0 pt-6 md:pt-0">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Current Application Status</h4>

                  <div className="flex items-center mb-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className={`w-3 h-3 rounded-full mr-2 ${STATUS_CONFIG[application.status].badgeColor}`}></div>
                    <p className="text-sm font-medium text-gray-700">
                      {STATUS_CONFIG[application.status].label}
                    </p>
                  </div>

                  {/* Status transition buttons */}
                  <div className="flex flex-col items-center space-y-3 w-full">
                    {STATUS_CONFIG[application.status].transitions.map(nextStatus => (
                      <CustomButton
                        key={nextStatus}
                        variant={nextStatus === 'rejected' ? 'danger' : 'primary'}
                        text={`Mark as ${STATUS_CONFIG[nextStatus].label}`}
                        // icon={nextStatus === 'rejected' ? faTimesCircle :
                        //   (nextStatus === 'completed' ? faCheckCircle : faClock)}
                        onClick={() => handleStatusChange(application.id, nextStatus)}
                        width="w-full"
                      />
                    ))}

                    {STATUS_CONFIG[application.status].transitions.length === 0 && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center w-full">
                        <p className="text-sm text-gray-500 italic">
                          No further status changes available
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Add animations
const styles = {
  '@keyframes dropdown': {
    from: { opacity: 0, transform: 'translateY(-5px)' },
    to: { opacity: 1, transform: 'translateY(0)' }
  },
  '.animate-dropdown': {
    animation: 'dropdown 0.2s ease-out forwards'
  }
};