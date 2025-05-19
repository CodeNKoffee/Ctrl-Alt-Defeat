import { useState, useEffect } from "react";
import { CSEN_Courses, DMET_Courses, BioTech_Courses, Law_Courses } from "../../constants/mockData";
import CustomButton from "./shared/CustomButton";
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export default function ReportCreationDashboard({ onAddTile, onCancel, initialReport, hideTitle = false, showSaveDraftButton = true, isEditMode = false }) {
  const [filledReport, setReport] = useState({
    internshipTitle: '',
    introduction: '',
    body: '',
    conclusion: '',
    courses: [],
    major: '',
    company: '',
  });
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [draftStatus, setDraftStatus] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [feedbackType, setFeedbackType] = useState('');

  useEffect(() => {
    if (initialReport) {
      setReport({
        internshipTitle: initialReport.internshipTitle || initialReport.title || '',
        introduction: initialReport.introduction || '',
        body: initialReport.body || '',
        conclusion: initialReport.conclusion || '',
        courses: initialReport.courses || [],
        major: initialReport.major || '',
        company: initialReport.company || '',
      });
      setSelectedCourses(initialReport.courses || []);
      if (initialReport.major === 'CSEN') setCourses(CSEN_Courses);
      else if (initialReport.major === 'DMET') setCourses(DMET_Courses);
      else if (initialReport.major === 'BioTechnology') setCourses(BioTech_Courses);
      else if (initialReport.major === 'Law') setCourses(Law_Courses);
      else setCourses([]);
    }
  }, [initialReport]);

  const handleMajorChange = (e) => {
    const major = e.target.value;
    setReport((prev) => ({ ...prev, major }));
    setSelectedCourses([]);
    if (major === 'CSEN') setCourses(CSEN_Courses);
    else if (major === 'DMET') setCourses(DMET_Courses);
    else if (major === 'BioTechnology') setCourses(BioTech_Courses);
    else if (major === 'Law') setCourses(Law_Courses);
    else setCourses([]);
  };

  const handleCourseSelect = (e) => {
    const selectedCourse = e.target.value;
    if (selectedCourse && !selectedCourses.includes(selectedCourse)) {
      setSelectedCourses((prev) => [...prev, selectedCourse]);
      setCourses((prev) => prev.filter((course) => course !== selectedCourse));
    }
    e.target.value = "";
  };

  const handleCourseRemove = (course) => {
    setSelectedCourses((prev) => prev.filter((c) => c !== course));
    setCourses((prev) => [...prev, course]);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setReport((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();

    // Show success feedback
    setFeedback('success');
    setFeedbackType('submit');

    // Wait for animation and then close
    setTimeout(() => {
      onAddTile({ ...filledReport, courses: selectedCourses, status: isEditMode ? 'updated' : 'submitted' });
      setFeedback(null);
      if (onCancel) onCancel();
      setReport({ internshipTitle: '', introduction: '', body: '', conclusion: '', courses: [], major: '' });
      setSelectedCourses([]);
      setCourses([]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-[2px] overflow-auto py-8">
      {/* Feedback success modal */}
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
                Success!
              </div>
              <div style={{ color: '#333', textAlign: 'center' }}>
                {feedbackType === 'submit'
                  ? `Your report has been successfully ${isEditMode ? 'updated' : 'submitted'}.`
                  : `Your report has been successfully saved as a ${isEditMode ? 'draft update' : 'draft'}.`
                }
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-6xl max-h-[90vh] overflow-hidden border-2 border-[#2A5F74] animate-fade-in relative">
        {/* Close button styled like CallModal.jsx */}
        <button
          className="absolute top-3 right-3 z-20 flex items-center justify-center w-7 h-7 rounded-full shadow-sm bg-gray-200/70 hover:bg-gray-300/90 transition-colors"
          onClick={onCancel}
          aria-label="Close modal"
        >
          <span className="text-xl text-gray-500 font-normal">&times;</span>
        </button>

        <div className="flex flex-col lg:flex-row h-[calc(90vh)]">
          {/* Left side - Form */}
          <div className="lg:w-1/2 p-6 overflow-y-auto bg-[#F0F9FB]">
            <h2 className="text-xl font-bold text-[#2A5F74] mb-6 text-left flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              {isEditMode ? "Edit Internship Report" : "Create Internship Report"}
            </h2>

            <form className="space-y-4" onSubmit={handleModalSubmit}>
              <div>
                <label className="block text-sm font-medium text-[#2A5F74] mb-1">Report Title</label>
                <input
                  required
                  name="internshipTitle"
                  value={filledReport.internshipTitle}
                  onChange={handleFormChange}
                  placeholder="Enter a descriptive title for your report"
                  className="mt-1 block w-full rounded-lg border-2 border-[#B8E1E9] shadow-sm focus:border-[#3298BA] focus:ring-[#3298BA] bg-[#F8FAFB] text-[#2A5F74] sm:text-sm px-4 py-2 transition-all duration-300 hover:shadow-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2A5F74] mb-1">Company/Organization Name</label>
                <input
                  name="company"
                  value={filledReport.company}
                  onChange={handleFormChange}
                  placeholder="Where did you complete your internship?"
                  className="mt-1 block w-full rounded-lg border-2 border-[#B8E1E9] shadow-sm focus:border-[#3298BA] focus:ring-[#3298BA] bg-[#F8FAFB] text-[#2A5F74] sm:text-sm px-4 py-2 transition-all duration-300 hover:shadow-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2A5F74] mb-1">Select your major</label>
                <select
                  required
                  value={filledReport.major}
                  onChange={handleMajorChange}
                  className="mt-1 block w-full rounded-lg border-2 border-[#B8E1E9] shadow-sm focus:border-[#3298BA] focus:ring-[#3298BA] bg-[#F8FAFB] text-[#2A5F74] sm:text-sm px-4 py-2 transition-all duration-300 hover:shadow-md"
                >
                  <option value="" disabled>Select your major</option>
                  <option value="CSEN">CSEN</option>
                  <option value="DMET">DMET</option>
                  <option value="BioTechnology">Biotechnology</option>
                  <option value="Law">Law</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2A5F74] mb-1">Add courses that helped you during your internship</label>
                <select
                  onChange={handleCourseSelect}
                  className="mt-1 block w-full rounded-lg border-2 border-[#B8E1E9] shadow-sm focus:border-[#3298BA] focus:ring-[#3298BA] bg-[#F8FAFB] text-[#2A5F74] sm:text-sm px-4 py-2 transition-all duration-300 hover:shadow-md"
                >
                  <option value="" disabled>Select a course</option>
                  {courses.map((course, index) => (
                    <option key={index} value={course}>{course}</option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCourses.map((course, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-200 cursor-pointer hover:bg-green-200 transition-colors duration-300 flex items-center"
                      onClick={() => handleCourseRemove(course)}
                    >
                      {course}
                      <span className="ml-1 text-sm">&times;</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#D9F0F4] rounded-lg border-2 border-[#86CBDA] text-xs">
                <p className="text-[#2A5F74] font-medium mb-2 text-center">Report Structure Guidelines</p>
                <div className="text-[#2A5F74] space-y-1">
                  <p>• Introduction: Describe the company and your initial expectations</p>
                  <p>• Body: Detail your responsibilities, projects, and key learning experiences</p>
                  <p>• Conclusion: Summarize your experience and what you gained from it</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2A5F74] mb-1">Introduction</label>
                <textarea
                  required
                  name="introduction"
                  value={filledReport.introduction}
                  onChange={handleFormChange}
                  placeholder="Introduce the company and your role..."
                  className="mt-1 block w-full rounded-lg border-2 border-[#B8E1E9] shadow-sm focus:border-[#3298BA] focus:ring-[#3298BA] bg-[#F8FAFB] text-[#2A5F74] sm:text-sm px-4 py-2 resize-y transition-all duration-300 hover:shadow-md"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2A5F74] mb-1">Body</label>
                <textarea
                  required
                  name="body"
                  value={filledReport.body}
                  onChange={handleFormChange}
                  placeholder="Detail your responsibilities and experiences..."
                  className="mt-1 block w-full rounded-lg border-2 border-[#B8E1E9] shadow-sm focus:border-[#3298BA] focus:ring-[#3298BA] bg-[#F8FAFB] text-[#2A5F74] sm:text-sm px-4 py-2 resize-y transition-all duration-300 hover:shadow-md"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2A5F74] mb-1">Conclusion</label>
                <textarea
                  required
                  name="conclusion"
                  value={filledReport.conclusion}
                  onChange={handleFormChange}
                  placeholder="Summarize what you learned and gained..."
                  className="mt-1 block w-full rounded-lg border-2 border-[#B8E1E9] shadow-sm focus:border-[#3298BA] focus:ring-[#3298BA] bg-[#F8FAFB] text-[#2A5F74] sm:text-sm px-4 py-2 resize-y transition-all duration-300 hover:shadow-md"
                  rows="3"
                />
              </div>
              <div className="flex gap-2 mt-6">
                <CustomButton
                  type="submit"
                  variant="primary"
                  text={isEditMode ? "Submit" : "Submit Report"}
                  fullWidth
                />
                {showSaveDraftButton && (
                  <CustomButton
                    type="button"
                    variant="secondary"
                    text={
                      draftStatus === 'saving'
                        ? 'Saving...'
                        : draftStatus === 'saved'
                          ? '✓ Saved!'
                          : (isEditMode ? 'Save Changes' : 'Save Draft')
                    }
                    fullWidth
                    disabled={draftStatus === 'saving' || draftStatus === 'saved'}
                    isLoading={draftStatus === 'saving'}
                    loadingText="Saving..."
                    onClick={async () => {
                      setDraftStatus('saving');
                      await new Promise(res => setTimeout(res, 800));
                      setReport({ ...filledReport, courses: selectedCourses });
                      onAddTile({
                        ...filledReport,
                        courses: selectedCourses,
                        status: isEditMode ? 'updated_draft' : 'draft'
                      });

                      // Show success feedback instead of just saved status
                      setDraftStatus("");
                      setFeedback('success');
                      setFeedbackType('draft');

                      // Wait for animation and then close
                      setTimeout(() => {
                        setFeedback(null);
                        if (onCancel) onCancel();
                      }, 1500);
                    }}
                  />
                )}
              </div>
            </form>
          </div>

          {/* Right side - Preview */}
          <div className="lg:w-1/2 p-6 overflow-y-auto bg-white">
            <h2 className="text-xl font-bold text-[#2A5F74] mb-6 text-left flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Report Preview
            </h2>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-[#D9F0F4] hover:shadow-lg transition-shadow duration-300">
              <div className="bg-[#F0F9FB] rounded-t-xl p-4 -m-6 mb-6 border-b border-[#D9F0F4]">
                <h3 className="text-xl font-bold text-[#2A5F74] text-center">
                  {filledReport.internshipTitle || "Your Report Title"}
                </h3>

                <div className="mt-2 flex justify-center">
                  <span className="bg-[#318FA8] text-white text-xs px-3 py-1 rounded-full">
                    {filledReport.company || "Company Name"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 border-b border-[#E2F4F7] pb-4">
                <div className="bg-[#F8FAFB] rounded-lg p-3 border border-[#D9F0F4]">
                  <h4 className="font-medium mb-1 text-[#2A5F74] text-sm">Major</h4>
                  <p className="text-[#4C798B] font-medium">
                    {filledReport.major || "Not specified"}
                  </p>
                </div>
                <div className="bg-[#F8FAFB] rounded-lg p-3 border border-[#D9F0F4]">
                  <h4 className="font-medium mb-1 text-[#2A5F74] text-sm">Submitted By</h4>
                  <p className="text-[#4C798B] font-medium">
                    Student Name
                  </p>
                </div>
              </div>

              {selectedCourses.length > 0 && (
                <div className="mb-6 border-b border-[#E2F4F7] pb-4">
                  <h4 className="font-medium mb-2 text-[#2A5F74]">Relevant Courses</h4>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedCourses.map((course, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-200">{course}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6 border-b border-[#E2F4F7] pb-4">
                <h4 className="font-medium mb-2 text-[#2A5F74] flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#318FA8] rounded-full mr-2"></span>
                  Introduction
                </h4>
                <div className="bg-[#F8FAFB] rounded-lg p-3 border border-[#D9F0F4]">
                  <p className="text-[#4C798B]">{filledReport.introduction || "Not provided"}</p>
                </div>
              </div>

              <div className="mb-6 border-b border-[#E2F4F7] pb-4">
                <h4 className="font-medium mb-2 text-[#2A5F74] flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#318FA8] rounded-full mr-2"></span>
                  Body
                </h4>
                <div className="bg-[#F8FAFB] rounded-lg p-3 border border-[#D9F0F4]">
                  <p className="text-[#4C798B]">{filledReport.body || "Not provided"}</p>
                </div>
              </div>

              <div className="mb-2">
                <h4 className="font-medium mb-2 text-[#2A5F74] flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#318FA8] rounded-full mr-2"></span>
                  Conclusion
                </h4>
                <div className="bg-[#F8FAFB] rounded-lg p-3 border border-[#D9F0F4]">
                  <p className="text-[#4C798B]">{filledReport.conclusion || "Not provided"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}