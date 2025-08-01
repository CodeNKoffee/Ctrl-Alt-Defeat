import './styles/StudentProfile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';

export default function StudentCard({ isOpen, toggleDetails, onEditProfile, studentData }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
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

  // Get theme colors if available
  const theme = studentData.theme || {
    primary: "#318FA8",
    secondary: "#256980",
    accent: "#41B9D9",
    text: "#1A4857",
    background: "#E8F4F8"
  };

  // Apply theme colors using CSS variables
  const themeStyle = {
    "--user-primary": theme.primary,
    "--user-secondary": theme.secondary,
    "--user-accent": theme.accent,
    "--user-accent-transparent": theme.accent + '66', // 66 in hex is approx 0.4 opacity
    "--user-text": theme.text,
    "--user-background": theme.background,
    "height": "673px" // Fixed height to match StudentDetails
  };

  // Text styles based on theme
  const nameStyle = { color: theme.text };
  const bioStyle = { color: theme.text };
  const sectionTitleStyle = { color: theme.secondary };
  const sectionValueStyle = { color: theme.text };
  const socialIconStyle = { color: theme.primary };

  return (
    <div
      className={`student-card ${isOpen ? 'active' : ''} max-w-[320px] md:max-w-[340px]`}
      onClick={toggleDetails}
      style={themeStyle}
    >
      <button
        className="edit-profile-button absolute top-3 right-3 z-50"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering card click
          onEditProfile();
        }}
      >
        <FontAwesomeIcon icon={faEdit} className="mr-1.5" /> {safeT('studentCard.edit')}
      </button>

      <div
        className="card-top"
      >
        <div className="profile-image-container">
          <img
            src={studentData.profileImage}
            alt="Student profile"
            className="profile-image"
          />
        </div>
      </div>

      <div className="card-content">
        <h2 className="student-name" style={nameStyle}>{studentData.name}</h2>
        <p className="student-bio" style={bioStyle}>
          <span className="quote-mark">"</span>
          {studentData.bio}
          <span className="quote-mark">"</span>
        </p>
        <div className="student-info-section">
          <h3 className="section-title" style={sectionTitleStyle}>{safeT('studentCard.major')}</h3>
          <p className="section-value" style={sectionValueStyle}>{studentData.major || "Compute Science and Engineering"}</p>
          <h3 className="section-title" style={sectionTitleStyle}>{safeT('studentCard.graduatingClass')}</h3>
          <p className="section-value" style={sectionValueStyle}>{studentData.year || "2027"}</p>
        </div>
        <div className="social-links">
          <a href={studentData.socialLinks?.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={socialIconStyle}>
            <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
          <a href={studentData.socialLinks?.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={socialIconStyle}>
            <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a href={studentData.socialLinks?.portfolio} target="_blank" rel="noopener noreferrer" aria-label="Portfolio" style={socialIconStyle}>
            <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.162c-.499 1.33-1.159 2.497-1.957 3.456v-3.62c.666.028 1.319.081 1.957.164zm-1.957-7.219v-3.015c.868-.034 1.721-.103 2.548-.224.238 1.027.389 2.111.446 3.239h-2.994zm0-5.014v-3.661c.806.969 1.471 2.15 1.971 3.496-.642.084-1.3.137-1.971.165zm2.703-3.267c1.237.496 2.354 1.228 3.29 2.146-.642.234-1.311.442-2.019.607-.344-.992-.775-1.91-1.271-2.753zm-7.241 13.56c-.244-1.039-.398-2.136-.456-3.279h2.994v3.057c-.865.034-1.714.102-2.538.222zm2.538 1.776v3.62c-.798-.959-1.458-2.126-1.957-3.456.638-.083 1.291-.136 1.957-.164zm-2.994-7.055c.057-1.128.207-2.212.446-3.239.827.121 1.68.19 2.548.224v3.015h-2.994zm1.024-5.179c.5-1.346 1.165-2.527 1.97-3.496v3.661c-.671-.028-1.329-.081-1.97-.165zm-2.005-.35c-.708-.165-1.377-.373-2.018-.607.937-.918 2.053-1.65 3.29-2.146-.496.844-.927 1.762-1.272 2.753zm-.549 1.918c-.264 1.151-.434 2.36-.492 3.611h-3.933c.165-1.658.739-3.197 1.617-4.518.88.361 1.816.67 2.808.907zm.009 9.262c-.988.236-1.92.542-2.797.9-.89-1.328-1.471-2.879-1.637-4.551h3.934c.058 1.265.231 2.488.5 3.651zm.553 1.917c.342.976.768 1.881 1.257 2.712-1.223-.49-2.326-1.211-3.256-2.115.636-.229 1.299-.435 1.999-.597zm9.924 0c.7.163 1.362.367 1.999.597-.931.903-2.034 1.625-3.257 2.116.489-.832.915-1.737 1.258-2.713zm.553-1.917c.27-1.163.442-2.386.501-3.651h3.934c-.167 1.672-.748 3.223-1.638 4.551-.877-.358-1.81-.664-2.797-.9zm.501-5.651c-.058-1.251-.229-2.46-.492-3.611.992-.237 1.929-.546 2.809-.907.877 1.321 1.451 2.86 1.616 4.518h-3.933z" />
            </svg>
          </a>
        </div>

        <div className="action-indicator mt-6">
          <div className="text-center text-sm text-gray-500">
            {isOpen ? safeT('studentCard.clickToViewLess') : safeT('studentCard.clickToViewMore')}
          </div>
        </div>
      </div>
    </div>
  );
}