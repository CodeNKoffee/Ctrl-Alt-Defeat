import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

export default function WorkshopCard({ workshop, onClick }) {
  // Format date for display
  const formatDate = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div
      onClick={() => onClick(workshop)}
      className="bg-white border-2 border-[#B8E1E9] rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:scale-[1.02] hover:border-[#5DB2C7]"
    >
      {/* Workshop Image */}
      <div className="relative h-48">
        <img
          src={workshop.imageUrl}
          alt={workshop.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Category Tag */}
        <span className="text-xs text-blue-600 font-medium mb-2 block">
          {workshop.category || "WORKSHOP"}
        </span>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[3rem]">
          {workshop.title}
        </h3>

        {/* Date & Location */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 text-[#5DB2C7] mr-2" />
            <span>
              {formatDate(workshop.startDate)} • {formatTime(workshop.startDate)}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 text-[#5DB2C7] mr-2" />
            <span>{workshop.location || "Online"}</span>
          </div>
        </div>

        {/* Instructor Info */}
        <div className="flex items-center pt-3 border-t border-gray-100">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
            <img
              src={workshop.instructorImage || "/images/default-avatar.png"}
              alt={workshop.instructor}
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          </div>
          <p className="text-sm text-gray-700 font-medium">
            {workshop.instructor}
          </p>
        </div>
      </div>
    </div>
  );
}