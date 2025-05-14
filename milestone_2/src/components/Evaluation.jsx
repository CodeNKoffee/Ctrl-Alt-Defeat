"use client"
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar, faStarHalfAlt, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import EvaluationModal from "./EvaluationModal";

export default function Evaluation({ evaluation, expanded, onExpand, stakeholder = "other", isDraft = false }) {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowEditModal(true);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    console.log("Delete evaluation:", evaluation.id);
    // Add actual delete functionality here
  };

  const handleSaveEdit = (updatedData, isEdit) => {
    console.log("Updated evaluation data:", updatedData);
    // Here you would typically save the data to your backend
    // You might also want to update the local state or trigger a refetch
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
          <div className="absolute top-0 left-0 bg-amber-100 text-amber-800 px-2 py-1 text-xs font-medium z-40">
            Draft
          </div>
        )}
        
        {stakeholder !== "student" ? (
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#E2F4F7] mb-2">
            <img
              src={evaluation.avatar || "/images/icons8-avatar-50.png"}
              alt={evaluation.studentName}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#E2F4F7] mb-2 bg-white flex items-center justify-center">
            <img
              src={evaluation.companyLogo || "/logos/tawabiry.png"}
              alt={evaluation.companyName}
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <div className="text-center mb-2">
          {stakeholder !== "student" ? (
            <h3 className="text-lg font-bold text-[#2A5F74]">{evaluation.studentName}</h3>
          ) : (
            <h3 className="text-lg font-bold text-[#2A5F74]">{evaluation.companyName}</h3>
          )}
          <p className="text-sm text-gray-400">{stakeholder === "student" ? evaluation.supervisorName : evaluation.major}</p>
          {stakeholder !== "student" && (
            <p className="text-sm text-[#3298BA] font-semibold">{evaluation.companyName}</p>
          )}
        </div>
        <div className="flex justify-center mb-3">
          {[1,2,3,4,5].map((star) => {
            const full = evaluation.rating >= star;
            const half = !full && evaluation.rating >= star - 0.5;
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
            <div><span className="font-semibold">Supervisor Name:</span> {evaluation.supervisorName}</div>
            <div><span className="font-semibold">Supervisor Email:</span> {evaluation.supervisorEmail}</div>
            <div><span className="font-semibold">Tasks:</span> {evaluation.tasks}</div>
            <div><span className="font-semibold">Work Environment:</span> {evaluation.environment}</div>
            <div><span className="font-semibold">Internship Start:</span> {evaluation.startDate}</div>
            <div><span className="font-semibold">Internship End:</span> {evaluation.endDate}</div>
          </div>
        )}
      </div>

      {showEditModal && (
        <EvaluationModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleSaveEdit}
          evaluationToEdit={evaluation}
        />
      )}
    </>
  );
}
