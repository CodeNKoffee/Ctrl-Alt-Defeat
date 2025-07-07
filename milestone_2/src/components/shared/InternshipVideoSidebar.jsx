"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faBook, faComments } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';

export default function InternshipVideoSidebar({ userMajor, videoUrl, videoTitle, isCompany }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  const url = videoUrl || "https://www.youtube.com/embed/KPD8C7c6P1w?si=46fIIWYEYW58AoJO";
  const title = videoTitle || safeT('internship.videoSidebar.defaultTitle');
  const bottomText = isCompany ? safeT('internship.videoSidebar.genZFuture') : `${safeT('internship.videoSidebar.watchFor')} ${userMajor || 'Your Major'}`;
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 sticky top-4 z-10 h-fit">
      <h3 className="text-xl font-semibold text-[#2a5f74] mb-4">{title}</h3>
      <div className="space-y-4">
        <div className="relative rounded-lg overflow-hidden aspect-video group shadow-md border border-[#B8E1E9]/50">
          <iframe
            width="100%"
            height="100%"
            src={url}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
          <div className="absolute bottom-0 left-0 right-0 bg-[#2a5f74]/70 text-white text-sm py-2 px-3 pointer-events-none backdrop-blur-sm rounded-b-lg">
            {isCompany ? title : `${safeT('internship.videoSidebar.watchFor')} ${userMajor || 'Your Major'}`}
          </div>
        </div>
        <p className="text-sm text-gray-600 bg-[#D9F0F4]/30 p-3 rounded-lg border border-[#B8E1E9]/30">
          {safeT('internship.videoSidebar.requirementsText')}
        </p>
        <div className="border-t pt-4 mt-2">
          <h4 className="font-medium text-[#2a5f74] mb-3 flex items-center">
            <span className="bg-[#D9F0F4] p-1.5 rounded-full mr-2 flex items-center justify-center">
              <FontAwesomeIcon icon={faGraduationCap} className="text-[#2a5f74] text-sm" />
            </span>
            {safeT('internship.videoSidebar.quickResources')}
          </h4>
          <ul className="text-sm space-y-3">
            <li className="flex items-start">
              <span className="bg-[#D9F0F4]/50 p-1.5 rounded-full mr-2 flex-shrink-0 flex items-center justify-center">
                <FontAwesomeIcon icon={faBook} className="text-[#3298BA] text-xs" />
              </span>
              <a href="" className="text-[#3298BA] hover:underline hover:text-[#2a5f74] transition-colors">{safeT('internship.videoSidebar.academicGuide')}</a>
            </li>
            <li className="flex items-start">
              <span className="bg-[#D9F0F4]/50 p-1.5 rounded-full mr-2 flex-shrink-0 flex items-center justify-center">
                <FontAwesomeIcon icon={faComments} className="text-[#3298BA] text-xs" />
              </span>
              <a href="#" className="text-[#3298BA] hover:underline hover:text-[#2a5f74] transition-colors">{safeT('internship.videoSidebar.contactAdvisor')}</a>
            </li>
            <li className="flex items-start">
              <span className="bg-[#D9F0F4]/50 p-1.5 rounded-full mr-2 flex-shrink-0 flex items-center justify-center">
                <FontAwesomeIcon icon={faBook} className="text-[#3298BA] text-xs" />
              </span>
              <a href="#" className="text-[#3298BA] hover:underline hover:text-[#2a5f74] transition-colors">{safeT('internship.videoSidebar.faqsInternships')}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 