"use client";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay, faPause, faExpand, faVolumeUp, faVolumeMute,
  faStepBackward, faStepForward, faArrowLeft, faDownload,
  faThumbsUp, faBookmark, faShare, faEllipsisV, faTimes
} from '@fortawesome/free-solid-svg-icons';
import Image from "next/image";
import WorkshopFeedback from "./WorkshopFeedback";

export default function PrerecordedWorkshopInterface({ workshop, onBack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const videoRef = useRef(null);
  const controlsTimeout = useRef(null);
  const videoContainerRef = useRef(null);

  useEffect(() => {
    setIsClient(true);

    // Simulate video metadata loading
    setTimeout(() => {
      setDuration(1834); // About 30 minutes in seconds
    }, 500);

    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (e) => {
    const seekTime = (e.nativeEvent.offsetX / e.currentTarget.clientWidth) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      if (isMuted) {
        // If unmuting, restore previous volume
        videoRef.current.volume = volume > 0 ? volume : 0.5;
        setVolume(volume > 0 ? volume : 0.5);
      } else {
        // Just mute but keep track of volume setting
      }
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;

    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }

    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    return [
      hours > 0 ? hours : null,
      minutes < 10 && hours > 0 ? `0${minutes}` : minutes,
      seconds < 10 ? `0${seconds}` : seconds
    ].filter(Boolean).join(':');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleFeedbackSubmit = (feedbackData) => {
    console.log("Feedback submitted:", feedbackData);
    // Here you would typically save the feedback to your backend

    // Directly navigate back to workshop list without delay
    if (onBack) {
      onBack();
    }
  };

  const handleCompleteVideo = () => {
    setShowFeedback(true);
  };

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col z-50">
      {/* Video Container */}
      <div
        ref={videoContainerRef}
        className="flex-1 relative flex justify-center bg-black"
        onMouseMove={handleMouseMove}
      >
        {/* Back button overlay in top-left corner */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-10 bg-black/50 text-white hover:bg-black/70 p-2 rounded-full transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Workshops
        </button>

        <video
          ref={videoRef}
          className="max-h-full max-w-full"
          poster={workshop?.imageUrl || "/images/workshop-thumbnail.jpg"}
          onTimeUpdate={handleTimeUpdate}
          onClick={togglePlay}
          onEnded={handleCompleteVideo}
        >
          <source src="/videos/sample-workshop.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Video Controls - show based on hover state */}
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Progress Bar */}
            <div
              className="h-1 bg-gray-600 rounded-full mb-3 cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-red-600 rounded-full relative"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-red-600 rounded-full"></div>
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {/* Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-gray-300"
                >
                  <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} className="h-5 w-5" />
                </button>

                {/* Time Display */}
                <div className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Volume Control */}
                <div className="flex items-center">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-gray-300 mr-2"
                  >
                    <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} className="h-5 w-5" />
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 md:w-24 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
                  />
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-gray-300"
                >
                  <FontAwesomeIcon icon={faExpand} className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Info & Actions */}
      <div className="bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-2">{workshop?.title || "Workshop Title"}</h2>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <Image
                src={workshop?.instructorImage || "/images/default-avatar.png"}
                alt={workshop?.instructor || "Instructor"}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-sm">{workshop?.instructor || "Instructor Name"}</p>
              <p className="text-xs text-gray-400">Instructor</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 px-3 py-2 rounded-full ${isLiked ? 'text-red-500' : 'text-white'} hover:bg-gray-800`}
            >
              <FontAwesomeIcon icon={faThumbsUp} />
              <span>Like</span>
            </button>

            <button
              onClick={handleSave}
              className={`flex items-center space-x-1 px-3 py-2 rounded-full ${isSaved ? 'text-metallica-blue-500' : 'text-white'} hover:bg-gray-800`}
            >
              <FontAwesomeIcon icon={faBookmark} />
              <span>Save</span>
            </button>

            <button className="flex items-center space-x-1 px-3 py-2 rounded-full text-white hover:bg-gray-800">
              <FontAwesomeIcon icon={faShare} />
              <span>Share</span>
            </button>


          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-300 text-sm">
            {workshop?.description || "No description available."}
          </p>

          {/* Prerequisites */}
          {workshop?.prerequisites && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-200">Prerequisites:</h4>
              <p className="text-gray-300 text-sm">{workshop.prerequisites}</p>
            </div>
          )}
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