"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentProfileSidebar({ student, onClose }) {
  const [actionFeedback, setActionFeedback] = useState(null);

  const handleSendMessage = () => {
    setActionFeedback('success');
    setTimeout(() => {
      setActionFeedback(null);
    }, 1500);
  };

  return (
    <div className={`fixed top-0 right-0 h-full transition-all duration-300 ease-in-out transform ${
      student ? "translate-x-0" : "translate-x-full"
    } w-1/3 z-50`}>
      {student && (
        <div className="bg-white border-l-2 border-[#5DB2C7] h-full flex flex-col shadow-lg relative">
          {/* Success Feedback */}
          <AnimatePresence>
            {actionFeedback === 'success' && (
              <motion.div
                className="absolute inset-0 z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-xl text-center max-w-xs border-2 border-[#3298BA]"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  <motion.div
                    className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <FontAwesomeIcon 
                      icon={faCheck} 
                      className="text-green-600 text-xl" 
                    />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600">
                    Your message has been sent to {student.name}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Close button */}
          <div className="flex justify-end sticky top-0 bg-white z-10 p-2">
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 px-6">
            <div className="pr-2">
              {/* Student Profile Header */}
              <div className="flex flex-col items-center py-6">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#3298BA]">
                    <Image
                      src={student.photo || '/default-avatar.png'}
                      alt={student.name}
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                  <span className="absolute -top-2 -right-2 px-3 py-1 bg-white rounded-full text-xs font-medium text-[#2a5f74] border border-[#3298BA]">
                    {student.status}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-[#3298BA] mb-1">{student.name}</h2>
                <p className="text-gray-600">{student.major}</p>
              </div>

              {/* Student Information Sections */}
              <div className="space-y-6 mb-6">
                {/* Academic Information */}
                <div className="bg-[#F0F9FB] p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-[#2a5f74] mb-3">Academic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Student ID</p>
                      <p className="font-medium">{student.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Major</p>
                      <p className="font-medium">{student.major}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Semester</p>
                      <p className="font-medium">Semester {student.semester}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">GPA</p>
                      <p className="font-medium">{student.gpa || 'Not available'}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-[#F0F9FB] p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-[#2a5f74] mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{student.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{student.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">{student.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Course Enrollment */}
                {student.courses && student.courses.length > 0 && (
                  <div className="bg-[#F0F9FB] p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#2a5f74] mb-3">Current Courses</h3>
                    <div className="space-y-2">
                      {student.courses.map((course, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="font-medium">{course.code}: {course.name}</span>
                          <span className="text-sm text-gray-600">{course.progress}% complete</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}