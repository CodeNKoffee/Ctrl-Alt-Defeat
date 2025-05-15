"use client";
import { useState, useEffect } from "react";
import { Save } from 'lucide-react';

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

const ratingLabels = {
  1: "Unsatisfactory",
  2: "Below Average",
  3: "Satisfactory", 
  4: "Above Average",
  5: "Excellent"
};

export default function EvaluationModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  mockReviews = [], 
  evaluationToEdit = null,
  evaluationType = "student" // "student" or "company"
}) {
  const [form, setForm] = useState({
    supervisorName: "",
    supervisorEmail: "",
    tasks: "",
    environment: "",
    rating: 0,
    recommend: "yes",
    // Company evaluation attributes
    skillRatings: Object.fromEntries(skillAttributes.map(skill => [skill, 3])),
    otherComments: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const isEditMode = !!evaluationToEdit;

  // Pre-fill form when editing an existing evaluation
  useEffect(() => {
    if (evaluationToEdit) {
      setForm({
        supervisorName: evaluationToEdit.supervisorName || "",
        supervisorEmail: evaluationToEdit.supervisorEmail || "",
        tasks: evaluationToEdit.tasks || "",
        environment: evaluationToEdit.environment || "",
        rating: evaluationToEdit.rating || 0,
        recommend: evaluationToEdit.recommend || "yes",
        skillRatings: evaluationToEdit.skillRatings || Object.fromEntries(skillAttributes.map(skill => [skill, 3])),
        otherComments: evaluationToEdit.otherComments || ""
      });
    } else {
      // Reset form when modal is opened for a new evaluation
      setForm({
        supervisorName: "",
        supervisorEmail: "",
        tasks: "",
        environment: "",
        rating: 0,
        recommend: "yes",
        skillRatings: Object.fromEntries(skillAttributes.map(skill => [skill, 3])),
        otherComments: ""
      });
    }
  }, [evaluationToEdit, isOpen]);

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
      
    onSubmit(submitData, isEditMode);
    
    setTimeout(() => {
      setSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(21,43,55,0.55)]">
      <div className={`bg-white rounded-2xl shadow-2xl ${evaluationType === "company" ? "max-w-4xl" : "max-w-3xl"} w-full p-8 relative flex flex-col md:flex-row gap-8 border-2 border-[#2A5F74]`}>
        <button
          className="absolute top-4 right-4 text-[#2A5F74] hover:text-[#3298BA] text-2xl font-bold"
          onClick={onClose}
        >
          &times;
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
                  <span className="text-[#4C798B] text-sm">Your rating</span>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#2A5F74] mb-2">
                    Do you recommend this internship to other students?
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
                      <span className="ml-2 text-[#2A5F74]">Yes</span>
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
                      <span className="ml-2 text-[#2A5F74]">No</span>
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-[#2A5F74] mb-4 text-center">
                  Skills & Professional Attributes
                </h2>
                <div className="overflow-auto max-h-[500px] pr-2">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-2 text-[#2A5F74]">Skills</th>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <th key={rating} className="text-center p-2 w-12 text-[#2A5F74]">{rating}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {skillAttributes.map((skill) => (
                        <tr key={skill} className="border-b border-[#D9F0F4]">
                          <td className="py-3 px-2 text-[#2A5F74]">{skill}</td>
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <td key={rating} className="text-center">
                              <label className="cursor-pointer inline-block w-full h-full">
                                <input
                                  type="radio"
                                  name={`skill-${skill}`}
                                  value={rating}
                                  checked={form.skillRatings[skill] === rating}
                                  onChange={() => handleSkillRating(skill, rating)}
                                  className="sr-only"
                                />
                                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center transition-all duration-200 ${form.skillRatings[skill] === rating 
                                  ? 'bg-[#3298BA] text-white scale-110' 
                                  : 'bg-[#E2F4F7] text-[#2A5F74] hover:bg-[#D9F0F4]'}`}>
                                  {rating}
                                </div>
                              </label>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="flex justify-between mt-4 px-2 text-xs text-[#2A5F74]">
                    <span>1: Unsatisfactory</span>
                    <span>2: Below Average</span>
                    <span>3: Satisfactory</span>
                    <span>4: Above Average</span>
                    <span>5: Excellent</span>
                  </div>
                </div>
              </>
            )}
            
            {evaluationType === "student" && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-[#2A5F74]">Most liked comments</h3>
                <div className="space-y-3">
                  {mockReviews.length > 0 && mockReviews.map((review, idx) => (
                    <div key={idx} className="bg-[#F8FAFB] rounded-lg p-3 border border-[#D9F0F4] flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#2A5F74]">{review.user}</span>
                        <span className="text-[#FFD600]">{'★'.repeat(review.rating)}</span>
                        <span className="text-xs text-[#4C798B] ml-2">{review.date}</span>
                      </div>
                      <div className="text-[#4C798B] text-sm mb-1">{review.comment}</div>
                      <div className="text-xs text-[#3298BA] font-semibold">👍 {review.likes} Liked</div>
                    </div>
                  ))}
                  {mockReviews.length === 0 && (
                    <div className="text-center py-4 text-[#4C798B]">
                      No reviews available
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Evaluation Form */}
        <form className="flex-1 min-w-[300px] z-50" onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold text-[#2A5F74] mb-4">
            {isEditMode ? "Edit Your Evaluation" : "Your Evaluation"}
          </h2>
          
          {evaluationType === "student" ? (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium text-[#2A5F74] mb-1">Company Supervisor Name</label>
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
                <label className="block text-sm font-medium text-[#2A5F74] mb-1">Company Supervisor Email</label>
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
                <label className="block text-sm font-medium text-[#2A5F74] mb-1">What tasks have you done?</label>
                <textarea
                  name="tasks"
                  value={form.tasks}
                  onChange={handleChange}
                  className="w-full border border-[#D9F0F4] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3298BA] bg-[#F8FAFB] text-[#2A5F74]"
                  rows={2}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-[#2A5F74] mb-1">How was the work environment?</label>
                <textarea
                  name="environment"
                  value={form.environment}
                  onChange={handleChange}
                  className="w-full border border-[#D9F0F4] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3298BA] bg-[#F8FAFB] text-[#2A5F74]"
                  rows={2}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#2A5F74] mb-2">Other Comments</label>
                <textarea
                  name="otherComments"
                  value={form.otherComments}
                  onChange={handleChange}
                  placeholder="Add any additional feedback about the intern's performance..."
                  className="w-full border border-[#D9F0F4] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3298BA] bg-[#F8FAFB] text-[#2A5F74]"
                  rows={6}
                />
                <p className="mt-2 text-xs text-[#4C798B]">
                  Please provide any additional comments about the intern's strengths, areas for improvement, 
                  or overall performance not covered in the skills assessment.
                </p>
              </div>
            </>
          )}
       
          <div className="flex gap-2 mt-2 w-full">
            <button
              type="submit"
              className="flex-1 px-4 py-2 mt-9 text-white bg-[#4796a8] rounded-lg font-semibold hover:bg-[#2a5c67] transition text-sm border border-[#5DB2C7] shadow"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : isEditMode ? "Save Changes" : "Submit Evaluation"}
            </button>
            {!isEditMode && (
              <button
                type="button"
                className="flex-1 px-4 py-2 text-[#5DB2C7] bg-metallica-blue-100 rounded-lg font-semibold mt-9 hover:bg-metallica-blue-300 hover:text-metallica-blue-50 transition text-sm border border-[#5DB2C7] shadow"
                disabled={submitting}
                onClick={() => {
                  onSubmit({ ...form, draft: true });
                  onClose();
                }}
              >
                Save as Draft
              </button>
            )}
            {isEditMode && (
              <button
                type="button"
                className="flex-1 px-4 py-2 mt-9 bg-red-200 text-red-800 border border-red-800 rounded-lg hover:bg-red-300 transition-colors"
                disabled={submitting}
                onClick={onClose}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
