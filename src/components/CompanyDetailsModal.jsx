import React, { useState } from "react";
import Image from "next/image";
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';
import { faTimes, faCheck, faExpand, faFile, faFileImage, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { INDUSTRY_ICONS } from "../../constants";
import { motion, AnimatePresence } from 'framer-motion';
import CustomButton from "./shared/CustomButton";

const BORDER = "border-2 border-[#497184]";
const ROUNDED = "rounded-xl";
const BG = "bg-[#eaf3f6]";

// Import INDUSTRY_ICONS
// (add at the top)
// import { INDUSTRY_ICONS } from '../../constants';
// But since this is a single file, add below the imports:
// (Assume INDUSTRY_ICONS is imported correctly)

export default function CompanyDetailsModal({ open, onClose, companyName, companyEmail, companyLogo, industry, size, documentation = [], registrationDate, onCompanyRemoval = () => { } }) {
  if (!open) return null;

  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  // Notepad state (6 notes for Figma style)
  const [notes, setNotes] = useState(["", "", "", "", "", ""]);
  const handleNoteChange = (idx, value) => {
    setNotes((prev) => prev.map((n, i) => (i === idx ? value : n)));
  };

  // Compose registration message
  const registrationMessage = `${safeT('scad.companyDetails.registeredOn')} 03 May, 2025`;

  // Accept/Reject feedback state
  const [feedback, setFeedback] = useState(null); // 'accepted' | 'rejected' | null
  const handleAccept = () => {
    setFeedback('accepted');
    setTimeout(() => {
      setFeedback(null);
      onCompanyRemoval(companyName);
      onClose && onClose(true);
    }, 1400);
  };
  const handleReject = () => {
    setFeedback('rejected');
    setTimeout(() => {
      setFeedback(null);
      onCompanyRemoval(companyName);
      onClose && onClose(true);
    }, 1400);
  };

  // Render document icon
  const renderDocIcon = (doc) => {
    const url = doc.url || doc.name || "";
    if (url.endsWith('.pdf')) return <FontAwesomeIcon icon={faFilePdf} className="text-[#497184] w-5 h-5 mr-2" />;
    if (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg')) return <FontAwesomeIcon icon={faFileImage} className="text-[#497184] w-5 h-5 mr-2" />;
    return <FontAwesomeIcon icon={faFilePdf} className="text-[#497184] w-5 h-5 mr-2" />;
  };

  // Compose docs array for card
  const docs = Array.isArray(documentation)
    ? documentation
    : documentation
      ? [{ url: documentation, name: documentation, type: documentation.split('.').pop() }]
      : [];

  return (
    <div className="modal-outer">
      {/* Feedback overlay */}
      <AnimatePresence>
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
                {feedback === 'accepted' ? safeT('scad.companyDetails.feedback.accepted') : safeT('scad.companyDetails.feedback.rejected')}
              </div>
              <div style={{ color: '#333', textAlign: 'center' }}>
                {feedback === 'accepted'
                  ? safeT('scad.companyDetails.feedback.acceptedMessage')
                  : safeT('scad.companyDetails.feedback.rejectedMessage')}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Main modal content (hidden when feedback is shown) */}
      {!feedback && (
        <div className={`modal-inner ${BG} ${BORDER} rounded-2xl`} style={{ boxShadow: '0 2px 8px #49718410', maxHeight: '90vh', overflow: 'hidden', paddingBottom: '24px' }}>
          {/* Close button - styled like EvaluationModal */}
          <button
            className="absolute top-3 ltr:right-3 rtl:left-3 z-20 flex items-center justify-center w-8 h-8 rounded-full shadow-sm bg-gray-100 hover:bg-gray-200/90 transition-colors"
            onClick={() => onClose && onClose(false)}
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl text-gray-500 font-normal" />
          </button>
          {/* Tab Header */}
          <div className="modal-header">
            <h2 className="text-xl font-bold text-[#2A5F74]">{safeT('scad.companyDetails.title')}</h2>
          </div>
          <div className="modal-content">
            {/* Top Row: Profile & Notepad */}
            <div className="modal-top-row">
              {/* Profile Card (inlined, with card styling) */}
              <div className="companyprofilecard-root bg-white p-6 flex flex-col items-center justify-center">
                <div className="companyprofilecard-title">{safeT('scad.companyDetails.profile')}</div>
                <div className="companyprofilecard-logo-container">
                  <Image src={companyLogo} alt="Company Logo" width={72} height={72} className="companyprofilecard-logo" />
                </div>
                <div className="companyprofilecard-name">{companyName}</div>
                <a href={`mailto:${companyEmail}`} className="companyprofilecard-email">{companyEmail}</a>
              </div>
              {/* Notepad */}
              <div className="modal-notepad">
                <div className="modal-notepad-title">{safeT('scad.companyDetails.notePad')}</div>
                <div className={`modal-notepad-container ${BORDER} ${ROUNDED} ${BG}`} >
                  {/* Inputs */}
                  {notes.map((note, idx) => (
                    <input
                      key={idx}
                      type="text"
                      className="modal-note-input"
                      style={{
                        borderRadius: 0,
                        marginTop: idx === 0 ? 0 : 8,
                        position: 'relative',
                        height: 25,
                        lineHeight: '33px',
                        borderBottom: '1px solid #497184',
                        opacity: note ? 1 : 0.3,
                        transition: 'opacity 0.2s ease'
                      }}
                      placeholder={idx === 0 ? "" : undefined}
                      value={note}
                      onChange={e => handleNoteChange(idx, e.target.value)}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Bottom Row: Documentation, Industry, Size */}
            <div className="modal-bottom-row">
              {/* Size Card (card style) */}
              <div className="companysizecard-root-big bg-white flex flex-col items-center justify-center p-1">
                <div className="companysizecard-title">{safeT('scad.companyDetails.companySize')}</div>
                <div className="companysizecard-bar-container" style={{ position: 'relative' }}>
                  <div className="companysizecard-bar-with-radius">

                    {/* indicator */}
                    <div className="companysizecard-bar">
                      {['<=50', '51-100', '101-500', '500+'].map((label, idx) => {
                        let activeIdx = 0;
                        if (size?.toLowerCase().includes('corporate')) activeIdx = 3;
                        else if (size?.toLowerCase().includes('large')) activeIdx = 2;
                        else if (size?.toLowerCase().includes('medium')) activeIdx = 1;
                        else activeIdx = 0;
                        return (
                          <div key={label} className="companysizecard-bar-segment">
                            <div className={`companysizecard-bar-label${idx === activeIdx ? ' companysizecard-bar-label-active' : ''}`}>{label}</div>
                            {idx === activeIdx && (
                              <div className="companysizecard-bar-here">
                                <span className="companysizecard-bar-arrow" style={{ marginTop: 8, fontSize: '1.1rem' }}>▼</span>
                              </div>
                            )}
                          </div>
                        );
                      })}

                    </div>
                  </div>
                </div>
              </div>
              {/* Industry Card (card style) */}
              <div className="companyindustrycard-root bg-white flex flex-col items-center justify-center p-1" style={{ minHeight: 200 }}>
                <div className="companyindustrycard-title">{safeT('scad.companyDetails.industry')}</div>
                <div className="companyindustrycard-icon-container-big companyindustrycard-icon-large">
                  {INDUSTRY_ICONS[industry] && <span>{INDUSTRY_ICONS[industry]}</span>}
                </div>
                <div className="companyindustrycard-industry companyindustrycard-industry-large">{industry}</div>
                {registrationDate && (
                  <div className="companyindustrycard-registration companyindustrycard-registration-small">
                    {registrationMessage}
                  </div>
                )}
              </div>
              {/* Documentation (card style) */}
              <div className="companydetails-third-width companydocumentscard-root bg-white p-1 flex flex-col companydetails-flex-grow">
                <div className="companydocumentscard-title">{safeT('scad.companyDetails.verificationDocs')}</div>
                <div className="companydocumentscard-list">
                  {docs.length === 0 && <div className="companydocumentscard-empty">{safeT('scad.companyDetails.noDocuments')}</div>}
                  {docs.map((doc, idx) => (
                    <div key={idx} className="companydocumentscard-item">
                      {/* File Icon logic */}
                      <FontAwesomeIcon icon={faFile} className="companydocumentscard-icon" />
                      <div className="companydocumentscard-item-info">
                        <span className="companydocumentscard-item-name">{doc.name || doc.url.split('/').pop()}</span>
                        <span className="companydocumentscard-item-type">{(doc.type || doc.url.split('.').pop() || '').toUpperCase()}</span>
                      </div>
                      <a href={doc.url} download className="companydocumentscard-download" title="Download">
                        <FontAwesomeIcon icon={faDownload} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Accept/Reject Buttons (outside main border, centered) */}
          <div className="w-full flex gap-4 justify-center mt-8 mb-4 px-6">
            <CustomButton
              variant="primary"
              onClick={handleAccept}
              icon={faCheck}
              text={safeT('scad.companyDetails.accept')}
              className="flex-1 w-full"
              width="w-full"
              showIconOnLoading={false}
            />
            <CustomButton
              variant="danger"
              onClick={handleReject}
              icon={faTimes}
              text={safeT('scad.companyDetails.reject')}
              className="flex-1 w-full"
              width="w-full"
              showIconOnLoading={false}
            />
          </div>
        </div>
      )}
    </div>
  );
} 