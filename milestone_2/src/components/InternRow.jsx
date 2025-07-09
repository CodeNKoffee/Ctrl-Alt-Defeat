import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import CustomButton from './shared/CustomButton';
import { useTranslation } from 'react-i18next';
import { createSafeT, formatTranslatedDate } from '../lib/translationUtils';

// Status colors configuration
const statusColors = {
  current: 'bg-blue-100 text-blue-800 border-blue-400',
  completed: 'bg-green-100 text-green-800 border-green-400',
  evaluated: 'bg-purple-100 text-purple-800 border-purple-400',
};

// Format date function (kept for fallback, but we'll use translated version in component)
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

// Create translated date formatting function
const createTranslatedDateFormatter = (safeT) => (period) => {
  if (!period) return "-";
  const yearMatch = period.match(/\d{4}/);
  if (!yearMatch) return period;
  const year = yearMatch[0];
  const month = period.toLowerCase().includes('summer') ? 'July' : 'January';
  const dateString = `${month} 1, ${year}`;
  return formatTranslatedDate(safeT, dateString);
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
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  const [isOpen, setIsOpen] = useState(false);
  const [isHeightAnimating, setIsHeightAnimating] = useState(false);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

  const formatTranslatedDateLocal = createTranslatedDateFormatter(safeT);

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
          className={`group flex flex-col p-4 w-full bg-[#E2F4F7] rounded-lg border-2 border-[#5DB2C7] hover:shadow-md transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] relative font-['IBM_Plex_Sans']
                    ${isHeightAnimating ? 'pb-12' : 'pb-8'} overflow-hidden`}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 pt-1">
              <AvatarImage profilePic={intern.profilePic} />
            </div>
            <div className="flex-1 min-w-0 flex items-start justify-between">
              <div className="text-left pt-1">
                <h3 className="text-lg font-bold text-gray-800">{intern.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{intern.jobTitle}</p>
              </div>
              <span className={`
                inline-flex items-center rtl:flex-row-reverse px-3 py-1 rounded-full text-xs font-medium border
                ${statusColors[intern.status]}
              `}>
                {safeT(`company.interns.statuses.${intern.status}`).toUpperCase()}
              </span>
            </div>
          </div>
          <span className="absolute bottom-2 right-2 text-xs text-gray-500">
            {safeT('company.internDetails.startedOn')} {formatTranslatedDateLocal(intern.startDate)}
          </span>
          <ChevronDown
            className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 h-5 w-5 text-gray-500 transition-transform duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden
          />
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
                  <span className="font-semibold">{safeT('company.internDetails.startDate')}</span> {formatTranslatedDateLocal(intern.startDate)}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-600">{safeT('company.internDetails.skills')}</h4>
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
                <h4 className="text-sm font-semibold text-gray-600 mb-1">{safeT('company.internDetails.degree')}</h4>
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
                <h4 className="text-sm font-semibold text-gray-600 mb-1">{safeT('company.internDetails.jobInterests')}</h4>
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
                <span> {safeT('company.internDetails.endedOn')} {formatTranslatedDateLocal(intern.endDate)}</span>
              )}
            </p>
            {intern.status === "completed" && (
              <CustomButton
                variant="primary"
                onClick={() => onEvaluate(intern.id)}
                text={safeT('company.internDetails.evaluateIntern')}
                width="w-fit sm:w-auto"
                className="py-2"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternRow;