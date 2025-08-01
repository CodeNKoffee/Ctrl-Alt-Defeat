"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import StudentCard from "./StudentCard";
import StudentDetails from "./StudentDetails";
import UpdateProfileS from "./UpdateProfileS";
import './styles/StudentProfile.css'; // Importing CSS for styling
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';

export default function Student() {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Feedback state for successful profile update - copied from UploadDocuments.jsx
  const [feedback, setFeedback] = useState(null);

  // Default student data
  const defaultStudentData = {
    name: "Salma Tarek Soliman",
    email: "SalmaSoliman@student.guc.edu.eg",
    bio: "Computer Science student passionate about web development and AI.",
    major: "Computer Science and Engineering",
    year: "Spring 2027",
    profileImage: "/images/girl1.png",
    socialLinks: {
      linkedin: "https://linkedin.com/in/johndoe",
      github: "https://github.com/johndoe",
      portfolio: "https://johndoe.dev"
    },
    personalityTraits: [
      { trait: "Openness", rating: 4 },
      { trait: "Creativity", rating: 5 },
      { trait: "Extraversion", rating: 4 },
      { trait: "Agreeableness", rating: 3 },
    ],
    education: [
      {
        degree: "B.S. in Computer Science and Engineering",
        institution: "German University in Cairo",
        period: "2022 - Present"
      },
      {
        faculty: "Media Engineering and Technology (MET)",
        semester: 6
      }
    ],
    skills: ["Java", "Python", "React", "Node.js", "UI/UX Design", "Problem Solving", "Team Leadership"],
    jobInterests: [
      {
        title: "Software Development Engineer",
        description: "Passionate about building scalable web applications with modern frameworks. Looking for opportunities to work on user-facing features that make a difference."
      },
      {
        title: "Data Science",
        description: "Intrigued by the power of data to drive decision-making. Eager to apply machine learning techniques to solve real-world problems."
      },
      {
        title: "Product Management",
        description: "Interested in bridging the gap between technical and business aspects. Aspires to lead product development from conception to launch."
      }
    ],
    experience: [
      {
        title: "Software Engineering Intern",
        company: "Tech Innovators Inc.",
        duration: "Summer 2023",
        responsibilities: [
          "Developed features for the company's web application",
          "Collaborated with the UX team to improve user experience",
          "Fixed bugs and improved application performance"
        ]
      },
      {
        title: "Research Assistant",
        company: "University AI Lab",
        duration: "2022 - Present",
        responsibilities: [
          "Assisted in data collection and analysis for AI research",
          "Implemented algorithms for pattern recognition",
          "Co-authored a research paper on machine learning applications"
        ]
      }
    ],
    internships: [
      {
        title: "Software Engineering Intern",
        company: "Google",
        period: "Summer 2024 (Upcoming)",
        description: "Will be working on Google Maps features using React and Node.js. Selected from over 500 applicants through a rigorous interview process."
      },
      {
        title: "Research Assistant",
        company: "Michigan State AI Lab",
        period: "Fall 2023",
        description: "Worked on developing machine learning algorithms for image recognition. Presented findings at the campus research exhibition."
      },
      {
        title: "Mobile Development Intern",
        company: "Local Startup",
        period: "Summer 2023",
        description: "Developed features for an iOS app using Swift. Implemented user authentication and real-time chat functionality."
      }
    ],
    theme: {
      primary: "#318FA8",
      secondary: "#256980",
      accent: "#41B9D9",
      text: "#1A4857",
      background: "#E8F4F8"
    }
  };

  // Load student data from localStorage on component mount
  const [studentData, setStudentData] = useState(defaultStudentData);

  useEffect(() => {
    const loadStudentData = () => {
      try {
        const savedData = localStorage.getItem('studentProfileData');
        if (savedData) {
          setStudentData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Error loading student data from localStorage:", error);
      }
    };

    loadStudentData();
  }, []);

  const toggleDetails = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Function to update student data from edit form
  const handleProfileUpdate = (updatedData) => {
    setStudentData(updatedData);

    // Save the updated data to localStorage
    try {
      localStorage.setItem('studentProfileData', JSON.stringify(updatedData));
    } catch (error) {
      console.error("Error saving student data to localStorage:", error);
    }

    closeEditModal();

    // In a real application, you would send the data to your backend here
    console.log("Updated profile data:", updatedData);
  };

  const handleEditModalClose = (success = false) => {
    closeEditModal();

    // If the update was successful, show feedback
    if (success) {
      setFeedback('success');
      setTimeout(() => {
        setFeedback(null);
      }, 1400);
    }
  };

  return (
    <div className="w-full h-full relative profile-container">
      <div className={`student-profile-wrapper ${isDetailsOpen ? 'expanded' : ''}`}>
        <StudentCard
          isOpen={isDetailsOpen}
          toggleDetails={toggleDetails}
          onEditProfile={openEditModal}
          studentData={studentData}
        />
        <StudentDetails
          isOpen={isDetailsOpen}
          studentData={studentData}
        />
      </div>
      <UpdateProfileS
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        studentData={studentData}
        onProfileUpdate={handleProfileUpdate}
      />

      {/* Feedback overlay - copied exactly from UploadDocuments.jsx */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
              background: 'rgba(42, 95, 116, 0.18)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{
                background: 'white',
                padding: '25px',
                borderRadius: '15px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                maxWidth: '400px'
              }}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <motion.div
                style={{
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: '#318FA8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ fontSize: 32, color: 'white' }}
                  />
                </div>
              </motion.div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2A5F74', marginBottom: '10px' }}>
                {safeT('updateProfile.updated')}
              </div>
              <div style={{ color: '#333', textAlign: 'center' }}>
                {safeT('updateProfile.message')}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}