import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CallModal from './CallModal';
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';

const CallButton = () => {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentUser = useSelector((state) => state.auth.currentUser);

  // Get user from session storage if not in Redux
  const getUserData = () => {
    if (currentUser) return currentUser;

    // Get from session/local storage as fallback
    const userSessionData = typeof window !== 'undefined' ?
      (sessionStorage.getItem('userSession') || localStorage.getItem('userSession')) : null;

    if (userSessionData) {
      try {
        return JSON.parse(userSessionData);
      } catch (e) {
        console.error('Error parsing user data', e);
        return null;
      }
    }

    return null;
  };

  const userData = getUserData();

  // Only show the call button for PRO students and SCAD admins
  if (!userData ||
    (userData.role !== 'scad' &&
      !(userData.role === 'student' && userData.accountType === 'PRO'))) {
    return null;
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle click with explicit function to ensure event capture
  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openModal();
  };

  return (
    <div className="relative z-30">
      <button
        onClick={handleButtonClick}
        className="relative w-11 h-11 rounded-full bg-gray-50 text-metallica-blue-700 flex items-center justify-center shadow-md hover:bg-metallica-blue-50 hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-metallica-blue-500 focus:ring-offset-2 transition-all duration-150 ease-in"
        aria-label="Video Call"
        title={userData.role === 'scad' ? safeT('student.dashboard.callButton.callPROStudents') : safeT('student.dashboard.callButton.callSCADAdmin')}
        data-testid="call-button"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>

        {/* PRO badge for students */}
        {userData.role === 'student' && userData.accountType === 'PRO' && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold pointer-events-none">
            P
          </span>
        )}
      </button>

      <CallModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default CallButton;