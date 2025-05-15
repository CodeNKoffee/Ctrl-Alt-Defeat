'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import CallButton from '../CallButton';
import NotificationButton from "../NotificationButton";

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

  return (
    <div className="flex h-screen bg-gradient-to-b from-metallica-blue-50 to-white">
      {showSidebar && (
        <Sidebar
          userType={userType}
          onViewChange={onViewChange}
          currentView={currentViewId}
          currentUser={userData}
        />
      )}

      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 min-h-screen flex flex-col">
          <div className="mb-6 flex flex-row justify-between items-center">
            <h1 className="text-2xl font-medium text-[#2a5f74] font-ibm-plex-sans">
              {userType.charAt(0).toUpperCase() + userType.slice(1)} Portal
            </h1>

            <div className="flex flex-row items-center gap-4">
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
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 