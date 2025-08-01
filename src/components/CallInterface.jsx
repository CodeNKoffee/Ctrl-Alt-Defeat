'use client';

import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  endCall,
  toggleMute,
  toggleVideo,
  toggleScreenShare,
  otherPartyLeft
} from '../store/callReducer';
import WebRTCService from '../services/WebRTCService';
import SignalingService from '../services/SignalingService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faDesktop,
  faPhone,
  faUserCircle,
  faComments,
  faNoteSticky,
  faPaperPlane,
  faSave,
  faXmark,
  faExpand
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from "react-i18next";
import { createSafeT } from "@/lib/translationUtils";

// Extract ChatPanelContent to be outside of CallInterface

const ChatPanelContent = memo(({
  chatMessages = [],
  currentMessage = '',
  setCurrentMessage,
  handleSendMessage,
  handleToggleChat,
  chatScrollRef,
}) => {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-blue-100">{safeT('callInterface.chat')}</h3>
        <button
          onClick={handleToggleChat}
          className="text-blue-200/60 hover:text-blue-200 p-2 rounded-full hover:bg-white/5 transition-colors"
          title={safeT('callInterface.closeChatPanel')}
        >
          <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-col flex-grow overflow-hidden">
        <div ref={chatScrollRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-sm text-blue-200/60">
              <FontAwesomeIcon icon={faComments} className="h-8 w-8 mb-3 opacity-50" />
              <p>{safeT('callInterface.noMessagesYet')}</p>
              <p className="text-xs mt-1">{safeT('callInterface.startConversation')}</p>
            </div>
          ) : (
            chatMessages.map(message => (
              <div key={message.id} className={`flex ${message.isSelf ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-2 shadow-lg ${message.isSelf
                  ? 'bg-[#318FA8] text-white rounded-br-none'
                  : 'bg-white/5 text-blue-100 border border-white/10 rounded-bl-none'
                  }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.isSelf ? 'text-blue-100/70' : 'text-blue-200/60'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t border-white/10">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              className="flex-grow bg-white/5 border border-white/10 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#318FA8] focus:border-[#41B9D9]/30 text-sm text-blue-100 placeholder-blue-200/40"
              placeholder={safeT('callInterface.typeMessage')}
            />
            <button
              type="submit"
              className={`w-10 h-10 rounded-full bg-[#318FA8] hover:bg-[#2A5F74] text-white flex items-center justify-center transition-colors disabled:opacity-50 ${!currentMessage.trim() ? 'cursor-not-allowed' : ''} shadow-lg hover:shadow-xl`}
              disabled={!currentMessage.trim()}
              title={safeT('callInterface.sendMessage')}
            >
              <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});

// Extract NotesPanelContent to be outside of CallInterface
const NotesPanelContent = memo(({
  noteContent = '',
  setNoteContent,
  handleSaveNotes,
  handleToggleNotes
}) => {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-blue-100">Notes</h3>
        <button
          onClick={handleToggleNotes}
          className="text-blue-200/60 hover:text-blue-200 p-2 rounded-full hover:bg-white/5 transition-colors"
          title={safeT('callInterface.closeNotesPanel')}
        >
          <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-col flex-grow p-4">
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          className="flex-grow w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#318FA8] focus:border-[#41B9D9]/30 resize-none text-sm text-blue-100 placeholder-blue-200/40 mb-4"
          placeholder={safeT('callInterface.takeNotes')}
        />
        <button
          onClick={handleSaveNotes}
          className="w-full bg-[#318FA8] hover:bg-[#2A5F74] text-white py-3 px-4 rounded-full font-medium flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-xl border border-[#41B9D9]/30"
          title={safeT('callInterface.saveNotes')}
        >
          <FontAwesomeIcon icon={faSave} className="h-4 w-4" />
          {safeT('callInterface.saveNotes')}
        </button>
      </div>
    </div>
  );
});

const CallInterface = () => {
  const dispatch = useDispatch();
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const instanceId = useRef(Math.random().toString(36).substring(2, 7)).current; // Unique ID for this instance
  console.log(`[CallInterface ${instanceId}] Function body executing.`); // Log instance invocation

  const {
    isInCall,
    isMuted,
    isVideoEnabled,
    isScreenSharing,
    callerId,
    calleeId,
    callerName,
    calleeName,
    otherPartyLeft: hasOtherPartyLeft
  } = useSelector((state) => state.call);

  const currentUser = useSelector((state) => state.auth.currentUser);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const answerAudioRef = useRef(null);
  const [showConnectingOverlay, setShowConnectingOverlay] = useState(true);
  const [showManualLeaveToast, setShowManualLeaveToast] = useState(false);
  const [otherPartyCameraOn, setOtherPartyCameraOn] = useState(false);

  const [showChat, setShowChat] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [noteContent, setNoteContent] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const chatScrollRef = useRef(null);

  const isCallee = currentUser?.id === calleeId;
  const otherPartyName = isCallee ? callerName : calleeName;
  const otherPartyId = isCallee ? callerId : calleeId;

  useEffect(() => {
    console.log("CallInterface currentUser:", currentUser);
  }, [currentUser]);

  useEffect(() => {
    setShowConnectingOverlay(true);
    setOtherPartyCameraOn(false); // Reset camera state when call setup begins
    let isMounted = true;
    const setupInstanceId = instanceId;
    console.log(`[CallInterface ${setupInstanceId}] Setup useEffect running. isInCall: ${isInCall}, otherPartyId: ${otherPartyId}, userId: ${currentUser?.id}`);

    async function setupCall() {
      if (!isInCall || !otherPartyId || !currentUser?.id) {
        console.log(`[CallInterface ${setupInstanceId}] Setup useEffect: Aborting setup.`);
        return;
      }
      console.log(`[CallInterface ${setupInstanceId}] Setup useEffect: Proceeding.`);

      try {
        if (answerAudioRef.current) {
          answerAudioRef.current.currentTime = 0;
          answerAudioRef.current.play().catch(e => console.error("Answer audio play error:", e));
        }

        SignalingService.init(currentUser.id);
        SignalingService.addReceiverId(otherPartyId);

        await WebRTCService.initialize(
          (candidate) => SignalingService.sendIceCandidate(otherPartyId, candidate),
          (stream) => {
            if (remoteVideoRef.current && isMounted) {
              remoteVideoRef.current.srcObject = stream;
              remoteVideoRef.current.play().catch(console.error);
            }
          },
          (connectionState) => {
            if (isMounted) {
              setIsCallConnected(connectionState === 'connected');
              if (connectionState === 'connected') {
                if (remoteVideoRef.current) remoteVideoRef.current.play().catch(console.error);
                if (localVideoRef.current) localVideoRef.current.play().catch(console.error);
              }
            }
          }
        );

        const localStream = await WebRTCService.getUserMedia(true, !isMuted);
        if (localVideoRef.current && isMounted && localStream) {
          localVideoRef.current.srcObject = localStream;
          if (isVideoEnabled) localVideoRef.current.play().catch(console.error);
        }

        WebRTCService.addLocalStreamTracks();

        SignalingService.on('offer', async ({ senderId, offer }) => {
          if (senderId === otherPartyId && isMounted) {
            await WebRTCService.setRemoteDescription(offer);
            const answer = await WebRTCService.createAnswer();
            SignalingService.sendAnswer(otherPartyId, answer);
          }
        });
        SignalingService.on('answer', async ({ senderId, answer }) => {
          if (senderId === otherPartyId && isMounted) {
            await WebRTCService.setRemoteDescription(answer);
          }
        });
        SignalingService.on('ice-candidate', async ({ senderId, candidate }) => {
          if (senderId === otherPartyId && isMounted) {
            await WebRTCService.addIceCandidate(candidate);
          }
        });
        SignalingService.on('end-call', ({ senderId }) => {
          if (senderId === otherPartyId && isMounted) dispatch(otherPartyLeft());
        });

        if (!isCallee) {
          const offer = await WebRTCService.createOffer();
          SignalingService.sendOffer(otherPartyId, offer);
        }

      } catch (error) {
        console.error(`[CallInterface ${setupInstanceId}] Error setting up WebRTC:`, error);
      }
    }

    setupCall();

    return () => {
      isMounted = false;
      console.log(`[CallInterface ${setupInstanceId}] Cleanup running.`);
      WebRTCService.close();
      SignalingService.disconnect();
      if (answerAudioRef.current) {
        answerAudioRef.current.pause();
        answerAudioRef.current.currentTime = 0;
      }
    };
  }, [isInCall, otherPartyId, currentUser?.id, dispatch, isCallee, instanceId]);

  useEffect(() => {
    let timerId = null;
    if (isInCall) {
      timerId = setTimeout(() => {
        setShowConnectingOverlay(false);
      }, 2000);
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [isInCall]);

  useEffect(() => {
    if (isInCall) WebRTCService.toggleAudio(!isMuted);
  }, [isMuted, isInCall]);

  useEffect(() => {
    if (isInCall) {
      WebRTCService.toggleVideo(isVideoEnabled);

      if (isVideoEnabled && localVideoRef.current && WebRTCService.localStream) {
        console.log("CallInterface: Re-assigning srcObject to localVideoRef as video is enabled.");
        localVideoRef.current.srcObject = WebRTCService.localStream;
        localVideoRef.current.play().catch(err => {
          console.error("CallInterface: Error trying to play local video ref:", err);
        });
      } else if (!isVideoEnabled && localVideoRef.current) {
        // Optional: Clear srcObject when video is disabled to show avatar properly
        // localVideoRef.current.srcObject = null;
      }
    }
  }, [isVideoEnabled, isInCall]);

  useEffect(() => {
    let isEffectMounted = true;
    async function handleScreenShare() {
      if (!isEffectMounted) return;
      if (isScreenSharing) {
        try {
          console.log("Attempting to start screen share...");
          await WebRTCService.replaceVideoTrackWithScreenShare(() => {
            if (isEffectMounted) {
              console.log("Screen share stopped callback triggered.");
              dispatch(toggleScreenShare());
            }
          });
          console.log("Screen share started successfully.");
        } catch (error) {
          console.error('CallInterface: Error starting screen share:', error);
          if (isEffectMounted) {
            dispatch(toggleScreenShare());
          }
        }
      } else if (WebRTCService.isCurrentlySharingScreen()) {
        console.log("Attempting to stop screen share (isScreenSharing is false)...");
        await WebRTCService.stopScreenShare(() => {
          if (isEffectMounted) {
            console.log("WebRTCService stopScreenShare completed.");
          }
        });
      }
    }

    if (isInCall) {
      handleScreenShare();
    }

    return () => {
      isEffectMounted = false;
      if (WebRTCService.isCurrentlySharingScreen()) {
        console.log("CallInterface unmount: Stopping screen share.");
        WebRTCService.stopScreenShare();
      }
    };
  }, [isScreenSharing, isInCall, dispatch]);

  useEffect(() => {
    if (hasOtherPartyLeft) {
      const timer = setTimeout(() => {
        dispatch(endCall());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [hasOtherPartyLeft, dispatch]);

  useEffect(() => {
    if (chatScrollRef && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    let cameraTimer = null;
    if (isInCall && !showConnectingOverlay && !otherPartyCameraOn) {
      cameraTimer = setTimeout(() => {
        setOtherPartyCameraOn(true);
      }, 6000); // Increased to 6 seconds (after connecting overlay disappears)
    }

    return () => {
      if (cameraTimer) {
        clearTimeout(cameraTimer);
      }
    };
  }, [isInCall, showConnectingOverlay, otherPartyCameraOn]);

  const handleEndCall = () => {
    console.log("handleEndCall: User clicked end call button.");
    if (otherPartyId) {
      SignalingService.sendEndCall(otherPartyId);
    }
    WebRTCService.close();
    dispatch(endCall());
  };

  const triggerLeaveToast = () => {
    if (showManualLeaveToast) return;
    console.log("CallInterface: Manually triggering leave toast.");
    setShowManualLeaveToast(true);
    setTimeout(() => setShowManualLeaveToast(false), 4000);
  };

  const handleToggleChat = useCallback(() => {
    setShowChat(prev => !prev);
  }, []);

  const handleToggleNotes = useCallback(() => {
    setShowNotes(prev => !prev);
  }, []);

  const getAutoResponse = (message) => {
    const responses = [
      "Okay, I understand.", "Got it.", "That makes sense.", "Thanks for the info.",
      "Acknowledged.", "Will do.", "Interesting point."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const messageContent = currentMessage.trim();
    if (!messageContent) return;

    const newMessage = {
      id: Date.now(),
      sender: currentUser?.name || 'You',
      content: messageContent,
      timestamp: new Date(),
      isSelf: true
    };
    setChatMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');

    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: otherPartyName || 'Other',
        content: getAutoResponse(messageContent),
        timestamp: new Date(),
        isSelf: false
      }]);
    }, 1500);
  };

  const handleSaveNotes = () => {
    console.log("Saving notes:", noteContent);
    alert("Notes saved (logged to console).");
  };

  if (!isInCall) {
    console.log(`[CallInterface ${instanceId}] Rendering null because isInCall is false.`); // Log null render
    return null;
  }

  console.log(`[CallInterface ${instanceId}] Rendering UI.`); // Log UI render

  const baseButtonClass = "flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-200 focus:outline-none shadow-lg hover:shadow-xl focus:ring-2 focus:ring-[#318FA8] focus:ring-offset-2 focus:ring-offset-[#0a1118]";
  const defaultButtonClass = "bg-white/5 hover:bg-white/10 text-blue-100 border border-white/10";
  const activeButtonClass = "bg-[#318FA8] hover:bg-[#2A5F74] text-white border border-[#41B9D9]/30";
  const redButtonClass = "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30";
  const greenButtonClass = "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30";

  const renderCallContent = () => (
    <>
      <div className="flex-1 flex relative bg-[#0a1118]">
        {/* Remote video */}
        {otherPartyCameraOn && (
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-contain"
            autoPlay
            playsInline
          />
        )}

        {/* Status messages */}
        <div className="absolute top-4 left-4 bg-[#1E3A5F]/40 backdrop-blur-sm text-blue-100 px-4 py-2 rounded-full flex items-center text-sm shadow-lg border border-white/10">
          {showConnectingOverlay ? (
            <>
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse mr-2"></div>
              {safeT('callInterface.connectingTo', { otherPartyName })}
            </>
          ) : otherPartyCameraOn ? (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></div>
              {safeT('callInterface.callInProgress', { otherPartyName })}
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-2"></div>
              {safeT('callInterface.connectedWith', { otherPartyName })}
            </>
          )}
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/10">
            <button
              onClick={triggerLeaveToast}
              className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-2 py-1 rounded-full border border-red-500/30 transition-colors"
              title={safeT('callInterface.simulateOtherPartyLeaving')}
            >
              {safeT('callInterface.simLeave')}
            </button>
            <button
              onClick={() => setOtherPartyCameraOn(prev => !prev)}
              className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30 transition-colors"
              title={safeT('callInterface.toggleCameraState')}
            >
              {safeT('callInterface.toggleCam')}
            </button>
          </div>
        </div>

        {/* Camera off placeholder */}
        {!otherPartyCameraOn && !showConnectingOverlay && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1118] text-white">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#318FA8] to-[#41B9D9] flex items-center justify-center text-4xl font-bold mb-4 shadow-lg">
              {otherPartyName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h2 className="text-xl font-semibold text-blue-100">{otherPartyName}</h2>
            <p className="text-sm text-blue-200/60 mt-2">{safeT('callInterface.cameraIsTurnedOff')}</p>
          </div>
        )}

        {/* Camera on placeholder with image */}
        {otherPartyCameraOn && !showConnectingOverlay && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1118] text-white">
            <img
              src="https://printler.com/media/photo/176171-1.jpg"
              alt="Call placeholder"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center top' }}
            />
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-lg sm:text-xl text-white bg-[#1E3A5F]/80 backdrop-blur-sm py-2 px-4 mx-auto inline-block rounded-full border border-white/10">
                {safeT('callInterface.cameraIsOn', { otherPartyName })}
              </p>
            </div>
          </div>
        )}

        {/* Connecting overlay */}
        {showConnectingOverlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a1118]/90 backdrop-blur-sm">
            <div className="text-blue-100 text-xl flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-4 border-[#318FA8] border-t-transparent animate-spin mb-4"></div>
              {safeT('callInterface.connecting')}
            </div>
          </div>
        )}

        {/* Party left notification */}
        {hasOtherPartyLeft && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500/20 backdrop-blur-sm text-red-400 px-4 py-2 rounded-full shadow-lg border border-red-500/30">
            {safeT('callInterface.otherPartyLeft', { otherPartyName })}
          </div>
        )}

        {/* Local video preview */}
        <div className="absolute right-6 bottom-32 w-1/4 sm:w-1/5 max-w-[200px] aspect-video bg-[#1E3A5F]/40 backdrop-blur-sm border border-white/20 overflow-hidden rounded-xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
          {isVideoEnabled ? (
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-white h-full w-full p-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#318FA8] to-[#41B9D9] flex items-center justify-center text-xl font-bold mb-2 shadow-lg">
                {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium text-blue-100">{safeT('callInterface.you')}</span>
              {isMuted && (
                <div className="mt-2 flex items-center text-red-400 text-xs bg-red-500/20 px-2 py-1 rounded-full">
                  <FontAwesomeIcon icon={faMicrophoneSlash} className="h-3 w-3 mr-1" />
                  {safeT('callInterface.muted')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Control bar */}
      <div className="h-24 bg-[#1E3A5F]/40 backdrop-blur-md flex items-center justify-center px-4 shadow-lg border-t border-white/10">
        <div className="bg-[#0a1118]/40 px-4 py-3 rounded-full flex items-center justify-center gap-6 backdrop-blur-sm border border-white/10 shadow-xl">
          <button
            onClick={() => dispatch(toggleMute())}
            className={`${baseButtonClass} ${isMuted ? redButtonClass : defaultButtonClass} transform hover:scale-110 transition-all duration-200`}
            title={isMuted ? safeT('callInterface.unmute') : safeT('callInterface.mute')}
          >
            <FontAwesomeIcon icon={isMuted ? faMicrophoneSlash : faMicrophone} className="h-5 w-5" />
          </button>

          <button
            onClick={() => dispatch(toggleVideo())}
            className={`${baseButtonClass} ${!isVideoEnabled ? redButtonClass : defaultButtonClass} transform hover:scale-110 transition-all duration-200`}
            title={isVideoEnabled ? safeT('callInterface.stopVideo') : safeT('callInterface.startVideo')}
          >
            <FontAwesomeIcon icon={isVideoEnabled ? faVideo : faVideoSlash} className="h-5 w-5" />
          </button>

          <button
            onClick={() => dispatch(toggleScreenShare())}
            className={`${baseButtonClass} ${isScreenSharing ? greenButtonClass : defaultButtonClass} transform hover:scale-110 transition-all duration-200`}
            title={isScreenSharing ? safeT('callInterface.stopSharing') : safeT('callInterface.shareScreen')}
          >
            <FontAwesomeIcon icon={faDesktop} className="h-5 w-5" />
          </button>

          <div className="h-8 w-px bg-white/10"></div>

          <button
            onClick={handleToggleChat}
            className={`${baseButtonClass} ${showChat ? activeButtonClass : defaultButtonClass} transform hover:scale-110 transition-all duration-200`}
            title={safeT('callInterface.chat')}
          >
            <FontAwesomeIcon icon={faComments} className="h-5 w-5" />
          </button>

          <button
            onClick={handleToggleNotes}
            className={`${baseButtonClass} ${showNotes ? activeButtonClass : defaultButtonClass} transform hover:scale-110 transition-all duration-200`}
            title={safeT('callInterface.notes')}
          >
            <FontAwesomeIcon icon={faNoteSticky} className="h-5 w-5" />
          </button>

          <div className="h-8 w-px bg-white/10"></div>

          <button
            onClick={handleEndCall}
            className={`${baseButtonClass} ${redButtonClass} transform hover:scale-110 transition-all duration-200`}
            title={safeT('callInterface.endCall')}
          >
            <FontAwesomeIcon icon={faPhone} className="h-5 w-5 transform rotate-135" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#1a2942] to-[#17202f] flex flex-row z-40">
      <audio
        ref={answerAudioRef}
        src="/sounds/Facetime_Ring_and_Answer_Sound.mp3"
        preload="auto"
      />

      {/* Main Call Content Area */}
      <motion.div
        layout
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`flex flex-col h-screen ${showChat || showNotes
          ? 'w-3/4'
          : 'w-full'
          }`
        }
      >
        {renderCallContent()}
      </motion.div>

      {/* Right Sidebar Area (for Chat and/or Notes) */}
      <AnimatePresence>
        {(showChat || showNotes) && (
          <motion.div
            key="right-sidebar"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: '0%', opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-1/4 min-w-[300px] h-full flex flex-col bg-[#1E3A5F]/40 backdrop-blur-md border-l border-white/10 shadow-2xl"
          >
            {showNotes && showChat ? (
              <>
                <div className="h-1/2 flex-grow overflow-hidden pb-2 p-4">
                  <div className="h-full rounded-3xl bg-[#0a1118]/40 backdrop-blur-sm border border-white/10 shadow-xl overflow-hidden">
                    <NotesPanelContent
                      noteContent={noteContent}
                      setNoteContent={setNoteContent}
                      handleSaveNotes={handleSaveNotes}
                      handleToggleNotes={handleToggleNotes}
                    />
                  </div>
                </div>
                <div className="h-1/2 flex-grow overflow-hidden pt-2 p-4">
                  <div className="h-full rounded-3xl bg-[#0a1118]/40 backdrop-blur-sm border border-white/10 shadow-xl overflow-hidden">
                    <ChatPanelContent
                      chatMessages={chatMessages}
                      currentMessage={currentMessage}
                      setCurrentMessage={setCurrentMessage}
                      handleSendMessage={handleSendMessage}
                      handleToggleChat={handleToggleChat}
                      chatScrollRef={chatScrollRef}
                    />
                  </div>
                </div>
              </>
            ) : showNotes ? (
              <div className="h-full p-4">
                <div className="h-full rounded-3xl bg-[#0a1118]/40 backdrop-blur-sm border border-white/10 shadow-xl overflow-hidden">
                  <NotesPanelContent
                    noteContent={noteContent}
                    setNoteContent={setNoteContent}
                    handleSaveNotes={handleSaveNotes}
                    handleToggleNotes={handleToggleNotes}
                  />
                </div>
              </div>
            ) : showChat ? (
              <div className="h-full p-4">
                <div className="h-full rounded-3xl bg-[#0a1118]/40 backdrop-blur-sm border border-white/10 shadow-xl overflow-hidden">
                  <ChatPanelContent
                    chatMessages={chatMessages}
                    currentMessage={currentMessage}
                    setCurrentMessage={setCurrentMessage}
                    handleSendMessage={handleSendMessage}
                    handleToggleChat={handleToggleChat}
                    chatScrollRef={chatScrollRef}
                  />
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {showManualLeaveToast && (
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-red-500/20 backdrop-blur-sm text-red-400 px-4 py-2 rounded-full shadow-lg border border-red-500/30 animate-pulse">
          {otherPartyName || 'Other party'} has left the call (Simulated)
        </div>
      )}
    </div>
  );
};

export default CallInterface;