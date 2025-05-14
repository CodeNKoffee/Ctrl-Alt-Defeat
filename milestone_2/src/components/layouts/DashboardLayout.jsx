'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

  // Authentication check
  useEffect(() => {
    // Check session storage as fallback
    const userSessionData = sessionStorage.getItem('userSession') || localStorage.getItem('userSession');

    if (!isAuthenticated && !userSessionData) {
      router.push(`/en/auth/login?userType=${userType}`);
      return;
    }

    // If we have user data in session
    if (userSessionData) {
      const userData = JSON.parse(userSessionData);

      // Verify user role
      if (userData.role !== userType) {
        router.push('/en');
        return;
      }
    } else if (isAuthenticated && currentUser?.role !== userType) {
      // Verify Redux user role
      router.push('/en');
      return;
    }
  }, [isAuthenticated, currentUser, router, userType]);

  // Determine content based on whether view components are provided
  const renderContent = () => {
    return children;
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-metallica-blue-50 to-white">
      {showSidebar && (
        <Sidebar
          userType={userType}
          onViewChange={onViewChange}
          currentView={currentViewId}
        />
      )}

      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 min-h-screen flex flex-col">
        <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
  <h1 className="text-2xl font-semibold text-[#2a5f74] font-ibm-plex-sans tracking-wide">
    {userType.charAt(0).toUpperCase() + userType.slice(1)} Portal
  </h1>

  <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-lg shadow-sm border border-[#d3e1e5]">
    <div className="flex flex-col">
      <label className="text-xs font-medium text-[#2A5F74] mb-1">Start Date</label>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        placeholderText="Select"
        dateFormat="MMMM d, yyyy"
        className="text-[11px] text-[#2A5F74] bg-[#F0F8FA] border border-[#2A5F74] rounded px-2 py-1 w-[110px] shadow-sm placeholder-[#A5BBC2] focus:outline-none focus:ring-1 focus:ring-[#2A5F74] transition duration-150 ease-in-out"
        />
    </div>
    <div className="flex flex-col">
      <label className="text-xs font-medium text-[#2A5F74] mb-1">End Date</label>
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        placeholderText="Select"
        dateFormat="MMMM d, yyyy"
        className="text-[11px] text-[#2A5F74] bg-[#F0F8FA] border border-[#2A5F74] rounded px-2 py-1 w-[110px] shadow-sm placeholder-[#A5BBC2] focus:outline-none focus:ring-1 focus:ring-[#2A5F74] transition duration-150 ease-in-out"
        />
    </div>
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