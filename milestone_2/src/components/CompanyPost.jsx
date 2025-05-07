import { useState } from 'react';

export default function CompanyPost({ post, onUpdateClick, compact = false }) {
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

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Get appropriate animation class based on applicant count
  const getApplicantPulseClass = () => {
    if (applicantsCount > 15) return "animate-pulse-fast bg-green-100";
    if (applicantsCount > 5) return "animate-pulse bg-blue-100";
    return "bg-[var(--metallica-blue-50)]";
  };

  // Classes that change based on compact mode
  const containerClasses = compact 
    ? `bg-white rounded-lg shadow-md p-4 border mb-0 ${expanded ? 'absolute z-10 w-full min-w-[280px] max-w-md' : 'h-full'} flex flex-col` 
    : "bg-white rounded-lg shadow-md p-6 border mb-4";
  
  const titleClasses = compact 
    ? "text-lg font-bold text-[var(--metallica-blue-800)] line-clamp-1" 
    : "text-xl font-bold text-[var(--metallica-blue-800)]";
  
  const descriptionClasses = compact && !expanded
    ? "text-gray-700 mb-3 text-xs line-clamp-2"
    : (compact ? "text-gray-700 mb-3 text-xs" : "text-gray-700 mb-4 text-sm");

  return (
    <div className="relative">
      <div className={containerClasses}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex-grow">
            <h3 className={titleClasses}>
              {post.title || "Job Title"}
            </h3>
            <div className="flex flex-wrap items-center text-gray-600 mt-1 text-xs">
              <span className="mr-2">{post.jobSetting || "Job Setting"}</span>
              <span>{post.jobType || "Job Type"}</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="inline-block bg-[var(--metallica-blue-100)] text-[var(--metallica-blue-800)] px-2 py-1 rounded text-xs">
              {post.paid || "Payment Status"}
            </span>
            {post.paid === 'Paid' && post.salary && (
              <p className="text-[var(--metallica-green-pop-color)] font-medium mt-1 text-xs">
                {post.salary}
              </p>
            )}
            
            {/* Applicants counter badge - always visible */}
            <div className={`flex items-center mt-2 px-2 py-1 rounded-full ${getApplicantPulseClass()}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-[var(--metallica-blue-700)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs font-medium text-[var(--metallica-blue-800)]">{applicantsCount}</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-3 mb-3 flex-grow">
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
              <div>
                <span className="font-medium text-[var(--metallica-blue-700)]">Start:</span>{' '}
                {post.startDate ? new Date(post.startDate).toLocaleDateString() : "Not specified"}
              </div>
              <div>
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
        
        {post.skills && post.skills.length > 0 && (
          <div className="mb-3">
            <h4 className="font-medium mb-1 text-[var(--metallica-blue-700)] text-sm">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {post.skills.slice(0, compact && !expanded ? 3 : undefined).map((skill, index) => (
                <span 
                  key={index}
                  className="bg-[var(--metallica-blue-100)] text-[var(--metallica-blue-800)] px-2 py-0.5 rounded-full text-xs"
                >
                  {skill}
                </span>
              ))}
              {compact && !expanded && post.skills.length > 3 && (
                <span className="text-[var(--metallica-blue-600)] text-xs font-medium">
                  +{post.skills.length - 3} more
                </span>
              )}
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
        
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-200">
          {compact && (
            <button
              onClick={toggleExpanded}
              className="text-[var(--metallica-blue-600)] hover:text-[var(--metallica-blue-800)] text-xs font-medium"
            >
              {expanded ? 'See less' : 'See more'}
            </button>
          )}
          <div className={compact ? 'ml-auto' : ''}>
            <button 
              onClick={handleUpdateClick}
              className="bg-[var(--metallica-blue-600)] hover:bg-[var(--metallica-blue-700)] text-white px-3 py-1 rounded-md text-xs transition-colors"
            >
              Update Post
            </button>
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