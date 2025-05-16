import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import CustomButton from './shared/CustomButton';

export default function CompanyPost({ post, onUpdateClick, onDeleteClick, compact = false }) {
  const [expanded, setExpanded] = useState(false);

  // Mock data for applicants count - in real app this would come from post prop
  const applicantsCount = post.applicantsCount || Math.floor(Math.random() * 20);

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const handleUpdateClick = () => {
    if (onUpdateClick) {
      onUpdateClick(post);
    }
  };

  const handleDeleteClick = () => {
    if (onDeleteClick) {
      onDeleteClick(post);
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Get appropriate animation class based on applicant count
  const getApplicantPulseClass = () => {
    if (applicantsCount > 15) return "animate-pulse-fast bg-green-100";
    if (applicantsCount > 5) return "animate-pulse bg-blue-100";
    return "bg-[var(--metallica-blue-50)]";
  };

  // Get background color based on job type
  const getJobTypeBg = (jobType) => {
    const types = {
      'Full-time': 'bg-green-100 text-green-700 border-green-200',
      'Part-time': 'bg-blue-100 text-blue-700 border-blue-200',
      'Internship': 'bg-purple-100 text-purple-700 border-purple-200',
      'Contract': 'bg-orange-100 text-orange-700 border-orange-200',
      'Temporary': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    };
    return types[jobType] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // Get background color based on job setting
  const getJobSettingBg = (setting) => {
    const settings = {
      'Remote': 'bg-teal-100 text-teal-700 border-teal-200',
      'On-site': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Hybrid': 'bg-cyan-100 text-cyan-700 border-cyan-200'
    };
    return settings[setting] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // Classes that change based on compact mode
  const containerClasses = compact
    ? `bg-white rounded-lg shadow-md p-4 border mb-0 ${expanded ? 'absolute z-10 w-full min-w-[280px] max-w-md' : 'h-[320px]'} flex flex-col`
    : "bg-white rounded-lg shadow-md p-6 border mb-4";

  const titleClasses = compact
    ? "text-lg font-bold text-[var(--metallica-blue-800)] line-clamp-1"
    : "text-xl font-bold text-[var(--metallica-blue-800)]";

  const descriptionClasses = compact && !expanded
    ? "text-gray-700 mb-3 text-xs line-clamp-2 h-10 overflow-hidden"
    : (compact ? "text-gray-700 mb-3 text-xs" : "text-gray-700 mb-4 text-sm");

  return (
    <div className="relative">
      <div className={containerClasses}>
        {/* Edit/Delete Icon Buttons (top-right, only here) */}
        <div
          className="absolute top-4 right-4 flex items-center gap-2 z-10"
          style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: '4px', borderRadius: '4px' }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={handleUpdateClick}
            title="Edit post"
            className="text-[#3298BA] hover:text-[#65bedc] p-1"
          >
            <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteClick}
            title="Delete post"
            className="text-red-500 hover:text-red-700 p-1"
          >
            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
          </button>
        </div>

        {/* Header section (remove edit button from here) */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-grow">
            <h3 className={titleClasses}>
              {post.title || "Job Title"}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {post.jobSetting && (
                <span className={`px-2.5 py-1 text-xs rounded-full font-medium border ${getJobSettingBg(post.jobSetting)} flex items-center`}>
                  {post.jobSetting === 'Remote' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.5 2a3.5 3.5 0 101.665 6.58L8.585 10l-1.42 1.42a3.5 3.5 0 101.414 1.414l1.42-1.42 1.42 1.42a3.5 3.5 0 101.414-1.414L11.415 10l1.42-1.42a3.5 3.5 0 10-1.414-1.414L10 8.585l-1.42-1.42A3.5 3.5 0 005.5 2zM4 5.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm9.5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm1.5 8a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zm-8 0a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {post.jobSetting === 'On-site' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 00-1-1H7a1 1 0 00-1 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                    </svg>
                  )}
                  {post.jobSetting === 'Hybrid' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  )}
                  {post.jobSetting}
                </span>
              )}

              {post.jobType && (
                <span className={`px-2.5 py-1 text-xs rounded-full font-medium border ${getJobTypeBg(post.jobType)} flex items-center`}>
                  {post.jobType === 'Full-time' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                  )}
                  {post.jobType === 'Part-time' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  )}
                  {post.jobType === 'Internship' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  )}
                  {post.jobType}
                </span>
              )}
            </div>
          </div>

          {/* Remove edit button from here for single icon group */}
        </div>

        <div className="border-t border-gray-200 pt-3 mb-3 flex-grow overflow-hidden">
          <h4 className="font-medium mb-1 text-[var(--metallica-blue-700)] text-sm">Description</h4>
          <p className={descriptionClasses}>
            {post.description || "No description provided"}
          </p>

          {(!compact || expanded) && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium mb-1 text-[var(--metallica-blue-700)] text-sm">Start Date</h4>
                <p className="text-gray-700 text-sm">
                  {formatDate(post.startDate)}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1 text-[var(--metallica-blue-700)] text-sm">Duration</h4>
                <p className="text-gray-700 text-sm">
                  {post.duration || "Not specified"}
                </p>
              </div>
            </div>
          )}

          {compact && !expanded && (
            <div className="flex justify-between text-xs mb-2">
              <div className="truncate pr-1">
                <span className="font-medium text-[var(--metallica-blue-700)]">Start:</span>{' '}
                {post.startDate ? new Date(post.startDate).toLocaleDateString() : "Not specified"}
              </div>
              <div className="truncate">
                <span className="font-medium text-[var(--metallica-blue-700)]">Duration:</span>{' '}
                {post.duration || "Not specified"}
              </div>
            </div>
          )}
        </div>

        {(!compact || expanded) && post.requirements && (
          <div className="mb-4">
            <h4 className="font-medium mb-2 text-[var(--metallica-blue-700)] text-sm">Requirements</h4>
            <p className="text-gray-700 text-sm">{post.requirements}</p>
          </div>
        )}

        {(!compact || expanded) && post.skills && post.skills.length > 0 && (
          <div className="mb-3">
            <h4 className="font-medium mb-1 text-[var(--metallica-blue-700)] text-sm">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {post.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-[var(--metallica-blue-100)] text-[var(--metallica-blue-800)] px-2 py-0.5 rounded-full text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {expanded && (
          <div className="mb-4">
            <div className="flex items-center justify-between bg-[var(--metallica-blue-50)] rounded-lg p-3">
              <div className="flex items-center">
                <div className="mr-3 bg-[var(--metallica-blue-600)] rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[var(--metallica-blue-800)]">Applicants</h4>
                  <p className="text-xs text-gray-600">
                    {applicantsCount === 0
                      ? "Be the first to apply!"
                      : `${applicantsCount} ${applicantsCount === 1 ? 'person has' : 'people have'} applied`}
                  </p>
                </div>
              </div>
              <div className={`text-2xl font-bold ${applicantsCount > 10 ? 'text-[var(--metallica-green-pop-color)]' : 'text-[var(--metallica-blue-600)]'}`}>
                {applicantsCount}
              </div>
            </div>
          </div>
        )}

        {/* Modified footer with only delete button */}
        <div className="flex flex-col mt-auto pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            {compact && (
              <button
                onClick={toggleExpanded}
                className="w-80 bg-metallica-blue-600 text-white font-semibold rounded-full py-2 mt-2 shadow-md hover:bg-metallica-blue-700 transition hover:-translate-y-0.5"
              >
                {expanded ? 'See less' : 'See more'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add overlay when expanded to handle clicks outside */}
      {compact && expanded && (
        <div
          className="fixed inset-0 z-0 bg-black bg-opacity-20"
          onClick={toggleExpanded}
        ></div>
      )}
    </div>
  );
}