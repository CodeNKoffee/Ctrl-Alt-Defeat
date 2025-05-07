import './styles/StudentProfile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

export default function StudentCard({ isOpen, toggleDetails, onEditProfile, studentData }) {
  // Function to generate a gradient based on the selected color
  const generateGradient = (baseColor) => {
    if (!baseColor) return "linear-gradient(135deg, var(--metallica-blue-300) 0%, var(--metallica-blue-600) 100%)";
    
    try {
      // Convert hex to RGB
      const r = parseInt(baseColor.slice(1, 3), 16);
      const g = parseInt(baseColor.slice(3, 5), 16);
      const b = parseInt(baseColor.slice(5, 7), 16);
      
      // Create lighter and darker variants for gradient
      const lighterColor = `rgb(${Math.min(r + 40, 255)}, ${Math.min(g + 40, 255)}, ${Math.min(b + 40, 255)})`;
      const darkerColor = `rgb(${Math.max(r - 40, 0)}, ${Math.max(g - 40, 0)}, ${Math.max(b - 40, 0)})`;
      
      return `linear-gradient(135deg, ${lighterColor} 0%, ${darkerColor} 100%)`;
    } catch (e) {
      // Fallback to default gradient if there's an error
      return "linear-gradient(135deg, var(--metallica-blue-300) 0%, var(--metallica-blue-600) 100%)";
    }
  };

  // Get background gradient based on student's color preference
  const cardBackgroundGradient = generateGradient(studentData.cardColor);

  return (
    <div className={`student-card ${isOpen ? 'active' : ''}`} onClick={toggleDetails}>
      <div 
        className="card-top"
        style={{ background: cardBackgroundGradient }}
      >
        <div className="profile-image-container">
          <img 
            src={studentData.profileImage} 
            alt="Student profile" 
            className="profile-image"
          />
        </div>
        <button 
          className="edit-profile-button"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering card click
            onEditProfile();
          }}
        >
          <FontAwesomeIcon icon={faEdit} /> Edit Profile
        </button>
      </div>
      <div className="card-content">
        <h2 className="student-name">{studentData.name}</h2>
        <p className="student-handle">{studentData.handle}</p>
        <div className="social-links">
          <a href={studentData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <a href={studentData.socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a href={studentData.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" aria-label="Portfolio">
            <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"/>
            </svg>
          </a>
        </div>
        <p className="student-bio">
          {studentData.bio}
        </p>
      </div>
    </div>
  );
}