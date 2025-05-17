"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faDownload } from '@fortawesome/free-solid-svg-icons';
import CustomButton from "./shared/CustomButton";

export default function WorkshopFeedback({ isOpen, onClose, onSubmit, workshop }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setRating(0);
      setFeedback("");
      setSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Call the onSubmit prop passed from the parent
    // The parent will handle closing this modal and opening the certificate modal
    onSubmit({
      workshopId: workshop?.id,
      rating,
      feedback
    });
    setSubmitting(false);
    // Removed setShowCertificateMessage(true);
    // Removed onClose(); // Parent handles closing
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(21,43,55,0.55)]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          className="absolute top-3 right-3 z-20 flex items-center justify-center w-10 h-10 rounded-full shadow-sm bg-gray-100 hover:bg-gray-200/90 transition-colors"
          onClick={onClose} // Keep this to allow closing via X button
          aria-label="Close Feedback Modal"
        >
          <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
        </button>

        {/* Removed conditional rendering for showCertificateMessage */}
        {/* Always show feedback form when modal is open */}
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-[#2a5f74] mb-6 text-center">Workshop Feedback</h2>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[#2a5f74] mb-3 text-center">How would you rate this workshop?</h3>
            <div className="flex justify-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-all transform hover:scale-110"
                >
                  <svg
                    className={`w-10 h-10 ${rating >= star ? "text-[#FFD600]" : "text-[#D9F0F4]"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <textarea
              className="w-full p-4 border-2 border-[#D9F0F4] rounded-lg focus:ring-2 focus:ring-[#3298BA] focus:outline-none resize-none"
              rows="6"
              placeholder="Share your thoughts about the workshop..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
          </div>
          <div className="flex gap-4">
            <CustomButton
              type="submit"
              variant="primary"
              text="Submit Feedback"
              isLoading={submitting}
              loadingText="Submitting..."
              disabled={rating === 0}
              width="w-full"
              showIconOnLoading={false}
            />
          </div>
        </form>
      </div>
    </div>
  );
}