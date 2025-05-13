/**
 * WebRTCService - Handles WebRTC connections for video calls
 * 
 * This service manages the peer connection, local and remote streams,
 * and all WebRTC-related functionality.
 */

class WebRTCService {
  constructor() {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.onIceCandidateCallback = null;
    this.onTrackCallback = null;
    this.onConnectionStateChangeCallback = null;
    this.originalVideoTrack = null; // Store the original camera track
    this.screenStream = null; // Store the screen share stream

    // Configuration for STUN and TURN servers
    this.config = {
      iceServers: [
        {
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
          ],
        },
      ],
      iceCandidatePoolSize: 10,
    };
  }

  /**
   * Initialize the WebRTC connection
   * @param {Function} onIceCandidate - Callback when a new ICE candidate is available
   * @param {Function} onTrack - Callback when remote tracks are received
   * @param {Function} onConnectionStateChange - Callback when connection state changes
   */
  async initialize(onIceCandidate, onTrack, onConnectionStateChange) {
    try {
      this.onIceCandidateCallback = onIceCandidate;
      this.onTrackCallback = onTrack;
      this.onConnectionStateChangeCallback = onConnectionStateChange;

      // Create the peer connection
      this.peerConnection = new RTCPeerConnection(this.config);

      // Set up remote streams
      this.remoteStream = new MediaStream();

      // Event handlers
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.onIceCandidateCallback(event.candidate);
        }
      };

      this.peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          this.remoteStream.addTrack(track);
        });
        this.onTrackCallback(this.remoteStream);
      };

      this.peerConnection.onconnectionstatechange = () => {
        this.onConnectionStateChangeCallback(this.peerConnection.connectionState);
      };

      return true;
    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      return false;
    }
  }

  /**
   * Get user media (camera and microphone)
   * @param {boolean} video - Whether to enable video
   * @param {boolean} audio - Whether to enable audio
   */
  async getUserMedia(video = true, audio = true) {
    try {
      // Stop existing tracks first if any
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
      }

      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: video,
        audio: audio
      });

      // Store the original video track
      if (video) {
        this.originalVideoTrack = this.localStream.getVideoTracks()[0];
      }

      return this.localStream;
    } catch (error) {
      console.error('Error getting user media:', error);
      throw error;
    }
  }

  /**
   * Add local stream tracks to peer connection
   */
  addLocalStreamTracks() {
    if (this.localStream && this.peerConnection) {
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, this.localStream);
      });
    }
  }

  /**
   * Create an offer (caller)
   */
  async createOffer() {
    try {
      const offerDescription = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offerDescription);
      return offerDescription;
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  }

  /**
   * Create an answer (callee)
   */
  async createAnswer() {
    try {
      const answerDescription = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answerDescription);
      return answerDescription;
    } catch (error) {
      console.error('Error creating answer:', error);
      throw error;
    }
  }

  /**
   * Set remote description (offer or answer)
   */
  async setRemoteDescription(description) {
    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(description));
    } catch (error) {
      console.error('Error setting remote description:', error);
      throw error;
    }
  }

  /**
   * Add ICE candidate from remote peer
   */
  async addIceCandidate(candidate) {
    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
      throw error;
    }
  }

  /**
   * Toggle audio on/off
   */
  toggleAudio(isEnabled) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = isEnabled;
      });
    }
  }

  /**
   * Toggle video on/off
   */
  toggleVideo(isEnabled) {
    console.log(`WebRTCService: toggleVideo called with isEnabled: ${isEnabled}`);
    if (this.localStream) {
      const videoTracks = this.localStream.getVideoTracks();
      console.log(`WebRTCService: Found ${videoTracks.length} video track(s).`);
      videoTracks.forEach(track => {
        console.log(`WebRTCService: Setting track ${track.id} (label: ${track.label}, readyState: ${track.readyState}) enabled to ${isEnabled}`);
        track.enabled = isEnabled;
      });
    } else {
      console.warn("WebRTCService: toggleVideo called but localStream is null.");
    }
  }

  /**
   * Replace video track with screen share
   */
  async replaceVideoTrackWithScreenShare(onStopScreenShareCallback) {
    try {
      if (this.screenStream) {
        console.warn("Screen sharing is already active.");
        return this.screenStream;
      }
      // Get screen share stream
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false // Usually screen sharing doesn't include audio by default
      });

      const screenTrack = this.screenStream.getVideoTracks()[0];

      // Store the original video track if we haven't already
      if (!this.originalVideoTrack && this.localStream) {
        this.originalVideoTrack = this.localStream.getVideoTracks()[0];
      }

      // Replace video track in peer connection
      const videoSender = this.peerConnection.getSenders().find(sender =>
        sender.track?.kind === 'video'
      );

      if (videoSender && screenTrack) {
        await videoSender.replaceTrack(screenTrack);
      } else {
        console.error("Could not find video sender or screen track.");
        // Stop the obtained screen track if sender wasn't found
        screenTrack?.stop();
        this.screenStream = null;
        throw new Error("Failed to replace video track for screen share.");
      }

      // Update local stream visually (optional, depends on UI needs)
      // This might not be needed if localVideoRef shows the replaced track
      // if (this.localStream && this.originalVideoTrack) {
      //   this.localStream.removeTrack(this.originalVideoTrack);
      //   this.localStream.addTrack(screenTrack);
      // }

      // When screen share ends (user clicks browser stop button)
      screenTrack.onended = () => {
        console.log('Screen share stopped via browser UI');
        this.stopScreenShare(onStopScreenShareCallback);
      };

      return this.screenStream;
    } catch (error) {
      console.error('Error sharing screen:', error);
      // Ensure screenStream state is reset if an error occurs
      if (this.screenStream) {
        this.screenStream.getTracks().forEach(track => track.stop());
        this.screenStream = null;
      }
      if (onStopScreenShareCallback) {
        onStopScreenShareCallback(); // Notify UI that screen share attempt failed or stopped
      }
      throw error;
    }
  }

  /**
   * Checks if screen sharing is currently active.
   * @returns {boolean} True if screen sharing is active, false otherwise.
   */
  isCurrentlySharingScreen() {
    return !!(this.screenStream && this.screenStream.getVideoTracks()[0] && this.screenStream.getVideoTracks()[0].readyState === 'live');
  }

  /**
   * Stop screen sharing and revert to original video track
   */
  async stopScreenShare(onStopScreenShareCallback) {
    if (!this.screenStream) {
      console.warn("Screen sharing is not active.");
      return;
    }

    // Stop the screen share tracks
    this.screenStream.getTracks().forEach(track => {
      console.log(`Stopping screen track: ${track.kind} - ${track.label}`);
      track.stop();
    });
    this.screenStream = null;

    // Revert to the original camera track
    if (this.originalVideoTrack) {
      const videoSender = this.peerConnection.getSenders().find(sender => sender.track?.kind === 'video');
      if (videoSender) {
        try {
          // Ensure the original track is still active or get a new one
          if (this.originalVideoTrack.readyState === 'ended') {
            console.log("Original video track ended, getting new one.");
            const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.originalVideoTrack = newStream.getVideoTracks()[0];
            // Also update the localStream if necessary
            if (this.localStream) {
              const oldVideoTrack = this.localStream.getVideoTracks()[0];
              if (oldVideoTrack) this.localStream.removeTrack(oldVideoTrack);
              this.localStream.addTrack(this.originalVideoTrack);
            }
          }
          await videoSender.replaceTrack(this.originalVideoTrack);
          console.log("Reverted to camera track.");
        } catch (error) {
          console.error("Error reverting to camera track:", error);
        }
      } else {
        console.error("Could not find video sender to revert track.");
      }
    } else {
      console.warn("No original video track stored to revert to.");
    }

    // Call the callback to update UI state (e.g., toggle isScreenSharing in Redux)
    if (onStopScreenShareCallback) {
      onStopScreenShareCallback();
    }
  }

  /**
   * Close and clean up the connection
   */
  close() {
    console.log("WebRTCService: Closing connection and streams.");
    // Stop screen sharing if active
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => {
        console.log(`Stopping screen track: ${track.kind} - ${track.label}`);
        track.stop();
      });
      this.screenStream = null;
    }
    // Stop all tracks in local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        console.log(`Stopping local track: ${track.kind} - ${track.label} - ID: ${track.id}`);
        track.stop();
      });
      this.localStream = null;
      this.originalVideoTrack = null;
    }

    // Close peer connection
    if (this.peerConnection) {
      // Remove event listeners to prevent errors after closing
      this.peerConnection.onicecandidate = null;
      this.peerConnection.ontrack = null;
      this.peerConnection.onconnectionstatechange = null;

      // Close the connection
      this.peerConnection.close();
      this.peerConnection = null;
      console.log("Peer connection closed.");
    }

    // Reset callbacks
    this.onIceCandidateCallback = null;
    this.onTrackCallback = null;
    this.onConnectionStateChangeCallback = null;
  }
}

// Export a singleton instance
const instance = new WebRTCService();
export default instance;