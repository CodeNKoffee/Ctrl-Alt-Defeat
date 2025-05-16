import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isInCall: false,
  isMakingCall: false,
  isReceivingCall: false,
  isMuted: true, // Default to muted
  isVideoEnabled: false, // Default to video off
  isScreenSharing: false,
  callerId: null,
  calleeId: null,
  callerName: null,
  calleeName: null,
  incomingCallData: null,
  otherPartyLeft: false,
  appointments: [
    // Sample pending appointment for testing: SCAD requests Hatem
    {
      id: 'appt_test_scad_to_hatem',
      requesterId: 'scad_001', // SCAD Admin ID
      requesterName: 'SCAD Admin',
      requestedUserId: 'student_002', // Hatem's ID
      requestedUserName: 'Hatem',
      status: 'pending',
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // e.g., tomorrow
    }
  ], // Added: { id, requesterId, requesterName, requestedUserId, requestedUserName, status: 'pending' | 'confirmed' | 'rejected', dateTime?: string }
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    outgoingCall: (state, action) => {
      state.isMakingCall = true;
      state.isReceivingCall = false;
      state.callerId = action.payload.callerId; // Assuming callerId is passed or known
      state.calleeId = action.payload.calleeId;
      state.calleeName = action.payload.calleeName;
      state.otherPartyLeft = false;
      console.log(`[Redux] Outgoing call initiated to ${action.payload.calleeName} (${action.payload.calleeId})`);
    },
    incomingCall: (state, action) => {
      // Prevent setting incoming call if already in one or making one
      if (!state.isInCall && !state.isMakingCall) {
        console.log('[Redux] incomingCall action received. Payload:', action.payload); // Log entire payload
        state.isReceivingCall = true;
        state.incomingCallData = action.payload; // { offer, callerId, callerName }
        state.callerId = action.payload.callerId;
        state.callerName = action.payload.callerName;
        state.calleeId = action.payload.calleeId; // Assuming calleeId is passed or known
        state.otherPartyLeft = false;
        console.log(`[Redux] Incoming call from ${action.payload.callerName} (${action.payload.callerId})`);
      } else {
        console.log("[Redux] Ignoring incoming call while already busy.");
      }
    },
    acceptCall: (state) => {
      console.log("[Redux] Accepting call.");
      state.isInCall = true;
      state.isMakingCall = false;
      state.isReceivingCall = false;
      state.incomingCallData = null;
      state.isMuted = true; // Start muted
      state.isVideoEnabled = false; // Start with video off
      state.otherPartyLeft = false;
    },
    rejectCall: (state) => {
      console.log("[Redux] Rejecting call.");
      state.isMakingCall = false;
      state.isReceivingCall = false;
      state.incomingCallData = null;
      state.callerId = null;
      state.calleeId = null;
      state.callerName = null;
      state.calleeName = null;
      // Keep isInCall as is, let endCall handle that if needed
    },
    endCall: (state) => {
      console.log("[Redux] Ending call.");
      state.isInCall = false;
      state.isMakingCall = false;
      state.isReceivingCall = false;
      state.isMuted = true;
      state.isVideoEnabled = false;
      state.isScreenSharing = false;
      state.callerId = null;
      state.calleeId = null;
      state.callerName = null;
      state.calleeName = null;
      state.incomingCallData = null;
      state.otherPartyLeft = false;
    },
    otherPartyLeft: (state) => {
      console.log("[Redux] Other party left.");
      state.otherPartyLeft = true;
      // Optionally end the call state immediately or after a delay
      // state.isInCall = false; // Or handle this in the UI
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    toggleVideo: (state) => {
      state.isVideoEnabled = !state.isVideoEnabled;
    },
    toggleScreenShare: (state) => {
      state.isScreenSharing = !state.isScreenSharing;
    },
    // --- Appointment Actions ---
    requestAppointment: (state, action) => {
      const { requesterId, requesterName, requestedUserId, requestedUserName, dateTime } = action.payload;
      const existingRequest = state.appointments.find(
        appt => appt.requesterId === requesterId &&
          appt.requestedUserId === requestedUserId &&
          (appt.status === 'pending' || appt.status === 'confirmed')
      );
      if (!existingRequest) {
        const newAppointment = {
          id: `appt_${Date.now()}_${Math.random().toString(16).slice(2)}`,
          requesterId,
          requesterName,
          requestedUserId,
          requestedUserName,
          status: 'pending',
          dateTime: dateTime || null // Store dateTime (as ISO string or null)
        };
        state.appointments.push(newAppointment);
        console.log(`[Redux] Appointment requested: ${requesterName} -> ${requestedUserName} for ${dateTime}`);
      } else {
        console.log(`[Redux] Existing appointment/request with ${requestedUserName} ignored.`);
      }
    },
    acceptAppointment: (state, action) => {
      const { appointmentId } = action.payload;
      const appointment = state.appointments.find(appt => appt.id === appointmentId);
      if (appointment && appointment.status === 'pending') {
        appointment.status = 'confirmed';
        console.log(`[Redux] Appointment ID ${appointmentId} confirmed: ${appointment.requesterName} & ${appointment.requestedUserName}`);
      } else {
        console.warn(`[Redux] Could not accept appointment ${appointmentId}. Status: ${appointment?.status}`);
      }
    },
    rejectAppointment: (state, action) => {
      const { appointmentId } = action.payload;
      const appointmentIndex = state.appointments.findIndex(appt => appt.id === appointmentId);
      if (appointmentIndex !== -1) {
        const appointment = state.appointments[appointmentIndex];
        if (appointment.status === 'pending' || appointment.status === 'confirmed') { // Can reject pending or confirmed
          console.log(`[Redux] Appointment ID ${appointmentId} rejected: ${appointment.requesterName} & ${appointment.requestedUserName}`);
          state.appointments[appointmentIndex].status = 'rejected';
          // Optionally remove rejected appointments after some time or keep them for history
        } else {
          console.warn(`[Redux] Cannot reject appointment ${appointmentId}. Status: ${appointment.status}`);
        }
      } else {
        console.warn(`[Redux] Appointment ID ${appointmentId} not found for rejection.`);
      }
    },
  },
});

export const {
  outgoingCall,
  incomingCall,
  acceptCall,
  rejectCall,
  endCall,
  otherPartyLeft,
  toggleMute,
  toggleVideo,
  toggleScreenShare,
  requestAppointment,
  acceptAppointment,
  rejectAppointment
} = callSlice.actions;

export default callSlice.reducer;