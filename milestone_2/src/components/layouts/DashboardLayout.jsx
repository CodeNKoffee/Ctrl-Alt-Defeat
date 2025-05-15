'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

export default function DashboardLayout({
  children,
  userType,
  title,
  showSidebar = true,
  currentViewId,
  onViewChange,
}) {
  const { currentUser, isAuthenticated } = useSelector(state => state.auth);
  const router = useRouter();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isCycleSet, setIsCycleSet] = useState(false);

  // Authentication check
  useEffect(() => {
    const userSessionData = sessionStorage.getItem('userSession') || localStorage.getItem('userSession');

    if (!isAuthenticated && !userSessionData) {
      router.push(`/en/auth/login?userType=${userType}`);
      return;
    }

    if (userSessionData) {
      const userData = JSON.parse(userSessionData);

      if (userData.role !== userType) {
        router.push('/en');
        return;
      }
    } else if (isAuthenticated && currentUser?.role !== userType) {
      router.push('/en');
      return;
    }
  }, [isAuthenticated, currentUser, router, userType]);

  // Determine content based on whether view components are provided
  const renderContent = () => {
    return children;
  };

  // Handle date range selection
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (end) {
      setIsDatePickerOpen(false); // Close picker after both start and end are selected
      setIsCycleSet(true); // Mark cycle as set to prevent re-editing
    }
  };

  // Format dates for display
  const formatDate = (date) => date ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div className="flex h-screen bg-gradient-to-b from-metallica-blue-50 to-white relative">
      <style jsx global>{`
        .react-datepicker {
          font-family: 'IBM Plex Sans', sans-serif;
          border: 1px solid #2A5F74;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          background: #FFFFFF;
        }
        .react-datepicker__header {
          background: #2A5F74;
          color: white;
          border-bottom: none;
          padding: 12px 0;
          border-radius: 8px 8px 0 0;
        }
        .react-datepicker__current-month,
        .react-datepicker__day-name {
          color: white;
          font-weight: 500;
        }
        .react-datepicker__day {
          color: #2A5F74;
          border-radius: 4px;
        }
        .react-datepicker__day:hover,
        .react-datepicker__day--today:hover {
          background: #D9F0F4;
          color: #FFFFFF; /* Make the number visible when hovering over today */
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--in-selecting-range,
        .react-datepicker__day--in-range,
        .react-datepicker__day--today.react-datepicker__day--selected {
          background: #318FA8;
          color: #FFFFFF; /* Ensure text is visible against the blue background */
        }
        .react-datepicker__day--today {
          font-weight: 500;
          color: #2A5F74;
        }
        .react-datepicker__navigation-icon::before {
          border-color: white;
        }
        .date-tooltip {
          position: absolute;
          bottom: -40px;
          right: 50%;
          transform: translateX(50%);
          background: #2A5F74;
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.2s ease-in-out;
          pointer-events: none;
          z-index: 60;
        }
        .date-tooltip::after {
          content: '';
          position: absolute;
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 5px solid #2A5F74;
        }
        .date-picker-button:hover .date-tooltip {
          opacity: 1;
        }
        .date-picker-button.locked button {
          cursor: default;
        }
        .internship-cycle-box {
          background: linear-gradient(135deg, #F0F8FA 0%, #D9F0F4 100%);
          border: 1px solid #2A5F74;
          border-radius: 8px;
          padding: 8px 12px;
          box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
          font-family: 'IBM Plex Sans', sans-serif;
        }
        .internship-cycle-box .title {
          font-size: 14px;
          font-weight: 600;
          color: #2A5F74;
          margin-bottom: 4px;
        }
        .internship-cycle-box .date-item {
          font-size: 12px;
          color: #2A5F74;
          margin: 2px 0;
        }
        .internship-cycle-box .date-item strong {
          color: #318FA8;
        }
        .date-picker-button:not(.locked) button:hover {
          animation: radial-glow 1.2s infinite ease-in-out;
        }
        @keyframes radial-glow {
          0% {
            box-shadow: 0 0 5px rgba(49, 143, 168, 0.3);
          }
          50% {
            box-shadow: 0 0 15px rgba(49, 143, 168, 0.7);
          }
          100% {
            box-shadow: 0 0 5px rgba(49, 143, 168, 0.3);
          }
        }
      `}</style>

      {showSidebar && (
        <Sidebar
          userType={userType}
          onViewChange={onViewChange}
          currentView={currentViewId}
        />
      )}

      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 min-h-screen flex flex-col">
          <div className="mb-6 flex justify-between items-center flex-wrap gap-4 relative">
            <h1 className="text-2xl font-semibold text-[#2a5f74] font-ibm-plex-sans tracking-wide">
              {userType.charAt(0).toUpperCase() + userType.slice(1)} Portal
            </h1>

            <div className="relative">
              <div className={`date-picker-button ${isCycleSet ? 'locked' : ''} relative`}>
                <button
                  onClick={isCycleSet ? undefined : () => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="text-[#2A5F74] text-2xl bg-[#F0F8FA] border border-[#2A5F74] rounded-full p-2 shadow-sm transition-all duration-300 ease-in-out"
                  aria-label="Open Date Picker"
                >
                  <FaCalendarAlt />
                </button>
                {!startDate && !endDate && (
                  <span className="date-tooltip">Set internship cycle</span>
                )}
              </div>
              {isDatePickerOpen && !isCycleSet && (
                <div className="absolute top-full right-0 mt-2 z-50">
                  <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                    dateFormat="MMMM d, yyyy"
                    className="text-[11px] text-[#2A5F74] bg-white border border-[#2A5F74] rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#2A5F74] transition duration-150 ease-in-out"
                    placeholderText="Select date range"
                    onClickOutside={() => setIsDatePickerOpen(false)}
                    open={isDatePickerOpen}
                  />
                </div>
              )}
              {(startDate || endDate) && (
                <div className="mt-2 internship-cycle-box">
                  <div className="title">Internship Cycle</div>
                  <div className="date-item"><strong>Start:</strong> {formatDate(startDate)}</div>
                  <div className="date-item"><strong>End:</strong> {formatDate(endDate)}</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-metallica-blue-50 rounded-xl shadow-sm overflow-hidden border border-gray-200 flex-1">
            {title && (
              <div className="w-full px-4 pt-6 pb-2">
                <div className="w-full max-w-3xl mx-auto">
                  <h2 className="text-3xl font-bold text-left text-[#2a5f74] relative">
                    {title}
                    <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
                  </h2>
                </div>
              </div>
            )}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}