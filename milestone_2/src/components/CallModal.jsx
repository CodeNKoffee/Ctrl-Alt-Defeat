import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { outgoingCall } from '../store/callReducer';
import CallInterface from './CallInterface';
import CallNotification from './CallNotification';
import { MOCK_USERS } from '../../constants/mockData';
import SignalingService from '../services/SignalingService';

const CallModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const callState = useSelector((state) => state.call);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isInitiatingCall, setIsInitiatingCall] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Only show PRO students to SCAD admins and SCAD admins to PRO students
    if (currentUser?.role === 'scad') {
      // Filter out only PRO students
      const proStudents = MOCK_USERS.students.filter(student => student.accountType === 'PRO');
      setAvailableUsers(proStudents);
    } else if (currentUser?.role === 'student' && currentUser?.accountType === 'PRO') {
      // Show only SCAD admins
      setAvailableUsers([MOCK_USERS.scad]);
    }
    
    // Initialize signaling service for this user when modal is opened
    if (isOpen && currentUser?.id) {
      SignalingService.init(currentUser.id);
    }
    
    return () => {
      // Clean up signaling service when modal closes
      if (!isOpen) {
        SignalingService.disconnect();
      }
    };
  }, [currentUser, isOpen]);

  // If we're in an active call, keep modal open
  useEffect(() => {
    if (callState.isInCall || callState.isReceivingCall || callState.isMakingCall) {
      // Force modal to stay open
      if (!isOpen) onClose();
    }
  }, [callState.isInCall, callState.isReceivingCall, callState.isMakingCall, isOpen, onClose]);

  const initiateCall = (userId, userName) => {
    // Set selected user and show initiating UI
    setSelectedUser({ id: userId, name: userName });
    setIsInitiatingCall(true);
    
    // Add receiver to signaling service
    SignalingService.addReceiverId(userId);
    
    // Start call after a brief delay (simulates connection time)
    setTimeout(() => {
      dispatch(outgoingCall(userId, userName));
      setIsInitiatingCall(false);
    }, 2000);
  };

  // Don't render if modal is closed
  if (!isOpen && !callState.isInCall && !callState.isReceivingCall && !callState.isMakingCall) {
    return null;
  }

  // If there's an active call or incoming call, just show the call interface
  if (callState.isInCall || callState.isReceivingCall || callState.isMakingCall) {
    return (
      <div className="fixed inset-0 z-50">
        <CallInterface />
        <CallNotification />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex justify-between items-center">
                  <span>Video Calls</span>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </h3>
                
                {/* Calling UI - shown when initiating a call */}
                {isInitiatingCall && selectedUser && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-2">Calling {selectedUser.name}...</h3>
                      <p className="mb-6 text-gray-600">Please wait for them to answer</p>
                      
                      <button 
                        onClick={() => setIsInitiatingCall(false)}
                        className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 flex items-center justify-center mx-auto"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel Call
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Available Contacts</h4>
                  
                  <p className="mb-4 text-sm text-gray-600">
                    {currentUser?.role === 'scad' ? 
                      'You can call any PRO student for career guidance discussions.' : 
                      'You can call SCAD administrators for academic advice and career planning.'}
                  </p>
                  
                  {availableUsers.length === 0 ? (
                    <p className="text-gray-600">No available contacts found.</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {availableUsers.map((user) => (
                        <div 
                          key={user.id} 
                          className="border rounded-lg p-3 flex items-center justify-between hover:bg-gray-50"
                        >
                          <div className="flex items-center">
                            <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                              <span className="text-gray-600 font-medium">{user.name.charAt(0)}</span>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800">{user.name}</h3>
                              <p className="text-xs text-gray-500">{user.role === 'scad' ? 'SCAD Administrator' : `${user.major} Student`}</p>
                              {user.role === 'student' && (
                                <span className="inline-block bg-green-100 text-green-800 text-xs px-1 rounded mt-1">
                                  PRO
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => initiateCall(user.id, user.name)}
                            className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Call
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallModal;