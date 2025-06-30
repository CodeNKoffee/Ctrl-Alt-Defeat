"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash,
  faDesktop, faComments, faNoteSticky, faPhone,
  faClosedCaptioning, faDownload, faUserCircle, faPaperPlane,
  faSave, faXmark, faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import WorkshopFeedback from './WorkshopFeedback';

// Extract ChatPanelContent to be outside of WorkshopInterface
const ChatPanelContent = ({
  chatMessages = [],
  currentMessage = '',
  setCurrentMessage,
  handleSendMessage,
  handleToggleChat,
  chatScrollRef
}) => (
  <div className="h-full flex flex-col">
    <div className="flex justify-between items-center p-4 border-b border-white/10">
      <h3 className="text-lg font-semibold text-blue-100">Chat</h3>
      <button
        onClick={handleToggleChat}
        className="text-blue-200/60 hover:text-blue-200 p-2 rounded-full hover:bg-white/5 transition-colors"
        title="Close Chat Panel"
      >
        <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
      </button>
    </div>
    <div className="flex flex-col flex-grow overflow-hidden">
      <div ref={chatScrollRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-sm text-blue-200/60">
            <FontAwesomeIcon icon={faComments} className="h-8 w-8 mb-3 opacity-50" />
            <p>No messages yet</p>
            <p className="text-xs mt-1">Start the conversation!</p>
          </div>
        ) : (
          chatMessages.map(message => (
            <div key={message.id} className={`flex ${message.isSelf ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-full px-4 py-2 shadow-lg ${message.isSelf
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
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className={`w-10 h-10 rounded-full bg-[#318FA8] hover:bg-[#2A5F74] text-white flex items-center justify-center transition-colors disabled:opacity-50 ${!currentMessage.trim() ? 'cursor-not-allowed' : ''} shadow-lg hover:shadow-xl`}
            disabled={!currentMessage.trim()}
            title="Send Message"
          >
            <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  </div>
);

// Extract NotesPanelContent to be outside of WorkshopInterface
const NotesPanelContent = ({
  notes = '',
  setNotes,
  handleSaveNotes,
  handleToggleNotes
}) => (
  <div className="h-full flex flex-col">
    <div className="flex justify-between items-center p-4 border-b border-white/10">
      <h3 className="text-lg font-semibold text-blue-100">Notes</h3>
      <button
        onClick={handleToggleNotes}
        className="text-blue-200/60 hover:text-blue-200 p-2 rounded-full hover:bg-white/5 transition-colors"
        title="Close Notes Panel"
      >
        <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
      </button>
    </div>
    <div className="flex flex-col flex-grow p-4">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="flex-grow w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#318FA8] focus:border-[#41B9D9]/30 resize-none text-sm text-blue-100 placeholder-blue-200/40 mb-4"
        placeholder="Take workshop notes here..."
      />
      <button
        onClick={handleSaveNotes}
        className="w-full bg-[#318FA8] hover:bg-[#2A5F74] text-white py-3 px-4 rounded-full font-medium flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-xl border border-[#41B9D9]/30"
        title="Save Notes"
      >
        <FontAwesomeIcon icon={faSave} className="h-4 w-4" />
        Save Notes
      </button>
    </div>
  </div>
);

export default function WorkshopInterface({ workshop, onBack }) {
  const [notes, setNotes] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const videoRef = useRef(null);
  const localVideoRef = useRef(null);
  const [workshopCompleted, setWorkshopCompleted] = useState(false);
  const [hasAttendedMinimumTime, setHasAttendedMinimumTime] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [workshopStartTime, setWorkshopStartTime] = useState(null);
  const chatScrollRef = useRef(null);
  const [workshopEnded, setWorkshopEnded] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWorkshopStartTime(new Date());
    }
  }, []);

  useEffect(() => {
    const attendanceCheck = setInterval(() => {
      if (workshopStartTime) {
        const timeSpent = (new Date() - workshopStartTime) / 1000 / 60; // Convert to minutes
        if (timeSpent >= 45) { // 45 minutes minimum attendance
          setHasAttendedMinimumTime(true);
          clearInterval(attendanceCheck);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(attendanceCheck);
  }, [workshopStartTime]);

  useEffect(() => {
    if (workshopEnded && hasAttendedMinimumTime) {
      setShowFeedback(true);
    }
  }, [workshopEnded, hasAttendedMinimumTime]);

  useEffect(() => {
    if (chatScrollRef && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleMicrophone = async () => {
    try {
      if (!isMicOn) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      setIsMicOn(!isMicOn);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const toggleCamera = async () => {
    try {
      if (!isCameraOn) {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = videoStream;
        }
      } else {
        if (localVideoRef.current && localVideoRef.current.srcObject) {
          localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
          localVideoRef.current.srcObject = null;
        }
      }
      setIsCameraOn(!isCameraOn);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia();
        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
        }
      } else {
        if (videoRef.current && videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      }
      setIsScreenSharing(!isScreenSharing);
    } catch (err) {
      console.error("Error sharing screen:", err);
    }
  };

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleToggleNotes = () => {
    setIsNotesOpen(!isNotesOpen);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const messageContent = newMessage.trim();
    if (!messageContent) return;

    const newMessageObj = {
      id: Date.now(),
      sender: "You",
      content: messageContent,
      timestamp: new Date(),
      isSelf: true
    };
    setMessages(prev => [...prev, newMessageObj]);
    setNewMessage("");

    // Simulated response from instructor
    setTimeout(() => {
      const responses = [
        "That's a great question!",
        "Let me explain that concept in more detail.",
        "Yes, you're on the right track.",
        "Check out the additional resources I'll share after the workshop.",
        "Anyone else have thoughts on this topic?"
      ];
      const responseText = responses[Math.floor(Math.random() * responses.length)];

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: workshop?.instructor || "Instructor",
        content: responseText,
        timestamp: new Date(),
        isSelf: false
      }]);
    }, 1500);
  };

  const handleSaveNotes = () => {
    const element = document.createElement("a");
    const file = new Blob([notes], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "workshop-notes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleLeaveWorkshop = () => {
    // Immediately return to workshop list without feedback
    console.log("Leave workshop clicked, attempting to navigate back");
    if (onBack) {
      onBack();
    } else {
      console.error("onBack function is not available");
    }
  };

  const handleFeedbackSubmit = (feedbackData) => {
    console.log("Feedback submitted:", feedbackData);
    // Here you would typically save the feedback to your backend

    // Directly navigate back to workshop list without delay
    if (onBack) {
      onBack();
    }
  };

  const handleToggleSubtitles = () => {
    setShowSubtitles(!showSubtitles);
  };

  const baseButtonClass = "flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-200 focus:outline-none shadow-lg hover:shadow-xl focus:ring-2 focus:ring-[#318FA8] focus:ring-offset-2 focus:ring-offset-[#0a1118]";
  const defaultButtonClass = "bg-white/5 hover:bg-white/10 text-blue-100 border border-white/10";
  const activeButtonClass = "bg-[#318FA8] hover:bg-[#2A5F74] text-white border border-[#41B9D9]/30";
  const activeNotesButtonClass = "bg-[#318FA8] hover:bg-[#2A5F74] text-white border border-[#41B9D9]/30";
  const redButtonClass = "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30";
  const greenButtonClass = "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30";

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-[#1a2942] to-[#17202f] text-white z-50 overflow-hidden">
      {/* Header with workshop title */}
      <div className="bg-[#1E3A5F]/40 backdrop-blur-md py-4 px-8 shadow-lg border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {workshop?.title || "Live Workshop"}
              </h1>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                LIVE
              </span>
            </div>
            <p className="text-sm text-blue-200/80 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {workshop?.instructor ? `Presenter: ${workshop.instructor}` : "Live Session"}
            </p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10 text-sm font-medium"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            Back to Workshops
          </button>
        </div>
      </div>

      {/* Main content area - video section */}
      <div className="flex flex-row h-full w-full overflow-hidden">
        {/* Main video area */}
        <div className={`flex-grow relative h-full bg-[#0a1118]`}>
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            autoPlay
            playsInline
          />

          {/* Subtitles area */}
          {showSubtitles && (
            <div className="absolute bottom-32 left-0 right-0 text-center">
              <div className="inline-block bg-black/75 backdrop-blur-sm text-white px-6 py-3 rounded-xl max-w-2xl mx-auto text-base border border-white/10">
                This is sample subtitle text that would appear here during the workshop...
              </div>
            </div>
          )}

          {/* Your video (participant) */}
          <div className="absolute right-6 bottom-32 w-1/4 sm:w-1/5 max-w-[200px] aspect-video bg-[#1E3A5F]/40 backdrop-blur-sm border border-white/20 overflow-hidden rounded-xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
            {isCameraOn ? (
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
                  <FontAwesomeIcon icon={faUserCircle} />
                </div>
                <span className="text-sm font-medium text-blue-100">You</span>
                {!isMicOn && (
                  <div className="mt-2 flex items-center text-red-400 text-xs bg-red-500/20 px-2 py-1 rounded-full">
                    <FontAwesomeIcon icon={faMicrophoneSlash} className="h-3 w-3 mr-1" />
                    Muted
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Sidebar (Chat/Notes) */}
        <AnimatePresence>
          {(isChatOpen || isNotesOpen) && (
            <motion.div
              key="right-sidebar"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: '0%', opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-1/4 min-w-[300px] h-full flex flex-col bg-[#1E3A5F]/40 backdrop-blur-md border-l border-white/10 shadow-2xl"
            >
              {isNotesOpen && isChatOpen ? (
                // Both Notes and Chat are open
                <>
                  <div className="h-1/2 flex-grow overflow-hidden pb-2 p-4">
                    <div className="h-full rounded-3xl bg-[#0a1118]/40 backdrop-blur-sm border border-white/10 shadow-xl overflow-hidden">
                      <NotesPanelContent
                        notes={notes}
                        setNotes={setNotes}
                        handleSaveNotes={handleSaveNotes}
                        handleToggleNotes={handleToggleNotes}
                      />
                    </div>
                  </div>
                  <div className="h-1/2 flex-grow overflow-hidden pt-2 p-4">
                    <div className="h-full rounded-3xl bg-[#0a1118]/40 backdrop-blur-sm border border-white/10 shadow-xl overflow-hidden">
                      <ChatPanelContent
                        chatMessages={messages}
                        currentMessage={newMessage}
                        setCurrentMessage={setNewMessage}
                        handleSendMessage={handleSendMessage}
                        handleToggleChat={handleToggleChat}
                        chatScrollRef={chatScrollRef}
                      />
                    </div>
                  </div>
                </>
              ) : isNotesOpen ? (
                // Only Notes is open
                <div className="h-full p-4">
                  <div className="h-full rounded-3xl bg-[#0a1118]/40 backdrop-blur-sm border border-white/10 shadow-xl overflow-hidden">
                    <NotesPanelContent
                      notes={notes}
                      setNotes={setNotes}
                      handleSaveNotes={handleSaveNotes}
                      handleToggleNotes={handleToggleNotes}
                    />
                  </div>
                </div>
              ) : isChatOpen ? (
                // Only Chat is open
                <div className="h-full p-4">
                  <div className="h-full rounded-3xl bg-[#0a1118]/40 backdrop-blur-sm border border-white/10 shadow-xl overflow-hidden">
                    <ChatPanelContent
                      chatMessages={messages}
                      currentMessage={newMessage}
                      setCurrentMessage={setNewMessage}
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
      </div>

      {/* Control bar */}
      <div className="h-28 bg-[#1E3A5F]/40 backdrop-blur-md flex items-center justify-center px-4 shadow-lg border-t border-white/10">
        <div className="bg-[#0a1118]/40 px-4 py-3 rounded-full flex items-center justify-center gap-6 backdrop-blur-sm border border-white/10 shadow-xl">
          <button
            onClick={toggleMicrophone}
            className={`${baseButtonClass} ${!isMicOn ? redButtonClass : defaultButtonClass} transform hover:scale-110 transition-all duration-200`}
            title={isMicOn ? 'Mute' : 'Unmute'}
          >
            <FontAwesomeIcon icon={isMicOn ? faMicrophone : faMicrophoneSlash} className="h-5 w-5" />
          </button>

          <button
            onClick={toggleCamera}
            className={`${baseButtonClass} ${!isCameraOn ? redButtonClass : defaultButtonClass} transform hover:scale-110 transition-all duration-200`}
            title={isCameraOn ? 'Stop Video' : 'Start Video'}
          >
            <FontAwesomeIcon icon={isCameraOn ? faVideo : faVideoSlash} className="h-5 w-5" />
          </button>

          <button
            onClick={toggleScreenShare}
            className={`${baseButtonClass} ${isScreenSharing ? greenButtonClass : defaultButtonClass} transform hover:scale-110 transition-all duration-200`}
            title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
          >
            <FontAwesomeIcon icon={faDesktop} className="h-5 w-5" />
          </button>

          <div className="h-8 w-px bg-white/10"></div>

          <button
            onClick={handleToggleChat}
            className={`${baseButtonClass} ${isChatOpen ? activeButtonClass : defaultButtonClass} transform hover:scale-110 transition-all duration-200`}
            title="Chat"
          >
            <FontAwesomeIcon icon={faComments} className="h-5 w-5" />
          </button>

          <button
            onClick={handleToggleNotes}
            className={`${baseButtonClass} ${isNotesOpen ? activeNotesButtonClass : defaultButtonClass} transform hover:scale-110 transition-all duration-200`}
            title="Notes"
          >
            <FontAwesomeIcon icon={faNoteSticky} className="h-5 w-5" />
          </button>

          <button
            onClick={handleToggleSubtitles}
            className={`${baseButtonClass} ${showSubtitles ? activeButtonClass : defaultButtonClass} transform hover:scale-110 transition-all duration-200`}
            title={showSubtitles ? 'Hide Subtitles' : 'Show Subtitles'}
          >
            <FontAwesomeIcon icon={faClosedCaptioning} className="h-5 w-5" />
          </button>

          <div className="h-8 w-px bg-white/10"></div>

          <button
            onClick={() => {
              console.log("Disconnect button clicked");
              handleLeaveWorkshop();
            }}
            className={`${baseButtonClass} ${redButtonClass} transform hover:scale-110 transition-all duration-200`}
            title="Leave Workshop"
          >
            <FontAwesomeIcon icon={faPhone} className="h-5 w-5 transform rotate-135" />
          </button>
        </div>
      </div>

      {/* Workshop Feedback Modal */}
      <WorkshopFeedback
        isOpen={showFeedback}
        onClose={() => {
          setShowFeedback(false);
          // Automatically return to workshop list when closing feedback modal
          if (onBack) {
            onBack();
          }
        }}
        onSubmit={handleFeedbackSubmit}
        workshop={workshop}
      />
    </div>
  );
}