
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
  const [screenShareStream, setScreenShareStream] = useState(null);
  
  // Get the name and ID of the other party (caller or callee)
  const isCallee = currentUser?.id === calleeId;
  const otherPartyName = isCallee ? callerName : calleeName;
  const otherPartyId = isCallee ? callerId : calleeId;
  
  // Initialize WebRTC and set up event listeners when call starts
  useEffect(() => {
    async function setupCall() {
      if (!isInCall || !otherPartyId) return;
      
      try {
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
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream;
            }
          },
          // Connection state change callback
          (connectionState) => {
            if (connectionState === 'connected') {
              setIsCallConnected(true);
            } else if (['disconnected', 'failed', 'closed'].includes(connectionState)) {
              setIsCallConnected(false);
            }
          }
        );
        
        // Get local media stream
        const localStream = await WebRTCService.getUserMedia(isVideoEnabled, !isMuted);
        if (localVideoRef.current) {
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
          if (senderId === otherPartyId) {
            dispatch(otherPartyLeft());
          }
        });
      } catch (error) {
        console.error('Error setting up WebRTC call:', error);
      }
    }
    
    setupCall();
    
    // Clean up when call ends
    return () => {
      WebRTCService.close();
      SignalingService.disconnect();
      
      // Stop any active screen sharing
      if (screenShareStream) {
        screenShareStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isInCall, otherPartyId, currentUser, dispatch, isCallee, isVideoEnabled, isMuted, screenShareStream]);
  
  // Handle mute toggling
  useEffect(() => {
    WebRTCService.toggleAudio(!isMuted);
  }, [isMuted]);
  
  // Handle video toggling
  useEffect(() => {
    WebRTCService.toggleVideo(isVideoEnabled);
  }, [isVideoEnabled]);
  
  // Handle screen sharing
  useEffect(() => {
    async function toggleScreenSharing() {
      if (isScreenSharing) {
        try {
          const newScreenShareStream = await WebRTCService.replaceVideoTrackWithScreenShare();
          setScreenShareStream(newScreenShareStream);
        } catch (error) {
          console.error('Error sharing screen:', error);
          dispatch(toggleScreenShare()); // Revert back if failed
        }
      } else if (screenShareStream) {
        // Stop screen sharing
        screenShareStream.getTracks().forEach(track => track.stop());
        setScreenShareStream(null);
      }
    }
    
    if (isInCall) {
      toggleScreenSharing();
    }
  }, [isScreenSharing, isInCall, dispatch]);
  
  // Handle other party leaving
  useEffect(() => {
    if (hasOtherPartyLeft) {
      // Show notification that the other party left
      const timer = setTimeout(() => {
        dispatch(endCall());
      }, 5000); // Auto end call after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [hasOtherPartyLeft, dispatch]);
  
  // Handle call ending
  const handleEndCall = () => {
    // Send end call signal to other party
    if (otherPartyId) {
      SignalingService.sendEndCall(otherPartyId);
    }
    
    dispatch(endCall());
  };

  if (!isInCall) return null;

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50">
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
        
        {/* Self view (Picture in Picture) */}
        <div className="absolute right-4 top-4 w-48 h-36 bg-gray-700 border-2 border-white overflow-hidden rounded">
          <video
            ref={localVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted // Always mute local video to prevent echo
          />
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
    </div>
  );
};

export default CallInterface;