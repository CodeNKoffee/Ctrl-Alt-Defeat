"use client"
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

export default function Evaluation({ evaluation, expanded, onExpand, stakeholder = "other" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-md p-6 max-w-xs mx-auto flex flex-col items-center relative border border-[#E2F4F7] transition-all duration-300 ${expanded ? 'ring-2 ring-[#3298BA] scale-105 z-10' : ''}`}>
      {stakeholder !== "student" && (
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#E2F4F7] mb-2">
          <img
            src={evaluation.avatar || "/images/icons8-avatar-50.png"}
            alt={evaluation.studentName}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="text-center mb-2">
        {stakeholder !== "student" && (
          <h3 className="text-lg font-bold text-[#2A5F74]">{evaluation.studentName}</h3>
        )}
        <p className="text-sm text-gray-400">{evaluation.major}</p>
        <p className="text-sm text-[#3298BA] font-semibold">{evaluation.companyName}</p>
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
      >
        {expanded ? "Hide" : "See More"}
      </button>
      {expanded && (
        <div className="mt-4 w-full text-left text-sm text-[#2A5F74] space-y-2 animate-fade-in">
          <div><span className="font-semibold">Supervisor Name:</span> {evaluation.supervisorName}</div>
          <div><span className="font-semibold">Supervisor Email:</span> {evaluation.supervisorEmail}</div>
          <div><span className="font-semibold">Tasks:</span> {evaluation.tasks}</div>
          <div><span className="font-semibold">Work Environment:</span> {evaluation.environment}</div>
          <div><span className="font-semibold">Internship Start:</span> {evaluation.startDate}</div>
          <div><span className="font-semibold">Internship End:</span> {evaluation.endDate}</div>
        </div>
      )}
    </div>
  );
}
