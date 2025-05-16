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
  <div className="h-full flex flex-col bg-white border-gray-300 shadow-lg rounded-3xl overflow-hidden">
    <div className="flex justify-between items-center p-3 border-b bg-gray-100">
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
      <div ref={chatScrollRef} className="flex-grow p-4 space-y-3 overflow-y-auto bg-white">
        {chatMessages.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-4">No messages yet.</p>
        ) : (
          chatMessages.map(message => (
            <div key={message.id} className={`flex ${message.isSelf ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg px-3 py-2 shadow-sm ${message.isSelf
                ? 'bg-[#318FA8] text-white rounded-br-none'
                : 'bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-none'
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
            className="flex-grow border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-[#318FA8] focus:border-[#318FA8] text-sm text-[#2a5f74]"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className={`w-10 h-10 rounded-full bg-[#318FA8] hover:bg-[#2A5F74] text-white flex items-center justify-center transition-colors disabled:opacity-50 ${!currentMessage.trim() ? 'cursor-not-allowed' : ''}`}
            disabled={!currentMessage.trim()}
            title="Send Message"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
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
  <div className="h-full flex flex-col bg-white border-gray-300 shadow-lg rounded-xl overflow-hidden">
    <div className="flex justify-between items-center p-3 border-b bg-gray-100">
      <h3 className="text-lg font-semibold text-gray-700">Notes</h3>
      <button
        onClick={handleToggleNotes}
        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200"
        title="Close Notes Panel"
      >
        <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
      </button>
    </div>
    <div className="flex flex-col flex-grow overflow-hidden p-4 bg-white">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="text-[#2a5f74] flex-grow w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#318FA8] focus:border-[#318FA8] resize-none text-sm mb-4"
        placeholder="Take workshop notes here..."
      />
      <button
        onClick={handleSaveNotes}
        className="w-full bg-[#318FA8] hover:bg-[#2A5F74] text-white py-2 px-4 rounded-full font-medium flex items-center justify-center gap-2 transition-colors"
        title="Save Notes"
      >
        <FontAwesomeIcon icon={faSave} />
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

  const baseButtonClass = "flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-colors transition-shadow transition-transform duration-150 focus:outline-none shadow-[0_2px_8px_rgba(49,143,168,0.06)] hover:translate-y-[-2px] hover:scale-110 focus:ring-2 focus:ring-[#318FA8] focus:ring-offset-2";
  const defaultButtonClass = "bg-gray-200 hover:bg-gray-300 text-[#2A5F74]";
  const activeButtonClass = "bg-[#318FA8] hover:bg-[#2A5F74] text-white";
  const activeNotesButtonClass = "bg-[#318FA8] hover:bg-[#2A5F74] text-white";
  const redButtonClass = "bg-red-600 hover:bg-red-700 text-white";
  const greenButtonClass = "bg-green-600 hover:bg-green-700 text-white";

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-900 text-white z-50">
      {/* Header with workshop title */}
      <div className="bg-[#2A5F74] py-3 px-6 shadow-md">
        <div>
          <h1 className="text-xl font-bold">{workshop?.title || "Live Workshop"}</h1>
          <p className="text-sm opacity-75">
            {workshop?.instructor ? `Presenter: ${workshop.instructor}` : "Live Session"}
          </p>
        </div>
      </div>

      {/* Main content area - video section */}
      <div className="flex-grow flex relative overflow-hidden">
        {/* Main video area */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          autoPlay
          playsInline
        />

        {/* Subtitles area */}
        {showSubtitles && (
          <div className="absolute bottom-24 left-0 right-0 text-center">
            <div className="inline-block bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg max-w-2xl mx-auto text-base">
              This is sample subtitle text that would appear here during the workshop...
            </div>
          </div>
        )}

        {/* Your video (participant) */}
        <div className="absolute right-4 bottom-24 w-1/4 sm:w-1/5 max-w-[200px] aspect-video bg-gray-700 border border-gray-500 overflow-hidden rounded-md shadow-lg flex items-center justify-center">
          {isCameraOn ? (
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-white h-full w-full p-2 bg-gray-700">
              <div className="w-10 h-10 rounded-full bg-[#318FA8] flex items-center justify-center text-xl font-bold mb-1">
                <FontAwesomeIcon icon={faUserCircle} />
              </div>
              <span className="text-xs font-semibold max-w-full truncate">You</span>
              {!isMicOn && (
                <div className="mt-1 flex items-center text-red-400 text-xs">
                  <FontAwesomeIcon icon={faMicrophoneSlash} className="h-3 w-3 mr-1" />
                  Muted
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar Area (for Chat and/or Notes) */}
        <AnimatePresence>
          {(isChatOpen || isNotesOpen) && (
            <motion.div
              key="right-sidebar"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: '0%', opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute top-0 right-0 bottom-20 w-1/4 min-w-[300px] flex flex-col bg-white border-l border-gray-300 shadow-lg"
            >
              {isNotesOpen && isChatOpen ? (
                // Both Notes and Chat are open
                <>
                  <div className="h-1/2 pb-1">
                    <NotesPanelContent
                      notes={notes}
                      setNotes={setNotes}
                      handleSaveNotes={handleSaveNotes}
                      handleToggleNotes={handleToggleNotes}
                    />
                  </div>
                  <div className="h-1/2 pt-1">
                    <ChatPanelContent
                      chatMessages={messages}
                      currentMessage={newMessage}
                      setCurrentMessage={setNewMessage}
                      handleSendMessage={handleSendMessage}
                      handleToggleChat={handleToggleChat}
                      chatScrollRef={chatScrollRef}
                    />
                  </div>
                </>
              ) : isNotesOpen ? (
                // Only Notes is open
                <NotesPanelContent
                  notes={notes}
                  setNotes={setNotes}
                  handleSaveNotes={handleSaveNotes}
                  handleToggleNotes={handleToggleNotes}
                />
              ) : isChatOpen ? (
                // Only Chat is open
                <ChatPanelContent
                  chatMessages={messages}
                  currentMessage={newMessage}
                  setCurrentMessage={setNewMessage}
                  handleSendMessage={handleSendMessage}
                  handleToggleChat={handleToggleChat}
                  chatScrollRef={chatScrollRef}
                />
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control bar */}
      <div className="h-20 bg-gray-800 flex items-center justify-center px-4 shadow-lg">
        <div className="bg-gray-700 p-3 rounded-full flex items-center justify-center gap-4">
          <button
            onClick={toggleMicrophone}
            className={`${baseButtonClass} ${!isMicOn ? redButtonClass : defaultButtonClass}`}
            title={isMicOn ? 'Mute' : 'Unmute'}
          >
            <FontAwesomeIcon icon={isMicOn ? faMicrophone : faMicrophoneSlash} className="h-5 w-5" />
          </button>

          <button
            onClick={toggleCamera}
            className={`${baseButtonClass} ${!isCameraOn ? redButtonClass : defaultButtonClass}`}
            title={isCameraOn ? 'Stop Video' : 'Start Video'}
          >
            <FontAwesomeIcon icon={isCameraOn ? faVideo : faVideoSlash} className="h-5 w-5" />
          </button>

          <button
            onClick={toggleScreenShare}
            className={`${baseButtonClass} ${isScreenSharing ? greenButtonClass : defaultButtonClass}`}
            title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
          >
            <FontAwesomeIcon icon={faDesktop} className="h-5 w-5" />
          </button>

          <button
            onClick={handleToggleChat}
            className={`${baseButtonClass} ${isChatOpen ? activeButtonClass : defaultButtonClass}`}
            title="Chat"
          >
            <FontAwesomeIcon icon={faComments} className="h-5 w-5" />
          </button>

          <button
            onClick={handleToggleNotes}
            className={`${baseButtonClass} ${isNotesOpen ? activeNotesButtonClass : defaultButtonClass}`}
            title="Notes"
          >
            <FontAwesomeIcon icon={faNoteSticky} className="h-5 w-5" />
          </button>

          <button
            onClick={handleToggleSubtitles}
            className={`${baseButtonClass} ${showSubtitles ? activeButtonClass : defaultButtonClass}`}
            title={showSubtitles ? 'Hide Subtitles' : 'Show Subtitles'}
          >
            <FontAwesomeIcon icon={faClosedCaptioning} className="h-5 w-5" />
          </button>

          <button
            onClick={() => {
              console.log("Disconnect button clicked");
              handleLeaveWorkshop();
            }}
            className={`${baseButtonClass} ${redButtonClass}`}
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