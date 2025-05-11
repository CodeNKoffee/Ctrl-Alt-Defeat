import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { acceptCall, rejectCall } from '../store/callReducer';
import SignalingService from '../services/SignalingService';

const CallNotification = () => {
  const dispatch = useDispatch();
  const { isReceivingCall, callerId, callerName } = useSelector((state) => state.call);
  const currentUser = useSelector((state) => state.auth.currentUser);
  
  // Initialize SignalingService when receiving a call
  useEffect(() => {
    if (isReceivingCall && callerId && currentUser?.id) {
      SignalingService.init(currentUser.id);
      SignalingService.addReceiverId(callerId);
    }
  }, [isReceivingCall, callerId, currentUser]);

  const handleAcceptCall = () => {
    dispatch(acceptCall());
  };

  const handleRejectCall = () => {
    // Send rejection notification to caller
    if (callerId) {
      SignalingService.sendEndCall(callerId);
    }
    dispatch(rejectCall());
  };

  if (!isReceivingCall) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">Incoming Call</h3>
        <p className="mb-6 text-gray-600">{callerName} is calling you</p>
        
        <div className="flex justify-between">
          <button 
            onClick={handleRejectCall}
            className="flex-1 px-4 py-2 mr-2 bg-red-600 text-white rounded-full hover:bg-red-700 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Decline
          </button>
          <button 
            onClick={handleAcceptCall}
            className="flex-1 px-4 py-2 ml-2 bg-green-600 text-white rounded-full hover:bg-green-700 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallNotification;