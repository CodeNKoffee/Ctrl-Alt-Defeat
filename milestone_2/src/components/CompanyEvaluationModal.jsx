import { useState, useEffect } from "react";
import CustomButton from "./shared/CustomButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

const skillAttributes = [
  "Ability to adapt to change",
  "Analytical skills",
  "Collecting data/ research data skills",
  "Creativity",
  "Follow up skills",
  "Interpersonal skills with peers, supervisors, and clients",
  "Problem solving",
  "Punctuality",
  "Reporting skills",
  "Responsibility and accountability",
  "Stress handling",
  "Taking initiatives",
  "Teamwork",
  "Time management"
];

const technicalAttributes = [
  "Technical Background",
  "Technical Knowledge",
  "Compatibility of technical skills with the job"
];

const ratingLabels = {
  1: "Unsatisfactory",
  2: "Below Average",
  3: "Satisfactory",
  4: "Above Average",
  5: "Excellent"
};

export default function CompanyEvaluationModal({ isOpen, onClose, onSubmit, evaluationToEdit = null }) {
  const [form, setForm] = useState({
    skillRatings: Object.fromEntries(skillAttributes.map(skill => [skill, 3])),
    skillOther: "",
    technical: Object.fromEntries(technicalAttributes.map(attr => [attr, ""])),
    technicalOther: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [draftStatus, setDraftStatus] = useState("");
  const [activeTab, setActiveTab] = useState('skills');
  const isEditMode = !!evaluationToEdit;
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');

  useEffect(() => {
    if (evaluationToEdit) {
      setForm({
        skillRatings: evaluationToEdit.skillRatings || Object.fromEntries(skillAttributes.map(skill => [skill, 3])),
        skillOther: evaluationToEdit.skillOther || "",
        technical: evaluationToEdit.technical || Object.fromEntries(technicalAttributes.map(attr => [attr, ""])),
        technicalOther: evaluationToEdit.technicalOther || ""
      });
    } else {
      setForm({
        skillRatings: Object.fromEntries(skillAttributes.map(skill => [skill, 3])),
        skillOther: "",
        technical: Object.fromEntries(technicalAttributes.map(attr => [attr, ""])),
        technicalOther: ""
      });
    }
  }, [evaluationToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSkillRating = (skill, value) => {
    setForm(prev => ({
      ...prev,
      skillRatings: {
        ...prev.skillRatings,
        [skill]: value
      }
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (technicalAttributes.includes(name)) {
      setForm(prev => ({
        ...prev,
        technical: {
          ...prev.technical,
          [name]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const submitData = isEditMode ? { ...form, id: evaluationToEdit.id } : form;

    await new Promise(resolve => setTimeout(resolve, 1000));
    onSubmit(submitData, isEditMode);

    setFeedbackType('submit');
    setShowFeedbackModal(true);
    setSubmitting(false);

    setTimeout(() => {
      setShowFeedbackModal(false);
      onClose();
    }, 1800);
  };

  const handleSaveDraft = async () => {
    setDraftStatus("saving");
    const draftData = isEditMode ? { ...form, id: evaluationToEdit.id } : form;

    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Draft saved:", draftData);

    setFeedbackType('saveDraft');
    setShowFeedbackModal(true);
    setDraftStatus("saved");

    setTimeout(() => {
      setShowFeedbackModal(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(44,63,80,0.60)]">
      {/* Feedback success modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div
            className="fixed inset-0 z-[10001] flex items-center justify-center bg-[rgba(42,95,116,0.18)] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <motion.div
                className="mb-4"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${feedbackType === 'saveDraft' ? 'bg-[#318FA8]' : 'bg-[#22C55E]'}`}>
                  <FontAwesomeIcon icon={faCheck} className="text-3xl text-white" />
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-[#2A5F74] mb-2">
                {feedbackType === 'saveDraft' ? 'Updated!' : 'Success!'}
              </h3>
              <p className="text-gray-700 text-center text-sm">
                {feedbackType === 'submit'
                  ? 'Your evaluation has been successfully submitted.'
                  : 'Your changes have been successfully saved.'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="bg-[#F8FAFB] rounded-2xl shadow-2xl max-w-xl w-full p-8 relative flex flex-col gap-4 border-2 border-[#2A5F74]">
        <button
          className="absolute top-3 right-3 z-20 flex items-center justify-center w-7 h-7 rounded-full shadow-sm bg-gray-200/70 hover:bg-gray-300/90 transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FontAwesomeIcon icon={faTimes} className="text-xl text-gray-500 font-normal" />
        </button>
        <form onSubmit={handleSubmit} className="flex flex-col h-[70vh]">
          {/* Tabs */}
          <div className="flex mb-6 border-b border-[#E2F4F7]">
            <button
              type="button"
              className={`px-6 py-2 font-semibold text-base rounded-t-lg focus:outline-none transition-colors duration-200
                ${activeTab === 'skills' ? 'bg-white text-[#2A5F74] border-x border-t border-[#E2F4F7] -mb-px' : 'text-[#4C798B] bg-[#F8FAFB] hover:bg-white'}`}
              onClick={() => setActiveTab('skills')}
            >
              Skills & Professional Attributes
            </button>
            <button
              type="button"
              className={`px-6 py-2 font-semibold text-base rounded-t-lg focus:outline-none transition-colors duration-200
                ${activeTab === 'technical' ? 'bg-white text-[#2A5F74] border-x border-t border-[#E2F4F7] -mb-px' : 'text-[#4C798B] bg-[#F8FAFB] hover:bg-white'}`}
              onClick={() => setActiveTab('technical')}
            >
              Technical
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            {activeTab === 'skills' && (
              <>
                <h2 className="text-2xl font-bold text-[#2A5F74] mb-6 text-left">Skills & Professional Attributes</h2>
                <div className="space-y-6 mb-8">
                  {skillAttributes.map((skill) => (
                    <div key={skill} className="bg-white rounded-xl p-5 border border-[#E2F4F7] flex flex-col gap-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-[#2A5F74] text-base">{skill}</span>
                        <span className="text-xs text-[#4C798B]">{ratingLabels[form.skillRatings[skill]]}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-[#4C798B] w-24">Unsatisfactory</span>
                        <div className="flex-1 flex justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <label key={rating} className="cursor-pointer group">
                              <input
                                type="radio"
                                name={`skill-${skill}`}
                                value={rating}
                                checked={form.skillRatings[skill] === rating}
                                onChange={() => handleSkillRating(skill, rating)}
                                className="hidden"
                              />
                              <div
                                className={`w-10 h-10 flex items-center justify-center font-bold text-base border-2 transition-all duration-200
                                  ${form.skillRatings[skill] === rating
                                    ? 'bg-[#4796a8] text-white border-[#4796a8] scale-110 shadow-md rounded-full'
                                    : 'bg-white text-[#4796a8] border-[#E2F4F7] group-hover:bg-[#E2F4F7] group-hover:border-[#4796a8] rounded-lg'}
                                `}
                              >
                                {rating}
                              </div>
                            </label>
                          ))}
                        </div>
                        <span className="text-xs text-[#4C798B] w-24 text-right">Excellent</span>
                      </div>
                    </div>
                  ))}
                  <div className="bg-white rounded-xl p-5 border border-[#E2F4F7] flex flex-col gap-2">
                    <label className="font-semibold text-[#2A5F74] text-base mb-1" htmlFor="skillOther">Other:</label>
                    <textarea
                      id="skillOther"
                      name="skillOther"
                      value={form.skillOther}
                      onChange={handleChange}
                      className="w-full border border-[#E2F4F7] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4796a8] bg-white text-[#2A5F74] text-sm"
                      rows={2}
                      placeholder="Add any other feedback on skills..."
                    />
                  </div>
                </div>
              </>
            )}
            {activeTab === 'technical' && (
              <>
                <h2 className="text-2xl font-bold text-[#2A5F74] mb-6 text-left">Technical</h2>
                <div className="space-y-6 mb-8">
                  {technicalAttributes.map((attr) => (
                    <div key={attr} className="bg-white rounded-xl p-5 border border-[#E2F4F7] flex flex-col gap-2">
                      <label className="font-semibold text-[#2A5F74] text-base mb-1" htmlFor={attr}>{attr}</label>
                      <textarea
                        id={attr}
                        name={attr}
                        value={form.technical[attr]}
                        onChange={handleChange}
                        className="w-full border border-[#E2F4F7] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4796a8] bg-white text-[#2A5F74] text-sm"
                        rows={2}
                        placeholder={`Add feedback on ${attr.toLowerCase()}...`}
                      />
                    </div>
                  ))}
                  <div className="bg-white rounded-xl p-5 border border-[#E2F4F7] flex flex-col gap-2">
                    <label className="font-semibold text-[#2A5F74] text-base mb-1" htmlFor="technicalOther">Other:</label>
                    <textarea
                      id="technicalOther"
                      name="technicalOther"
                      value={form.technicalOther}
                      onChange={handleChange}
                      className="w-full border border-[#E2F4F7] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4796a8] bg-white text-[#2A5F74] text-sm"
                      rows={2}
                      placeholder="Add any other technical feedback..."
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex gap-3 mt-4 w-full">
            <CustomButton
              variant="primary"
              type="submit"
              text="Submit Evaluation"
              isLoading={submitting}
              loadingText="Submitting..."
              disabled={submitting || draftStatus === 'saving'}
              onClick={handleSubmit}
              width="w-full"
            />
            <CustomButton
              variant="secondary"
              type="button"
              text={isEditMode ? "Save Changes" : "Save as Draft"}
              isLoading={draftStatus === 'saving'}
              loadingText="Saving..."
              disabled={submitting || draftStatus === 'saving'}
              onClick={handleSaveDraft}
              width="w-full"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
