import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUsers, faMapMarkerAlt, faClock, faUserTie, faListUl, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function WorkshopSidebar({ workshop, onClose }) {
  // Format date for display
  const formatDateFull = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Calculate duration
  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const durationMs = endDate - startDate;
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${durationHours > 0 ? `${durationHours}h ` : ''}${durationMinutes > 0 ? `${durationMinutes}m` : ''}`;
  };

  return (
    <AnimatePresence>
      {workshop && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed right-0 top-0 bottom-0 w-full sm:w-1/2 lg:w-1/3 bg-white shadow-xl overflow-y-auto z-20"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors z-10"
          >
            <FontAwesomeIcon icon={faTimes} className="h-5 w-5 text-gray-600" />
          </button>

          {/* Workshop Cover Image */}
          <div className="relative h-64 w-full">
            <img
              src={workshop.imageUrl}
              alt={workshop.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full mb-2">
                {workshop.category || "WORKSHOP"}
              </span>
              <h2 className="text-white text-2xl font-bold">{workshop.title}</h2>
            </div>
          </div>

          {/* Workshop Details */}
          <div className="p-6 space-y-6">
            {/* Date and Time Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#2a5f74] flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 text-[#5DB2C7] mr-2" />
                Schedule
              </h3>

              <div className="bg-[#F1F9FB] p-4 rounded-lg">
                <div className="flex flex-col space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">{formatDateFull(workshop.startDate)}</p>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Start Time</p>
                      <p className="font-medium">{formatTime(workshop.startDate)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">End Time</p>
                      <p className="font-medium">{formatTime(workshop.endDate)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium">{calculateDuration(workshop.startDate, workshop.endDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-medium text-[#2a5f74] mb-2">About This Workshop</h3>
              <p className="text-gray-600">{workshop.description}</p>
            </div>

            {/* Location and Capacity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F1F9FB] p-4 rounded-lg">
                <div className="flex items-start">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5 text-[#5DB2C7] mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{workshop.location || "Online"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F1F9FB] p-4 rounded-lg">
                <div className="flex items-start">
                  <FontAwesomeIcon icon={faUsers} className="h-5 w-5 text-[#5DB2C7] mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Capacity</p>
                    <p className="font-medium">{workshop.maxAttendees || 25} attendees</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructor Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-[#2a5f74] flex items-center mb-4">
                <FontAwesomeIcon icon={faUserTie} className="h-5 w-5 text-[#5DB2C7] mr-2" />
                Instructor
              </h3>

              <div className="flex items-start">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 mr-4">
                  <img
                    src={workshop.instructorImage || "/images/default-avatar.png"}
                    alt={workshop.instructor}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{workshop.instructor}</h4>
                  <p className="text-gray-600 mt-1">{workshop.instructorBio || "Workshop instructor"}</p>
                </div>
              </div>
            </div>

            {/* Agenda Section */}
            {workshop.agenda && workshop.agenda.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-[#2a5f74] flex items-center mb-4">
                  <FontAwesomeIcon icon={faListUl} className="h-5 w-5 text-[#5DB2C7] mr-2" />
                  Workshop Agenda
                </h3>

                <ol className="space-y-3">
                  {workshop.agenda.map((item, index) => (
                    <li key={index} className="flex">
                      <span className="inline-flex items-center justify-center bg-[#5DB2C7] text-white rounded-full h-6 w-6 text-sm mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Register Button */}
            <div className="pt-6">
              <button className="w-full bg-[#2a5f74] hover:bg-[#1a3f54] text-white py-3 rounded-lg text-center font-medium shadow-md transition-colors">
                Register for Workshop
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Overlay */}
      {workshop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-10"
          onClick={onClose}
        />
      )}
    </AnimatePresence>
  );
}