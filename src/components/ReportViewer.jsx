"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHighlighter, faSave, faTimes, faTrash, faPalette, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import CustomButton from './shared/CustomButton';

/**
 * ReportViewer Component
 * 
 * A component that allows users to view report text and annotate it with comments and highlights.
 * The component supports:
 * - Text selection for commenting
 * - Highlighting text sections with different colors
 * - Adding comments to selected text
 * - Viewing all annotations in a sidebar
 * - Saving annotations
 */
export default function ReportViewer({ report, userType = "faculty" }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  // Sample report data if none provided
  const sampleReport = {
    title: 'Frontend Development Internship Report',
    introduction: 'This report outlines my experience as a frontend developer intern at TechCorp from June to August 2025. During this period, I worked on several projects involving React, NextJS, and Tailwind CSS.',
    body: 'During my internship, I participated in the development of a customer-facing web application. I was responsible for implementing responsive UI components using React and ensuring compatibility across different browsers. The team followed an agile methodology with two-week sprints and daily stand-up meetings.\n\nOne of the most challenging aspects was optimizing performance for users with slow internet connections. I implemented code splitting and lazy loading techniques to improve the initial load time by 40%.\n\nI also had the opportunity to learn about state management with Redux and how to properly structure a large-scale application. My mentor provided valuable feedback on my code during regular code reviews, which significantly improved my coding practices.\n\nIn the final month, I was tasked with creating a design system to standardize UI components across the application. This involved close collaboration with UX designers and other frontend developers.',
    status: 'approved' // Example status
  };

  const reportData = report || sampleReport;
  const [annotations, setAnnotations] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [selectedRange, setSelectedRange] = useState(null);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isSelectingHighlightColor, setIsSelectingHighlightColor] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [activeAnnotation, setActiveAnnotation] = useState(null);
  const textRef = useRef(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [scadReason, setScadReason] = useState('');
  const [onSubmitReason, setOnSubmitReason] = useState(null);
  const [scadReasonSubmitted, setScadReasonSubmitted] = useState(false);

  // Highlight color options
  const highlightColors = [
    { name: safeT('reportViewer.colors.yellow'), value: '#FFFBC9' }, // Pastel yellow
    { name: safeT('reportViewer.colors.green'), value: '#D1F5D3' },  // Pastel green
    { name: safeT('reportViewer.colors.pink'), value: '#FFDBF2' },   // Pastel pink
    { name: safeT('reportViewer.colors.blue'), value: '#D4F1F9' }    // Pastel blue
  ];

  // Current selected color
  const [selectedColor, setSelectedColor] = useState(highlightColors[0].value);

  // Floating toolbar state
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0, visible: false });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const toolbarRef = useRef(null);

  // Enable annotation tools for faculty only if the report status is 'pending'. Otherwise, read-only for faculty, SCAD, and students.
  // For 'student-draft', hide annotation sidebar and tools
  const isReadOnly = userType === "scad" || userType === "student" || userType === "student-draft" || (userType === "faculty" && report?.status !== 'pending');
  const hideAnnotations = userType === "student-draft";

  // Helper to get the full report text for annotation extraction
  function getReportText(sectionKey = 'body') {
    if (sectionKey === 'introduction') return report?.introduction || '';
    return report?.body || '';
  }

  // Load highlights/comments from report prop if present
  useEffect(() => {
    if (report && (report.highlights || report.comments)) {
      const highlights = (report.highlights || []).map((h, idx) => {
        const sectionText = h.section === 'introduction' ? report.introduction : report.body;
        return {
          id: `highlight-${idx}`,
          type: 'highlight',
          text: sectionText?.substring(h.start, h.end) || '',
          color: h.color || '#FFFBC9',
          range: { start: h.start, end: h.end },
          section: h.section || 'body',
        };
      });
      const comments = (report.comments || []).map((c, idx) => {
        const sectionText = c.section === 'introduction' ? report.introduction : report.body;
        return {
          id: `comment-${idx}`,
          type: 'comment',
          text: sectionText?.substring(c.position, c.position + 20) || '',
          comment: c.text,
          range: { start: c.position, end: c.position + 20 },
          section: c.section || 'body',
        };
      });
      setAnnotations([...highlights, ...comments]);
    } else {
      setAnnotations([]);
    }
  }, [report]);

  // Handle text selection
  const handleTextSelection = () => {
    if (isReadOnly) return; // Disable in read-only mode
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0 && textRef.current) {
      const range = selection.getRangeAt(0);
      const startNode = range.startContainer;
      const endNode = range.endContainer;

      // Only allow selection within the report text elements
      if (textRef.current.contains(startNode) && textRef.current.contains(endNode)) {
        // Determine which section the selection is from
        let section = 'body'; // default
        let textContainer = null;
        let currentNode = startNode;
        while (currentNode && currentNode !== textRef.current) {
          if (currentNode.parentNode) {
            const parentClasses = currentNode.parentNode.className;
            if (typeof parentClasses === 'string' && parentClasses.includes('introduction-section')) {
              section = 'introduction';
              // Find the actual text container within the section
              const textElement = currentNode.parentNode.querySelector('.report-text');
              textContainer = textElement || currentNode.parentNode;
              break;
            }
            if (typeof parentClasses === 'string' && parentClasses.includes('body-section')) {
              section = 'body';
              // Find the actual text container within the section
              const textElement = currentNode.parentNode.querySelector('.report-text');
              textContainer = textElement || currentNode.parentNode;
              break;
            }
          }
          currentNode = currentNode.parentNode;
        }

        // Calculate the text offset within the actual text content
        let sectionStartOffset = 0;
        let sectionEndOffset = 0;

        if (textContainer) {
          const beforeSelection = range.cloneRange();
          beforeSelection.selectNodeContents(textContainer);
          beforeSelection.setEnd(range.startContainer, range.startOffset);
          sectionStartOffset = beforeSelection.toString().length;
          sectionEndOffset = sectionStartOffset + selection.toString().length;
        }

        setSelectedText(selection.toString());
        setSelectedRange({
          startOffset: range.startOffset,
          endOffset: range.endOffset,
          start: sectionStartOffset,
          end: sectionEndOffset,
          startContainerPath: getDOMPath(range.startContainer, textRef.current),
          endContainerPath: getDOMPath(range.endContainer, textRef.current),
          text: selection.toString(),
          section: section
        });
      }
    }
  };

  // Get DOM path for saving selection position
  const getDOMPath = (node, rootNode) => {
    const path = [];
    let current = node;
    while (current !== rootNode) {
      if (!current.parentNode) break;
      const index = Array.from(current.parentNode.childNodes).indexOf(current);
      path.unshift(index);
      current = current.parentNode;
    }
    return path;
  };

  // Show color selection panel
  const handleShowColorSelection = () => {
    if (isReadOnly) return;
    if (selectedText && selectedRange) {
      setIsSelectingHighlightColor(true);
    }
  };

  // Handle adding highlight to selected text
  const handleHighlight = (color) => {
    if (isReadOnly) return;
    if (selectedText && selectedRange) {
      const newAnnotation = {
        id: Date.now(),
        type: 'highlight',
        text: selectedText,
        range: selectedRange,
        color: color || selectedColor,
        section: selectedRange.section || 'body'
      };
      setAnnotations([...annotations, newAnnotation]);
      setSelectedText('');
      setSelectedRange(null);
      setIsSelectingHighlightColor(false);
      window.getSelection().removeAllRanges();
    }
  };

  // Handle opening comment form for selected text
  const handleAddComment = () => {
    if (isReadOnly) return;
    if (selectedText && selectedRange) {
      setIsCommenting(true);
    }
  };

  // Handle saving a comment
  const handleSaveComment = () => {
    if (isReadOnly) return;
    if (commentText.trim() && selectedRange) {
      const newAnnotation = {
        id: Date.now(),
        type: 'comment',
        text: selectedText,
        range: selectedRange,
        comment: commentText,
        section: selectedRange.section || 'body'
      };
      setAnnotations([...annotations, newAnnotation]);
      setCommentText('');
      setIsCommenting(false);
      setSelectedText('');
      setSelectedRange(null);
      window.getSelection().removeAllRanges();
    }
  };

  // Handle canceling comment creation
  const handleCancelComment = () => {
    if (isReadOnly) return;
    setIsCommenting(false);
    setCommentText('');
  };

  // Handle canceling highlight color selection
  const handleCancelHighlightColor = () => {
    if (isReadOnly) return;
    setIsSelectingHighlightColor(false);
    setSelectedColor(highlightColors[0].value);
  };

  // Delete an annotation
  const handleDeleteAnnotation = (id) => {
    if (isReadOnly) return;
    setAnnotations(annotations.filter(ann => ann.id !== id));
    setActiveAnnotation(null);
  };

  // Toggle annotation panel
  const toggleAnnotations = () => {
    setShowAnnotations(!showAnnotations);
  };

  // Show floating toolbar above selection
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && selection.toString().trim().length > 0 && textRef.current.contains(selection.anchorNode)) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setToolbarPos({
          top: rect.top + window.scrollY - 48, // 48px above selection, relative to viewport
          left: rect.left + window.scrollX + rect.width / 2,
          visible: true
        });
      } else {
        setToolbarPos(pos => ({ ...pos, visible: false }));
        setShowColorPicker(false);
      }
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  // Hide toolbar on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setToolbarPos(pos => ({ ...pos, visible: false }));
        setShowColorPicker(false);
      }
    };
    if (toolbarPos.visible) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [toolbarPos.visible]);

  // Helper: Render text with highlights and comments using start/end indices
  function renderTextWithHighlights(text, sectionKey = 'body') {
    if (!text) return null;

    const sectionAnnotations = annotations.filter(a => (a.section || 'body') === sectionKey);

    let ranges = [];
    sectionAnnotations.forEach((annotation) => {
      let start, end;
      if (annotation.range && typeof annotation.range.start === 'number') {
        start = annotation.range.start;
        end = annotation.range.end;
      } else if (annotation.text) {
        // Fallback for newly created annotations that don't have start/end offsets.
        // This is not robust and may fail if the same text is repeated.
        const FuzzFactor = 20; // For comments, the text is a snippet
        const annText = annotation.type === 'comment' ? annotation.text.slice(0, FuzzFactor) : annotation.text;
        const index = text.indexOf(annText);
        if (index !== -1) {
          start = index;
          end = index + annotation.text.length;
        }
      }

      if (typeof start === 'number') {
        const rangeData = {
          start,
          end,
          id: annotation.id
        };
        if (annotation.type === 'highlight') {
          ranges.push({ ...rangeData, type: 'highlight', color: annotation.color });
        } else if (annotation.type === 'comment') {
          ranges.push({ ...rangeData, type: 'comment', comment: annotation.comment });
        }
      }
    });

    // Sort by start index
    ranges.sort((a, b) => a.start - b.start);
    // Render text with highlights/comments
    let result = [];
    let lastIndex = 0;
    for (let i = 0; i < ranges.length; i++) {
      const r = ranges[i];
      if (r.start > lastIndex) {
        result.push(text.slice(lastIndex, r.start));
      }
      const annotatedText = text.slice(r.start, r.end);
      if (r.type === 'highlight') {
        result.push(
          <mark key={r.id} style={{ backgroundColor: r.color, borderRadius: 4, padding: '0 2px' }}>{annotatedText}</mark>
        );
      } else if (r.type === 'comment') {
        result.push(
          <span key={r.id} style={{ backgroundColor: '#FFDBF2', borderRadius: 4, padding: '0 2px', border: '1px dashed #C41E3A' }} title={r.comment}>
            {annotatedText}
          </span>
        );
      }
      lastIndex = r.end;
    }
    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }
    return result.length ? result : text;
  }

  // Handle PDF export (just shows toast for now)
  const handleExportPDF = () => {
    toast.info('PDF export started. Your document will be downloaded shortly.', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="report-viewer-container">
      <div className={`report-content-container ${showAnnotations ? 'with-sidebar' : ''}`}>
        {/* Floating annotation toolbar (hide for SCAD, Faculty, and Students) */}
        {!isReadOnly && toolbarPos.visible && (
          <div
            ref={toolbarRef}
            className="floating-toolbar"
            style={{ top: toolbarPos.top, left: toolbarPos.left, position: 'fixed', zIndex: 100 }}
          >
            <button
              className="toolbar-btn"
              aria-label="Highlight"
              onClick={() => setShowColorPicker(v => !v)}
              tabIndex={0}
            >
              <FontAwesomeIcon icon={faHighlighter} />
              <span className="toolbar-tooltip">Highlight</span>
            </button>
            <button
              className="toolbar-btn"
              aria-label="Comment"
              onClick={handleAddComment}
              tabIndex={0}
            >
              <FontAwesomeIcon icon={faComment} />
              <span className="toolbar-tooltip">Comment</span>
            </button>
            {showColorPicker && (
              <div className="color-picker-popover">
                {highlightColors.map((color, idx) => (
                  <button
                    key={color.value}
                    className={`color-dot ${selectedColor === color.value ? 'selected' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => { handleHighlight(color.value); setShowColorPicker(false); }}
                    aria-label={color.name}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        <div className="report-content" onMouseUp={handleTextSelection} ref={textRef}>
          <div className="report-header">
            <h1 className="report-title">{reportData.title}</h1>
            <div className="report-actions">
              {/* <button
                onClick={handleExportPDF}
                className="export-pdf-tab"
              >
                <FontAwesomeIcon icon={faFilePdf} className="pdf-icon" />
                Export as PDF
              </button> */}
            </div>
          </div>
          <div className="report-section introduction-section">
            <h2 className="report-section-title">Introduction</h2>
            <p className="report-text">{renderTextWithHighlights(reportData.introduction, 'introduction')}</p>
          </div>
          <div className="report-section body-section">
            <h2 className="report-section-title">Report Body</h2>
            <div className="report-text">
              <p className="report-paragraph" style={{ whiteSpace: 'pre-wrap' }}>
                {renderTextWithHighlights(reportData.body || reportData.text || "", 'body')}
              </p>
            </div>
          </div>
        </div>

        {/* Comment/Highlight forms (hide for read-only) */}
        {!isReadOnly && isCommenting && (
          <div className="comment-form">
            <h3>{safeT('reportViewer.commentForm.title')}</h3>
            <p className="selected-text">"{selectedText}"</p>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={safeT('reportViewer.commentForm.placeholder')}
              className="comment-input"
            />
            <div className="comment-actions">
              <button onClick={handleSaveComment} className="save-button">
                <FontAwesomeIcon icon={faSave} />
                <span>{safeT('reportViewer.commentForm.save')}</span>
              </button>
              <button onClick={handleCancelComment} className="cancel-button">
                <FontAwesomeIcon icon={faTimes} />
                <span>{safeT('reportViewer.commentForm.cancel')}</span>
              </button>
            </div>
          </div>
        )}

        {!isReadOnly && isSelectingHighlightColor && (
          <div className="highlight-color-form">
            <h3>{safeT('reportViewer.highlightForm.title')}</h3>
            <p className="selected-text">"{selectedText}"</p>
            <div className="color-options">
              {highlightColors.map((color, index) => (
                <button
                  key={index}
                  className={`color-option ${selectedColor === color.value ? 'selected' : ''}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleHighlight(color.value)}
                  title={color.name}
                >
                  <span className="color-preview" style={{ backgroundColor: color.value }}></span>
                  <span className="color-name">{color.name}</span>
                </button>
              ))}
            </div>
            <div className="preview-section">
              <span>{safeT('reportViewer.highlightForm.preview')} </span>
              <span className="highlight-preview" style={{ backgroundColor: selectedColor }}>
                {selectedText.length > 30 ? selectedText.substring(0, 30) + '...' : selectedText}
              </span>
            </div>
            <div className="comment-actions">
              <button onClick={handleCancelHighlightColor} className="cancel-button">
                <FontAwesomeIcon icon={faTimes} />
                <span>{safeT('reportViewer.highlightForm.cancel')}</span>
              </button>
            </div>
          </div>
        )}

        {/* SCAD reason input for flagged/rejected */}
        {userType === "scad" && (reportData.status === 'flagged' || reportData.status === 'rejected') && (
          <div className="mt-8 p-4 bg-metallica-blue-50 rounded-lg border border-metallica-blue-200">
            <h3 className="text-metallica-blue-800 font-semibold mb-2">{safeT('reportViewer.scadForm.title')}</h3>
            <textarea
              className="w-full p-2 border border-metallica-blue-200 rounded mb-2 focus:outline-none focus:border-metallica-blue-500 focus:ring-2 focus:ring-metallica-blue-200 transition-all duration-200"
              placeholder={safeT('reportViewer.scadForm.placeholder')}
              value={scadReason || ''}
              onChange={e => setScadReason(e.target.value)}
            />
            <button
              className="inline-flex items-center justify-center w-40 min-w-[10rem] px-0 py-2 rounded-full font-medium shadow-sm bg-metallica-blue-500 text-white border border-metallica-blue-200 hover:bg-metallica-blue-900 hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-metallica-blue-200 focus:ring-offset-2"
              onClick={() => {
                if (onSubmitReason) onSubmitReason(scadReason);
                setScadReasonSubmitted(true);
                setTimeout(() => setScadReasonSubmitted(false), 2000);
              }}
            >
              {safeT('reportViewer.scadForm.submitButton')}
            </button>
            {scadReasonSubmitted && (
              <div className="mt-3 text-green-700 font-semibold text-center">
                {safeT('reportViewer.scadForm.successMessage')}
              </div>
            )}
          </div>
        )}
      </div>

      {showAnnotations && !hideAnnotations && (
        <div className="annotations-sidebar">
          <div className="annotations-header">
            <h3>{safeT('reportViewer.annotations.title')}</h3>
            <span className="annotation-count">{annotations.length}</span>
          </div>

          <div className="annotations-list">
            {annotations.length > 0 ? (
              annotations.map(annotation => (
                <div
                  key={annotation.id}
                  className={`annotation-item ${annotation.type} ${activeAnnotation === annotation.id ? 'active' : ''}`}
                  onClick={() => setActiveAnnotation(activeAnnotation === annotation.id ? null : annotation.id)}
                >
                  <div className="annotation-header">
                    <span className="annotation-type">
                      <FontAwesomeIcon icon={annotation.type === 'comment' ? faComment : faHighlighter} />
                      {annotation.type === 'comment' ? safeT('reportViewer.annotationTypes.comment') : safeT('reportViewer.annotationTypes.highlight')}
                    </span>
                    {/* Hide delete button in read-only mode */}
                    {!isReadOnly && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAnnotation(annotation.id);
                        }}
                        className="delete-button"
                        title={safeT('reportViewer.annotations.deleteTooltip')}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </div>
                  <div
                    className="annotation-text"
                    style={annotation.type === 'highlight' ? { backgroundColor: annotation.color } : {}}
                  >
                    {annotation.text ? `"${annotation.text}"` : <em>{safeT('reportViewer.errors.noTextFound')}</em>}
                  </div>
                  {annotation.type === 'comment' && (
                    <div className="annotation-comment">{annotation.comment}</div>
                  )}
                </div>
              ))
            ) : (
              <p className="no-annotations">{safeT('reportViewer.annotations.noAnnotations')}</p>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .report-viewer-container {
          display: flex;
          height: 100%;
          min-height: 500px;
          max-height: 70vh; /* Set maximum height */
          background-color: var(--metallica-blue-50);
          border-radius: 12px;
          overflow: hidden;
        }
        
        .report-content-container {
          flex: 1;
          padding: 2rem;
          transition: all 0.3s ease;
          overflow: hidden; /* Hide overflow */
          display: flex;
          flex-direction: column;
        }
        
        .report-content-container.with-sidebar {
          width: calc(100% - 320px);
        }
        
        .report-content {
          background-color: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          overflow-y: auto; /* Make content scrollable */
          flex-grow: 1;
          max-height: 100%;
        }
        
        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid var(--metallica-blue-200);
        }
        
        .report-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--metallica-blue-800);
          margin-bottom: 0;
        }
        
        .report-actions {
          display: flex;
          gap: 1rem;
        }
        
        .report-section {
          margin-bottom: 1.5rem;
        }
        
        .report-section-title {
          font-size: 1.25rem;
          color: var(--metallica-blue-700);
          margin-bottom: 0.75rem;
          font-weight: 600;
        }
        
        .report-text {
          line-height: 1.6;
          color: var(--metallica-blue-900);
        }
        
        .report-paragraph {
          margin-bottom: 1rem;
        }
        
        .annotations-sidebar {
          width: 320px;
          background-color: white;
          border-left: 1px solid var(--metallica-blue-200);
          display: flex;
          flex-direction: column;
          box-shadow: -2px 0 8px rgba(0, 0, 0, 0.05);
          max-height: 70vh; /* Match container height */
        }
        
        .annotations-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 1.5rem 0.5rem;
          border-bottom: 1px solid var(--metallica-blue-200);
          flex-shrink: 0; /* Prevent header from shrinking */
        }
        
        .annotations-header h3 {
          color: var(--metallica-blue-700);
          font-weight: 600;
          font-size: 1.125rem;
        }
        
        .annotation-count {
          background-color: var(--metallica-blue-100);
          color: var(--metallica-blue-700);
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: bold;
        }
        
        .annotations-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1.5rem;
          overflow-y: auto; /* Make annotations scrollable */
          flex-grow: 1; /* Allow list to grow and fill space */
        }
        
        .annotation-item {
          padding: 0.75rem;
          border-radius: 6px;
          border: 1px solid var(--metallica-blue-200);
          transition: all 0.2s ease;
        }
        
        .annotation-item:hover {
          border-color: var(--metallica-blue-500);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .annotation-item.active {
          border-color: var(--metallica-blue-500);
          box-shadow: 0 2px 8px rgba(49, 143, 168, 0.2);
        }
        
        .annotation-item.highlight {
          background-color: #FEFDF5;
        }
        
        .annotation-item.comment {
          background-color: var(--metallica-blue-50);
        }
        
        .annotation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .annotation-type {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.875rem;
          color: var(--metallica-blue-600);
          font-weight: 500;
        }
        
        .delete-button {
          background: none;
          border: none;
          color: var(--metallica-blue-500);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .delete-button:hover {
          color: #C41E3A;
          background-color: #FEE2E2;
        }
        
        .annotation-text {
          font-size: 0.875rem;
          color: var(--metallica-blue-900);
          margin-bottom: 0.5rem;
          word-break: break-word;
        }
        
        .annotation-comment {
          font-size: 0.875rem;
          background-color: white;
          padding: 0.5rem;
          border-radius: 4px;
          border: 1px solid var(--metallica-blue-200);
          color: var(--metallica-blue-800);
        }
        
        .no-annotations {
          color: var(--metallica-blue-500);
          font-style: italic;
          font-size: 0.875rem;
        }
        
        .comment-form {
          position: absolute;
          width: 300px;
          background-color: white;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid var(--metallica-blue-200);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          right: 2rem;
          top: 2rem;
          z-index: 10;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .comment-form h3 {
          color: var(--metallica-blue-700);
          margin-bottom: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
        }
        
        .selected-text {
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: var(--metallica-blue-700);
          padding: 0.5rem;
          background-color: var(--metallica-blue-50);
          border-radius: 4px;
          max-height: 120px;
          overflow-y: auto;
        }
        
        .comment-input {
          width: 100%;
          min-height: 100px;
          padding: 0.5rem;
          border: 1px solid var(--metallica-blue-300);
          border-radius: 4px;
          resize: vertical;
          margin-bottom: 0.75rem;
          transition: border-color 0.2s ease;
        }
        
        .comment-input:focus {
          border-color: var(--metallica-blue-500);
          outline: none;
          box-shadow: 0 0 0 2px rgba(49, 143, 168, 0.2);
        }
        
        .comment-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        
        .save-button, .cancel-button {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .save-button {
          background-color: var(--metallica-blue-600);
          color: white;
        }
        
        .save-button:hover {
          background-color: var(--metallica-blue-700);
        }
        
        .cancel-button {
          background-color: #E5E7EB;
          color: #4B5563;
        }
        
        .cancel-button:hover {
          background-color: #D1D5DB;
        }
        
        .highlight-color-form {
          position: absolute;
          width: 300px;
          background-color: white;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid var(--metallica-blue-200);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          right: 2rem;
          top: 2rem;
          z-index: 10;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .highlight-color-form h3 {
          color: var(--metallica-blue-700);
          margin-bottom: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
        }
        
        .color-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        
        .color-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border: 1px solid var(--metallica-blue-300);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .color-option.selected {
          border-color: var(--metallica-blue-500);
          box-shadow: 0 0 0 2px rgba(49, 143, 168, 0.2);
        }
        
        .color-preview {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }
        
        .color-name {
          font-size: 0.875rem;
          color: var(--metallica-blue-700);
        }
        
        .preview-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        
        .highlight-preview {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
          color: var(--metallica-blue-900);
        }

        .floating-toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          padding: 12px 24px;
          position: fixed;
          transform: translate(-50%, -100%);
          border: 1.5px solid #E0E7EF;
        }
        .toolbar-btn {
          background: #f6f8fa;
          border: none;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(49,143,168,0.06);
          transition: background 0.15s, box-shadow 0.15s, transform 0.12s;
          position: relative;
          color: #2A5F74;
          font-size: 20px;
          outline: none;
        }
        .toolbar-btn:focus {
          box-shadow: 0 0 0 2px #318FA8, 0 2px 8px rgba(49,143,168,0.06);
        }
        .toolbar-btn:hover {
          background: #e6f2fa;
          transform: translateY(-2px) scale(1.07);
        }
        .toolbar-tooltip {
          display: none;
          position: absolute;
          top: -38px;
          left: 50%;
          transform: translateX(-50%);
          background: #fff;
          color: #2A5F74;
          font-size: 12px;
          border-radius: 6px;
          padding: 4px 10px;
          border: 1px solid #318FA8;
          box-shadow: 0 2px 8px rgba(49,143,168,0.08);
          white-space: nowrap;
          z-index: 200;
        }
        .toolbar-btn:hover .toolbar-tooltip {
          display: block;
        }
        .color-picker-popover {
          display: flex;
          gap: 8px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(49,143,168,0.10);
          border: 1px solid #E0E7EF;
          padding: 8px 12px;
          position: absolute;
          top: 54px;
          left: 0;
          z-index: 300;
        }
        .color-dot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: border 0.15s, transform 0.12s;
        }
        .color-dot.selected {
          border: 2px solid #318FA8;
          transform: scale(1.12);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .report-viewer-container {
            flex-direction: column;
            max-height: none;
            height: auto;
          }
          
          .report-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .report-content-container {
            width: 100% !important;
            padding: 1rem;
          }
          
          .annotations-sidebar {
            width: 100%;
            border-left: none;
            border-top: 1px solid var(--metallica-blue-200);
            max-height: 300px;
          }
        }
        
        .export-pdf-tab {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: #e7f4f8;
          color: #318FA8;
          font-weight: 500;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 999px;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          font-size: 0.9rem;
          cursor: pointer;
        }
        
        .export-pdf-tab:hover {
          background-color: #d3edf5;
          transform: translateY(-1px);
        }
        
        .pdf-icon {
          color: #318FA8;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}
