import Image from "next/image";
import CompanyProfileCard from './cards/CompanyProfileCard';
import CompanyIndustryCard from './cards/CompanyIndustryCard';
import CompanySizeCard from './cards/CompanySizeCard';
import CompanyDocumentsCard from './cards/CompanyDocumentsCard';
import { faChevronDown, faChevronUp, faCheck, faTimes, faExpand } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { INDUSTRY_ICONS } from '../constants/industryIcons';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CompanyDetails({
  companyName,
  companyEmail,
  companyLogo,
  industry,
  size,
  documentation = [],
  onCollapse,
}) {
  const [feedback, setFeedback] = useState(null); // 'accepted' | 'rejected' | null

    // Compose registration message
    const registrationMessage = `Registered on 03 May, 2025`;
  // Compose docs array for card
  const docs = Array.isArray(documentation)
    ? documentation
    : documentation
      ? [{ url: documentation, name: documentation, type: documentation.split('.').pop() }]
      : [];

  // Get the appropriate icon for the industry
  const industryIcon = INDUSTRY_ICONS[industry] || '🏢'; // Default icon if industry not found

  // Handlers for accept/reject with feedback animation
  const handleAccept = () => {
    setFeedback('accepted');
    setTimeout(() => {
      onCollapse && onCollapse();
    }, 1400);
  };
  const handleReject = () => {
    setFeedback('rejected');
    setTimeout(() => {
      onCollapse && onCollapse();
    }, 1400);
  };

  return (
    <div className="companydetails-root companydetails-big relative">
      <AnimatePresence>
        {feedback && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: 'rgba(42, 95, 116, 0.18)' }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="flex flex-col items-center justify-center"
              style={{ minWidth: 0 }}
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="mb-3"
              >
                <div
                  className={`flex items-center justify-center rounded-full mx-auto mb-1 shadow-lg ${feedback === 'accepted' ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: 60, height: 60 }}
                >
                  <FontAwesomeIcon
                    icon={feedback === 'accepted' ? faCheck : faTimes}
                    className="text-white"
                    style={{ fontSize: 32 }}
                  />
                </div>
              </motion.div>
              <div className="text-lg font-bold text-center mb-1 text-gray-900" style={{ letterSpacing: 1 }}>
                {feedback === 'accepted' ? 'Accepted!' : 'Rejected!'}
              </div>
              <div className="text-sm text-center text-gray-700 font-medium mb-1" style={{ opacity: 0.9 }}>
                {feedback === 'accepted'
                  ? (<span>This company has been <span className="font-bold text-green-700">approved</span> and added to your list.</span>)
                  : (<span>This company has been <span className="font-bold text-red-700">rejected</span> and removed from your list.</span>)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Main content (hidden when feedback is shown) */}
      {!feedback && (
        <>
          <div className="companydetails-header-row companydetails-header-row-flex">
            <CompanyProfileCard logo={companyLogo} name={companyName} email={companyEmail} />
            <CompanyIndustryCard industry={industry} icon={industryIcon} registrationMessage={registrationMessage} />
          </div>
          <CompanySizeCard size={size} />
          <CompanyDocumentsCard documents={docs} />
          <div className="companydetails-action-row">
            <button
              className="companydetails-accept-btn rounded-full px-4 py-2 text-base min-w-[100px]"
              onClick={handleAccept}
            >
              <FontAwesomeIcon icon={faCheck} className="companydetails-action-icon" /> Accept
            </button>
            <button
              className="companydetails-reject-btn rounded-full px-4 py-2 text-base min-w-[100px]"
              onClick={handleReject}
            >
              <FontAwesomeIcon icon={faTimes} className="companydetails-action-icon" /> Reject
            </button>
          </div>
        </>
      )}
    </div>
  );
} 