import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheckCircle, faUsers } from '@fortawesome/free-solid-svg-icons';
import NotificationsList from './NotificationsList';
import { useSelector } from 'react-redux';

export default function NotificationButton() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const animationTimerRef = useRef(null);

  // Get user type from Redux store if available
  const { currentUser } = useSelector(state => state.auth || {});
  const isCompany = currentUser?.userType === 'company';

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  // Handle animation timing
  useEffect(() => {
    // Function to start animation
    const startAnimation = () => {
      setIsAnimating(true);

      // Stop animation after 2 seconds
      setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
    };

    // Initial animation after 3 seconds
    const initialTimer = setTimeout(startAnimation, 3000);

    // Set up periodic animation
    animationTimerRef.current = setInterval(() => {
      startAnimation();
    }, 30000); // Vibrate every 30 seconds

    return () => {
      clearTimeout(initialTimer);
      clearInterval(animationTimerRef.current);
    };
  }, []);

  // Add company-specific notifications
  useEffect(() => {
    if (isCompany) {
      // Custom notifications for companies
      const event = new CustomEvent('addNotification', {
        detail: [
          {
            id: 'company-accepted',
            icon: faCheckCircle,
            title: 'Your company has been accepted on the system',
            time: '3 days ago',
            isUnread: true
          },
          {
            id: 'applications-backend',
            icon: faUsers,
            title: '67 applications have been received for the Backend Developer Intern role',
            time: '1 day ago',
            isUnread: true
          }
        ]
      });
      document.dispatchEvent(event);
    }
  }, [isCompany]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && buttonRef.current.contains(event.target)) {
        return;
      }
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsPanelOpen(false);
      }
    };

    if (isPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPanelOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={togglePanel}
        className="relative w-11 h-11 rounded-full bg-gray-50 text-metallica-blue-700 flex items-center justify-center shadow-md hover:bg-metallica-blue-50 hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-metallica-blue-500 focus:ring-offset-2 transition-all duration-150 ease-in"
        aria-label="Notifications"
        title="Notifications"
        type="button"
      >
        <FontAwesomeIcon
          icon={faBell}
          className={`h-6 w-6 ${isAnimating ? 'animate-bell-ring' : ''}`}
        />
      </button>

      {isPanelOpen && (
        <div
          ref={panelRef}
          className="absolute top-full ltr:right-0 rtl:left-0 mt-2 w-96 max-w-lg bg-white rounded-xl shadow-2xl z-50 border border-gray-200 overflow-hidden"
        >
          <div className="max-h-[calc(100vh-120px)] sm:max-h-[500px] overflow-y-auto">
            <NotificationsList hideFilters={true} />
          </div>
        </div>
      )}
    </div>
  );
};