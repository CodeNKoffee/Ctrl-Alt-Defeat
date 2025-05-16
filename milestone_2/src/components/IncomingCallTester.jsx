'use client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incomingCall } from '../store/callReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug } from '@fortawesome/free-solid-svg-icons';

const IncomingCallTester = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  // No need to get appointments since this is a test feature

  // Helper to get the effective user (Redux or fallback from session/local storage)
  const getEffectiveUser = () => {
    if (currentUser) return currentUser;
    if (typeof window !== 'undefined') {
      const userSessionData = sessionStorage.getItem('userSession') || localStorage.getItem('userSession');
      if (userSessionData) {
        try { return JSON.parse(userSessionData); } catch (e) { console.error('Error parsing user session data', e); }
      }
    }
    return { id: 'unknown_user', name: 'Unknown User' }; // Fallback if no user found
  };

  const effectiveUser = getEffectiveUser();

  // Determine if the current user is SCAD admin or a PRO student
  const isScadAdmin = effectiveUser?.role === 'scad';
  const isProStudent = effectiveUser?.role === 'student' && effectiveUser?.accountType === 'PRO';

  const shouldShowTester = isScadAdmin || isProStudent;

  const simulateIncomingCall = () => {
    // No appointment check needed for test functionality
    const simulatedPayload = {
      callerId: 'alien-x-001', // Dummy ID for Alien X
      callerName: 'Alien X',
      calleeId: effectiveUser.id, // The ID of the currently logged-in user
      // offer: null, // No actual WebRTC offer needed for UI testing
      message: 'Wants to connect with you.' // Optional message
    };
    console.log('[TesterButton] Simulating incoming call:', simulatedPayload);
    dispatch(incomingCall(simulatedPayload));
  };

  // Only render the button if the user is SCAD Admin or PRO Student
  if (!shouldShowTester) {
    return null;
  }

  return (
    <div className="relative z-30">
      <button
        onClick={simulateIncomingCall}
        className="relative w-11 h-11 rounded-full bg-gray-50 text-purple-700 flex items-center justify-center shadow-md hover:bg-purple-100 hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-150 ease-in"
        aria-label="Simulate Incoming Call"
        title="Simulate Incoming Call from Alien X (Test Feature)"
        type="button"
      >
        <FontAwesomeIcon icon={faBug} className="h-6 w-6 pointer-events-none" />
      </button>
    </div>
  );
};

export default IncomingCallTester; 