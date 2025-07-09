"use client";
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import StatusBadge from './StatusBadge';
import { Tooltip } from 'react-tooltip';
import UploadDocuments from '../UploadDocuments';
import EvaluationModal from '../EvaluationModal';
import { mockCompanyReviews } from '../../../constants/mockData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import CustomButton from "../shared/CustomButton";
import { useTranslation } from 'react-i18next';
import { createSafeT, translateFilterValue } from '@/lib/translationUtils';

const formatDate = (isoDate) => {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper to show how long ago a date was
const createTimeAgo = (safeT) => (isoDate) => {
  if (!isoDate) return "-";
  const now = new Date();
  const date = new Date(isoDate);
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) {
    const unit = months > 1 ? safeT('internship.row.timeAgo.monthsAgoPlural') : safeT('internship.row.timeAgo.monthsAgo');
    return `${safeT('internship.row.timeAgo.posted')} ${months} ${unit} ${safeT('internship.row.timeAgo.ago')}`;
  }
  if (weeks > 0) {
    const unit = weeks > 1 ? safeT('internship.row.timeAgo.weeksAgoPlural') : safeT('internship.row.timeAgo.weeksAgo');
    return `${safeT('internship.row.timeAgo.posted')} ${weeks} ${unit} ${safeT('internship.row.timeAgo.ago')}`;
  }
  if (days > 0) {
    const unit = days > 1 ? safeT('internship.row.timeAgo.daysAgoPlural') : safeT('internship.row.timeAgo.daysAgo');
    return `${safeT('internship.row.timeAgo.posted')} ${days} ${unit} ${safeT('internship.row.timeAgo.ago')}`;
  }
  if (hours > 0) {
    const unit = hours > 1 ? safeT('internship.row.timeAgo.hoursAgoPlural') : safeT('internship.row.timeAgo.hoursAgo');
    return `${safeT('internship.row.timeAgo.posted')} ${hours} ${unit} ${safeT('internship.row.timeAgo.ago')}`;
  }
  if (minutes > 0) {
    const unit = minutes > 1 ? safeT('internship.row.timeAgo.minutesAgoPlural') : safeT('internship.row.timeAgo.minutesAgo');
    return `${safeT('internship.row.timeAgo.posted')} ${minutes} ${unit} ${safeT('internship.row.timeAgo.ago')}`;
  }
  return safeT('internship.row.timeAgo.justNow');
};

// Tooltip messages specifically for APPLIED internship statuses
const createAppliedStatusTooltipMessages = (safeT) => ({
  accepted: safeT('internship.row.statusTooltips.accepted'),
  pending: safeT('internship.row.statusTooltips.pending'),
  finalized: safeT('internship.row.statusTooltips.finalized'),
  rejected: safeT('internship.row.statusTooltips.rejected'),
});

