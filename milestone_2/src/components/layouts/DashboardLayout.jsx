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
    setIsDatePickerOpen(false); // Close picker after selection
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-metallica-blue-50 to-white relative">
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

            {/* Date Picker Icon and Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className="text-[#2A5F74] text-2xl bg-[#F0F8FA] border border-[#2A5F74] rounded-full p-2 shadow-sm hover:bg-[#D9F0F4] transition duration-150 ease-in-out"
                aria-label="Open Date Picker"
              >
                <FaCalendarAlt />
              </button>
              {isDatePickerOpen && (
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