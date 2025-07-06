import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faShare } from '@fortawesome/free-solid-svg-icons';// Correct import path
import CustomButton from "../components/shared/CustomButton";
import { toast } from 'react-toastify';
const likertOptions = [
  { id: 1, text: 'Strongly Disagree', color: 'border-[#FCA5A5] bg-[#FEE2E2]', selected: 'border-[#EF4444] bg-[#FCA5A5]/40' },
  { id: 2, text: 'Disagree', color: 'border-[#FDE68A] bg-[#FEF9C3]', selected: 'border-[#FBBF24] bg-[#FDE68A]/40' },
  { id: 3, text: 'Neutral', color: 'border-gray-300 bg-gray-100', selected: 'border-gray-400 bg-gray-200' },
  { id: 4, text: 'Agree', color: 'border-[#6EE7B7] bg-[#D1FAE5]', selected: 'border-[#34D399] bg-[#6EE7B7]/40' },
  { id: 5, text: 'Strongly Agree', color: 'border-[#5EEAD4] bg-[#CCFBF1]', selected: 'border-[#14B8A6] bg-[#5EEAD4]/40' },
];

const AssessmentSidebar = ({ assessment, onClose }) => {
  const [answers, setAnswers] = useState([]);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [finalMockScore, setFinalMockScore] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isScoreAnimationDone, setIsScoreAnimationDone] = useState(false);

  const [postFeedback, setPostFeedback] = useState(null);
  const [sharing, setSharing] = useState(null);

  useEffect(() => {
    if (assessment) {
      setAnswers(new Array(assessment?.questions.length).fill(null));
      setTestStarted(false);
      setTestCompleted(false);
      setSharing(null);
    }
  }, [assessment]);

  const handleAnswerChange = (questionIndex, answerId) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = answerId;
    setAnswers(updatedAnswers);
  };

  const calculateProgress = () => {
    const answeredCount = answers.filter(answer => answer !== null).length;
    return (answeredCount / answers.length) * 100;
  };

  const handleSubmitTest = () => {
    setTestCompleted(true);
    try {
      const calculatedScore = Math.floor(Math.random() * 31) + 70; // Example: score between 70 and 100
      setFinalMockScore(calculatedScore); // Set the target score for animation
      setAnimatedScore(0); // Reset animated score before starting
      setIsScoreAnimationDone(false); // Reset animation done flag

      // console.log('Form values:', values); // Assuming 'values' is not defined here or part of a larger context

      // Show success toast notification with score
      toast.info(`Your test score is ${calculatedScore}%. Please check your email for detailed results.`, {
        position: 'top-right',
        autoClose: 7000, // Increased duration for better readability
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Error submitting test', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      // If there's an error, we might not want to show the score animation screen,
      // or handle it differently. For now, it will still go to testCompleted view.
    } finally {
      // setSubmitting(false); // Assuming 'setSubmitting' is not defined here or handled elsewhere
    }
  };

  const handlePostToProfile = () => {
    setPostFeedback('success');
    setTimeout(() => {
      setPostFeedback(null);
    }, 1500);
  };

  const handleSharingDecision = (decision) => {
    setSharing(decision);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  // useEffect for score animation
  useEffect(() => {
    if (testCompleted && finalMockScore !== null) {
      if (animatedScore < finalMockScore) {
        const timer = setTimeout(() => {
          setAnimatedScore(prevScore => Math.min(prevScore + 1, finalMockScore));
        }, 20); // Adjust timing for animation speed
        return () => clearTimeout(timer);
      } else {
        setIsScoreAnimationDone(true);
      }
    }
  }, [testCompleted, finalMockScore, animatedScore]);

  return (
    <>
      {/* Semi-transparent overlay behind sidebar */}
      {assessment && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-20 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      <div className={`fixed top-0 right-0 h-full w-1/3 z-50 transition-all duration-300 ease-in-out transform ${assessment ? 'translate-x-0' : 'translate-x-full'}`}>
        {assessment && !testStarted && !testCompleted && (
          <div className="bg-white border-l-2 border-[#5DB2C7] h-full flex flex-col shadow-lg relative">
            <div className="flex justify-end sticky top-0 bg-white z-10 p-2">
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            <div className="overflow-y-auto flex-1 px-0">
              <div className="flex flex-col items-center">
                <div className="w-full px-6 pt-6 pb-2">
                  <img
                    src={assessment.imageUrl}
                    alt={assessment.title}
                    className="w-full h-56 object-cover rounded-md shadow"
                    style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                  />
                </div>
                <div className="px-6 w-full flex flex-col items-start">
                  <h2 className="text-2xl font-bold text-[#3298BA] mb-4 text-left w-full">{assessment.title}</h2>
                  <p className="text-gray-700 mb-4">{assessment.description}</p>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Why take the test?</h3>
                  <p className="text-gray-700 mb-4">{assessment.whyTakeIt}</p>
                  <p className="text-gray-700 mb-4">{assessment.resultExplanation}</p>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 left-0 w-full bg-white px-6 pb-6 pt-3 border-t border-gray-100 z-20">
              <CustomButton
                onClick={() => setTestStarted(true)}
                variant="primary"
                text="Take the Test"
                width="w-full"
              />
            </div>
          </div>
        )}

        {assessment && testStarted && !testCompleted && (
          <div className="bg-white border-l-2 border-[#5DB2C7] h-full flex flex-col shadow-lg relative overflow-y-auto">
            <div className="flex justify-end sticky top-0 bg-white z-10 p-2">
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            {/* Make progress bar sticky */}
            <div className="sticky top-0 z-10 bg-white px-6 pt-2 pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-[#3298BA] mb-2">{assessment.title}</h2>
              <div className="h-2 bg-gray-300 rounded-full mb-2">
                <div
                  className="h-full bg-[#3298BA] rounded-full"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
            </div>
            <div className="p-6 pt-4">
              <div className="space-y-6">
                {assessment.questions.map((question, index) => (
                  <div key={index} className="flex flex-col items-center mb-8">
                    <p className="text-center text-base font-medium text-gray-800 mb-2">{question.question}</p>
                    <div className="flex justify-center gap-8 mt-2">
                      {likertOptions.map(option => (
                        <div key={option.id} className="flex flex-col items-center">
                          <motion.div
                            whileTap={{ scale: 0.9 }}  // Apply shrinking effect when clicked
                            whileHover={{
                              scale: 1.1, // Slight scaling effect on hover
                              borderWidth: '3px', // Match border thickness on hover
                              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)' // Add a subtle shadow to match the selected state on hover
                            }}
                            animate={answers[index] === option.id ? { scale: 1.15, borderWidth: '3px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)' } : { scale: 1 }}
                            transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                            onClick={() => handleAnswerChange(index, option.id)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                            ${answers[index] === option.id
                                ? option.selected + ' border-[3px] shadow-md'
                                : option.color + ' border'}
                            cursor-pointer transition-all duration-100 ease-in-out // Faster transition
                          `}
                          />
                          <span className="text-[10px] text-gray-600 text-center w-16">{option.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleSubmitTest}
                className="w-full mt-6 bg-[#3298BA] text-white py-2 px-4 rounded-full hover:bg-[#267a8c] transition-colors duration-200"
              >
                Submit Test
              </button>
            </div>
          </div>
        )}

        {testCompleted && (
          <div className="bg-white border-l-2 border-[#5DB2C7] h-full flex flex-col shadow-lg relative">
            <div className="flex justify-end sticky top-0 bg-white z-10 p-2">
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 text-center">
              <div className="bg-white rounded-xl shadow p-8 w-full max-w-md flex flex-col items-center">
                <div className="bg-green-50 rounded-full flex items-center justify-center mb-6" style={{ width: 72, height: 72 }}>
                  <FontAwesomeIcon icon={faCheck} className="text-green-500 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Test Completed!</h3>

                <p className="text-gray-700 text-xl mb-2">Your Score:</p>
                <p className="text-5xl font-bold text-[#3298BA] mb-6">
                  {animatedScore}%
                </p>

                {isScoreAnimationDone && (
                  <>
                    <p className="text-gray-600 text-sm mb-4">
                      Detailed results have been sent to your email.
                    </p>
                    <div className="mb-4">
                      <p className="text-base font-medium text-gray-800 mb-2">Would you like to share your score?</p>
                      <div className="flex gap-4 justify-center">
                        <CustomButton
                          onClick={handlePostToProfile}
                          variant="primary"
                          text="Yes, post it"
                          icon={faShare}
                          width="w-40"
                        />
                        <CustomButton
                          onClick={() => onClose()}
                          variant="secondary"
                          text="No, thanks"
                          width="w-40"
                        />
                      </div>
                    </div>
                    {postFeedback === 'success' && (
                      <div className="text-green-600 font-medium mt-2">Score posted to your profile!</div>
                    )}
                  </>
                )}

                {/* The original sharing prompt is removed as per the request to replace it. */}
                {/* If sharing is still needed, it can be added here, perhaps after isScoreAnimationDone is true. */}

              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AssessmentSidebar;