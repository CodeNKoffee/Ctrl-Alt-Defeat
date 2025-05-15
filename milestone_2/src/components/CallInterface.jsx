'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  faPhoneSlash,
  faUserCircle,
  faComments,
  faNoteSticky,
  faPaperPlane,
  faSave,
  faXmark,
  faExpand
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

const CallInterface = () => {
  const dispatch = useDispatch();
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

  const baseButtonClass = "flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-colors transition-shadow transition-transform duration-150 focus:outline-none shadow-[0_2px_8px_rgba(49,143,168,0.06)] hover:translate-y-[-2px] hover:scale-107 focus:ring-2 focus:ring-[#318FA8] focus:ring-offset-2 focus:ring-offset-metallica-blue-400";
  const defaultButtonClass = "bg-gray-200 hover:bg-gray-300 text-[#2A5F74]";
  const activeButtonClass = "bg-[#318FA8] hover:bg-[#2A5F74] text-white";
  const activeNotesButtonClass = "bg-metallica-blue-100 hover:bg-metallica-blue-200 text-metallica-blue-700";
  const redButtonClass = "bg-red-600 hover:bg-red-700 text-white";
  const greenButtonClass = "bg-green-600 hover:bg-green-700 text-white";

  const renderCallContent = () => (
    <>
      <div className="flex-1 flex relative bg-apple-gray-900">
        <video
          ref={remoteVideoRef}
          className="w-full h-full object-contain"
          autoPlay
          playsInline
        />

        {!isVideoEnabled && !isScreenSharing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-apple-gray-800 text-white p-4">
            <FontAwesomeIcon icon={faUserCircle} className="text-apple-gray-500 text-6xl sm:text-8xl mb-2 sm:mb-4" />
            <p className="text-lg sm:text-xl text-center">{otherPartyName}'s video is off</p>
          </div>
        )}

        {showConnectingOverlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
            <div className="text-white text-lg sm:text-xl">Connecting...</div>
          </div>
        )}

        {hasOtherPartyLeft && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 py-1 rounded shadow-md text-sm">
            {otherPartyName} has left the call
          </div>
        )}

        <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg flex items-center text-xs sm:text-sm shadow">
          {isCallConnected ? 'Connected' : 'Connecting'} with {otherPartyName}
          <button
            onClick={triggerLeaveToast}
            className="ml-2 text-xs bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-0.5 px-1.5 rounded opacity-75 hover:opacity-100 transition-opacity"
            title="Simulate other party leaving"
          >
            Sim Leave
          </button>
        </div>

        <div className="absolute right-4 bottom-24 w-1/4 sm:w-1/5 max-w-[150px] sm:max-w-xs aspect-video bg-apple-gray-700 border border-apple-gray-500 overflow-hidden rounded-md sm:rounded-lg shadow-lg flex items-center justify-center">
          {isVideoEnabled ? (
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-white h-full w-full p-1 sm:p-2 bg-apple-gray-700">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-metallica-blue-600 flex items-center justify-center text-sm sm:text-xl font-bold mb-1 p-1 shrink-0">
                {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-xs font-semibold max-w-full truncate mt-0.5" title={currentUser?.name || 'User'}>{currentUser?.name || 'User'}</span>
              {isMuted && (
                <div className="mt-0.5 flex items-center text-red-400 text-xs scale-90">
                  <FontAwesomeIcon icon={faMicrophoneSlash} className="h-2.5 w-2.5 mr-1" />
                  Muted
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="h-24 flex items-center justify-center px-4 bg-gray-50">
        <div className="bg-gray-100 p-3 rounded-full flex items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => dispatch(toggleMute())}
            className={`${baseButtonClass} ${isMuted ? redButtonClass : defaultButtonClass}`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <FontAwesomeIcon icon={isMuted ? faMicrophoneSlash : faMicrophone} className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <button
            onClick={() => dispatch(toggleVideo())}
            className={`${baseButtonClass} ${!isVideoEnabled ? redButtonClass : defaultButtonClass}`}
            title={isVideoEnabled ? 'Stop Video' : 'Start Video'}
          >
            <FontAwesomeIcon icon={isVideoEnabled ? faVideo : faVideoSlash} className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <button
            onClick={handleToggleChat}
            className={`${baseButtonClass} ${showChat ? activeButtonClass : defaultButtonClass}`}
            title="Chat"
          >
            <FontAwesomeIcon icon={faComments} className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <button
            onClick={handleToggleNotes}
            className={`${baseButtonClass} ${showNotes ? activeNotesButtonClass : defaultButtonClass}`}
            title="Notes"
          >
            <FontAwesomeIcon icon={faNoteSticky} className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <button
            onClick={() => dispatch(toggleScreenShare())}
            className={`${baseButtonClass} ${isScreenSharing ? greenButtonClass : defaultButtonClass}`}
            title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
          >
            <FontAwesomeIcon icon={faDesktop} className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <button
            onClick={handleEndCall}
            className={`${baseButtonClass} ${redButtonClass}`}
            title="End Call"
          >
            <FontAwesomeIcon icon={faPhoneSlash} className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black flex flex-row z-40">
      <audio
        ref={answerAudioRef}
        src="/sounds/Facetime_Ring_and_Answer_Sound.mp3"
        preload="auto"
      />

      {/* Chat Panel (Left) */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            key="chat-sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-1/4 h-screen flex flex-col bg-white border-r border-gray-300 shadow-lg"
          >
            <div className="flex justify-between items-center p-3 border-b bg-gray-50 rounded-t-lg">
              <h3 className="text-lg font-semibold text-gray-700">Chat</h3>
              <button
                onClick={handleToggleChat}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200"
                title="Close Chat Panel"
              >
                <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col flex-grow overflow-hidden">
              <div ref={chatScrollRef} className="flex-grow p-4 space-y-3 overflow-y-auto bg-gray-100">
                {chatMessages.length === 0 ? (
                  <p className="text-center text-sm text-gray-500 py-4">No messages yet.</p>
                ) : (
                  chatMessages.map(message => (
                    <div key={message.id} className={`flex ${message.isSelf ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg px-3 py-2 shadow-sm ${message.isSelf
                        ? 'bg-metallica-blue-700 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                        }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.isSelf ? 'text-blue-100' : 'text-gray-400'} ${message.isSelf ? 'text-right' : 'text-left'}`}>
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 border-t bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    className="flex-grow border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-metallica-blue-700 focus:border-metallica-blue-700 text-sm"
                    placeholder="Type your message..."
                  />
                  <button
                    type="submit"
                    className={`w-10 h-10 rounded-full bg-metallica-blue-700 hover:bg-metallica-blue-800 text-white flex items-center justify-center transition-colors disabled:opacity-50 ${!currentMessage.trim() ? 'cursor-not-allowed' : ''}`}
                    disabled={!currentMessage.trim()}
                    title="Send Message"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Call Content Area */}
      <motion.div
        layout
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`flex flex-col h-screen ${showChat && showNotes
          ? 'w-1/2'
          : showChat || showNotes
            ? 'w-3/4'
            : 'w-full'
          }`}
      >
        {renderCallContent()}
      </motion.div>

      {/* Notes Panel (Right) */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            key="notes-sidebar"
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-1/4 h-screen flex flex-col bg-white border-l border-gray-300 shadow-lg"
          >
            <div className="flex justify-between items-center p-3 border-b bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-700">Private Notes</h3>
              <button
                onClick={handleToggleNotes}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200"
                title="Close Notes Panel"
              >
                <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col flex-grow overflow-hidden p-4">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="flex-grow w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-metallica-blue-700 focus:border-metallica-blue-700 resize-none text-sm mb-4"
                placeholder="Write your private notes here..."
              />
              <button
                onClick={handleSaveNotes}
                className="w-full bg-metallica-blue-700 hover:bg-metallica-blue-800 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                title="Save Notes (logs to console)"
              >
                <FontAwesomeIcon icon={faSave} />
                Save Notes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showManualLeaveToast && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg animate-pulse z-60">
          {otherPartyName || 'Other party'} has left the call (Simulated)
        </div>
      )}
    </div>
  );
};

export default CallInterface;