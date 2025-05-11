"use client";

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { outgoingCall } from '../../../store/callReducer';
import CallInterface from '../../../components/CallInterface';
import CallNotification from '../../../components/CallNotification';
import { MOCK_USERS } from '../../../../constants/mockData';
import SignalingService from '../../../services/SignalingService';

const CallsPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
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
    
    // Initialize signaling service for this user
    if (currentUser?.id) {
      SignalingService.init(currentUser.id);
    }
    
    return () => {
      // Clean up signaling service
      SignalingService.disconnect();
    };
  }, [currentUser]);

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

  // If user is not a SCAD admin or PRO student, show access denied
  if (
    !currentUser || 
    (currentUser.role !== 'scad' && 
     (currentUser.role !== 'student' || currentUser.accountType !== 'PRO'))
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-700">
            This feature is only available to SCAD administrators and PRO students.
          </p>
          {currentUser?.role === 'student' && currentUser?.accountType !== 'PRO' && (
            <p className="mt-4 text-gray-600">
              Upgrade to a PRO account to access video call features.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Video Calls</h1>
      
      {/* Call components */}
      <CallInterface />
      <CallNotification />
      
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
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Available Contacts</h2>
        
        <p className="mb-4 text-gray-600">
          {currentUser.role === 'scad' ? 
            'You can call any PRO student for career guidance discussions.' : 
            'You can call SCAD administrators for academic advice and career planning.'}
        </p>
        
        {availableUsers.length === 0 ? (
          <p className="text-gray-600">No available contacts found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableUsers.map((user) => (
              <div 
                key={user.id} 
                className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.role === 'scad' ? 'SCAD Administrator' : `${user.major} Student`}</p>
                  {user.role === 'student' && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                      PRO Account
                    </span>
                  )}
                </div>
                <button
                  onClick={() => initiateCall(user.id, user.name)}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">About Video Calls</h3>
        <p className="text-blue-700 mb-4">
          This feature allows direct communication between SCAD administrators and PRO students.
        </p>
        <ul className="list-disc list-inside text-blue-700 space-y-1">
          <li>Receive incoming call notifications with options to accept or reject</li>
          <li>Toggle your microphone on/off during calls</li>
          <li>Enable or disable your video camera</li>
          <li>Share your screen to discuss academic plans and career options</li>
          <li>End the call at any time</li>
        </ul>
      </div>
    </div>
  );
};

export default CallsPage;