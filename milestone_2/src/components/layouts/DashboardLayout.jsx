'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import CallButton from '../CallButton';
import NotificationButton from "../NotificationButton";
import ProfileIcon from '@/components/shared/ProfileIcon';
import ProBadge from '@/components/shared/ProBadge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSuitcase } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';

export default function DashboardLayout({
  children,
  userType,
  title,
  showSidebar = true,
  currentViewId,
  onViewChange,
  sidebarOpen = false,
}) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const { currentUser, isAuthenticated } = useSelector(state => state.auth);
  const router = useRouter();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showCycleModal, setShowCycleModal] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [cycleType, setCycleType] = useState('Winter');
  const [cycleYear, setCycleYear] = useState(new Date().getFullYear());
  const [formOpen, setFormOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [savedCycle, setSavedCycle] = useState(null);

  const handleSidebarToggle = (isExpanded) => {
    setSidebarExpanded(isExpanded);
  };

  // Authentication check
  useEffect(() => {
    // Check session storage as fallback
    const userSessionData = sessionStorage.getItem('userSession') || localStorage.getItem('userSession');

    /* 
    // PROBLEM: This check might run *after* logout is initiated but *before* the 
    // redirect to the home page completes, causing a redirect back to login.
    // Relying on Sidebar.jsx logout redirect and potentially middleware/page-level guards.
    if (!isAuthenticated && !userSessionData) {
      router.push(`/en/auth/login?userType=${userType}`);
      return;
    }
    */

    // If we have user data in session (and potentially Redux state is not yet updated)
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

  // Detect cycle type and year from start date and validate range
  useEffect(() => {
    setError("");
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        setError("End date cannot be before start date.");
        setCycleType("");
        return;
      }
      const startMonth = start.getMonth();
      const endMonth = end.getMonth();
      // Winter: Dec, Jan, Feb (11, 0, 1)
      // Summer: Jun, Jul, Aug (5, 6, 7)
      let detectedType = "";
      if ([11, 0, 1].includes(startMonth) && [11, 0, 1].includes(endMonth)) {
        detectedType = "Winter";
      } else if ([5, 6, 7].includes(startMonth) && [5, 6, 7].includes(endMonth)) {
        detectedType = "Summer";
      } else {
        setError("Dates must be within the same season: Winter (Dec-Feb) or Summer (Jun-Aug).");
        setCycleType("");
        return;
      }
      setCycleType(detectedType);
      setCycleYear(start.getFullYear());
    } else if (startDate) {
      const date = new Date(startDate);
      const month = date.getMonth();
      let detectedType = "";
      if ([11, 0, 1].includes(month)) detectedType = "Winter";
      else if ([5, 6, 7].includes(month)) detectedType = "Summer";
      else detectedType = "";
      setCycleType(detectedType);
      setCycleYear(date.getFullYear());
    }
  }, [startDate, endDate]);

  // Get user data for conditional rendering
  const getUserData = () => {
    if (currentUser) return currentUser;

    // Get from session/local storage as fallback
    const userSessionData = typeof window !== 'undefined' ?
      sessionStorage.getItem('userSession') || localStorage.getItem('userSession') : null;

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
  const showCallButton = userData &&
    (userData.role === 'scad' || (userData.role === 'student' && userData.accountType === 'PRO'));

  // Format cycle string
  const getCycleString = () => {
    const shortYear = String(cycleYear).slice(-2);
    return `${cycleType}'${shortYear}`;
  };

  // Format date range for display
  const formatDateRange = (start, end) => {
    if (!start || !end) return "";
    const opts = { year: 'numeric', month: 'short', day: 'numeric' };
    return `${new Date(start).toLocaleDateString('en-US', opts)} – ${new Date(end).toLocaleDateString('en-US', opts)}`;
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-metallica-blue-50 to-white">
      {showSidebar && (
        <Sidebar
          userType={userType}
          onViewChange={onViewChange}
          currentView={currentViewId}
          currentUser={userData}
          onToggle={handleSidebarToggle}
        />
      )}

      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 min-h-screen flex flex-col">
          <div className="mb-6 flex flex-row justify-between items-center">
          <h1 className="text-2xl font-medium text-[#2a5f74] font-ibm-plex-sans">
            {safeT(`dashboard.titles.${userType}`)}
          </h1>

            <div className="flex flex-row items-center gap-4">
              {/* SCAD internship cycle */}
              {userData?.role === 'scad' && (
                savedCycle ? (
                  <div className="flex items-center gap-3 bg-[#E2F4F7] border-2 border-[#5DB2C7] rounded-full px-6 py-2 shadow font-semibold text-[#2a5f74] text-base" style={{ minHeight: 56 }}>
                    <span className="font-bold flex items-center gap-2">
                      <FontAwesomeIcon icon={faSuitcase} className="w-5 h-5 text-[#3298BA]" />
                      {savedCycle.cycleType}'{String(savedCycle.cycleYear).slice(-2)}
                    </span>
                    <span className="text-sm text-gray-600">{formatDateRange(savedCycle.startDate, savedCycle.endDate)}</span>
                    <button
                      className="ml-2 p-1 rounded-full hover:bg-[#B8E1E9]/60 transition"
                      onClick={() => { setSavedCycle(null); setFormOpen(true); setShowCycleModal(true); }}
                      title="Edit cycle"
                    >
                      <FontAwesomeIcon icon={faEdit} className="w-4 h-4 text-[#3298BA]" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="relative"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => { setHovered(false); if (!formOpen) setShowCycleModal(false); }}
                  >
                    <button
                      className={`group relative z-10 bg-[#5DB2C7] hover:bg-[#4AA0B5] text-white rounded-full shadow-md transition-all duration-500 flex items-center justify-center overflow-hidden h-10`}
                      style={{ minWidth: 40, width: (hovered || formOpen) ? 320 : 40 }}
                      onClick={() => { setFormOpen(!formOpen); setShowCycleModal(true); }}
                      aria-label="Set Internship Cycle"
                    >
                      {(hovered || formOpen) ? (
                        <span className="flex items-center justify-center w-full">
                          <FontAwesomeIcon icon={faSuitcase} className="text-xl text-white mr-3" />
                          <span className={`font-semibold text-white text-base text-center transition-all duration-300 overflow-hidden ${((hovered || formOpen) ? 'max-w-xs opacity-100 delay-300' : 'max-w-0 opacity-0')}`}
                            style={{ display: 'inline-block' }}>
                            Set Internship Cycle
                          </span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center w-10 h-10">
                          <FontAwesomeIcon icon={faSuitcase} className="text-xl text-white" />
                        </span>
                      )}
                    </button>
                    {/* Modal/Form */}
                    {(hovered || formOpen) && showCycleModal && (
                      <div className={`absolute left-1/2 -translate-x-1/2 top-14 bg-white rounded-xl shadow-xl p-6 z-50 w-80 transition-all duration-300 ${formOpen ? 'block' : 'hidden'}`}
                        style={{ minWidth: 320 }}
                      >
                        <form
                          onSubmit={e => {
                            e.preventDefault();
                            if (error || !cycleType || !startDate || !endDate) return;
                            setSavedCycle({ cycleType, cycleYear, startDate, endDate });
                            setFormOpen(false); setShowCycleModal(false);
                          }}
                          className="flex flex-col gap-3"
                        >
                          <label className="text-sm font-semibold text-[#2a5f74]">Start Date</label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="rounded-full px-4 py-2 border-2 border-[#B8E1E9] bg-white/90 text-[#1a3f54] shadow-md focus:outline-none focus:ring-2 focus:ring-[#5DB2C7] focus:border-[#5DB2C7] transition-all duration-300 placeholder-gray-500"
                          />
                          <label className="text-sm font-semibold text-[#2a5f74]">End Date</label>
                          <input
                            type="date"
                            value={endDate}
                            min={startDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="rounded-full px-4 py-2 border-2 border-[#B8E1E9] bg-white/90 text-[#1a3f54] shadow-md focus:outline-none focus:ring-2 focus:ring-[#5DB2C7] focus:border-[#5DB2C7] transition-all duration-300 placeholder-gray-500"
                          />
                          <label className="text-sm font-semibold text-[#2a5f74]">Cycle</label>
                          <input
                            type="text"
                            value={cycleType}
                            readOnly
                            className="rounded-full px-4 py-2 border-2 border-[#B8E1E9] bg-gray-100 text-[#1a3f54] shadow-md focus:outline-none focus:ring-2 focus:ring-[#5DB2C7] focus:border-[#5DB2C7] transition-all duration-300 placeholder-gray-500 cursor-not-allowed"
                          />
                          <label className="text-sm font-semibold text-[#2a5f74]">Year</label>
                          <input
                            type="text"
                            value={cycleYear}
                            readOnly
                            className="rounded-full px-4 py-2 border-2 border-[#B8E1E9] bg-gray-100 text-[#1a3f54] shadow-md focus:outline-none focus:ring-2 focus:ring-[#5DB2C7] focus:border-[#5DB2C7] transition-all duration-300 placeholder-gray-500 cursor-not-allowed"
                          />
                          {error && <div className="text-red-500 text-xs text-center mt-1">{error}</div>}
                          <div className="mt-2 text-sm text-gray-700 text-center">
                            <span className="font-semibold">Cycle: </span>
                            <span className="text-[#3298BA]">{getCycleString()}</span>
                          </div>
                          <button
                            type="submit"
                            className="mt-2 bg-[#5DB2C7] hover:bg-[#3298BA] text-white rounded-full px-4 py-2 font-semibold shadow-md transition-all duration-200 hover:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!!error || !cycleType || !startDate || !endDate}
                          >
                            Save
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                )
              )}
              {/* Call button prominently displayed for eligible users */}
              {showCallButton && (
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium text-gray-600 hidden sm:inline">
                    {userData.role === 'scad' ? 'Call PRO Students' : 'Call SCAD Admin'}
                  </span>
                  <div className="relative">
                    <CallButton />
                    {/* Animated pulse effect to draw attention */}
                    <span className="absolute -inset-1 rounded-full animate-ping bg-indigo-300 opacity-75" style={{ animationDuration: '3s' }}></span>
                  </div>
                </div>
              )}
              <NotificationButton />
              {/* Profile Icon and Badge Section */}
              {userData && (
                <div className="flex items-center ml-4 relative">
                  <ProfileIcon
                    src={userData.profileImage}
                    alt={userData.name || 'User'}
                    size="lg"
                  />
                  {userData.accountType === 'PRO' && (
                    <div className="absolute top-[-4px] right-[-10px]">
                      <ProBadge size="sm" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={`bg-metallica-blue-50 rounded-xl shadow-sm border border-gray-200 transition-all duration-500 ${sidebarOpen ? 'mr-[420px]' : ''}`}>
            {title && (
              <div className="w-full pl-10 pt-6 pb-2">
                <h2 className="text-3xl font-bold text-left text-[#2a5f74] relative">
                  {title}
                  <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
                </h2>
              </div>
            )}
            {typeof children === 'function'
              ? children({ sidebarExpanded })
              : React.cloneElement(children, { sidebarExpanded })}
          </div>
        </div>
      </div>
    </div>
  );
} 