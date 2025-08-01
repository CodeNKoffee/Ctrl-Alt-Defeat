import React from "react";
import Image from "next/image";

export default function AssessmentCard({ assessment, onClick, className = "" }) {
  return (
    <div
      onClick={() => onClick(assessment)}
      className={`bg-white border-2 border-[#B8E1E9] rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:scale-[1.02] hover:border-[#5DB2C7] flex flex-col h-full ${className}`}
    >
      {/* Assessment Image */}
      <div className="relative h-56">
        <img
          src={assessment.imageUrl}
          alt={assessment.title}
          className="w-full h-full object-cover"
        />
        {assessment.isPriority && (
          <span className="absolute top-0 left-0 bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-br-md">
            Priority
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category Tag */}
        <span className="text-xs text-blue-600 font-medium mb-2 block">
          {assessment.type || "ASSESSMENT"}
        </span>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[3rem]">
          {assessment.title}
        </h3>
      </div>
    </div>
  );
}