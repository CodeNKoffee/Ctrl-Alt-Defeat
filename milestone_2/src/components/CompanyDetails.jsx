import Image from "next/image";
import CompanyProfileCard from './cards/CompanyProfileCard';
import CompanyIndustryCard from './cards/CompanyIndustryCard';
import CompanySizeCard from './cards/CompanySizeCard';
import CompanyDocumentsCard from './cards/CompanyDocumentsCard';
import { faChevronDown, faChevronUp, faCheck, faTimes, faExpand } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { INDUSTRY_ICONS } from "../../constants";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomButton from "./shared/CustomButton";

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
    <div className="companydetails-root companydetails-big relative ml-4!">
      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
              background: 'rgba(42, 95, 116, 0.18)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{
                background: 'white',
                padding: '25px',
                borderRadius: '15px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                maxWidth: '400px'
              }}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <motion.div
                style={{
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: feedback === 'accepted' ? '#22C55E' : '#D32F2F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FontAwesomeIcon
                    icon={feedback === 'accepted' ? faCheck : faTimes}
                    style={{ fontSize: 32, color: 'white' }}
                  />
                </div>
              </motion.div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2A5F74', marginBottom: '10px' }}>
                {feedback === 'accepted' ? 'Accepted!' : 'Rejected!'}
              </div>
              <div style={{ color: '#333', textAlign: 'center' }}>
                {feedback === 'accepted'
                  ? 'This company has been approved and added to your list.'
                  : 'This company has been rejected and removed from your list.'}
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
          <div className="w-full flex gap-4 justify-center mt-6">
            <CustomButton
              variant="primary"
              onClick={handleAccept}
              icon={faCheck}
              text="Accept"
              width="w-1/2"
            />
            <CustomButton
              variant="danger"
              onClick={handleReject}
              icon={faTimes}
              text="Reject"
              width="w-1/2"
            />
          </div>
        </>
      )}
    </div>
  );
} 