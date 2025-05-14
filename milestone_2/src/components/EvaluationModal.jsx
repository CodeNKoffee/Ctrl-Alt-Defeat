"use client";
import { useState, useEffect } from "react";
import { Save } from 'lucide-react';

export default function EvaluationModal({ isOpen, onClose, onSubmit, mockReviews = [], evaluationToEdit = null }) {
  const [form, setForm] = useState({
    supervisorName: "",
    supervisorEmail: "",
    tasks: "",
    environment: "",
    rating: 0,
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
      });
    } else {
      // Reset form when modal is opened for a new evaluation
      setForm({
        supervisorName: "",
        supervisorEmail: "",
        tasks: "",
        environment: "",
        rating: 0,
      });
    }
  }, [evaluationToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRating = (val) => setForm((prev) => ({ ...prev, rating: val }));

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
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative flex flex-col md:flex-row gap-8 border-2 border-[#2A5F74]">
        <button
          className="absolute top-4 right-4 text-[#2A5F74] hover:text-[#3298BA] text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        {/* Left: Rating & Reviews */}
        <div className="flex-1 min-w-[300px] flex flex-col justify-between">
          <div>
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
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-[#2A5F74]">Most liked comments</h3>
              <div className="space-y-3">
                {mockReviews.map((review, idx) => (
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
              </div>
            </div>
          </div>
        </div>
        {/* Right: Evaluation Form */}
        <form className="flex-1 min-w-[300px] z-50" onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold text-[#2A5F74] mb-4">
            {isEditMode ? "Edit Your Evaluation" : "Your Evaluation"}
          </h2>
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
          <div className="flex gap-2 mt-2 w-full">
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-[#4796a8] rounded-lg font-semibold hover:bg-[#2a5c67] transition text-sm border border-[#5DB2C7] shadow"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : isEditMode ? "Update Evaluation" : "Submit Evaluation"}
            </button>
            {!isEditMode && (
              <button
                type="button"
                className="flex-1 px-4 py-2 text-white bg-[#4796a8] rounded-lg font-semibold hover:bg-[#2a5c67] transition text-sm border border-[#5DB2C7] shadow"
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
                className="flex-1 px-4 py-2 text-white bg-[#3c5e66] rounded-lg font-semibold hover:bg-[#2a5c67] transition text-sm border border-[#5DB2C7] shadow"
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
