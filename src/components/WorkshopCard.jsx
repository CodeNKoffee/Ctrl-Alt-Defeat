import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from "react-i18next";
import { createSafeT } from "@/lib/translationUtils";

export default function WorkshopCard({ workshop, onClick, className = "" }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  // Format date for display
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString); // Ensure dateString is parsed correctly
    return dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  };

  // Label based on workshop type
  const getTypeLabel = () => {
    switch (workshop.type) {
      case "live":
        return {
          text: safeT('student.dashboard.statusPills.live'),
          bgColor: "bg-red-500",
          textColor: "text-white"
        };
      case "prerecorded":
        return {
          text: safeT('student.dashboard.statusPills.prerecorded'),
          bgColor: " bg-amber-200 ",
          textColor: "text-amber-900"
        };
      default: // regular/upcoming
        return {
          text: safeT('student.dashboard.statusPills.upcoming'),
          bgColor: "bg-green-600",
          textColor: "text-white"
        };
    }
  };

  // Button text based on workshop type
  const getButtonText = () => {
    switch (workshop.type) {
      case "live":
        return safeT('student.dashboard.joinNow');
      case "prerecorded":
        return safeT('student.dashboard.watchNow');
      default: // regular/upcoming
        return safeT('student.dashboard.registerNow');
    }
  };

  const typeLabel = getTypeLabel();

  // Get border color based on workshop type
  const getBorderHoverColor = () => {
    switch (workshop.type) {
      case "live":
        return "hover:border-red-500";
      case "prerecorded":
        return "hover:border-yellow-500";
      default: // regular/upcoming
        return "hover:border-green-600";
    }
  };

  return (
    <div
      onClick={() => onClick(workshop)}
      className={`bg-white border-2 border-[#B8E1E9] rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:scale-[1.02] ${getBorderHoverColor()} flex flex-col h-full w-full ${className}`}
      style={{ maxWidth: "100%" }}
    >
      {/* Workshop Image */}
      <div className="relative h-48 overflow-hidden w-full">
        <img
          src={workshop.imageUrl}
          alt={workshop.title}
          className="w-full h-full object-cover"
        />
        <span className={`absolute top-0 left-0 ${typeLabel.bgColor} ${typeLabel.textColor} text-xs font-medium px-3 py-1 rounded-br-md flex items-center gap-2`}>
          <span className={`h-2 w-2 rounded-full ${workshop.type === "live" ? "bg-red-300" : workshop.type === "prerecorded" ? "bg-amber-500" : "bg-green-300"}`}></span>
          {typeLabel.text}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow w-full">
        {/* Category Tag */}
        <span className={`text-xs font-medium mb-2 block ${workshop.type === "live"
          ? "text-red-600"
          : workshop.type === "prerecorded"
            ? "text-yellow-600"
            : "text-green-600"
          }`}>
          {workshop.type === "live" ? "LIVE WORKSHOP" :
            workshop.type === "prerecorded" ? "PRERECORDED WORKSHOP" : "WORKSHOP"}
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
              {formatDate(workshop.date)} • {workshop.time}
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