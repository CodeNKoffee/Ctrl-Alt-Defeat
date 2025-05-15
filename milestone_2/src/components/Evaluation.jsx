"use client"
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar, faStarHalfAlt, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import EvaluationModal from "./EvaluationModal";
import { mockCompanyReviews } from "../../constants/mockData";

export default function Evaluation({ 
  evaluation, 
  expanded, 
  onExpand, 
  stakeholder = "other", 
  isDraft = false,
  onUpdate,
  onDelete 
}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [localEvaluation, setLocalEvaluation] = useState(evaluation);

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowEditModal(true);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    // Call the parent component's onDelete function
    if (onDelete) {
      onDelete(localEvaluation.id);
    }
    setShowDeleteConfirm(false);
  };

  const handleSaveEdit = (updatedData, isEdit) => {
    // Update the local state
    const updatedEvaluation = { ...localEvaluation, ...updatedData };
    setLocalEvaluation(updatedEvaluation);
    
    // Call the parent component's onUpdate function
    if (onUpdate) {
      onUpdate(updatedEvaluation);
    }
  };

  return (
    <>
      <div className={`bg-white rounded-2xl shadow-md p-6 max-w-xs mx-auto flex flex-col items-center relative border border-[#E2F4F7] transition-all duration-300 ${expanded ? 'ring-2 ring-[#3298BA] scale-105 z-30' : ''}`}>
        {isDraft && stakeholder === "student" && (
          <div 
            className="absolute top-4 right-4 flex items-center gap-2 " 
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: '4px', borderRadius: '4px' }}
          >
            <button 
              onClick={handleEdit}
              title="Edit evaluation"
              className="text-[#3298BA] hover:text-[#65bedc] p-1"
            >
              <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
            </button>
            <button 
              onClick={handleDelete}
              title="Delete evaluation"
              className="text-red-500 hover:text-red-700 p-1"
            >
              <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {isDraft && stakeholder === "student" && (
          <div className="absolute top-0 left-0 bg-amber-100 text-amber-800 px-2 py-1 text-xs font-medium z-40 rounded-tl-xl rounded-br-xl">
            Draft
          </div>
        )}
        
        {stakeholder !== "student" ? (
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#E2F4F7] mb-2">
            <img
              src={localEvaluation.avatar || "/images/icons8-avatar-50.png"}
              alt={localEvaluation.studentName}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#E2F4F7] mb-2 bg-white flex items-center justify-center">
            <img
              src={localEvaluation.companyLogo || "/logos/tawabiry.png"}
              alt={localEvaluation.companyName}
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <div className="text-center mb-2">
          {stakeholder !== "student" ? (
            <h3 className="text-lg font-bold text-[#2A5F74]">{localEvaluation.studentName}</h3>
          ) : (
            <h3 className="text-lg font-bold text-[#2A5F74]">{localEvaluation.companyName}</h3>
          )}
          <p className="text-sm text-gray-400">{stakeholder === "student" ? localEvaluation.supervisorName : localEvaluation.major}</p>
          {stakeholder !== "student" && (
            <p className="text-sm text-[#3298BA] font-semibold">{localEvaluation.companyName}</p>
          )}
        </div>
        <div className="flex justify-center mb-3">
          {[1,2,3,4,5].map((star) => {
            const full = localEvaluation.rating >= star;
            const half = !full && localEvaluation.rating >= star - 0.5;
            return (
              <span key={star} className="text-2xl mx-0.5">
                {full ? (
                  <FontAwesomeIcon icon={solidStar} className="text-[#FFD600]" />
                ) : half ? (
                  <FontAwesomeIcon icon={faStarHalfAlt} className="text-[#FFD600]" />
                ) : (
                  <FontAwesomeIcon icon={regularStar} className="text-[#E2F4F7]" />
                )}
              </span>
            );
          })}
        </div>
        <button
          className="w-full bg-[#3298BA] text-white font-semibold rounded-full py-2 mt-2 shadow-md hover:bg-[#65bedc] transition"
          onClick={onExpand}
          onKeyDown={(e) => e.key === 'Enter' && onExpand()}
          aria-expanded={expanded}
          aria-controls={expanded ? 'evaluation-details' : undefined}
        >
          {expanded ? "Hide" : "See More"}
        </button>
        {expanded && (
          <div 
            id="evaluation-details"
            className="absolute top-full left-0 right-0 mt-2 bg-white p-6 rounded-2xl shadow-lg border border-[#E2F4F7] text-left text-sm text-[#2A5F74] space-y-2 z-20 animate-fade-in"
            tabIndex={expanded ? 0 : -1}
            role="region"
            aria-label="Evaluation details"
          >
            <div><span className="font-semibold">Supervisor Name:</span> {localEvaluation.supervisorName}</div>
            <div><span className="font-semibold">Supervisor Email:</span> {localEvaluation.supervisorEmail}</div>
            <div><span className="font-semibold">Tasks:</span> {localEvaluation.tasks}</div>
            <div><span className="font-semibold">Work Environment:</span> {localEvaluation.environment}</div>
            <div><span className="font-semibold">Internship Start:</span> {localEvaluation.startDate}</div>
            <div><span className="font-semibold">Internship End:</span> {localEvaluation.endDate}</div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EvaluationModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleSaveEdit}
          evaluationToEdit={localEvaluation}
          mockReviews={mockCompanyReviews}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(21,43,55,0.75)]" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-[#2A5F74] mb-3">Confirm Delete</h3>
            <p className="text-[#4C798B] mb-4">Are you sure you want to delete this evaluation draft? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
