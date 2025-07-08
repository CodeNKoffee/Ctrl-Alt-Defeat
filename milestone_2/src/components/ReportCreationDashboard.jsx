import { useState, useEffect } from "react";
import { CSEN_Courses, DMET_Courses, BioTech_Courses, Law_Courses } from "../../constants/mockData";
import CustomButton from "./shared/CustomButton";
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';

export default function ReportCreationDashboard({ onAddTile, onCancel, initialReport, hideTitle = false, showSaveDraftButton = true, isEditMode = false }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

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
        {feedback && ready && (
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
                padding: '40px',
                borderRadius: '12px',
                textAlign: 'center',
                maxWidth: '400px',
                position: 'relative'
              }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2A5F74', marginBottom: '10px' }}>
                {safeT(feedbackType === 'draft' ? 'student.dashboard.reportCreationDashboard.feedback.updated' : 'student.dashboard.reportCreationDashboard.feedback.success')}
              </div>
              <div style={{ color: '#333', textAlign: 'center' }}>
                {feedbackType === 'submit'
                  ? safeT(`student.dashboard.reportCreationDashboard.feedback.submitSuccess.${isEditMode ? 'edit' : 'create'}`)
                  : safeT(`student.dashboard.reportCreationDashboard.feedback.draftSuccess.${isEditMode ? 'edit' : 'create'}`)}
              </div>
              <FontAwesomeIcon icon={faCheck} style={{ color: '#2A5F74', fontSize: '48px', marginTop: '20px' }} />
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
              {safeT(`student.dashboard.reportCreationDashboard.title.${isEditMode ? 'edit' : 'create'}`)}
            </h2>

            <form className="space-y-4" onSubmit={handleModalSubmit}>
              <div>
                <label className="block text-sm font-medium text-[#2A5F74] mb-1">{safeT('student.dashboard.reportCreationDashboard.form.reportTitle.label')}</label>
                <input
                  required
                  name="internshipTitle"
                  value={filledReport.internshipTitle}
                  onChange={handleFormChange}
                  placeholder={safeT('student.dashboard.reportCreationDashboard.form.reportTitle.placeholder')}
                  className="w-full border-2 border-[var(--metallica-blue-200)] p-2 rounded-md bg-white focus:border-[var(--metallica-blue-500)] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2A5F74] mb-1">{safeT('student.dashboard.reportCreationDashboard.form.company.label')}</label>
                <input
                  name="company"
                  value={filledReport.company}
                  onChange={handleFormChange}
                  placeholder={safeT('student.dashboard.reportCreationDashboard.form.company.placeholder')}
                  className="w-full border-2 border-[var(--metallica-blue-200)] p-2 rounded-md bg-white focus:border-[var(--metallica-blue-500)] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2A5F74] mb-1">{safeT('student.dashboard.reportCreationDashboard.form.major.label')}</label>
                <select
                  required
                  value={filledReport.major}
                  onChange={handleMajorChange}
                  className="w-full border-2 border-[var(--metallica-blue-200)] p-2 rounded-md bg-white focus:border-[var(--metallica-blue-500)] focus:outline-none transition-colors"
                >
                  <option value="" disabled>{safeT('student.dashboard.reportCreationDashboard.form.major.placeholder')}</option>
                  <option value="CSEN">{safeT('student.dashboard.reportCreationDashboard.form.major.options.csen')}</option>
                  <option value="DMET">{safeT('student.dashboard.reportCreationDashboard.form.major.options.dmet')}</option>
                  <option value="BioTechnology">{safeT('student.dashboard.reportCreationDashboard.form.major.options.biotech')}</option>
                  <option value="Law">{safeT('student.dashboard.reportCreationDashboard.form.major.options.law')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2A5F74] mb-1">{safeT('student.dashboard.reportCreationDashboard.form.courses.label')}</label>
                <select
                  onChange={handleCourseSelect}
                  className="w-full border-2 border-[var(--metallica-blue-200)] p-2 rounded-md bg-white focus:border-[var(--metallica-blue-500)] focus:outline-none transition-colors"
                >
                  <option value="" disabled>{safeT('student.dashboard.reportCreationDashboard.form.courses.placeholder')}</option>
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
                <p className="text-[#2A5F74] font-medium mb-2 text-center">{safeT('student.dashboard.reportCreationDashboard.guidelines.title')}</p>
                <div className="text-[#2A5F74] space-y-1">
                  <p>• {safeT('student.dashboard.reportCreationDashboard.guidelines.introduction')}</p>
                  <p>• {safeT('student.dashboard.reportCreationDashboard.guidelines.body')}</p>
                  <p>• {safeT('student.dashboard.reportCreationDashboard.guidelines.conclusion')}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2A5F74] mb-1">{safeT('student.dashboard.reportCreationDashboard.sections.introduction.label')}</label>
                <textarea
                  required
                  name="introduction"
                  value={filledReport.introduction}
                  onChange={handleFormChange}
                  placeholder={safeT('student.dashboard.reportCreationDashboard.sections.introduction.placeholder')}
                  className="w-full border-2 border-[var(--metallica-blue-200)] p-2 rounded-md bg-white focus:border-[var(--metallica-blue-500)] focus:outline-none transition-colors resize-vertical min-h-[100px]"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2A5F74] mb-1">{safeT('student.dashboard.reportCreationDashboard.sections.body.label')}</label>
                <textarea
                  required
                  name="body"
                  value={filledReport.body}
                  onChange={handleFormChange}
                  placeholder={safeT('student.dashboard.reportCreationDashboard.sections.body.placeholder')}
                  className="w-full border-2 border-[var(--metallica-blue-200)] p-2 rounded-md bg-white focus:border-[var(--metallica-blue-500)] focus:outline-none transition-colors resize-vertical min-h-[100px]"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2A5F74] mb-1">{safeT('student.dashboard.reportCreationDashboard.sections.conclusion.label')}</label>
                <textarea
                  required
                  name="conclusion"
                  value={filledReport.conclusion}
                  onChange={handleFormChange}
                  placeholder={safeT('student.dashboard.reportCreationDashboard.sections.conclusion.placeholder')}
                  className="w-full border-2 border-[var(--metallica-blue-200)] p-2 rounded-md bg-white focus:border-[var(--metallica-blue-500)] focus:outline-none transition-colors resize-vertical min-h-[100px]"
                  rows="3"
                />
              </div>
              <div className="flex gap-2 mt-6">
                <CustomButton
                  type="submit"
                  variant="primary"
                  text={isEditMode ? safeT('student.dashboard.reportCreationDashboard.buttons.submitEdit') : safeT('student.dashboard.reportCreationDashboard.buttons.submit')}
                  fullWidth
                />
                {showSaveDraftButton && (
                  <CustomButton
                    type="button"
                    variant="secondary"
                    text={
                      draftStatus === 'saving'
                        ? safeT('student.dashboard.reportCreationDashboard.buttons.saving')
                        : draftStatus === 'saved'
                          ? safeT('student.dashboard.reportCreationDashboard.buttons.saved')
                          : (isEditMode ? safeT('student.dashboard.reportCreationDashboard.buttons.saveChanges') : safeT('student.dashboard.reportCreationDashboard.buttons.saveDraft'))
                    }
                    fullWidth
                    disabled={draftStatus === 'saving' || draftStatus === 'saved'}
                    isLoading={draftStatus === 'saving'}
                    loadingText={safeT('student.dashboard.reportCreationDashboard.buttons.saving')}
                    onClick={async () => {
                      setDraftStatus('saving');
                      await new Promise(res => setTimeout(res, 800));
                      setReport({ ...filledReport, courses: selectedCourses });

                      // Show success feedback first
                      setDraftStatus("");
                      setFeedbackType('draft');
                      setFeedback('success');

                      // Wait for animation and then close
                      setTimeout(() => {
                        onAddTile({
                          ...filledReport,
                          courses: selectedCourses,
                          status: isEditMode ? 'updated_draft' : 'draft'
                        });
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
              {safeT('student.dashboard.reportCreationDashboard.preview.title')}
            </h2>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-[#D9F0F4] hover:shadow-lg transition-shadow duration-300">
              <div className="bg-[#F0F9FB] rounded-t-xl p-4 -m-6 mb-6 border-b border-[#D9F0F4]">
                <h3 className="text-xl font-bold text-[#2A5F74] text-center">
                  {filledReport.internshipTitle || safeT('student.dashboard.reportCreationDashboard.preview.defaultTitle')}
                </h3>

                <div className="mt-2 flex justify-center">
                  <span className="bg-[#318FA8] text-white text-xs px-3 py-1 rounded-full">
                    {filledReport.company || safeT('student.dashboard.reportCreationDashboard.preview.defaultCompany')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 border-b border-[#E2F4F7] pb-4">
                <div className="bg-[#F8FAFB] rounded-lg p-3 border border-[#D9F0F4]">
                  <h4 className="font-medium mb-1 text-[#2A5F74] text-sm">{safeT('student.dashboard.reportCreationDashboard.preview.major')}</h4>
                  <p className="text-[#4C798B] font-medium">
                    {filledReport.major || safeT('student.dashboard.reportCreationDashboard.preview.notSpecified')}
                  </p>
                </div>
                <div className="bg-[#F8FAFB] rounded-lg p-3 border border-[#D9F0F4]">
                  <h4 className="font-medium mb-1 text-[#2A5F74] text-sm">{safeT('student.dashboard.reportCreationDashboard.preview.submittedBy')}</h4>
                  <p className="text-[#4C798B] font-medium">
                    {safeT('student.dashboard.reportCreationDashboard.preview.studentName')}
                  </p>
                </div>
              </div>

              {selectedCourses.length > 0 && (
                <div className="mb-6 border-b border-[#E2F4F7] pb-4">
                  <h4 className="font-medium mb-2 text-[#2A5F74]">{safeT('student.dashboard.reportCreationDashboard.preview.relevantCourses')}</h4>
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
                  {safeT('student.dashboard.reportCreationDashboard.sections.introduction.label')}
                </h4>
                <div className="bg-[#F8FAFB] rounded-lg p-3 border border-[#D9F0F4]">
                  <p className="text-[#4C798B]">{filledReport.introduction || safeT('student.dashboard.reportCreationDashboard.preview.notProvided')}</p>
                </div>
              </div>

              <div className="mb-6 border-b border-[#E2F4F7] pb-4">
                <h4 className="font-medium mb-2 text-[#2A5F74] flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#318FA8] rounded-full mr-2"></span>
                  {safeT('student.dashboard.reportCreationDashboard.sections.body.label')}
                </h4>
                <div className="bg-[#F8FAFB] rounded-lg p-3 border border-[#D9F0F4]">
                  <p className="text-[#4C798B]">{filledReport.body || safeT('student.dashboard.reportCreationDashboard.preview.notProvided')}</p>
                </div>
              </div>

              <div className="mb-2">
                <h4 className="font-medium mb-2 text-[#2A5F74] flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#318FA8] rounded-full mr-2"></span>
                  {safeT('student.dashboard.reportCreationDashboard.sections.conclusion.label')}
                </h4>
                <div className="bg-[#F8FAFB] rounded-lg p-3 border border-[#D9F0F4]">
                  <p className="text-[#4C798B]">{filledReport.conclusion || safeT('student.dashboard.reportCreationDashboard.preview.notProvided')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}