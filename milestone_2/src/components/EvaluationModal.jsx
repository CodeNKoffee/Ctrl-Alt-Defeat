"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import CustomButton from "./shared/CustomButton";
import { useTranslation } from 'react-i18next';
import { createSafeT } from '../lib/translationUtils';

// Skill attribute keys for mapping to translations
const skillAttributeKeys = [
  "adaptToChange",
  "analyticalSkills",
  "dataCollection",
  "creativity",
  "followUp",
  "interpersonal",
  "problemSolving",
  "punctuality",
  "reporting",
  "responsibility",
  "stressHandling",
  "takingInitiatives",
  "teamwork",
  "timeManagement"
];

// Rating value keys for mapping to translations
const ratingLabelKeys = {
  1: "unsatisfactory",
  2: "belowAverage",
  3: "satisfactory",
  4: "aboveAverage",
  5: "excellent"
};

export default function EvaluationModal({
  isOpen,
  onClose,
  onSubmit,
  mockReviews = [],
  evaluationToEdit = null,
  evaluationType = "student" // "student" or "company"
}) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  // Get translated skill attributes
  const getSkillAttributes = () => skillAttributeKeys.map(key => safeT(`company.evaluation.skillAttributes.${key}`));

  // Get translated rating labels
  const getRatingLabels = () => ({
    1: safeT(`company.evaluation.ratingLabels.${ratingLabelKeys[1]}`),
    2: safeT(`company.evaluation.ratingLabels.${ratingLabelKeys[2]}`),
    3: safeT(`company.evaluation.ratingLabels.${ratingLabelKeys[3]}`),
    4: safeT(`company.evaluation.ratingLabels.${ratingLabelKeys[4]}`),
    5: safeT(`company.evaluation.ratingLabels.${ratingLabelKeys[5]}`)
  });
  const [form, setForm] = useState({
    supervisorName: "",
    supervisorEmail: "",
    tasks: "",
    environment: "",
    rating: 0,
    recommend: "yes",
    // Company evaluation attributes
    skillRatings: Object.fromEntries(getSkillAttributes().map(skill => [skill, 3])),
    otherComments: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [draftStatus, setDraftStatus] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [feedbackType, setFeedbackType] = useState(''); // 'submit' or 'draft'
  const isEditMode = !!evaluationToEdit;
  const [initialFormState, setInitialFormState] = useState({});

  // Pre-fill form when editing an existing evaluation and store initial state
  useEffect(() => {
    const newInitialState = {
      supervisorName: evaluationToEdit?.supervisorName || "",
      supervisorEmail: evaluationToEdit?.supervisorEmail || "",
      tasks: evaluationToEdit?.tasks || "",
      environment: evaluationToEdit?.environment || "",
      rating: evaluationToEdit?.rating || 0,
      recommend: evaluationToEdit?.recommend || "yes",
      skillRatings: evaluationToEdit?.skillRatings || Object.fromEntries(getSkillAttributes().map(skill => [skill, 3])),
      otherComments: evaluationToEdit?.otherComments || ""
    };
    if (evaluationToEdit) {
      setForm(newInitialState);
      setInitialFormState(newInitialState);
    } else {
      // Reset form for new evaluation
      const defaultState = {
        supervisorName: "",
        supervisorEmail: "",
        tasks: "",
        environment: "",
        rating: 0,
        recommend: "yes",
        skillRatings: Object.fromEntries(getSkillAttributes().map(skill => [skill, 3])),
        otherComments: ""
      };
      setForm(defaultState);
      setInitialFormState(defaultState); // Also set initial state for new form for consistency
    }
  }, [evaluationToEdit, isOpen]);

  // Check if form is dirty (only in edit mode)
  const isFormDirty = () => {
    if (!isEditMode) return false; // Not applicable if not editing
    return JSON.stringify(form) !== JSON.stringify(initialFormState);
  };

  // Basic form validity check (customize as needed)
  const isFormValid = () => {
    if (evaluationType === "student") {
      return (
        form.supervisorName.trim() !== "" &&
        form.supervisorEmail.trim() !== "" &&
        form.tasks.trim() !== "" &&
        form.environment.trim() !== "" &&
        form.rating > 0
      );
    } else if (evaluationType === "company") {
      // For company, all skill ratings are implicitly valid as they default to 3.
      // Add other checks if there are specific required fields for company evals.
      return true;
    }
    return false;
  };

  // Validity for saving as draft (can be less strict)
  const isFormForDraftValid = () => {
    // Example: only require supervisor name for student draft
    if (evaluationType === "student") {
      return form.supervisorName.trim() !== "";
    }
    // For company, perhaps allow saving draft anytime
    return true;
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRating = (val) => setForm((prev) => ({ ...prev, rating: val }));

  const handleSkillRating = (skill, value) => {
    setForm(prev => ({
      ...prev,
      skillRatings: {
        ...prev.skillRatings,
        [skill]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Pass the original evaluation ID when in edit mode
    const submitData = isEditMode
      ? { ...form, id: evaluationToEdit.id }
      : form;

    // Show success feedback
    setFeedback('success');
    setFeedbackType(isEditMode ? 'update' : 'submit');

    setTimeout(() => {
      onSubmit(submitData, isEditMode);
      setSubmitting(false);
      setFeedback(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(21,43,55,0.55)]">
      {/* Feedback success modal */}
      <AnimatePresence>
        {feedback && (
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
                style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: feedbackType === 'submit' ? '#22C55E' : '#318FA8',
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
                {feedbackType === 'submit' ? safeT('company.evaluation.feedback.success') : safeT('company.evaluation.feedback.updated')}
              </div>
              <div style={{ color: '#333', textAlign: 'center' }}>
                {feedbackType === 'submit'
                  ? safeT('company.evaluation.feedback.submittedSuccess')
                  : feedbackType === 'update'
                    ? safeT('company.evaluation.feedback.updatedSuccess')
                    : safeT('company.evaluation.feedback.draftSaved')
                }
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`bg-white rounded-2xl shadow-2xl ${evaluationType === "company" ? "max-w-4xl" : "max-w-3xl"} w-full p-8 relative flex flex-col md:flex-row gap-8`}>
        <button
          className="absolute top-3 right-3 z-20 flex items-center justify-center w-8 h-8 rounded-full shadow-sm bg-gray-100 hover:bg-gray-200/90 transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FontAwesomeIcon icon={faTimes} className="text-xl text-gray-500 font-normal" />
        </button>

        {/* Left: Rating & Reviews for student evaluation OR Skills Rating for company evaluation */}
        <div className={`${evaluationType === "company" ? "flex-1" : "flex-1 min-w-[300px]"} flex flex-col justify-between`}>
          <div>
            {evaluationType === "student" ? (
              <>
                <div className="flex flex-col items-center mb-4">
                  <span className="text-5xl font-bold text-[#2A5F74]">{form.rating ? form.rating.toFixed(2) : "-"}</span>
                  <div className="flex items-center mt-2 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRating(star)}
                        className="focus:outline-none"
                      >
                        <svg
                          className={`w-8 h-8 ${form.rating >= star ? "text-[#FFD600]" : "text-[#D9F0F4]"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <span className="text-[#4C798B] text-sm">{safeT('company.evaluation.labels.yourRating')}</span>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#2A5F74] mb-2">
                    {safeT('company.evaluation.labels.recommend')}
                  </label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="recommend"
                        value="yes"
                        checked={form.recommend === "yes"}
                        onChange={handleChange}
                        className="h-4 w-4 accent-[#3298BA] border-[#3298BA] focus:ring-2 focus:ring-[#3298BA] focus:ring-opacity-25"
                        required
                      />
                      <span className="ml-2 text-[#2A5F74]">{safeT('company.evaluation.labels.yes')}</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="recommend"
                        value="no"
                        checked={form.recommend === "no"}
                        onChange={handleChange}
                        className="h-4 w-4 accent-[#3298BA] border-[#3298BA] focus:ring-2 focus:ring-[#3298BA] focus:ring-opacity-25"
                        required
                      />
                      <span className="ml-2 text-[#2A5F74]">{safeT('company.evaluation.labels.no')}</span>
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-[#2A5F74] mb-6 text-center">
                  {safeT('company.evaluation.tabs.skillsAndProfessional')}
                </h2>
                <div className="mt-6 p-4 bg-[#F8FAFB] rounded-lg border border-[#D9F0F4] text-xs text-center">
                  <p className="text-[#2A5F74] font-medium mb-2">{safeT('company.evaluation.labels.ratingScale')}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#4C798B]">1: {safeT('company.evaluation.ratingLabels.unsatisfactory')}</span>
                    <span className="text-[#4C798B]">2: {safeT('company.evaluation.ratingLabels.belowAverage')}</span>
                    <span className="text-[#4C798B]">3: {safeT('company.evaluation.ratingLabels.satisfactory')}</span>
                    <span className="text-[#4C798B]">4: {safeT('company.evaluation.ratingLabels.aboveAverage')}</span>
                    <span className="text-[#4C798B]">5: {safeT('company.evaluation.ratingLabels.excellent')}</span>
                  </div>
                </div>
                <div className="overflow-auto max-h-[500px] pr-2">
                  <div className="space-y-6">
                    {getSkillAttributes().map((skill) => (
                      <div key={skill} className="bg-white rounded-lg p-4 shadow-sm border border-[#E2F4F7]">
                        <div className="mb-3">
                          <h3 className="text-md font-semibold text-[#2A5F74]">{skill}</h3>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs font-medium text-[#4C798B] w-28">{safeT('company.evaluation.ratingLabels.unsatisfactory')}</span>
                          <div className="flex-1 flex justify-between items-center mx-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <label key={rating} className="cursor-pointer">
                                <input
                                  type="radio"
                                  name={`skill-${skill}`}
                                  value={rating}
                                  checked={form.skillRatings[skill] === rating}
                                  onChange={() => handleSkillRating(skill, rating)}
                                  className="sr-only"
                                />
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 
                                  ${form.skillRatings[skill] === rating
                                    ? 'bg-[#318FA8] font-bold text-white scale-110 shadow-md border-2 border-[#318FA8]'
                                    : 'border-[#3298BA] border-2 text-[#3298BA] hover:bg-[#E2F4F7] hover:text-[#2A5F74] hover:border-[#2A5F74]'}`}>
                                  {rating}
                                </div>
                              </label>
                            ))}
                          </div>
                          <span className="text-xs font-medium text-[#4C798B] w-28 text-right">{safeT('company.evaluation.ratingLabels.excellent')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {evaluationType === "student" && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-[#2A5F74]">{safeT('company.evaluation.labels.mostLikedComments')}</h3>
                <div className="space-y-3">
                  {mockReviews.length > 0 && mockReviews.map((review, idx) => (
                    <div key={idx} className="bg-[#F8FAFB] rounded-lg p-3 border border-[#D9F0F4] flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#2A5F74]">{review.user}</span>
                        <span className="text-[#FFD600]">{'★'.repeat(review.rating)}</span>
                        <span className="text-xs text-[#4C798B] ml-2">{review.date}</span>
                      </div>
                      <div className="text-[#4C798B] text-sm mb-1">{review.comment}</div>
                      <div className="text-xs text-[#3298BA] font-semibold">👍 {review.likes} {safeT('company.evaluation.labels.liked')}</div>
                    </div>
                  ))}
                  {mockReviews.length === 0 && (
                    <div className="text-center py-4 text-[#4C798B]">
                      {safeT('company.evaluation.labels.noReviews')}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Evaluation Form */}
        <form className="flex-1 min-w-[300px] z-50 flex flex-col" onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold text-[#2A5F74] mb-4">
            {isEditMode ? safeT('company.evaluation.labels.editEvaluation') : safeT('company.evaluation.labels.yourEvaluation')}
          </h2>

          {/* Wrapper for form fields to allow buttons to be pushed to the bottom */}
          <div className="flex-grow">
            {evaluationType === "student" ? (
              <>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-[#2A5F74] mb-1">{safeT('company.evaluation.labels.supervisorName')}</label>
                  <input
                    type="text"
                    name="supervisorName"
                    value={form.supervisorName}
                    onChange={handleChange}
                    className="w-full border border-[#D9F0F4] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3298BA] bg-[#F8FAFB] text-[#2A5F74]"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-[#2A5F74] mb-1">{safeT('company.evaluation.labels.supervisorEmail')}</label>
                  <input
                    type="email"
                    name="supervisorEmail"
                    value={form.supervisorEmail}
                    onChange={handleChange}
                    className="w-full border border-[#D9F0F4] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3298BA] bg-[#F8FAFB] text-[#2A5F74]"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-[#2A5F74] mb-1">{safeT('company.evaluation.labels.tasks')}</label>
                  <textarea
                    name="tasks"
                    value={form.tasks}
                    onChange={handleChange}
                    placeholder={safeT('company.evaluation.placeholders.tasks')}
                    className="w-full border border-[#D9F0F4] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3298BA] bg-[#F8FAFB] text-[#2A5F74]"
                    rows={2}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-[#2A5F74] mb-1">{safeT('company.evaluation.labels.environment')}</label>
                  <textarea
                    name="environment"
                    value={form.environment}
                    onChange={handleChange}
                    placeholder={safeT('company.evaluation.placeholders.environment')}
                    className="w-full border border-[#D9F0F4] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3298BA] bg-[#F8FAFB] text-[#2A5F74]"
                    rows={2}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#2A5F74] mb-2">{safeT('company.evaluation.labels.otherComments')}</label>
                  <textarea
                    name="otherComments"
                    value={form.otherComments}
                    onChange={handleChange}
                    placeholder={safeT('company.evaluation.placeholders.otherComments')}
                    className="w-full border border-[#D9F0F4] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3298BA] bg-[#F8FAFB] text-[#2A5F74]"
                    rows={6}
                  />
                  <p className="mt-2 text-xs text-[#4C798B]">
                    {safeT('company.evaluation.helpText.otherCommentsHelp')}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-4 w-full mt-auto pt-6">
            <CustomButton
              type="submit"
              variant="primary"
              text={safeT("company.evaluation.buttons.submitEvaluation")}
              isLoading={submitting}
              loadingText={safeT("company.evaluation.buttons.submitting")}
              disabled={submitting || (isEditMode && !isFormDirty()) || !isFormValid()}
              fullWidth
            />
            {!isEditMode && (
              <CustomButton
                variant="secondary"
                text={draftStatus === 'saved' ? '✓ Saved!' : safeT('company.evaluation.buttons.saveAsDraft')}
                onClick={async () => {
                  setDraftStatus('saving');
                  await new Promise(res => setTimeout(res, 800));

                  // Show success feedback
                  setFeedback('success');
                  setFeedbackType('draft');
                  setDraftStatus('');

                  setTimeout(() => {
                    onSubmit({ ...form, draft: true }, false);
                    setFeedback(null);
                    onClose();
                  }, 1500);
                }}
                isLoading={draftStatus === 'saving'}
                loadingText={safeT("company.evaluation.buttons.saving")}
                disabled={submitting}
              />
            )}
            {isEditMode && (
              <CustomButton
                variant="secondary"
                text={safeT('company.evaluation.buttons.saveChanges')}
                onClick={() => {
                  if (isFormDirty()) {
                    // Show feedback for saving changes
                    setFeedback('success');
                    setFeedbackType('update');

                    setTimeout(() => {
                      onSubmit({ ...form, id: evaluationToEdit.id }, true);
                      setFeedback(null);
                      onClose();
                    }, 1500);
                  } else {
                    onClose();
                  }
                }}
                disabled={submitting || !isFormDirty()}
                fullWidth
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
