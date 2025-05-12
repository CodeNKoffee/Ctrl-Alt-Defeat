// Call action types
export const INCOMING_CALL = 'INCOMING_CALL';
export const OUTGOING_CALL = 'OUTGOING_CALL';
export const ACCEPT_CALL = 'ACCEPT_CALL';
export const REJECT_CALL = 'REJECT_CALL';
export const END_CALL = 'END_CALL';
export const TOGGLE_MUTE = 'TOGGLE_MUTE';
export const TOGGLE_VIDEO = 'TOGGLE_VIDEO';
export const TOGGLE_SCREEN_SHARE = 'TOGGLE_SCREEN_SHARE';
export const OTHER_PARTY_LEFT = 'OTHER_PARTY_LEFT';

const initialState = {
  isInCall: false,
  isReceivingCall: false,
  isMakingCall: false,
  callerId: null,
  callerName: null,
  calleeId: null,
  calleeName: null,
  isMuted: false,
  isVideoEnabled: true,
  isScreenSharing: false,
  otherPartyLeft: false,
};

export const callReducer = (state = initialState, action) => {
  switch (action.type) {
    case INCOMING_CALL:
      return {
        ...state,
        isReceivingCall: true,
        callerId: action.payload.callerId,
        callerName: action.payload.callerName,
      };
    case OUTGOING_CALL:
      return {
        ...state,
        isMakingCall: true,
        calleeId: action.payload.calleeId,
        calleeName: action.payload.calleeName,
      };
    case ACCEPT_CALL:
      return {
        ...state,
        isInCall: true,
        isReceivingCall: false,
        isMakingCall: false,
        isMuted: true,
        isVideoEnabled: false,
        isScreenSharing: false,
        otherPartyLeft: false,
      };
    case REJECT_CALL:
    case END_CALL:
      return {
        ...initialState,
      };
    case TOGGLE_MUTE:
      return {
        ...state,
        isMuted: !state.isMuted,
      };
    case TOGGLE_VIDEO:
      return {
        ...state,
        isVideoEnabled: !state.isVideoEnabled,
      };
    case TOGGLE_SCREEN_SHARE:
      return {
        ...state,
        isScreenSharing: !state.isScreenSharing,
      };
    case OTHER_PARTY_LEFT:
      return {
        ...state,
        otherPartyLeft: true,
      };
    default:
      return state;
  }
};

// Action creators
export const incomingCall = (callerId, callerName) => ({
  type: INCOMING_CALL,
  payload: { callerId, callerName }
});

export const outgoingCall = (calleeId, calleeName) => ({
  type: OUTGOING_CALL,
  payload: { calleeId, calleeName }
});

export const acceptCall = () => ({
  type: ACCEPT_CALL
});

export const rejectCall = () => ({
  type: REJECT_CALL
});

export const endCall = () => ({
  type: END_CALL
});

export const toggleMute = () => ({
  type: TOGGLE_MUTE
});

export const toggleVideo = () => ({
  type: TOGGLE_VIDEO
});

export const toggleScreenShare = () => ({
  type: TOGGLE_SCREEN_SHARE
});

export const otherPartyLeft = () => ({
  type: OTHER_PARTY_LEFT
});

export default callReducer;