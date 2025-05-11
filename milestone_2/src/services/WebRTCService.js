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
      this.localStream = await navigator.mediaDevices.getUserMedia({ 
        video: video,
        audio: audio 
      });
      
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
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = isEnabled;
      });
    }
  }

  /**
   * Replace video track with screen share
   */
  async replaceVideoTrackWithScreenShare() {
    try {
      // Get screen share stream
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      
      const screenTrack = screenStream.getVideoTracks()[0];
      
      // Replace video track in peer connection
      const senders = this.peerConnection.getSenders();
      const videoSender = senders.find(sender => 
        sender.track?.kind === 'video'
      );
      
      if (videoSender) {
        await videoSender.replaceTrack(screenTrack);
      }
      
      // Replace video track in local stream
      if (this.localStream) {
        const videoTrack = this.localStream.getVideoTracks()[0];
        if (videoTrack) {
          this.localStream.removeTrack(videoTrack);
          this.localStream.addTrack(screenTrack);
        }
      }
      
      // When screen share ends, revert to camera
      screenTrack.onended = async () => {
        // Get user's camera back
        const userMedia = await navigator.mediaDevices.getUserMedia({ video: true });
        const cameraTrack = userMedia.getVideoTracks()[0];
        
        // Replace track in peer connection
        if (videoSender) {
          await videoSender.replaceTrack(cameraTrack);
        }
        
        // Replace track in local stream
        if (this.localStream) {
          const currentTrack = this.localStream.getVideoTracks()[0];
          if (currentTrack) {
            this.localStream.removeTrack(currentTrack);
            this.localStream.addTrack(cameraTrack);
          }
        }
      };
      
      return screenStream;
    } catch (error) {
      console.error('Error sharing screen:', error);
      throw error;
    }
  }

  /**
   * Close and clean up the connection
   */
  close() {
    // Stop all tracks in local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    // Reset callbacks
    this.onIceCandidateCallback = null;
    this.onTrackCallback = null;
    this.onConnectionStateChangeCallback = null;
    
    this.remoteStream = null;
  }
}

// Export as singleton
export default new WebRTCService();