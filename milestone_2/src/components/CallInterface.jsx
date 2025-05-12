import React, { useEffect, useRef, useState } from 'react';
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

const CallInterface = () => {
  const dispatch = useDispatch();
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
  const [showLeaveToast, setShowLeaveToast] = useState(false);

  // Get the name and ID of the other party (caller or callee)
  const isCallee = currentUser?.id === calleeId;
  const otherPartyName = isCallee ? callerName : calleeName;
  const otherPartyId = isCallee ? callerId : calleeId;

  // Log currentUser when component mounts
  useEffect(() => {
    console.log("CallInterface currentUser:", currentUser);
  }, [currentUser]);

  // Initialize WebRTC and set up event listeners when call starts
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component
    async function setupCall() {
      if (!isInCall || !otherPartyId || !currentUser?.id) return;

      try {
        // Play answer sound immediately on entry
        if (answerAudioRef.current) {
          console.log("CallInterface: Playing answer sound.");
          answerAudioRef.current.currentTime = 0;
          answerAudioRef.current.play()
            .catch(err => console.error("CallInterface: Error playing answer audio:", err));
        }

        // Initialize signaling with current user's ID
        SignalingService.init(currentUser.id);
        SignalingService.addReceiverId(otherPartyId);

        // Initialize WebRTC peer connection with callbacks
        await WebRTCService.initialize(
          // ICE candidate callback
          (candidate) => {
            SignalingService.sendIceCandidate(otherPartyId, candidate);
          },
          // Track callback
          (stream) => {
            if (remoteVideoRef.current && isMounted) {
              remoteVideoRef.current.srcObject = stream;
            }
          },
          // Connection state change callback
          (connectionState) => {
            if (isMounted) {
              if (connectionState === 'connected') {
                setIsCallConnected(true);
              } else if (['disconnected', 'failed', 'closed'].includes(connectionState)) {
                setIsCallConnected(false);
              }
            }
          }
        );

        // Get local media stream - ALWAYS request video, enable/disable later
        const localStream = await WebRTCService.getUserMedia(true, !isMuted);
        // Log the stream and its tracks
        if (localStream) {
          console.log("CallInterface: Got localStream:", localStream);
          console.log("CallInterface: Local Tracks:", localStream.getTracks());
        } else {
          console.error("CallInterface: Failed to get localStream.");
        }

        if (localVideoRef.current && isMounted) {
          localVideoRef.current.srcObject = localStream;
        }

        // Add local stream tracks to peer connection
        WebRTCService.addLocalStreamTracks();

        // If this user is the caller, create and send an offer
        if (!isCallee) {
          const offer = await WebRTCService.createOffer();
          SignalingService.sendOffer(otherPartyId, offer);
        }

        // Set up signaling event listeners
        SignalingService.on('offer', async ({ senderId, offer }) => {
          if (senderId === otherPartyId) {
            await WebRTCService.setRemoteDescription(offer);
            const answer = await WebRTCService.createAnswer();
            SignalingService.sendAnswer(otherPartyId, answer);
          }
        });

        SignalingService.on('answer', async ({ senderId, answer }) => {
          if (senderId === otherPartyId) {
            await WebRTCService.setRemoteDescription(answer);
          }
        });

        SignalingService.on('ice-candidate', async ({ senderId, candidate }) => {
          if (senderId === otherPartyId) {
            await WebRTCService.addIceCandidate(candidate);
          }
        });

        SignalingService.on('end-call', ({ senderId }) => {
          if (senderId === otherPartyId && isMounted) {
            dispatch(otherPartyLeft());
          }
        });
      } catch (error) {
        console.error('Error setting up WebRTC call:', error);
      }
    }

    setupCall();

    // Clean up when call ends or component unmounts
    return () => {
      isMounted = false;
      console.log("CallInterface: Unmounting or call ended, closing WebRTC.");
      WebRTCService.close(); // Ensure close is called on unmount/dependency change
      SignalingService.disconnect();
      // Stop answer sound if playing
      if (answerAudioRef.current) {
        answerAudioRef.current.pause();
        answerAudioRef.current.currentTime = 0;
      }
    };
  }, [isInCall, otherPartyId, currentUser?.id, dispatch, isCallee]);

  // Handle mute toggling
  useEffect(() => {
    if (isInCall) WebRTCService.toggleAudio(!isMuted);
  }, [isMuted, isInCall]);

  // Handle video toggling
  useEffect(() => {
    if (isInCall) {
      // Remove the delay logic
      WebRTCService.toggleVideo(isVideoEnabled);

      // Re-assign srcObject logic remains the same
      if (isVideoEnabled && localVideoRef.current && WebRTCService.localStream) {
        console.log("CallInterface: Re-assigning srcObject to localVideoRef as video is enabled.");
        localVideoRef.current.srcObject = WebRTCService.localStream;
        // Attempt to play the video element after setting srcObject
        localVideoRef.current.play().catch(err => {
          console.error("CallInterface: Error trying to play local video ref:", err);
        });
      }
    }
  }, [isVideoEnabled, isInCall]); // Re-run when isVideoEnabled or isInCall changes

  // Handle screen sharing
  useEffect(() => {
    let isEffectMounted = true;
    async function handleScreenShare() {
      if (isScreenSharing) {
        try {
          console.log("Attempting to start screen share...");
          // Provide a callback to update Redux state when screen share stops
          await WebRTCService.replaceVideoTrackWithScreenShare(() => {
            if (isEffectMounted) {
              console.log("Screen share stopped callback triggered.");
              dispatch(toggleScreenShare()); // Toggle the state back in Redux
            }
          });
          console.log("Screen share started successfully.");
        } catch (error) {
          console.error('CallInterface: Error starting screen share:', error);
          // If error occurred (e.g., user cancelled), toggle Redux state back
          if (isEffectMounted) {
            dispatch(toggleScreenShare());
          }
        }
      } else {
        // Stop screen sharing if it was previously active
        console.log("Attempting to stop screen share (isScreenSharing is false)...");
        await WebRTCService.stopScreenShare(() => {
          console.log("WebRTCService stopScreenShare completed.");
        });
      }
    }

    if (isInCall) {
      handleScreenShare();
    }

    return () => {
      isEffectMounted = false;
      // Optional: Ensure screen sharing stops if component unmounts mid-share
      // This might be handled by WebRTCService.close() already in the main cleanup
      // if (WebRTCService.screenStream) { 
      //    WebRTCService.stopScreenShare();
      // }
    };
  }, [isScreenSharing, isInCall, dispatch]);

  // Handle other party leaving
  useEffect(() => {
    if (hasOtherPartyLeft) {
      const timer = setTimeout(() => {
        // No need to call WebRTCService.close() here, dispatching endCall
        // will unmount the component, triggering the main cleanup effect.
        dispatch(endCall());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [hasOtherPartyLeft, dispatch]);

  // Effect for repeating 'left call' toast simulation (Point 6)
  useEffect(() => {
    let intervalId = null;
    if (isInCall) {
      console.log("CallInterface: Starting repeating 'left call' toast interval.");
      intervalId = setInterval(() => {
        // Use otherPartyName determined earlier
        console.log(`CallInterface: Simulating toast for ${otherPartyName} left.`);
        setShowLeaveToast(true);
        // Hide the toast after a few seconds (e.g., 3 seconds)
        setTimeout(() => setShowLeaveToast(false), 3000);
      }, 5000); // Show every 5 seconds
    }

    // Cleanup function to clear the interval
    return () => {
      if (intervalId) {
        console.log("CallInterface: Clearing repeating 'left call' toast interval.");
        clearInterval(intervalId);
      }
      setShowLeaveToast(false); // Ensure toast is hidden on unmount
    };
  }, [isInCall, otherPartyName]); // Rerun if isInCall changes or otherPartyName changes

  // Handle call ending - Updated
  const handleEndCall = () => {
    console.log("handleEndCall: User clicked end call button.");
    // Send end call signal *before* closing locally
    if (otherPartyId) {
      SignalingService.sendEndCall(otherPartyId);
    }
    // Explicitly close WebRTC connection and stop streams *now*
    WebRTCService.close();
    // Dispatch Redux action to update global state and unmount component
    dispatch(endCall());
  };

  if (!isInCall) return null;

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50">
      {/* Add Answer Audio Element */}
      <audio
        ref={answerAudioRef}
        src="/sounds/Facetime_Ring_and_Answer_Sound.mp3"
        preload="auto"
      />

      {/* Video container */}
      <div className="flex-1 flex">
        {/* Main video (other person or screen share) */}
        <div className="flex-1 bg-gray-800 relative">
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />

          {!isVideoEnabled && !isScreenSharing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-xl">Video is disabled</div>
            </div>
          )}

          {!isCallConnected && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
              <div className="text-white text-xl">Connecting...</div>
            </div>
          )}

          {/* Notification when other party leaves */}
          {hasOtherPartyLeft && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded">
              {otherPartyName} has left the call
            </div>
          )}

          {/* Call info */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
            {isCallConnected ? 'Connected' : 'Connecting'} with {otherPartyName}
          </div>
        </div>

        {/* Self view (Picture in Picture) - Use 16:9 aspect ratio */}
        <div className="absolute right-4 top-4 w-48 aspect-video bg-gray-700 border-2 border-white overflow-hidden rounded flex items-center justify-center">
          {isVideoEnabled ? (
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted // Always mute local video to prevent echo
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-white h-full w-full">
              <div className="w-16 h-16 rounded-full bg-metallica-blue-600 flex items-center justify-center text-3xl font-bold mb-2 p-2">
                {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-xs font-semibold">{currentUser?.name || 'User'}</span>
              {isMuted && (
                <div className="mt-1 flex items-center text-red-400 text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 017 8a1 1 0 10-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-1v-2.07z" clipRule="evenodd" />
                    <path stroke="#FFF" strokeWidth="1.5" d="M2.93 2.93a1 1 0 011.414 0L17.07 15.656a1 1 0 01-1.414 1.414L2.93 4.344a1 1 0 010-1.414z" />
                  </svg>
                  Muted
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Control bar */}
      <div className="h-20 bg-gray-900 flex items-center justify-center gap-8">
        {/* Mute/unmute button */}
        <button
          onClick={() => dispatch(toggleMute())}
          className={`rounded-full p-4 ${isMuted ? 'bg-red-600' : 'bg-gray-700'}`}
        >
          <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2" stroke="currentColor" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>

        {/* Video toggle button */}
        <button
          onClick={() => dispatch(toggleVideo())}
          className={`rounded-full p-4 ${isVideoEnabled ? 'bg-gray-700' : 'bg-red-600'}`}
        >
          <span className="sr-only">{isVideoEnabled ? 'Turn off video' : 'Turn on video'}</span>
          {isVideoEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2" stroke="currentColor" />
            </svg>
          )}
        </button>

        {/* Screen share button */}
        <button
          onClick={() => dispatch(toggleScreenShare())}
          className={`rounded-full p-4 ${isScreenSharing ? 'bg-green-600' : 'bg-gray-700'}`}
        >
          <span className="sr-only">{isScreenSharing ? 'Stop sharing screen' : 'Share screen'}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>

        {/* End call button */}
        <button
          onClick={handleEndCall}
          className="rounded-full p-4 bg-red-600"
        >
          <span className="sr-only">End call</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
            <line x1="2" y1="22" x2="22" y2="2" strokeWidth="2" stroke="currentColor" />
          </svg>
        </button>
      </div>

      {/* --- Repeating Leave Toast (Point 6) --- */}
      {showLeaveToast && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg animate-pulse">
          {otherPartyName || 'Other party'} has left the call (Simulated)
        </div>
      )}
      {/* --- End of Repeating Toast --- */}
    </div>
  );
};

export default CallInterface;