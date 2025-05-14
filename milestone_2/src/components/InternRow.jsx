import { useState } from "react";
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

// Status colors configuration
const statusColors = {
  current: 'bg-blue-100 text-blue-800 border-blue-400',
  completed: 'bg-green-100 text-green-800 border-green-400',
  evaluated: 'bg-purple-100 text-purple-800 border-purple-400',
};

// Format date from period (e.g., "Summer 2023" -> "July 1, 2023")
const formatDate = (period) => {
  if (!period) return "-";
  const yearMatch = period.match(/\d{4}/);
  if (!yearMatch) return period;
  const year = yearMatch[0];
  const month = period.toLowerCase().includes('summer') ? 'July' : 'January';
  return new Date(`${month} 1, ${year}`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Avatar image component
const AvatarImage = ({ profilePic }) => {
  return (
    <div className="w-12 h-12 rounded-full bg-[#D9F0F4] p-0.5 flex items-center justify-center shadow-sm">
      <Image
        src={profilePic}
        alt="Profile"
        width={48}
        height={48}
        className="rounded-full object-cover"
        priority
      />
    </div>
  );
};

const InternRow = ({ intern, onSelect, onEvaluate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHeightAnimating, setIsHeightAnimating] = useState(false);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsHeightAnimating(true);
      setTimeout(() => {
        setIsDescriptionVisible(true);
      }, 400);
    } else {
      setIsDescriptionVisible(false);
      setTimeout(() => {
        setIsHeightAnimating(false);
        setIsOpen(false);
      }, 600);
    }
  };

  return (
    <div className="mb-3 w-full max-w-3xl mx-auto">
      {/* Header Row (Click to Expand) */}
      <div className="relative">
        <button
          onClick={handleToggle}
          className={`group flex flex-col p-4 w-full bg-[#E2F4F7] rounded-lg border-2 border-[#5DB2C7] hover:shadow-md transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] gap-4 relative font-['IBM_Plex_Sans']
                    ${isHeightAnimating ? 'pb-8' : ''} overflow-hidden`}
        >
          {/* Top Row */}
          <div className="flex items-start gap-4">
            {/* Left: Avatar and Company */}
            <div className="flex flex-col items-center w-24 flex-shrink-0 space-y-3">
              <AvatarImage profilePic={intern.profilePic} />
              <p className="text-sm font-medium text-gray-500 text-center">{intern.company}</p>
            </div>

            {/* Center: Intern Details */}
            <div className="flex-1 min-w-0 ml-2">
              <div className="flex flex-col space-y-1">
                <h3 className="text-lg font-bold text-gray-800 text-left">{intern.name}</h3>
                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-gray-600 text-left">{intern.jobTitle}</p>
                  <div className="inline-flex">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-800">
                      Intern
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Status Badge and Evaluate Button */}
            <div className="flex flex-col items-end w-28 flex-shrink-0 space-y-2">
              <span className={`
                inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                ${statusColors[intern.status]}
              `}>
                {intern.status.toUpperCase()}
              </span>
              {intern.status === "completed" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEvaluate(intern.id);
                  }}
                  className="px-4 py-1.5 bg-[#5DB2C7] text-white text-xs font-medium rounded-full hover:bg-[#4796A8] transition-all duration-300 border-2 border-[#5DB2C7] hover:border-[#4796A8] shadow-sm hover:shadow-md hover:transform hover:translate-y-[-1px]"
                >
                  EVALUATE
                </button>
              )}
            </div>

            {/* Chevron Icon */}
            <ChevronDown
              className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 h-5 w-5 text-gray-500 transition-transform duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'rotate-180' : ''}`}
              aria-hidden
            />

            {/* Start Date */}
            <span className="absolute bottom-2 right-2 text-xs text-gray-500">
              started on {formatDate(intern.startDate)}
            </span>
          </div>

          {/* Expanded Description (Left Aligned) */}
          {isHeightAnimating && (
            <div className="mt-4 flex flex-col p-4 w-full text-left space-y-1 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]">
              <p className={`text-sm text-gray-700 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${isDescriptionVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
                {intern.description}
              </p>
            </div>
          )}
        </button>
      </div>

      {/* Collapsible Content */}
      <div
        className={`overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu
                  ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}
      >
        <div className={`px-4 py-4 bg-white rounded-b-lg border border-t-0 border-[#5DB2C7] mt-1 font-['IBM_Plex_Sans']
                      transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu origin-top
                      ${isOpen ? 'translate-y-0 scale-y-100' : 'translate-y-[-100%] scale-y-0'}`}>
          {/* Details Section */}
          <div className="flex flex-col md:flex-row gap-6 mb-4">
            {/* Left */}
            <div className="flex-1 space-y-4 p-3">
              {/* Start Date */}
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Start Date:</span> {formatDate(intern.startDate)}
                </p>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-600">Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {intern.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#E2F4F7] text-[#5DB2C7] border border-[#5DB2C7]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex-1 space-y-1 p-3">
              {/* Job Description Title */}
              <h4 className="text-sm font-semibold text-gray-600 mb-1">Job Description</h4>
              <div className="border border-[#5DB2C7] rounded-md p-2">
                <p className="text-sm text-gray-600">{intern.description}</p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-t border-gray-400 mt-6 pt-3">
            <p className="text-xs text-gray-500">
              started on {formatDate(intern.startDate)}
            </p>
            {intern.status === "completed" && (
              <button
                onClick={() => onEvaluate(intern.id)}
                className="px-4 py-2 bg-[#5DB2C7] text-white rounded-lg hover:bg-[#4796A8] transition w-full sm:w-auto text-sm"
              >
                Evaluate Intern
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternRow;