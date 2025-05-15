"use client";

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { outgoingCall, requestAppointment } from '../../../store/callReducer';
import CallInterface from '../../../components/CallInterface';
import CallNotification from '../../../components/CallNotification';
import { MOCK_USERS } from '../../../../constants/mockData';
import SignalingService from '../../../services/SignalingService';

const CallsPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const { isReceivingCall, isInCall, appointments } = useSelector((state) => state.call);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isInitiatingCall, setIsInitiatingCall] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [appointmentDateTime, setAppointmentDateTime] = useState('');

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

  // Check if a user has a confirmed appointment
  const hasConfirmedAppointment = (userId) => {
    return appointments.some(appt =>
      ((appt.requesterId === currentUser?.id && appt.requestedUserId === userId) ||
        (appt.requestedUserId === currentUser?.id && appt.requesterId === userId)) &&
      appt.status === 'confirmed'
    );
  };

  // Get all appointments for the current user
  const getUserAppointments = () => {
    return appointments.filter(appt =>
      appt.requesterId === currentUser?.id ||
      appt.requestedUserId === currentUser?.id
    );
  };

  const initiateCall = (userId, userName) => {
    // Check if there is a confirmed appointment first
    if (!hasConfirmedAppointment(userId)) {
      alert("You can only call users with confirmed appointments. Please book an appointment first.");
      return;
    }

    // Set selected user and show initiating UI
    setSelectedUser({ id: userId, name: userName });
    setIsInitiatingCall(true);

    // Add receiver to signaling service
    SignalingService.addReceiverId(userId);

    // Dispatch immediately
    dispatch(outgoingCall({ calleeId: userId, calleeName: userName, callerId: currentUser.id }));
  };

  const handleRequestAppointment = (userId, userName) => {
    // Check if already have a pending or confirmed appointment
    const existingAppointment = appointments.find(
      appt => (appt.requesterId === currentUser?.id && appt.requestedUserId === userId) &&
        (appt.status === 'pending' || appt.status === 'confirmed')
    );

    if (existingAppointment) {
      alert(`You already have a ${existingAppointment.status} appointment with ${userName}`);
      return;
    }

    setSelectedUser({ id: userId, name: userName });
    setShowRequestForm(true);
  };

  const submitAppointmentRequest = () => {
    if (!appointmentDateTime) {
      alert("Please select a date and time for the appointment");
      return;
    }

    dispatch(requestAppointment({
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requestedUserId: selectedUser.id,
      requestedUserName: selectedUser.name,
      dateTime: appointmentDateTime
    }));

    setShowRequestForm(false);
    setAppointmentDateTime('');
    alert(`Appointment requested with ${selectedUser.name}. Once they accept, you'll be able to call them.`);
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

  // Get user appointments
  const userAppointments = getUserAppointments();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Video Calls</h1>

      {/* Call components - only render when needed */}
      {isInCall && <CallInterface />}
      {isReceivingCall && !isInitiatingCall && <CallNotification />}

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

      {/* Appointment Request Form */}
      {showRequestForm && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Request Appointment with {selectedUser.name}</h3>
            <p className="mb-4 text-gray-600">
              Select a date and time for your appointment. You'll be able to call once the appointment is confirmed.
            </p>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Date and Time</label>
              <input
                type="datetime-local"
                className="w-full p-2 border rounded"
                value={appointmentDateTime}
                onChange={(e) => setAppointmentDateTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRequestForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitAppointmentRequest}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Request Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>

        {userAppointments.length === 0 ? (
          <p className="text-gray-600">No appointments scheduled. Book an appointment to enable video calls.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">With</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userAppointments.map(appt => {
                  const isRequester = appt.requesterId === currentUser.id;
                  const otherParty = isRequester ? appt.requestedUserName : appt.requesterName;
                  const otherPartyId = isRequester ? appt.requestedUserId : appt.requesterId;

                  return (
                    <tr key={appt.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{otherParty}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appt.dateTime ? new Date(appt.dateTime).toLocaleString() : 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'}`
                        }>
                          {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {appt.status === 'confirmed' && (
                          <button
                            onClick={() => initiateCall(otherPartyId, otherParty)}
                            className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-xs"
                          >
                            Call Now
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Available Contacts</h2>

        <p className="mb-4 text-gray-600">
          {currentUser.role === 'scad' ?
            'Book appointments with PRO students for career guidance discussions.' :
            'Book appointments with SCAD administrators for academic advice and career planning.'}
        </p>

        {availableUsers.length === 0 ? (
          <p className="text-gray-600">No available contacts found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableUsers.map((user) => {
              const hasAppointment = hasConfirmedAppointment(user.id);
              const hasPendingRequest = appointments.some(
                appt => appt.requesterId === currentUser?.id &&
                  appt.requestedUserId === user.id &&
                  appt.status === 'pending'
              );

              return (
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
                    {hasAppointment && (
                      <span className="block text-green-600 text-xs mt-1">
                        ✓ Confirmed Appointment
                      </span>
                    )}
                    {hasPendingRequest && (
                      <span className="block text-yellow-600 text-xs mt-1">
                        ⏱ Pending Request
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    {hasAppointment ? (
                      <button
                        onClick={() => initiateCall(user.id, user.name)}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRequestAppointment(user.id, user.name)}
                        className={`${hasPendingRequest ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 px-4 rounded flex items-center`}
                        disabled={hasPendingRequest}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {hasPendingRequest ? 'Request Pending' : 'Book Appointment'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">About Video Calls</h3>
        <p className="text-blue-700 mb-4">
          This feature allows direct communication between SCAD administrators and PRO students.
        </p>
        <ul className="list-disc list-inside text-blue-700 space-y-1">
          <li>Book appointments with available contacts</li>
          <li>Start calls once appointments are confirmed</li>
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