export default function InternshipRow({ internship, type, onApplicationCompleted, isApplied, onTriggerReportCreate, isRecommended }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  const [isOpen, setIsOpen] = useState(false);
  const [isHeightAnimating, setIsHeightAnimating] = useState(false);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const router = useRouter();

  const timeAgo = createTimeAgo(safeT);
  const appliedStatusTooltipMessages = createAppliedStatusTooltipMessages(safeT);

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

  // Determine tooltip content ONLY for applied type
  let tooltipContent = undefined;
  if (type === 'applied') {
    const currentStatus = internship.status ? internship.status.toLowerCase() : null;
    if (currentStatus) {
      tooltipContent = appliedStatusTooltipMessages[currentStatus];
    }
  }

  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = (success, appliedInternshipId) => {
    setIsUploadModalOpen(false);
    if (success && onApplicationCompleted && appliedInternshipId) {
      onApplicationCompleted(appliedInternshipId);
    }
    // Potentially refresh data or give feedback if an upload happened - handled by parent
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={i <= rating ? faStarSolid : faStarRegular}
          className={i <= rating ? "text-amber-400" : "text-gray-300"}
        />
      );
    }
    return stars;
  };

  return (
    <div className="mb-3 w-full">
      {/* Header Row (Click to Expand) */}
      <div className="relative z-0">
        <button
          onClick={handleToggle}
          className={`group flex flex-col p-4 w-full bg-[#E2F4F7] rounded-lg border-2 border-[#5DB2C7] hover:shadow-md transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] gap-4 relative font-['IBM_Plex_Sans']
                    ${isHeightAnimating ? 'pb-8' : ''} overflow-hidden`}
        >
          {/* Top Row */}
          <div className="flex items-start gap-4">
            {/* Left: Logo and Company */}
            <div className="flex flex-col items-center w-24 flex-shrink-0 space-y-3">
              <div className="w-12 h-12 rounded-full bg-gray-300"></div>
              <p className="text-sm font-medium text-gray-500 text-center">{internship.company}</p>

              {/* Show star rating for recommended internships */}
              {isRecommended && internship.pastInternRating && (
                <div className="flex text-xs space-x-1">
                  {renderStars(internship.pastInternRating)}
                </div>
              )}
            </div>

            {/* Center: Job Details */}
            <div className="flex-1 min-w-0 ltr:ml-2 rtl:mr-2">
              <div className="flex flex-col space-y-1">
                <h3 className="text-lg font-bold text-gray-800 text-left rtl:text-right">{internship.title}</h3>
                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-gray-600 text-left rtl:text-right">{translateFilterValue(safeT, internship.type, 'jobType')}</p>
                  <div className="inline-flex">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-800">
                      {translateFilterValue(safeT, internship.jobSetting, 'jobSetting')}
                    </span>

                    {/* Show recommendation reason badge */}
                    {isRecommended && internship.recommendedReason && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800 border border-pink-400 ml-2">
                        {(() => {
                          const reason = internship.recommendedReason;
                          if (reason === 'industry match') return safeT('student.dashboard.statusPills.industryMatch');
                          if (reason === 'job interest match') return safeT('student.dashboard.statusPills.jobInterestMatch');
                          if (reason === 'recommended by past interns') return safeT('student.dashboard.statusPills.recommendedByPastInterns');
                          return reason.toUpperCase(); // fallback
                        })()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Status Badge */}
            <div className="flex flex-col items-end w-28 flex-shrink-0 space-y-2">
              {type === 'recommended' || type === 'browsing' && (
                <StatusBadge color={internship.paid ? 'bg-green-100 text-green-800 border-green-400' : 'bg-gray-100 text-gray-600 border-gray-400'} className="border">
                  {internship.paid ? `$ ${safeT('internship.row.statuses.paid')}` : safeT('internship.row.statuses.unpaid')}
                </StatusBadge>
              )}

              {(type === 'my' || type === 'mine') && (
                <StatusBadge
                  color={
                    internship.status === 'current' ? 'bg-blue-100 text-blue-800 border-blue-400' :
                      internship.status === 'completed' ? 'bg-green-100 text-green-800 border-green-400' :
                        internship.status === 'evaluated' ? 'bg-purple-100 text-purple-800 border-purple-400' :
                          'bg-gray-100 text-gray-600 border-gray-400'
                  }
                  className="border"
                >
                  {internship.status ? safeT(`internship.row.statuses.${internship.status}`) : safeT('internship.row.statuses.current')}
                </StatusBadge>
              )}

              {type === 'applied' && (
                <StatusBadge
                  data-tooltip-id="status-tooltip"
                  data-tooltip-content={tooltipContent}
                  color={
                    internship.status === 'accepted' ? 'bg-green-100 text-green-800 border-green-400' :
                      internship.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-400' :
                        internship.status === 'finalized' ? 'bg-purple-100 text-purple-800 border-purple-400' :
                          'bg-yellow-100 text-yellow-800 border-yellow-400'
                  }
                  className="border"
                >
                  {internship.status ? safeT(`internship.row.statuses.${internship.status}`) : safeT('internship.row.statuses.pending')}
                </StatusBadge>
              )}
            </div>

            {/* Chevron Icon */}
            <ChevronDown
              className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 h-5 w-5 text-gray-500 transition-transform duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'rotate-180' : ''}`}
              aria-hidden
            />

            {/* Posted/Applied/Started Date (Header Row) */}
            <span className="absolute bottom-2 right-2 text-xs text-gray-500">
              {type === 'my' && `${safeT('internship.row.labels.startedOn')} ${formatDate(internship.startDate)}`}
              {type === 'applied' && `${safeT('internship.row.labels.appliedOn')} ${formatDate(internship.appliedDate)}`}
              {(type === 'recommnded' || type === 'browsing') && timeAgo(internship.postedDate)}
            </span>
          </div>

          {/* Expanded Company Details (Left Aligned) */}
          {isHeightAnimating && (
            <div className="mt-4 flex flex-col p-4 w-full text-left space-y-1 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]">
              <p className={`text-sm text-gray-700 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${isDescriptionVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
                {internship.details}
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
          {/* Section 1 & 2 */}
          <div className="flex flex-col md:flex-row gap-6 mb-4">
            {/* Left */}
            <div className="flex-1 space-y-4 p-3">
              {/* Start Date & Duration */}
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{safeT('internship.row.labels.startDate')}</span> {formatDate(internship.startDate)}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{safeT('internship.row.labels.duration')}</span> {internship.duration}
                </p>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-600">{safeT('internship.row.labels.skills')}</h4>
                <div className="flex flex-wrap gap-2">
                  {internship.skills?.map((skill, index) => (
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
              <h4 className="text-sm font-semibold text-gray-600 mb-1">{safeT('internship.row.labels.jobDescription')}</h4>
              <div className="border border-[#5DB2C7] rounded-md p-2">
                <p className="text-sm text-gray-600">{internship.description}</p>
              </div>
              {/* Requirements Title */}
              <h4 className="text-sm font-semibold text-gray-600 mb-1">{safeT('internship.row.labels.requirements')}</h4>
              <div className="border border-[#5DB2C7] rounded-md p-2">
                <p className="text-sm text-gray-600">{internship.requirements || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-t border-gray-400 mt-6 pt-3">
            <div className="flex flex-col">
              <p className="text-base font-bold text-gray-800">
                {internship.rate || safeT('internship.row.labels.rateNotSpecified')}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {type === 'my' && `${safeT('internship.row.labels.startedOn')} ${formatDate(internship.startDate)}`}
                {type === 'applied' && `${safeT('internship.row.labels.appliedOn')} ${formatDate(internship.appliedDate)}`}
                {(type === 'browsing' || type === 'recommended') && timeAgo(internship.postedDate)}
              </p>
            </div>

            {/* Only show Create Report for completed status in 'my' internships */}
            {(type === 'my' || type === 'mine') && internship.status === 'completed' && (
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <CustomButton
                  variant="primary"
                  onClick={() => onTriggerReportCreate(internship)}
                  text={safeT('internship.row.buttons.createReport')}
                  className="text-sm py-2 px-4"
                />

                <CustomButton
                  variant="secondary"
                  onClick={() => setShowEvaluation(true)}
                  text={safeT('internship.row.buttons.evaluateCompany')}
                  className="text-sm py-2 px-4 bg-green-100 text-green-800 border-green-400 hover:bg-[#aeeac5]"
                />
              </div>

            )}

            {/* Apply button for recommended or browsing internships */}
            {(type === 'recommended' || type === 'browsing') && type !== 'company-view' && (
              <button
                onClick={isApplied ? undefined : handleOpenUploadModal}
                className="p font-bold py-2 px-3 rounded-full transition-all duration-200 
        flex items-center justify-center focus:outline-none focus:ring-2
       bg-[#318FA8] text-white hover:bg-[#2a5c67] border-[#5DB2C7]
        w-24 hover:-translate-y-0.5 shadow-md hover:shadow-lg  border letter-spacing-1"
                disabled={isApplied}
              >
                {isApplied ? safeT('internship.row.buttons.applied') : safeT('internship.row.buttons.apply')}
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Tooltip component instance - only needed if type='applied' might be rendered */}
      {type === 'applied' && (
        <Tooltip
          id="status-tooltip"
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
              <span className="font-semibold text-base mb-1">{safeT('internship.row.tooltip.statusInfo')}</span>
              <span className="text-white text-sm font-normal">{content}</span>
            </div>
          )}
        />
      )}

      {/* Upload Documents Modal */}
      <UploadDocuments
        open={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        internshipId={internship.id}
      />

      {/* Evaluation Modal */}
      <EvaluationModal
        isOpen={showEvaluation}
        onClose={() => setShowEvaluation(false)}
        onSubmit={(data) => {
          // You can handle the evaluation submission here (e.g., API call or state update)
          setShowEvaluation(false);
        }}
        mockReviews={mockCompanyReviews}
      />
    </div>
  );
}
