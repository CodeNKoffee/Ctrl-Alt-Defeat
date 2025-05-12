"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHighlighter, faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

/**
 * ReportViewer Component
 * 
 * A component that allows users to view report text and annotate it with comments and highlights.
 * The component supports:
 * - Text selection for commenting
 * - Highlighting text sections
 * - Adding comments to selected text
 * - Viewing all annotations in a sidebar
 * - Saving annotations
 */
export default function ReportViewer({ report }) {
  // Sample report data if none provided
  const sampleReport = {
    title: 'Frontend Development Internship Report',
    introduction: 'This report outlines my experience as a frontend developer intern at TechCorp from June to August 2025. During this period, I worked on several projects involving React, NextJS, and Tailwind CSS.',
    body: 'During my internship, I participated in the development of a customer-facing web application. I was responsible for implementing responsive UI components using React and ensuring compatibility across different browsers. The team followed an agile methodology with two-week sprints and daily stand-up meetings.\n\nOne of the most challenging aspects was optimizing performance for users with slow internet connections. I implemented code splitting and lazy loading techniques to improve the initial load time by 40%.\n\nI also had the opportunity to learn about state management with Redux and how to properly structure a large-scale application. My mentor provided valuable feedback on my code during regular code reviews, which significantly improved my coding practices.\n\nIn the final month, I was tasked with creating a design system to standardize UI components across the application. This involved close collaboration with UX designers and other frontend developers.'
  };

  const reportData = report || sampleReport;
  const [annotations, setAnnotations] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [selectedRange, setSelectedRange] = useState(null);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [activeAnnotation, setActiveAnnotation] = useState(null);
  const textRef = useRef(null);
  const [showAnnotations, setShowAnnotations] = useState(true);

  // Handle text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0 && textRef.current) {
      const range = selection.getRangeAt(0);
      const startNode = range.startContainer;
      const endNode = range.endContainer;
      
      // Only allow selection within the report text elements
      if (textRef.current.contains(startNode) && textRef.current.contains(endNode)) {
        setSelectedText(selection.toString());
        setSelectedRange({
          startOffset: range.startOffset,
          endOffset: range.endOffset,
          startContainerPath: getDOMPath(range.startContainer, textRef.current),
          endContainerPath: getDOMPath(range.endContainer, textRef.current),
          text: selection.toString()
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

  // Handle adding highlight to selected text
  const handleHighlight = () => {
    if (selectedText && selectedRange) {
      const newAnnotation = {
        id: Date.now(),
        type: 'highlight',
        text: selectedText,
        range: selectedRange,
        color: '#FFFBC9', // Default highlight color
      };
      setAnnotations([...annotations, newAnnotation]);
      setSelectedText('');
      setSelectedRange(null);
      window.getSelection().removeAllRanges();
    }
  };

  // Handle opening comment form for selected text
  const handleAddComment = () => {
    if (selectedText && selectedRange) {
      setIsCommenting(true);
    }
  };

  // Handle saving a comment
  const handleSaveComment = () => {
    if (commentText.trim() && selectedRange) {
      const newAnnotation = {
        id: Date.now(),
        type: 'comment',
        text: selectedText,
        range: selectedRange,
        comment: commentText
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
    setIsCommenting(false);
    setCommentText('');
  };

  // Delete an annotation
  const handleDeleteAnnotation = (id) => {
    setAnnotations(annotations.filter(ann => ann.id !== id));
    setActiveAnnotation(null);
  };

  // Toggle annotation panel
  const toggleAnnotations = () => {
    setShowAnnotations(!showAnnotations);
  };

  // Calculate text sections with annotations applied (for display purposes)
  const renderTextWithAnnotations = (text) => {
    // This is a simplified implementation that would need to be expanded
    // for a production-ready component that handles overlapping annotations
    
    return text;
  };

  return (
    <div className="report-viewer-container">
      <div className={`report-content-container ${showAnnotations ? 'with-sidebar' : ''}`}>
        <div className="report-actions">
          <button 
            onClick={handleHighlight} 
            disabled={!selectedText} 
            className={`action-button ${!selectedText ? 'disabled' : ''}`}
            title="Highlight selected text"
          >
            <FontAwesomeIcon icon={faHighlighter} />
            <span>Highlight</span>
          </button>
          <button 
            onClick={handleAddComment} 
            disabled={!selectedText} 
            className={`action-button ${!selectedText ? 'disabled' : ''}`}
            title="Comment on selected text"
          >
            <FontAwesomeIcon icon={faComment} />
            <span>Comment</span>
          </button>
          <button 
            onClick={toggleAnnotations}
            className="action-button"
            title={showAnnotations ? "Hide annotations panel" : "Show annotations panel"}
          >
            <FontAwesomeIcon icon={showAnnotations ? faTimes : faComment} />
            <span>{showAnnotations ? "Hide Annotations" : "Show Annotations"}</span>
          </button>
        </div>

        <div className="report-content" onMouseUp={handleTextSelection} ref={textRef}>
          <h1 className="report-title">{reportData.title}</h1>
          
          <div className="report-section">
            <h2 className="report-section-title">Introduction</h2>
            <p className="report-text">{reportData.introduction}</p>
          </div>
          
          <div className="report-section">
            <h2 className="report-section-title">Report Body</h2>
            <div className="report-text">
              {reportData.body.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="report-paragraph">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {isCommenting && (
          <div className="comment-form">
            <h3>Add Comment</h3>
            <p className="selected-text">"{selectedText}"</p>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add your comment here..."
              className="comment-input"
            />
            <div className="comment-actions">
              <button onClick={handleSaveComment} className="save-button">
                <FontAwesomeIcon icon={faSave} />
                <span>Save</span>
              </button>
              <button onClick={handleCancelComment} className="cancel-button">
                <FontAwesomeIcon icon={faTimes} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {showAnnotations && (
        <div className="annotations-sidebar">
          <div className="annotations-header">
            <h3>Annotations</h3>
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
                      {annotation.type === 'comment' ? 'Comment' : 'Highlight'}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAnnotation(annotation.id);
                      }}
                      className="delete-button"
                      title="Delete annotation"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  <div className="annotation-text">"{annotation.text}"</div>
                  {annotation.type === 'comment' && (
                    <div className="annotation-comment">{annotation.comment}</div>
                  )}
                </div>
              ))
            ) : (
              <p className="no-annotations">No annotations yet. Select text to add highlights or comments.</p>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .report-viewer-container {
          display: flex;
          height: 100%;
          min-height: 500px;
          background-color: var(--metallica-blue-50);
          border-radius: 12px;
          overflow: hidden;
        }
        
        .report-content-container {
          flex: 1;
          padding: 2rem;
          transition: all 0.3s ease;
        }
        
        .report-content-container.with-sidebar {
          width: calc(100% - 320px);
        }
        
        .report-actions {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--metallica-blue-200);
        }
        
        .action-button {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: var(--metallica-blue-600);
          color: white;
          border: none;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .action-button:hover {
          background-color: var(--metallica-blue-700);
        }
        
        .action-button.disabled {
          background-color: var(--metallica-blue-300);
          cursor: not-allowed;
        }
        
        .report-content {
          background-color: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .report-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--metallica-blue-800);
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid var(--metallica-blue-200);
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
          padding: 1.5rem;
          overflow-y: auto;
          box-shadow: -2px 0 8px rgba(0, 0, 0, 0.05);
        }
        
        .annotations-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--metallica-blue-200);
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
      `}</style>
    </div>
  );
}