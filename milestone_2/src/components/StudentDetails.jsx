import './styles/StudentProfile.css';

export default function StudentDetails({ isOpen, studentData }) {
  // Function to render stars for personality traits
  const renderStars = (rating) => {
    const stars = [];
    const maxStars = 5;
    
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <span 
          key={i} 
          className={`trait-star ${i <= rating ? 'filled' : 'empty'}`}
        >
          ★
        </span>
      );
    }
    
    return (
      <div className="trait-stars">
        {stars}
      </div>
    );
  };

  return (
    <div className={`student-details ${isOpen ? 'expanded' : ''}`}>
      <div className="details-content">
        <div className="grid-layout">
          <div className="grid-column">
            <div className="details-section personality-traits-section">
              <h3>Personality Traits</h3>
              <div className="personality-traits">
                {studentData.personalityTraits.map((trait, index) => (
                  <div key={index} className="trait-item">
                    <div className="trait-header-inline">
                      <span className="trait-label">{trait.trait}</span>
                      {renderStars(trait.rating)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="details-section education-section">
              <h3>Education</h3>
              <div className="education-content">
                {studentData.education[0] && (
                  <div className="education-item">
                    <h4>{studentData.education[0].degree}</h4>
                    <p>{studentData.education[0].institution}</p>
                    <p className="year">{studentData.education[0].period}</p>
                  </div>
                )}
                {studentData.education[1] && (
                  <div className="education-item">
                    <h4>Faculty</h4>
                    <p>{studentData.education[1].faculty}</p>
                    <p className="year">Semester {studentData.education[1].semester}</p>            
                  </div>
                )}
              </div>
            </div>
            
            <div className="details-section skills-section">
              <h3>Skills</h3>
              <div className="skills-container">
                {studentData.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
            
            <div className="details-section job-interests-section">
              <h3>Job Interests</h3>
              <div className="job-interests-container">
                {studentData.jobInterests.map((interest, index) => (
                  <div key={index} className="job-interest-item">
                    <h4>{interest.title}</h4>
                    <div className="job-interest-separator"></div>
                    <p className="job-interest-description">
                      {interest.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid-column">
            <div className="details-section experience-section">
              <h3>Experience</h3>
              <div className="experience-content">
                {studentData.experience.map((exp, index) => (
                  <div key={index} className="experience-item">
                    <h4>{exp.title}</h4>
                    <p className="company">{exp.company}</p>
                    <p className="duration">{exp.duration}</p>
                    <ul className="responsibilities">
                      {exp.responsibilities.map((resp, respIdx) => (
                        <li key={respIdx}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="details-section internships-section">
              <h3>Internships</h3>
              <div className="internships-container">
                {studentData.internships.map((internship, index) => (
                  <div key={index} className="internship-item">
                    <div className="internship-header">
                      <div className="internship-icon">
                        {index === 0 ? '💼' : index === 1 ? '🔬' : '📱'}
                      </div>
                      <h4>{internship.title}</h4>
                    </div>
                    <div className="internship-content">
                      <p>{internship.company}</p>
                      <p className="internship-period">{internship.period}</p>
                      <div className="internship-separator"></div>
                      <p className="internship-description">
                        {internship.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

