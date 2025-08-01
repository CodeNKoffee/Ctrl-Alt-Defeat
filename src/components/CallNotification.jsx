import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { acceptCall, rejectCall } from '../store/callReducer';
import SignalingService from '../services/SignalingService';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faPhoneSlash, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';

const CallNotification = () => {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const dispatch = useDispatch();
  const { isReceivingCall, callerId, callerName } = useSelector((state) => state.call);
  console.log(`[CallNotification] Rendering. isReceivingCall: ${isReceivingCall}, callerId: ${callerId}, callerName: ${callerName}`);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const audioRef = useRef(null);

  // Play sound when notification appears
  useEffect(() => {
    if (isReceivingCall && audioRef.current) {
      audioRef.current.play().catch(error => console.error("Error playing notification sound:", error));
    } else if (!isReceivingCall && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isReceivingCall]);

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

  // Detect RTL
  const isRTL = typeof window !== 'undefined' && document?.documentElement?.dir === 'rtl';
  const notificationVariants = {
    hidden: { opacity: 0, x: isRTL ? "-100%" : "100%" },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
    exit: { opacity: 0, x: isRTL ? "-100%" : "100%", transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <motion.div
      variants={notificationVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed top-5 ltr:right-5 rtl:left-5 z-[100] w-80 sm:w-96 font-sans"
    >
      {/* Notification Panel */}
      <div className="bg-metallica-blue-950/25 backdrop-blur-lg text-white p-4 rounded-2xl shadow-2xl flex items-center space-x-3">
        {/* Optional: Avatar - Replace with dynamic avatar if available */}
        <div className="flex-shrink-0 w-12 h-12 bg-metallica-blue-700 rounded-full flex items-center justify-center text-xl font-semibold rtl:mr-2">
          {callerName ? callerName.charAt(0).toUpperCase() : '!'}
        </div>

        {/* Text Info */}
        <div className="flex-grow min-w-0">
          <p className="font-semibold text-base truncate">{callerName || 'Unknown Caller'}</p>
          <p className="text-sm text-gray-300">{safeT('callInterface.incomingVideoCall')}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 items-stretch">
          <button
            onClick={handleRejectCall}
            className="px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white text-xs font-medium rounded-md flex items-center justify-center transition-colors w-full"
          >
            <FontAwesomeIcon icon={faPhoneSlash} className="mr-1.5 h-3 w-3" />
            {safeT('callInterface.decline')}
            <FontAwesomeIcon icon={faChevronDown} className="ml-1.5 h-2.5 w-2.5 opacity-70" />
          </button>
          <button
            onClick={handleAcceptCall}
            className="px-3 py-1.5 bg-green-500/80 hover:bg-green-500 text-white text-xs font-medium rounded-md flex items-center justify-center transition-colors w-full"
          >
            <FontAwesomeIcon icon={faVideo} className="mr-1.5 h-3 w-3" />
            {safeT('callInterface.accept')}
          </button>
        </div>
      </div>
      {/* Audio element for the ringtone */}
      <audio
        ref={audioRef}
        src="/sounds/Facetime_Ring_and_Answer_Sound.mp3"
        preload="auto"
        loop
      />
    </motion.div>
  );
};

export default CallNotification;