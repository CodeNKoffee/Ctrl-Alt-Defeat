import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { acceptCall, rejectCall } from '../store/callReducer';
import SignalingService from '../services/SignalingService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faPhoneSlash, faChevronDown } from '@fortawesome/free-solid-svg-icons';

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
    <div className="fixed top-5 right-5 z-[100] w-80 sm:w-96 font-sans">
      {/* Notification Panel */}
      <div className="bg-gray-900/80 backdrop-blur-lg text-white p-4 rounded-2xl shadow-2xl flex items-center space-x-3">
        {/* Optional: Avatar - Replace with dynamic avatar if available */}
        <div className="flex-shrink-0 w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-xl font-semibold">
          {callerName ? callerName.charAt(0).toUpperCase() : '!'}
        </div>

        {/* Text Info */}
        <div className="flex-grow min-w-0">
          <p className="font-semibold text-base truncate">{callerName || 'Unknown Caller'}</p>
          <p className="text-sm text-gray-300">Incoming Video Call</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 items-stretch">
          <button
            onClick={handleRejectCall}
            className="px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white text-xs font-medium rounded-md flex items-center justify-center transition-colors w-full"
          >
            <FontAwesomeIcon icon={faPhoneSlash} className="mr-1.5 h-3 w-3" />
            Decline
            <FontAwesomeIcon icon={faChevronDown} className="ml-1.5 h-2.5 w-2.5 opacity-70" />
          </button>
          <button
            onClick={handleAcceptCall}
            className="px-3 py-1.5 bg-green-500/80 hover:bg-green-500 text-white text-xs font-medium rounded-md flex items-center justify-center transition-colors w-full"
          >
            <FontAwesomeIcon icon={faVideo} className="mr-1.5 h-3 w-3" />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallNotification;