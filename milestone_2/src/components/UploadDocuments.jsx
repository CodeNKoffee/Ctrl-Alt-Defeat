"use client";

// Import tools we need: React hooks to manage state and refs, and lottie-web to show animations
import { useState, useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faXmark } from '@fortawesome/free-solid-svg-icons';

// Create the main component for uploading documents
export default function UploadDocuments() {
  // Keep track of upload progress for resume and cover letter (starts at 0)
  const [resumeUploadProgress, setResumeUploadProgress] = useState(0);
  const [coverLetterUploadProgress, setCoverLetterUploadProgress] = useState(0);
  // Keep track of what the user types in the cover letter and GitHub link fields (starts empty)
  const [coverLetterText, setCoverLetterText] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [links, setLinks] = useState([{ id: 1, value: '' }]); // State for managing multiple links
  const [resumeError, setResumeError] = useState('');

  // Track the interval IDs for progress updates
  const resumeUploadInterval = useRef(null);
  const coverLetterUploadInterval = useRef(null);

  // Create placeholders (refs) to put our animations in different spots
  const resumeProgressCloudContainer = useRef(null); // For resume progress animation
  const coverLetterProgressCloudContainer = useRef(null); // For cover letter progress animation

  // Track the Lottie animation instances
  const resumeProgressAnim = useRef(null);
  const coverLetterProgressAnim = useRef(null);

  // Add this new function to handle adding new link fields
  const handleAddLink = () => {
    setLinks([...links, { id: Date.now(), value: '' }]);
  };

  // Add this new function to handle link value changes
  const handleLinkChange = (id, newValue) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, value: newValue } : link
    ));
  };

  // Add this new function to handle removing links
  const handleRemoveLink = (id) => {
    if (links.length > 1) {
      setLinks(links.filter(link => link.id !== id));
    }
  };

  // Load Lottie animation helper with error handling and delay
  const loadAnimation = (container, type) => {
    if (!container.current) {
      console.log(`${type} animation container not found`);
      return null;
    }

     // Clear any existing content
     container.current.innerHTML = '';

     console.log(`Attempting to load ${type} Lottie animation from public/Animation - 1746759825504.json`);
     try {
       const anim = lottie.loadAnimation({
         container: container.current,
         renderer: 'svg',
         loop: true,
         autoplay: true,
         path: 'public/Animation - 1746759825504.json', // Updated to new animation
         rendererSettings: {
           preserveAspectRatio: 'xMidYMid meet'
         }
       });
       anim.addEventListener('DOMLoaded', () => {
         console.log(`${type} Lottie animation DOM loaded`);
         // Check if SVG is in the DOM
         const svg = container.current.querySelector('svg');
         if (svg) {
           console.log(`${type} SVG found, size:`, svg.getBoundingClientRect());
         } else {
           console.log(`${type} No SVG found in container`);
         }
       });
       anim.addEventListener('error', (error) => {
         console.error(`${type} Lottie animation error:`, error);
       });
       anim.addEventListener('data_failed', (error) => {
         console.error(`${type} Lottie data load failed:`, error);
       });
       return anim;
     } catch (error) {
       console.error(`Failed to load ${type} Lottie animation:`, error);
       return null;
     }
   };

  // Handle animations when progress changes
  useEffect(() => {
    // Resume progress animation
    if (resumeUploadProgress > 0 && resumeUploadProgress < 100 && resumeProgressCloudContainer.current) {
      if (!resumeProgressAnim.current) {
        // Delay to ensure container is ready
        setTimeout(() => {
          resumeProgressAnim.current = loadAnimation(resumeProgressCloudContainer, 'resume');
        }, 100);
      }
    } else if (resumeUploadProgress === 100 && resumeProgressAnim.current) {
      console.log('Destroying resume animation');
      resumeProgressAnim.current.destroy();
      resumeProgressAnim.current = null;
    }

    // Cover letter progress animation
    if (coverLetterUploadProgress > 0 && coverLetterUploadProgress < 100 && coverLetterProgressCloudContainer.current) {
      if (!coverLetterProgressAnim.current) {
        // Delay to ensure container is ready
        setTimeout(() => {
          coverLetterProgressAnim.current = loadAnimation(coverLetterProgressCloudContainer, 'coverLetter');
        }, 100);
      }
    } else if (coverLetterUploadProgress === 100 && coverLetterProgressAnim.current) {
      console.log('Destroying cover letter animation');
      coverLetterProgressAnim.current.destroy();
      coverLetterProgressAnim.current = null;
    }

    // Cleanup on unmount
    return () => {
      if (resumeUploadInterval.current) clearInterval(resumeUploadInterval.current);
      if (coverLetterUploadInterval.current) clearInterval(coverLetterUploadInterval.current);
      if (resumeProgressAnim.current) {
        resumeProgressAnim.current.destroy();
        resumeProgressAnim.current = null;
      }
      if (coverLetterProgressAnim.current) {
        coverLetterProgressAnim.current.destroy();
        coverLetterProgressAnim.current = null;
      }
    };
  }, [resumeUploadProgress, coverLetterUploadProgress]);

 // Handle when a user picks a file to upload
const handleFileUpload = (event, type) => {
  const file = event.target.files[0];
  if (file) {
    const updateProgress = (progress, setProgress) => {
      if (progress >= 100) {
        setProgress(100);
        console.log(`${type} progress reached 100%`);
        return;
      }
      setProgress(progress);
      console.log(`${type} progress updating to:`, progress);
      setTimeout(() => {
        updateProgress(progress + 7, setProgress);
      }, 100);
    };

    if (type === 'resume') {
      setResumeFile(file);
      setResumeUploadProgress(0); // Start at 0%
      console.log('Starting resume upload progress');
      updateProgress(0, setResumeUploadProgress);
    } else if (type === 'coverLetter') {
      setCoverLetterFile(file);
      setCoverLetterUploadProgress(0); // Start at 0%
      console.log('Starting cover letter upload progress');
      updateProgress(0, setCoverLetterUploadProgress);
    }
  }
};
  // Remove the uploaded file
  const handleRemoveFile = (type) => {
    if (type === 'resume') {
      setResumeFile(null);
      setResumeUploadProgress(0);
      if (resumeUploadInterval.current) {
        clearInterval(resumeUploadInterval.current);
      }
    } else if (type === 'coverLetter') {
      setCoverLetterFile(null);
      setCoverLetterUploadProgress(0);
      if (coverLetterUploadInterval.current) {
        clearInterval(coverLetterUploadInterval.current);
      }
    }
  };

  // Save what the user types in the cover letter box
  const handleCoverLetterChange = (event) => {
    setCoverLetterText(event.target.value); // Update the cover letter text
  };

  // Save what the user types in the GitHub link box
  const handleGithubLinkChange = (event) => {
    setGithubLink(event.target.value); // Update the GitHub link
  };

  const handleUpload = () => {
    if (!resumeFile) {
      setResumeError('A resume is required to proceed.');
      return;
    }
    setResumeError('');
    // Add your upload logic here (e.g., API call or file processing)
    console.log('Uploading files:', { resumeFile, coverLetterFile, coverLetterText, links });
  };

  const handleCancel = () => {
    setResumeFile(null);
    setCoverLetterFile(null);
    setCoverLetterText('');
    setLinks([{ id: 1, value: '' }]);
    setResumeError('');
    setResumeUploadProgress(0);
    setCoverLetterUploadProgress(0);
  };

  return (
    // Main box with a light blue background, padding, and rounded corners to match the card design
    <div style={{ backgroundColor: '#F0F9FB', padding: '20px', borderRadius: '10px', fontFamily: 'IBM Plex Sans, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      {/* Title at the top in dark blue */}
      <h1 style={{ color: '#2A5F74', fontSize: '24px', fontWeight: '700', marginBottom: '20px', textAlign: 'center' }}>Upload Your Documents</h1>
      
      {/* Two side-by-side boxes for resume and cover letter uploads */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '20px' }}>
        {/* Resume upload box with dashed border and centered content */}
        <div style={{ width: '48%', border: '2px dashed #318FA8', borderRadius: '30px', padding: '20px', textAlign: 'center', backgroundColor: '#FFFFFF', position: 'relative' }}>
          <label style={{ color: '#2A5F74', fontSize: '16px', fontWeight: '600', marginBottom: '10px', display: 'block' }}>Resume <span style={{ color: '#D32F2F' }}>*</span></label>
          {resumeError && (
            <div style={{ color: '#D32F2F', fontSize: '12px', marginBottom: '8px' }}>
              {resumeError}
            </div>
          )}
          {!resumeFile ? (
            <>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e, 'resume')}
                style={{ display: 'none' }}
                id="resume-upload"
              />
              <label htmlFor="resume-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '15px', backgroundColor: '#D9F0F4', borderRadius: '20px', color: '#2A5F74', fontSize: '14px', gap: '8px', width: '100%' }}>
                <FontAwesomeIcon icon={faCloudArrowUp} style={{ width: '32px', height: '32px', color: '#318FA8' }} />
                <span style={{ fontWeight: '700' }}>Upload Resume</span>
              </label>
            </>
          ) : (
            <div style={{ position: 'relative' }}>
              <div style={{ 
                backgroundColor: '#F0F9FB',
                padding: '10px 15px',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#2A5F74',
                wordBreak: 'break-word',
                border: '1px solid #318FA8',
                marginBottom: '15px',
                position: 'relative',
                paddingRight: '35px'
              }}>
                {resumeFile.name}
                <button
                  onClick={() => handleRemoveFile('resume')}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#318FA8',
                    padding: 0
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
              <div style={{ 
                backgroundColor: '#D9F0F4',
                padding: '15px',
                borderRadius: '5px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                position: 'relative',
                zIndex: 1
              }}>
                <div 
                  ref={resumeProgressCloudContainer} 
                  style={{ 
                    width: '80px',
                    height: '80px',
                    position: 'relative',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    overflow: 'visible' // Ensure animation isn't clipped
                  }}
                />
                <span style={{ color: '#2A5F74', fontSize: '14px' }}>{resumeUploadProgress}%</span>
              </div>
            </div>
          )}
        </div>
        {/* Cover letter upload box with dashed border and centered content */}
        <div style={{ width: '48%', border: '2px dashed #318FA8', borderRadius: '30px', padding: '20px', textAlign: 'center', backgroundColor: '#FFFFFF', position: 'relative' }}>
          <label style={{ color: '#2A5F74', fontSize: '16px', fontWeight: '600', marginBottom: '10px', display: 'block' }}>Cover Letter</label>
          {!coverLetterFile ? (
            <>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e, 'coverLetter')}
                style={{ display: 'none' }}
                id="cover-letter-upload"
              />
              <label htmlFor="cover-letter-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '15px', backgroundColor: '#D9F0F4', borderRadius: '20px', color: '#2A5F74', fontSize: '14px', gap: '8px', width: '100%' }}>
                <FontAwesomeIcon icon={faCloudArrowUp} style={{ width: '32px', height: '32px', color: '#318FA8' }} />
                <span style={{ fontWeight: '700' }}>Upload Cover Letter</span>
              </label>
            </>
          ) : (
            <div style={{ position: 'relative' }}>
              <div style={{ 
                backgroundColor: '#F0F9FB',
                padding: '10px 15px',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#2A5F74',
                wordBreak: 'break-word',
                border: '1px solid #318FA8',
                marginBottom: '15px',
                position: 'relative',
                paddingRight: '35px'
              }}>
                {coverLetterFile.name}
                <button
                  onClick={() => handleRemoveFile('coverLetter')}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#318FA8',
                    padding: 0
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
              <div style={{ 
                backgroundColor: '#D9F0F4',
                padding: '15px',
                borderRadius: '5px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                position: 'relative',
                zIndex: 1
              }}>
                <div 
                  ref={coverLetterProgressCloudContainer} 
                  style={{ 
                    width: '80px',
                    height: '80px',
                    position: 'relative',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    overflow: 'visible' // Ensure animation isn't clipped
                  }}
                />
                <span style={{ color: '#2A5F74', fontSize: '14px' }}>{coverLetterUploadProgress}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Text area for writing a custom cover letter */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: '#2A5F74', fontSize: '16px', fontWeight: '600', marginBottom: '10px', display: 'block' }}>Write your own Cover Letter</label>
        <textarea
          value={coverLetterText}
          onChange={handleCoverLetterChange}
          placeholder="Type your cover letter here..."
          style={{ 
            width: '100%', 
            height: '120px', 
            border: '2px solid #318FA8', 
            borderRadius: '20px', 
            padding: '12px', 
            fontSize: '14px', 
            color: '#2A5F74', 
            resize: 'vertical', 
            fontFamily: 'IBM Plex Sans, sans-serif',
            backgroundColor: '#FFFFFF'
          }}
        />
      </div>

      {/* Multiple links section */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: '#2A5F74', fontSize: '16px', fontWeight: '600', display: 'block', marginBottom: '10px' }}>
          Include links to your GitHub profile and/or website
        </label>
        {links.map((link, index) => (
          <div key={link.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: index !== links.length - 1 ? '10px' : '0' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                value={link.value}
                onChange={(e) => handleLinkChange(link.id, e.target.value)}
                placeholder="https://github.com/yourusername"
                style={{ 
                  width: '100%',
                  border: '2px solid #318FA8', 
                  borderRadius: '50px', 
                  padding: '10px 12px', 
                  fontSize: '14px', 
                  color: '#2A5F74', 
                  fontFamily: 'IBM Plex Sans, sans-serif',
                  backgroundColor: '#FFFFFF'
                }}
              />
            </div>
            {links.length > 1 && (
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
                  lineHeight: '1',
                  flexShrink: 0
                }}
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Cancel and Upload buttons aligned to the right */}
      <div>
        <div className="flex flex-col space-y-4">
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button style={{ 
              backgroundColor: '#D32F2F', 
              color: '#FFFFFF', 
              padding: '10px 30px', 
              borderRadius: '5px', 
              border: 'none', 
              cursor: 'pointer', 
              borderRadius: '70px',
              fontSize: '16px', 
              fontWeight: '500',
              fontFamily: 'IBM Plex Sans, sans-serif' 
            }}
            onClick={handleCancel}>
              Cancel
            </button>
            <button style={{ 
              backgroundColor: '#318FA8', 
              color: '#FFFFFF', 
              padding: '10px 30px', 
              borderRadius: '5px', 
              border: 'none', 
              cursor: 'pointer', 
              borderRadius: '70px',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'IBM Plex Sans, sans-serif'
            }}
            onClick={handleUpload}>
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}