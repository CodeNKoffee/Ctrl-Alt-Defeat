'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import CallButton from '../CallButton';
import NotificationButton from "../NotificationButton";
import ProfileIcon from '@/components/shared/ProfileIcon';
import ProBadge from '@/components/shared/ProBadge';

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
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showCycleModal, setShowCycleModal] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [cycleType, setCycleType] = useState('Winter');
  const [cycleYear, setCycleYear] = useState(new Date().getFullYear());
  const [formOpen, setFormOpen] = useState(false);

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
              {userType.charAt(0).toUpperCase() + userType.slice(1)} Portal
            </h1>

            <div className="flex flex-row items-center gap-4">
              {/* SCAD internship cycle */}
              {userData?.role === 'scad' && (
                <div
                  className="relative"
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => { setHovered(false); if (!formOpen) setShowCycleModal(false); }}
                >
                  <button
                    className={`rounded-full bg-[#3298BA] text-white px-4 py-2 font-semibold shadow transition-all duration-300 ${hovered || formOpen ? 'w-56' : 'w-12'} overflow-hidden flex items-center justify-center`}
                    onClick={() => { setFormOpen(!formOpen); setShowCycleModal(true); }}
                    style={{ minWidth: hovered || formOpen ? 180 : 48 }}
                  >
                    <span className={`transition-all duration-300 ${hovered || formOpen ? 'opacity-100 ml-2' : 'opacity-0 ml-0'} whitespace-nowrap`}>
                      Set Internship Cycle
                    </span>
                    <span className="ml-2">{!formOpen && <svg width="18" height="18" fill="none"><circle cx="9" cy="9" r="8" stroke="white" strokeWidth="2" /></svg>}</span>
                  </button>
                  {/* Modal/Form */}
                  {(hovered || formOpen) && showCycleModal && (
                    <div className={`absolute top-12 left-0 bg-white rounded-xl shadow-lg p-4 z-50 w-64 transition-all duration-300 ${formOpen ? 'block' : 'hidden'}`}>
                      <div className="mb-2 font-semibold text-[#2a5f74]">Set Internship Cycle</div>
                      <form
                        onSubmit={e => { e.preventDefault(); setFormOpen(false); setShowCycleModal(false); }}
                        className="flex flex-col gap-2"
                      >
                        <label className="text-sm font-medium">Cycle</label>
                        <select
                          value={cycleType}
                          onChange={e => setCycleType(e.target.value)}
                          className="rounded px-2 py-1 border"
                        >
                          <option value="Winter">Winter</option>
                          <option value="Summer">Summer</option>
                        </select>
                        <label className="text-sm font-medium">Year</label>
                        <input
                          type="number"
                          min={2020}
                          max={2100}
                          value={cycleYear}
                          onChange={e => setCycleYear(e.target.value)}
                          className="rounded px-2 py-1 border"
                        />
                        <div className="mt-2 text-sm text-gray-700">
                          <span className="font-semibold">Cycle: </span>
                          <span className="text-[#3298BA]">{getCycleString()}</span>
                        </div>
                        <button
                          type="submit"
                          className="mt-2 bg-[#3298BA] text-white rounded-full px-4 py-2 font-semibold hover:bg-[#267a8c] transition"
                        >
                          Save
                        </button>
                      </form>
                    </div>
                  )}
                </div>
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

          <div className="bg-metallica-blue-50 rounded-xl shadow-sm border border-gray-200">
            {title && (
              <div className="w-full px-10 pt-6 pb-2">
                <div className="w-full max-w-6xl mx-auto">
                  <h2 className="text-3xl font-bold text-left text-[#2a5f74] relative">
                    {title}
                    <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
                  </h2>
                </div>
              </div>
            )}
            {typeof children === 'function'
              ? children({ sidebarExpanded })
              : children}
          </div>
        </div>
      </div>
    </div>
  );
} 