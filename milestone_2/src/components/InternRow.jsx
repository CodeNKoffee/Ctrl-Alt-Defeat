import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

// Status colors configuration
const statusColors = {
  current: 'bg-blue-100 text-blue-800 border-blue-400',
  completed: 'bg-green-100 text-green-800 border-green-400',
  evaluated: 'bg-purple-100 text-purple-800 border-purple-400',
};

// Format date function
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

const AvatarImage = ({ profilePic }) => {
  return (
    <div className="w-12 h-12 rounded-full bg-[#FFFFFF] border-2 border-[#3298BA] p-0.5 flex items-center justify-center shadow-sm">
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
    <div className="mb-3 w-full">
      <div className="relative">
        <button
          onClick={handleToggle}
          className={`group flex flex-col p-4 w-full bg-[#E2F4F7] rounded-lg border-2 border-[#5DB2C7] hover:shadow-md transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] gap-4 relative font-['IBM_Plex_Sans']
                    ${isHeightAnimating ? 'pb-8' : ''} overflow-hidden`}
        >
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center w-24 flex-shrink-0 space-y-3">
              <AvatarImage profilePic={intern.profilePic} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col space-y-1">
                <h3 className="text-lg font-bold text-gray-800 text-left">{intern.name}</h3>
                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-gray-600 text-left">{intern.jobTitle}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end w-28 flex-shrink-0 space-y-2">
              <span className={`
                inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                ${statusColors[intern.status]}
              `}>
                {intern.status.toUpperCase()}
              </span>
            </div>
            <ChevronDown
              className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 h-5 w-5 text-gray-500 transition-transform duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'rotate-180' : ''}`}
              aria-hidden
            />
            <span className="absolute bottom-2 right-2 text-xs text-gray-500">
              started on {formatDate(intern.startDate)}
            </span>
          </div>
          {isHeightAnimating && (
            <div className="mt-4 flex flex-col p-4 w-full text-left space-y-1 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]">
              <p className={`text-sm text-gray-700 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${isDescriptionVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
                {intern.description}
              </p>
            </div>
          )}
        </button>
      </div>
      <div
        className={`overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu
                  ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}
      >
        <div className={`px-4 py-4 bg-white rounded-b-lg border border-t-0 border-[#5DB2C7] mt-1 font-['IBM_Plex_Sans']
                      transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu origin-top
                      ${isOpen ? 'translate-y-0 scale-y-100' : 'translate-y-[-100%] scale-y-0'}`}>
          <div className="flex flex-col md:flex-row gap-6 mb-4">
            <div className="flex-1 space-y-4 p-3">
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Start Date:</span> {formatDate(intern.startDate)}
                </p>
              </div>
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
            <div className="flex-1 space-y-4 p-3">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-600 mb-1">Degree</h4>
                <div className="border border-[#5DB2C7] rounded-md p-2">
                    <p className="text-sm text-gray-600">
                    {intern.degree}, {intern.period}
                    </p>
                    <p className="text-sm text-gray-600">
                    {intern.period}
                    </p>
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-600 mb-1">Job Interests</h4>
                <div className="border border-[#5DB2C7] rounded-md p-2">
                  {intern.jobInterests?.length > 0 ? (
                    intern.jobInterests.map((interest, index) => (
                      <p key={index} className="text-sm text-gray-600">
                        {interest.title}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No job interests listed</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-t border-gray-400 mt-6 pt-3">
            <p className="text-xs text-gray-500">
              {(intern.status === 'completed' || intern.status === 'evaluated') && intern.endDate && (
                <span> Ended on {formatDate(intern.endDate)}</span>
              )}
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