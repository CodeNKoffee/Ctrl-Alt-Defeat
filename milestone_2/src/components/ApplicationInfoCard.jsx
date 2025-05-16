import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsersViewfinder } from '@fortawesome/free-solid-svg-icons';

const ApplicationInfoCard = () => (
  <div className="w-full max-w-6xl mx-auto">
    <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      {/* Decorative elements */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
      <div className="absolute right-20 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500 pointer-events-none"></div>
      <div className="absolute left-40 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500 pointer-events-none"></div>

      <div className="flex items-start gap-4 w-full md:w-auto relative z-10">
        <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
          <FontAwesomeIcon icon={faUsersViewfinder} className="h-7 w-7 text-white" />
        </div>
        <div className="text-left w-full">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
            APPLICANT PORTAL
          </div>
          <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">Applicant Management Portal</div>
          <div className="text-gray-700 mb-3 relative">
            <p className="mb-3">Monitor and evaluate all student applications to your posted internship opportunities in one centralized location.</p>

            {/* Card content with improved styling */}
            <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4 transform transition-all duration-500 hover:scale-[1.01] hover:shadow-md">
              <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                Applicant Tracking Features:
              </p>
              <ul className="space-y-2 mb-2">
                <li className="flex items-start group cursor-pointer transition-all duration-300 hover:translate-x-1">
                  <span className="text-[#3298BA] mr-2 group-hover:scale-110 transition-transform duration-300">✓</span>
                  <span>View all applications organized by position and submission date</span>
                </li>
                <li className="flex items-start group cursor-pointer transition-all duration-300 hover:translate-x-1">
                  <span className="text-[#3298BA] mr-2 group-hover:scale-110 transition-transform duration-300">✓</span>
                  <span>Access comprehensive candidate profiles and application materials</span>
                </li>
                <li className="flex items-start group cursor-pointer transition-all duration-300 hover:translate-x-1">
                  <span className="text-[#3298BA] mr-2 group-hover:scale-110 transition-transform duration-300">✓</span>
                  <span>Review attached documents (resumes, portfolios, cover letters)</span>
                </li>
                <li className="flex items-start group cursor-pointer transition-all duration-300 hover:translate-x-1">
                  <span className="text-[#3298BA] mr-2 group-hover:scale-110 transition-transform duration-300">✓</span>
                  <span>Explore professional social links and relevant student work</span>
                </li>
                <li className="flex items-start group cursor-pointer transition-all duration-300 hover:translate-x-1">
                  <span className="text-[#3298BA] mr-2 group-hover:scale-110 transition-transform duration-300">✓</span>
                  <span>Track application status (new, reviewed, interviewed, selected, declined)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-[#D9F0F4] px-4 py-3 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm mb-4 transform transition-all duration-300 hover:shadow-md">
              <p className="text-metallica-blue-700 font-medium flex items-center group cursor-default">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#2a5f74] group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                All application materials are presented in a standardized format for efficient comparison while preserving each student's unique presentation style.
              </p>
            </div>

            <div className="bg-gradient-to-r from-[#FFE8E8] to-[#FFF7F7] p-4 rounded-xl border border-[#FFCCD9] transition-all duration-300 hover:shadow-md">
              <p className="text-[#B22247] font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Privacy Notice: Student information is protected and should only be used for evaluation purposes related to your internship opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ApplicationInfoCard;
