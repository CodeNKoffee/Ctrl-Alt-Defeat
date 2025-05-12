'use client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incomingCall } from '../store/callReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const IncomingCallTester = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);

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

  const simulateIncomingCall = () => {
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

  return (
    <button
      onClick={simulateIncomingCall}
      className="fixed bottom-5 right-5 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-full shadow-lg z-50 flex items-center transition-transform transform hover:scale-105"
      title="Simulate Incoming Call from Alien X"
    >
      <FontAwesomeIcon icon={faBell} className="mr-2" />
      Test Incoming Call
    </button>
  );
};

export default IncomingCallTester; 