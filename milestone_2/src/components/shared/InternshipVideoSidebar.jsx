"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faBook, faComments } from '@fortawesome/free-solid-svg-icons';

export default function InternshipVideoSidebar({ userMajor }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 sticky top-4 z-10 h-fit">
      <h3 className="text-xl font-semibold text-[#2a5f74] mb-4">Internship Requirements</h3>
      <div className="space-y-4">
        <div className="relative rounded-lg overflow-hidden aspect-video group shadow-md border border-[#B8E1E9]/50">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/KPD8C7c6P1w?si=46fIIWYEYW58AoJO"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
          <div className="absolute bottom-0 left-0 right-0 bg-[#2a5f74]/70 text-white text-sm py-2 px-3 pointer-events-none backdrop-blur-sm rounded-b-lg">
            Watch: Internships for {userMajor || 'Your Major'}
          </div>
        </div>
        <p className="text-sm text-gray-600 bg-[#D9F0F4]/30 p-3 rounded-lg border border-[#B8E1E9]/30">
          Learn which internships count toward your graduation requirements based on your major and academic plan.
        </p>
        <div className="border-t pt-4 mt-2">
          <h4 className="font-medium text-[#2a5f74] mb-3 flex items-center">
            <span className="bg-[#D9F0F4] p-1.5 rounded-full mr-2 flex items-center justify-center">
              <FontAwesomeIcon icon={faGraduationCap} className="text-[#2a5f74] text-sm" />
            </span>
            Quick Resources
          </h4>
          <ul className="text-sm space-y-3">
            <li className="flex items-start">
              <span className="bg-[#D9F0F4]/50 p-1.5 rounded-full mr-2 flex-shrink-0 flex items-center justify-center">
                <FontAwesomeIcon icon={faBook} className="text-[#3298BA] text-xs" />
              </span>
              <a href="#" className="text-[#3298BA] hover:underline hover:text-[#2a5f74] transition-colors">Academic Requirements Guide</a>
            </li>
            <li className="flex items-start">
              <span className="bg-[#D9F0F4]/50 p-1.5 rounded-full mr-2 flex-shrink-0 flex items-center justify-center">
                <FontAwesomeIcon icon={faComments} className="text-[#3298BA] text-xs" />
              </span>
              <a href="#" className="text-[#3298BA] hover:underline hover:text-[#2a5f74] transition-colors">Contact Academic Advisor</a>
            </li>
            <li className="flex items-start">
              <span className="bg-[#D9F0F4]/50 p-1.5 rounded-full mr-2 flex-shrink-0 flex items-center justify-center">
                <FontAwesomeIcon icon={faBook} className="text-[#3298BA] text-xs" />
              </span>
              <a href="#" className="text-[#3298BA] hover:underline hover:text-[#2a5f74] transition-colors">FAQs About Internships</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 