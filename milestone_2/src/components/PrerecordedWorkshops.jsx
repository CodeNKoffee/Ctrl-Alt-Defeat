import { useState, useRef } from 'react';
import { FaPlay, FaPause, FaStop, FaStepForward, FaStepBackward } from 'react-icons/fa';

const PrerecordedWorkshops = () => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  // Sample workshop data - replace with your actual data
  const workshops = [
    {
      id: 1,
      title: "Introduction to React",
      instructor: "John Doe",
      duration: "1:30:00",
      thumbnail: "/path-to-thumbnail.jpg",
      videoUrl: "path-to-video.mp4"
    },
    // Add more workshops here
  ];

  const containerStyle = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const listStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  };

  const workshopCardStyle = {
    background: 'white',
    borderRadius: '10px',
    padding: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    border: '1px solid #D9F0F4',
  };

  const playerStyle = {
    width: '100%',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '20px',
  };

  const controlsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    padding: '15px',
    background: '#D9F0F4',
    borderRadius: '10px',
    marginTop: '10px',
  };

  const buttonStyle = {
    background: '#318FA8',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s',
  };

  const handleWorkshopSelect = (workshop) => {
    setCurrentVideo(workshop);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleSeek = (direction) => {
    if (videoRef.current) {
      videoRef.current.currentTime += direction * 10; // Skip 10 seconds
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#2A5F74', marginBottom: '20px' }}>Pre-recorded Workshops</h2>
      
      {currentVideo && (
        <div style={playerStyle}>
          <video
            ref={videoRef}
            src={currentVideo.videoUrl}
            style={{ width: '100%', borderRadius: '10px' }}
            controls={false}
          />
          <div style={controlsStyle}>
            <button 
              style={buttonStyle} 
              onClick={() => handleSeek(-1)}
              title="Backward 10s"
            >
              <FaStepBackward />
            </button>
            {!isPlaying ? (
              <button 
                style={buttonStyle} 
                onClick={handlePlay}
                title="Play"
              >
                <FaPlay />
              </button>
            ) : (
              <button 
                style={buttonStyle} 
                onClick={handlePause}
                title="Pause"
              >
                <FaPause />
              </button>
            )}
            <button 
              style={buttonStyle} 
              onClick={handleStop}
              title="Stop"
            >
              <FaStop />
            </button>
            <button 
              style={buttonStyle} 
              onClick={() => handleSeek(1)}
              title="Forward 10s"
            >
              <FaStepForward />
            </button>
          </div>
        </div>
      )}

      <div style={listStyle}>
        {workshops.map(workshop => (
          <div
            key={workshop.id}
            style={{
              ...workshopCardStyle,
              transform: currentVideo?.id === workshop.id ? 'scale(1.02)' : 'none',
              border: currentVideo?.id === workshop.id ? '2px solid #318FA8' : '1px solid #D9F0F4',
            }}
            onClick={() => handleWorkshopSelect(workshop)}
          >
            <img
              src={workshop.thumbnail}
              alt={workshop.title}
              style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <h3 style={{ color: '#2A5F74', margin: '10px 0' }}>{workshop.title}</h3>
            <p style={{ color: '#666', margin: '5px 0' }}>Instructor: {workshop.instructor}</p>
            <p style={{ color: '#666', margin: '5px 0' }}>Duration: {workshop.duration}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrerecordedWorkshops;