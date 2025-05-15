import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import NotificationsList from './NotificationsList';

export default function NotificationButton() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

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
        className="relative p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-md cursor-pointer"
        aria-label="Notifications"
        title="Notifications"
        type="button"
      >
        <FontAwesomeIcon icon={faBell} className="h-6 w-6" />
      </button>

      {isPanelOpen && (
        <div
          ref={panelRef}
          className="absolute top-full right-0 mt-2 w-96 max-w-lg bg-white rounded-xl shadow-2xl z-50 border border-gray-200 overflow-hidden"
        >
          <div className="max-h-[calc(100vh-120px)] sm:max-h-[500px] overflow-y-auto">
            <NotificationsList hideFilters={true} />
          </div>
        </div>
      )}
    </div>
  );
};