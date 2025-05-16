"use client";

// Import tools we need: React hooks to manage state and refs, and lottie-web to show animations
import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import Lottie dynamically with SSR disabled
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// import animationData from '../../public/animted-cloud.json'; // Your Lottie JSON
import animationData from '../../public/cloud-icon.json'; // Your Lottie JSON
import { motion, AnimatePresence } from 'framer-motion';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faXmark, faTimes, faCheckCircle, faTimesCircle, faCheck } from '@fortawesome/free-solid-svg-icons';
import CustomButton from './shared/CustomButton';

// Create the main component for uploading documents
const UploadDocuments = ({ open, onClose, internshipId }) => {
  // States for Resume
  const [resumeFile, setResumeFile] = useState(null);
  const [isResumeUploading, setIsResumeUploading] = useState(false);
  const [resumeUploadComplete, setResumeUploadComplete] = useState(false);
  const [resumeUploadProgress, setResumeUploadProgress] = useState(0);
  const [resumeError, setResumeError] = useState('');
  const resumeFileInputRef = useRef(null);
  const resumeProgressIntervalRef = useRef(null);
  const resumeAnimationTimerRef = useRef(null);

  // States for Cover Letter
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [isCoverLetterUploading, setIsCoverLetterUploading] = useState(false);
  const [coverLetterUploadComplete, setCoverLetterUploadComplete] = useState(false);
  const [coverLetterUploadProgress, setCoverLetterUploadProgress] = useState(0);
  const coverLetterFileInputRef = useRef(null);
  const coverLetterProgressIntervalRef = useRef(null);
  const coverLetterAnimationTimerRef = useRef(null);

  // Shared states
  const [coverLetterText, setCoverLetterText] = useState('');
  const [links, setLinks] = useState([{ id: Date.now(), value: '' }]);
  // Add state for animation
  const [animatingLinks, setAnimatingLinks] = useState({});

  // Feedback state for successful upload
  const [feedback, setFeedback] = useState(null);

  const resetUploadStates = (type) => {
    if (type === 'resume' || type === 'all') {
      setResumeFile(null);
      setIsResumeUploading(false);
      setResumeUploadComplete(false);
      setResumeUploadProgress(0);
      setResumeError('');
      if (resumeProgressIntervalRef.current) clearInterval(resumeProgressIntervalRef.current);
      if (resumeAnimationTimerRef.current) clearTimeout(resumeAnimationTimerRef.current);
    }
    if (type === 'coverLetter' || type === 'all') {
      setCoverLetterFile(null);
      setIsCoverLetterUploading(false);
      setCoverLetterUploadComplete(false);
      setCoverLetterUploadProgress(0);
      if (coverLetterProgressIntervalRef.current) clearInterval(coverLetterProgressIntervalRef.current);
      if (coverLetterAnimationTimerRef.current) clearTimeout(coverLetterAnimationTimerRef.current);
    }
  };

  useEffect(() => {
    if (!open) {
      resetUploadStates('all');
      setCoverLetterText('');
      setLinks([{ id: Date.now(), value: '' }]);
    }
    return () => {
      resetUploadStates('all'); // Cleanup on unmount
    };
  }, [open]);

  const handleFileChange = (e, type) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    let setFile, setIsUploading, setUploadComplete, setProgress, progressIntervalRef, animationTimerRef;

    if (type === 'resume') {
      resetUploadStates('resume');
      setFile = setResumeFile;
      setIsUploading = setIsResumeUploading;
      setUploadComplete = setResumeUploadComplete;
      setProgress = setResumeUploadProgress;
      progressIntervalRef = resumeProgressIntervalRef;
      animationTimerRef = resumeAnimationTimerRef;
      setResumeError(''); // Clear resume error on new selection
    } else { // coverLetter
      resetUploadStates('coverLetter');
      setFile = setCoverLetterFile;
      setIsUploading = setIsCoverLetterUploading;
      setUploadComplete = setCoverLetterUploadComplete;
      setProgress = setCoverLetterUploadProgress;
      progressIntervalRef = coverLetterProgressIntervalRef;
      animationTimerRef = coverLetterAnimationTimerRef;
    }

    setFile(selectedFile);
    setIsUploading(true);
    setUploadComplete(false); // Ensure complete is false during animation
    setProgress(0);
    let currentProgress = 0;
    const targetProgress = 100;
    const animationDuration = 5000;
    const progressUpdateInterval = 50;
    const totalSteps = animationDuration / progressUpdateInterval;
    const increment = targetProgress / totalSteps;

    progressIntervalRef.current = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= targetProgress) {
        setProgress(targetProgress);
        clearInterval(progressIntervalRef.current);
      } else {
        setProgress(Math.floor(currentProgress));
      }
    }, progressUpdateInterval);

    animationTimerRef.current = setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true); // Now mark as complete
      setProgress(100);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }, animationDuration);
  };

  const handleTriggerFileInput = (type) => {
    if (type === 'resume') resumeFileInputRef.current.click();
    else coverLetterFileInputRef.current.click();
  };

  const handleRemoveFile = (type) => {
    resetUploadStates(type);
  };

  const handleAddLink = () => {
    const newLinkId = Date.now();
    // Set animating state for new link
    setAnimatingLinks(prev => ({ ...prev, [newLinkId]: 'entering' }));
    setLinks([...links, { id: newLinkId, value: '' }]);

    // Remove animation class after animation completes
    setTimeout(() => {
      setAnimatingLinks(prev => {
        const updated = { ...prev };
        delete updated[newLinkId];
        return updated;
      });
    }, 500);
  };

  const handleLinkChange = (id, newValue) => setLinks(links.map(link => (link.id === id ? { ...link, value: newValue } : link)));

  const handleRemoveLink = (idToRemove) => {
    if (links.length > 1) {
      // Set animating state for link being removed
      setAnimatingLinks(prev => ({ ...prev, [idToRemove]: 'exiting' }));

      // Remove after animation completes
      setTimeout(() => {
        setLinks(links.filter(link => link.id !== idToRemove));
      }, 300);
    }
  };

  const handleActualSubmit = () => {
    if (!resumeFile || !resumeUploadComplete) {
      setResumeError('Resume is required and must finish uploading.');
      return;
    }
    setResumeError('');

    console.log("Submitting Documents for internship:", internshipId, {
      resume: resumeFile ? resumeFile.name : null,
      coverLetterFile: coverLetterFile ? coverLetterFile.name : null,
      coverLetterText,
      links
    });

    // Show success feedback
    setFeedback('success');

    setTimeout(() => {
      setFeedback(null);
      console.log('Documents successfully submitted (simulated).');
      resetUploadStates('all');
      setCoverLetterText('');
      setLinks([{ id: Date.now(), value: '' }]);
      if (onClose) onClose(true, internshipId); // Indicate success and pass internshipId
    }, 1400);
  };

  const handleCancelAndClose = () => {
    resetUploadStates('all');
    setCoverLetterText('');
    setLinks([{ id: Date.now(), value: '' }]);
    if (onClose) onClose(false, null); // Indicate not a successful submission
  };

  const handleCoverLetterChange = (event) => setCoverLetterText(event.target.value);

  if (!open) return null;

  const renderUploadBox = (type) => {
    const isUploading = type === 'resume' ? isResumeUploading : isCoverLetterUploading;
    const file = type === 'resume' ? resumeFile : coverLetterFile;
    const uploadComplete = type === 'resume' ? resumeUploadComplete : coverLetterUploadComplete;
    const progress = type === 'resume' ? resumeUploadProgress : coverLetterUploadProgress;
    const title = type === 'resume' ? 'Resume' : 'Cover Letter';
    const isRequired = type === 'resume';

    return (
      <div style={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <label style={{ color: '#2A5F74', fontSize: '16px', fontWeight: '600', display: 'block', textAlign: 'left' }}>
            {title} {isRequired && <span style={{ color: '#D32F2F' }}>*</span>}
          </label>

          {type === 'resume' && resumeError && (
            <div style={{ color: '#D32F2F', fontSize: '12px', textAlign: 'right', marginLeft: '12px' }}>{resumeError}</div>
          )}
        </div>

        <div style={{
          border: '1px dashed #318FA8',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'left',
          backgroundColor: '#F8FAFB',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '180px',
          width: '100%',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05) inset',
          transition: 'all 0.2s ease'
        }}>
          {isUploading && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
              <div style={{ width: '120px', height: '120px', position: 'relative', margin: '0 auto 10px auto', zIndex: 10 }}>
                <Lottie animationData={animationData} loop={true} style={{ width: '100%', height: '100%' }} />
                <span style={{
                  position: 'absolute', top: '55%', left: '55%', transform: 'translate(-50%, -50%)',
                  color: '#2A5F74', fontSize: '20px', fontWeight: 'bold', zIndex: 11
                }}>{progress}%</span>
              </div>
            </div>
          )}

          {!isUploading && uploadComplete && file && (
            <div style={{
              backgroundColor: '#F0F9FB',
              padding: '8px 15px',
              borderRadius: '14px',
              fontSize: '14px',
              color: '#2A5F74',
              wordBreak: 'break-word',
              border: '1px solid #D9F0F4',
              marginTop: '20px',
              position: 'relative',
              paddingRight: '35px',
              width: 'calc(100% - 60px)',
              textAlign: 'left',
              margin: '0 auto',
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <div style={{
                background: '#D9F0F4',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '4px'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#318FA8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 8h-3V4h3v4zM12 18.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5s-1.6 3.5-3.5 3.5z" />
                </svg>
              </div>
              {file.name}
              <button onClick={() => handleRemoveFile(type)} style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                background: '#E0E0E0',
                border: 'none',
                cursor: 'pointer',
                color: '#2A5F74',
                padding: 0,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#D0D0D0'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#E0E0E0'}>
                <FontAwesomeIcon icon={faXmark} style={{ width: '10px', height: '10px' }} />
              </button>
            </div>
          )}

          {!isUploading && !uploadComplete && (
            <button onClick={() => handleTriggerFileInput(type)} style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '12px',
              color: '#2A5F74',
              fontSize: '16px',
              gap: '8px',
              width: '130px',
              marginTop: '24px',
              border: '1px solid #D9F0F4',
              alignSelf: 'center',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease'
            }}
              onMouseOver={(e) => {
                e.target.style.borderColor = '#3298BA';
                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = '#D9F0F4';
                e.target.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.05)';
              }}>
              <FontAwesomeIcon icon={faCloudArrowUp} style={{ width: '28px', height: '28px', color: '#318FA8' }} />
              <span style={{ fontWeight: '600', fontSize: '14px' }}>Upload</span>
            </button>
          )}
          <input
            type="file"
            ref={type === 'resume' ? resumeFileInputRef : coverLetterFileInputRef}
            onChange={(e) => handleFileChange(e, type)}
            style={{ display: 'none' }}
            accept=".pdf"
          />
        </div>
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 9999,
      backdropFilter: 'blur(2px)'
    }}>
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
                    background: '#318FA8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ fontSize: 32, color: 'white' }}
                  />
                </div>
              </motion.div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2A5F74', marginBottom: '10px' }}>
                Success!
              </div>
              <div style={{ color: '#333', textAlign: 'center' }}>
                Your documents have been successfully uploaded.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main modal content */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '24px 32px',
        borderRadius: '16px',
        fontFamily: 'IBM Plex Sans, sans-serif',
        width: '900px',
        margin: '0 auto',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25), 0 4px 10px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.1)'
      }}>
        <button onClick={handleCancelAndClose} style={{
          position: 'absolute', top: '20px', right: '20px',
          background: '#F0F0F0',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          color: '#2A5F74',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s ease'
        }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#E0E0E0'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#F0F0F0'}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h1 style={{
          color: '#2A5F74',
          fontSize: '22px',
          fontWeight: '600',
          marginBottom: '24px',
          textAlign: 'left',
          borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
          paddingBottom: '12px'
        }}>
          Upload Your Documents
        </h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '20px' }}>
          {renderUploadBox('resume')}
          {renderUploadBox('coverLetter')}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            color: '#2A5F74',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '10px',
            display: 'block',
            textAlign: 'left'
          }}>Write your own Cover Letter</label>
          <textarea
            value={coverLetterText}
            onChange={handleCoverLetterChange}
            placeholder="Type your cover letter here..."
            style={{
              width: '100%',
              height: '120px',
              border: '1px solid #D9F0F4',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '14px',
              color: '#2A5F74',
              resize: 'vertical',
              fontFamily: 'IBM Plex Sans, sans-serif',
              backgroundColor: '#F8FAFB',
              outline: 'none',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3298BA';
              e.target.style.boxShadow = '0 0 0 3px rgba(50, 152, 186, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#D9F0F4';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            color: '#2A5F74',
            fontSize: '16px',
            fontWeight: '600',
            display: 'block',
            marginBottom: '10px',
            textAlign: 'left'
          }}>Include a link to your GitHub profile and/or website</label>
          {links.map((link, index) => (
            <div
              key={link.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: index !== links.length - 1 ? '10px' : '0',
                opacity: animatingLinks[link.id] === 'entering' ? 0 : 1,
                transform: animatingLinks[link.id] === 'entering' ? 'translateY(-20px)' : 'translateY(0)',
                height: animatingLinks[link.id] === 'exiting' ? 0 : 'auto',
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out'
              }}
            >
              <div className="relative w-2/3">
                <input
                  type="text"
                  value={link.value}
                  onChange={(e) => handleLinkChange(link.id, e.target.value)}
                  placeholder="https://example.com"
                  style={{
                    width: '100%',
                    border: '1px solid #D9F0F4',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    fontSize: '14px',
                    color: '#2A5F74',
                    fontFamily: 'IBM Plex Sans, sans-serif',
                    backgroundColor: '#F8FAFB',
                    outline: 'none',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3298BA';
                    e.target.style.boxShadow = '0 0 0 3px rgba(50, 152, 186, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#D9F0F4';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {(links.length > 1 || index < links.length - 1) && index !== links.length - 1 && (
                <button
                  onClick={() => handleRemoveLink(link.id)}
                  style={{
                    backgroundColor: '#D32F2F',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#FFFFFF',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: '500',
                    padding: '0',
                    lineHeight: '1',
                    flexShrink: 0
                  }}
                >
                  -
                </button>
              )}
              {index === links.length - 1 && (
                <button
                  onClick={handleAddLink}
                  style={{
                    backgroundColor: '#318FA8',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#FFFFFF',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: '500',
                    padding: '0',
                    lineHeight: '0',
                    flexShrink: 0
                  }}
                >
                  +
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-7">
          <CustomButton
            onClick={handleCancelAndClose}
            variant="danger"
            text="Cancel"
            style={{ width: '200px' }}
          />
          <CustomButton
            onClick={handleActualSubmit}
            variant="primary"
            text="Upload"
            disabled={!resumeFile || !resumeUploadComplete || isResumeUploading}
            isLoading={isResumeUploading}
            style={{
              width: '200px',
              opacity: (!resumeFile || !resumeUploadComplete || isResumeUploading) ? 0.7 : 1
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadDocuments;