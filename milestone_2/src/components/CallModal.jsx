import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { outgoingCall, acceptCall } from '../store/callReducer';
import CallInterface from './CallInterface';
import CallNotification from './CallNotification';
import { MOCK_USERS } from '../../constants/mockData';
import SignalingService from '../services/SignalingService';
import { motion, AnimatePresence } from 'framer-motion';

const CallModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const callState = useSelector((state) => state.call);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isInitiatingCall, setIsInitiatingCall] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [callTimeout, setCallTimeout] = useState(null);
  const callingAudioRef = useRef(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log("CallModal: Opening, resetting initiation state.");
      setIsInitiatingCall(false);
      setSelectedUser(null);
    }
  }, [isOpen]);

  useEffect(() => {
    console.log('Current user from Redux:', currentUser);

    // For debugging - get user from session if Redux is empty
    const getUserFromSession = () => {
      if (typeof window !== 'undefined') {
        const userSessionData = sessionStorage.getItem('userSession') || localStorage.getItem('userSession');
        if (userSessionData) {
          try {
            return JSON.parse(userSessionData);
          } catch (e) {
            console.error('Error parsing user session data', e);
          }
        }
      }
      return null;
    };

    const sessionUser = !currentUser ? getUserFromSession() : null;
    console.log('User from session:', sessionUser);

    // Use currentUser from Redux or fallback to session storage
    const effectiveUser = currentUser || sessionUser;

    // Only show PRO students to SCAD admins and SCAD admins to PRO students
    if (effectiveUser?.role === 'scad') {
      // Filter out only PRO students
      const proStudents = MOCK_USERS.students.filter(student => student.accountType === 'PRO');
      console.log('Available PRO students for SCAD:', proStudents);
      setAvailableUsers(proStudents);
    } else if (effectiveUser?.role === 'student' && effectiveUser?.accountType === 'PRO') {
      // Show only SCAD admins
      console.log('SCAD admin for PRO student:', MOCK_USERS.scad);
      setAvailableUsers([MOCK_USERS.scad]);
    } else {
      // For other users, no contacts available
      console.log('No available contacts for user type:', effectiveUser?.role);
      setAvailableUsers([]);
    }

    // Initialize signaling service for this user when modal is opened
    if (isOpen && effectiveUser?.id) {
      SignalingService.init(effectiveUser.id);
    }

    return () => {
      // Clean up signaling service when modal closes
      if (!isOpen) {
        SignalingService.disconnect();
      }
    };
  }, [currentUser, isOpen]);

  // If we're in an active call, ensure modal stays open
  useEffect(() => {
    if (callState.isInCall || callState.isReceivingCall || callState.isMakingCall) {
      // Force modal to stay open
      if (!isOpen) onClose();
    }
  }, [callState.isInCall, callState.isReceivingCall, callState.isMakingCall, isOpen, onClose]);

  // Handle calling sound and call initiation sequence
  useEffect(() => {
    let callingSoundTimeoutId = null;
    let callActionTimeoutId = null;
    let acceptTimeoutId = null;

    if (isInitiatingCall && selectedUser) {
      // Start calling sound
      if (callingAudioRef.current) {
        console.log("CallModal: Playing calling sound.");
        callingAudioRef.current.currentTime = 0;
        callingAudioRef.current.play()
          .catch(err => console.error('CallModal: Error playing calling audio:', err));

        // Set a timeout (e.g., 3 seconds) after which we dispatch actions
        // This timeout represents the "ringing" duration before connection simulation
        callingSoundTimeoutId = setTimeout(() => {
          console.log("CallModal: Calling sound timeout reached.");
          // Stop the calling sound
          if (callingAudioRef.current) {
            callingAudioRef.current.pause();
            callingAudioRef.current.currentTime = 0;
          }

          // Dispatch outgoingCall action (signals intent to call)
          // Note: In a real app, we might wait for an answer signal here
          console.log("CallModal: Dispatching outgoingCall.");
          dispatch(outgoingCall(selectedUser.id, selectedUser.name));

          // Simulate call acceptance after a short delay (e.g., 500ms)
          // This will set isInCall = true, triggering the modal close and CallInterface mount
          acceptTimeoutId = setTimeout(() => {
            console.log("CallModal: Simulating call acceptance, dispatching acceptCall.");
            dispatch(acceptCall());
            // No need to setIsInitiatingCall(false) here, as the component will unmount
          }, 500); // Short delay before acceptance

        }, 3000); // Ringing duration
      }
    }

    // Store the timeout ID to clear it if cancelled early
    setCallTimeout(callingSoundTimeoutId);

    // Cleanup function for the effect
    return () => {
      console.log("CallModal: Cleaning up sound/initiation effect.");
      clearTimeout(callingSoundTimeoutId);
      // clearTimeout(callActionTimeoutId); // Removed as it's implicit in callingSoundTimeoutId
      clearTimeout(acceptTimeoutId);

      // Stop sounds on cleanup or cancellation
      if (callingAudioRef.current) {
        callingAudioRef.current.pause();
        callingAudioRef.current.currentTime = 0;
      }
      // No need to manage answerAudioRef here anymore
    };
  }, [isInitiatingCall, selectedUser, dispatch]); // Rerun when initiating state or selected user changes

  // Cleanup timeouts and sounds on modal close or component unmount
  useEffect(() => {
    return () => {
      if (callTimeout) {
        clearTimeout(callTimeout);
      }
    };
  }, [callTimeout]); // Only needs callTimeout as dependency

  // Close the modal automatically when the call connects
  useEffect(() => {
    if (callState.isInCall && isOpen) {
      console.log('Call connected (isInCall is true), closing CallModal.');
      onClose();
    }
  }, [callState.isInCall, isOpen, onClose]);

  const initiateCall = (userId, userName) => {
    setSelectedUser({ id: userId, name: userName });
    setIsInitiatingCall(true);
    SignalingService.addReceiverId(userId);
  };

  const cancelCall = () => {
    console.log("CallModal: Cancelling call initiation.");
    if (callTimeout) {
      clearTimeout(callTimeout);
      setCallTimeout(null);
    }
    // Stop calling sound immediately
    if (callingAudioRef.current) {
      callingAudioRef.current.pause();
      callingAudioRef.current.currentTime = 0;
    }
    // Remove answer sound ref management
    setIsInitiatingCall(false);
    setSelectedUser(null);
  };

  // Render Logic:
  // 1. If isInCall or isReceivingCall, show CallInterface.
  // 2. Otherwise, if the modal is open, show the contact list or the initiating UI.

  if (callState.isInCall || callState.isReceivingCall) {
    // If already in a call (accepted) or receiving one, show the main interface
    return (
      <div className="fixed inset-0 z-50">
        <CallInterface />
        <CallNotification />
      </div>
    );
  }

  // If modal is not open and not in a call state, render nothing
  if (!isOpen) {
    return null;
  }

  // Otherwise, show the modal content (contacts or initiating UI)
  return (
    <div className="fixed inset-0 z-40 overflow-y-auto">
      {/* Audio elements */}
      <audio
        ref={callingAudioRef}
        src="/sounds/FaceTime_Calling_Sound.mp3"
        preload="auto"
      />

      <AnimatePresence>
        {/* Overlay */}
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm"
          onClick={isInitiatingCall ? null : onClose}
        />

        {/* Modal Content Wrapper */}
        <div className="flex items-center justify-center min-h-screen px-4 py-8 text-center sm:p-0">
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-metallica-blue-50 rounded-2xl overflow-hidden shadow-2xl transform sm:my-8 text-left"
          >
            {/* Conditional Rendering: Calling UI or Contact List */}
            {isInitiatingCall && selectedUser ? (
              <div className="p-6 flex flex-col items-center">
                {/* Avatar & Rings */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-metallica-blue-200 flex items-center justify-center text-5xl font-bold text-metallica-blue-600 mb-6">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-metallica-blue-400"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-metallica-blue-300"
                    animate={{ scale: [1, 1.7, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  />
                </div>
                {/* Name & Status */}
                <h2 className="text-2xl font-young-serif text-metallica-blue-600 font-semibold mt-2">
                  {selectedUser.name}
                </h2>
                <p className="text-metallica-blue-500 mb-6 text-sm">Calling...</p>
                {/* Cancel Button */}
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <button
                    onClick={cancelCall}
                    className="flex items-center justify-center w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
                    aria-label="Cancel call"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="px-6 py-4 bg-metallica-blue-600 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-young-serif font-medium">Video Calls</h3>
                    <button
                      onClick={onClose}
                      className="text-white hover:bg-metallica-blue-500 rounded-full p-1 transition-colors"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                {/* List Area */}
                <div className="p-6">
                  <h4 className="font-medium text-metallica-blue-700 mb-2 font-ibm-plex-sans">Available Contacts</h4>
                  <p className="mb-5 text-sm text-metallica-blue-600 font-ibm-plex-sans">
                    {currentUser?.role === 'scad' ? 'You can call any PRO student...' : 'You can call SCAD administrators...'}
                  </p>
                  {/* Conditional List or Empty State */}
                  {availableUsers.length === 0 ? (
                    <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 font-ibm-plex-sans">No available contacts found.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 overflow-hidden">
                      {availableUsers.map((user) => (
                        <motion.div
                          key={user.id}
                          className="bg-white rounded-xl p-4 shadow-sm border border-metallica-blue-100 hover:shadow-md transition-all duration-200"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="bg-metallica-blue-100 text-metallica-blue-600 rounded-full h-12 w-12 flex items-center justify-center mr-4 font-medium text-lg shadow-sm">
                                {user.name.charAt(0)}
                              </div>
                              <div className="text-left">
                                <h3 className="font-medium text-metallica-blue-800 font-ibm-plex-sans">{user.name}</h3>
                                <p className="text-xs text-metallica-blue-500 mt-0.5 font-ibm-plex-sans">
                                  {user.role === 'scad' ? 'SCAD Administrator' : `${user.major} Student`}
                                </p>
                                {user.role === 'student' && (
                                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded mt-1 font-ibm-plex-sans">PRO</span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => initiateCall(user.id, user.name)}
                              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full flex items-center transition-colors shadow-sm"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              Call
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  );
};

export default CallModal;