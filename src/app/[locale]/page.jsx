"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';
import { MOCK_USERS } from "../../../constants/mockData";
import { usersOptions } from "../../../constants/index";
import Header from "@/components/Header";
import Copyright from "@/components/Copyright";
import Blobs from "@/components/Blobs";
import LoginForm from "@/components/LoginForm";
import BackButton from "@/components/shared/BackButton";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContinueOption from "@/components/ContinueOption";
import { useRouter, useParams } from "next/navigation";
import { createTypingAnimation } from "../../../utils";
import { MutatingDots } from 'react-loader-spinner';

export default function Home() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'en';
  const dispatch = useDispatch();

  // i18n helpers
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  const [showWelcome, setShowWelcome] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('welcomeShown');
    }
    return true;
  });
  const [animationState, setAnimationState] = useState(0);
  const [view, setView] = useState(showWelcome ? 'welcome' : 'options');
  const [selectedUserOption, setSelectedUserOption] = useState(null);
  const [isIconAnimating, setIsIconAnimating] = useState(false);
  const [clickedOptionId, setClickedOptionId] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const textContent = [
    { title: "", subtitle: "" }, // Initial state
    { title: safeT('home.welcomeTitle'), subtitle: "" },
    { title: safeT('home.appName'), subtitle: "" },
    { title: safeT('home.appName'), subtitle: safeT('home.slogan') }
  ];

  // Create typing animation variants
  const typingVariants = createTypingAnimation(textContent[1].title, {
    delay: 100,
    duration: 1
  });

  // Handle animation timing with explicit states for delay
  useEffect(() => {
    if (view !== 'welcome' || !showWelcome) return; // Only run for welcome animation

    if (animationState < textContent.length - 1) {
      const timer = setTimeout(() => {
        if (animationState === 2) {
          setTimeout(() => setAnimationState(3), 1000);
        } else {
          setAnimationState(prevState => prevState + 1);
        }
      }, animationState === 1 ? 2000 : 500);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowWelcome(false);
        sessionStorage.setItem('welcomeShown', 'true');
        setView('options'); // Transition to options view
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [animationState, view, showWelcome]);

  useEffect(() => {
    // If already logged in (persistent session), redirect to dashboard
    if (typeof window !== 'undefined') {
      const userSessionData = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
      if (userSessionData) {
        try {
          const user = JSON.parse(userSessionData);
          if (user && user.role) {
            router.push(`/${locale}/dashboard/${user.role}`);
            return;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }, []);

  const handleOptionClick = (userType) => {
    const userDetails = usersOptions.find(option => option.value === userType);
    if (userDetails) {
      setSelectedUserOption(userDetails);
      setClickedOptionId(userDetails.value);
      setIsIconAnimating(true);
      setIsTransitioning(true);

      // Show loader after fade out
      setTimeout(() => {
        setShowLoader(true);
        setView('login');

        // Hide loader and complete transition
        setTimeout(() => {
          setShowLoader(false);
          setIsTransitioning(false);
        }, 1600); // Reduced from 2000ms to 1400ms to decrease gap before login animations
      }, 300); // Increased from 150ms to 300ms for smoother fade out
    }
  };

  const handleBackToOptions = () => {
    setIsTransitioning(true);
    setIsLoggingIn(false); // Reset login state

    // Simple fade transition back (no loader)
    setTimeout(() => {
      setSelectedUserOption(null);
      setClickedOptionId(null);
      setIsIconAnimating(false);
      setView('options');
      setIsTransitioning(false);
    }, 250); // Increased from 150ms to 250ms for smoother back transition
  };

  const handleLogin = async (values) => {
    setIsLoggingIn(true);

    try {
      // if (!selectedUserOption) {
      //   // Should not happen if login form is visible, but good guard
      //   toast.error('User type not selected.', {
      //     position: 'top-right',
      //     autoClose: 4000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     theme: 'light',
      //   });
      //   return;
      // }

      let mockUser = null;
      const userType = selectedUserOption.value; // e.g., 'student', 'company'

      if (userType === 'student') {
        mockUser = MOCK_USERS.students.find(
          student => student.email === values.email && student.password === values.password
        );
      } else {
        // For other user types like 'company', 'faculty', 'scad'
        const potentialUser = MOCK_USERS[userType];
        if (potentialUser && potentialUser.email === values.email && potentialUser.password === values.password) {
          mockUser = potentialUser;
        }
      }

      if (!mockUser) {
        throw new Error('Invalid email or password');
      }

      const userSession = {
        ...mockUser, // Contains all user details from MOCK_USERS, including 'role'
        userType: userType, // Explicitly add/ensure userType for clarity in the session
        timestamp: new Date().toISOString()
      };

      if (values.remember) {
        localStorage.setItem('userSession', JSON.stringify(userSession));
      }
      sessionStorage.setItem('userSession', JSON.stringify(userSession));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: userSession
      });

      router.push(`/${locale}/dashboard/${userType}`);
    } catch (error) {
      setIsLoggingIn(false);
      throw error; // Re-throw so LoginForm can handle it
    }
  };

  // Add event listener for Enter key on login view
  useEffect(() => {
    const handleEnterKeyPress = (event) => {
      // Check if we're on the login view and Enter key is pressed
      if (view === 'login' && event.key === 'Enter' && !isLoggingIn && !showLoader) {
        // Prevent default behavior to avoid conflicts
        event.preventDefault();

        // Find the login form and trigger its submission
        const loginForm = document.querySelector('form');
        if (loginForm) {
          // Trigger form submission which will call handleLogin
          loginForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
      }
    };

    // Only add event listener when on login view
    if (view === 'login' && selectedUserOption && !showLoader) {
      document.addEventListener('keydown', handleEnterKeyPress);

      // Cleanup function to remove event listener
      return () => {
        document.removeEventListener('keydown', handleEnterKeyPress);
      };
    }
  }, [view, selectedUserOption, showLoader, isLoggingIn]); // Dependencies to re-run when these change

  const handleIconAnimationComplete = () => {
    setIsIconAnimating(false);
  };

  // Variants for GIF and blobs
  const gifVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1.2, opacity: 1, transition: { duration: 1, ease: "easeOut" } },
  };

  const blobVariants = {
    initial: { scale: 0.8, opacity: 0.3 },
    animate: {
      scale: [0.8, 1.05, 0.8], // Reduced scale range for subtler movement
      opacity: [0.3, 0.5, 0.3], // Reduced opacity range for softer effect
      rotate: [0, 2, 0], // Reduced rotation for calmer movement
      transition: {
        duration: 8, // Increased duration for slower animation
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.5, 1] // Added timing array for smoother transitions
      }
    },
  };

  // "Merge" animation for "InternHub" (scaling in)
  const mergeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.5 } },
  };

  // "Shift" animation for slogan (word-by-word drop)
  const shiftVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  // Simple fade and slide transition variants
  const simpleTransitionVariants = {
    initial: {
      opacity: 1,
      y: 0
    },
    fadeOut: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    final: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Reverse simple transition
  const reverseSimpleVariants = {
    initial: {
      opacity: 1,
      y: 0
    },
    fadeIn: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    final: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Clean Apple-style transition
  const appleTransitionVariants = {
    initial: {
      opacity: 1,
      scale: 1
    },
    exit: {
      opacity: 0,
      scale: 0.97,
      transition: {
        duration: 0.2,
        ease: [0.32, 0.72, 0, 1]
      }
    },
    enter: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.32, 0.72, 0, 1]
      }
    }
  };

  // Subtle hover effect
  const appleHoverAnimation = {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: [0.32, 0.72, 0, 1]
    }
  };

  // Simple fade transition
  const fadeTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } // Increased duration and smooth easing
  };

  return (
    <div className="min-h-screen flex flex-col kontainer relative overflow-hidden">
      <ToastContainer />
      <AnimatePresence mode="wait">
        {view === 'welcome' && showWelcome && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow flex items-center justify-center"
          >
            <div className="row">
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
                {/* Larger GIF with adjusted positioning */}
                <motion.div
                  className="w-60 h-60 relative -mt-12 rounded-full"
                  variants={gifVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Image
                    src="/images/world-creativity-and-innovation-day-transparent-one-count.gif"
                    alt="InternHub Logo"
                    fill
                    style={{ objectFit: "contain" }}
                    className="z-20"
                    priority
                  />
                </motion.div>

                <div className="h-16" />

                {/* Animated Title */}
                <div className="relative inline-block flex-col items-center" style={{ minHeight: '110px' }}>
                  <AnimatePresence mode="wait">
                    {animationState === 1 && (
                      <motion.div
                        className="text-6xl font-semibold font-young-serif text-[var(--metallica-blue-600)]"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.5 } }}
                      >
                        {textContent[1].title.split("").map((letter, index) => (
                          <motion.span
                            key={index}
                            custom={index}
                            variants={typingVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {letter}
                          </motion.span>
                        ))}
                      </motion.div>
                    )}
                    {animationState >= 2 && (
                      <motion.h1
                        className="text-6xl font-bold font-young-serif"
                        variants={mergeVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <span className="text-[#B0BEC5]">Intern</span>
                        <span className="text-[var(--metallica-blue-600)]">Hub</span>
                      </motion.h1>
                    )}
                  </AnimatePresence>

                  {/* Absolutely positioned subtitle */}
                  {animationState >= 3 && (
                    <motion.div
                      className="absolute top-full mt-2 text-md tracking-[.25em] text-[var(--metallica-blue-600)] text-center "
                      initial="hidden"
                      animate="visible"
                      variants={shiftVariants}
                      style={{ whiteSpace: 'nowrap', width: 'max-content' }}
                    >
                      {textContent[3].subtitle.split(" ").map((word, index, arr) => (
                        <motion.span
                          key={index}
                          custom={index}
                          variants={shiftVariants}
                          initial="hidden"
                          animate="visible"
                          className={index !== arr.length - 1 ? "inline-block mr-1" : "inline-block"}
                          transition={{ delay: 0.1 + index * 0.08, duration: 0.25 }}
                        >
                          {word}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'options' && !showWelcome && (
          <motion.div
            key="options"
            {...fadeTransition}
            className="flex-grow"
          >
            <div className="row h-full">
              <div className="main">
                <div className="flex flex-col items-center justify-center flex-grow">
                  {/* Header */}
                  <motion.div
                    animate={{ opacity: isTransitioning ? 0 : 1 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <Header
                      text={safeT('home.continueAs')}
                      className="continue-text"
                      isFullWidth={true}
                      size="1xl"
                    />
                  </motion.div>

                  {/* Continue Options */}
                  <div className="continue_options">
                    {usersOptions.map((option) => (
                      <motion.div
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        animate={isTransitioning ? {
                          opacity: 0,
                          scale: 0.95,
                          transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] }
                        } : {}}
                        style={{ transformOrigin: "center center" }}
                      >
                        <ContinueOption
                          name={safeT(`sidebar.${option.value}User`)}
                          imageUrl={option.imageUrl}
                          className={option.class}
                          width={option.dimension}
                          height={option.dimension}
                          onClick={() => handleOptionClick(option.value)}
                          layoutId={`user-icon-${option.value}`}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Motivational Text */}
                  <motion.div
                    animate={{ opacity: isTransitioning ? 0 : 1 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <div className="motivational-text font-ibm-plex-sans">
                      {safeT('home.tailoredExperience')}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {showLoader && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }} // Ultra-fast exit
            transition={{ duration: 0.35 }}
            className="flex-grow flex items-center justify-center"
          >
            <div className="flex flex-col items-center space-y-4">
              <MutatingDots
                height={120}
                width={120}
                color="#2A5F74"
                secondaryColor="#5DB2C7"
                radius={12}
                ariaLabel="mutating-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
              <p className="text-metallica-blue-950 font-semibold text-xl mt-4">{safeT('home.loading')}</p>
            </div>
          </motion.div>
        )}

        {view === 'login' && selectedUserOption && !showLoader && (
          <motion.div
            key="login"
            {...fadeTransition}
            className="flex-grow flex flex-col pt-12 md:pt-0"
          >
            <div className="flex-grow flex flex-col pt-12 md:pt-0">
              <div className="absolute top-5 left-5 z-50">
                <BackButton onClick={handleBackToOptions} />
              </div>
              <div className="flex-grow flex items-center justify-center py-8">
                <main className="w-full flex flex-col-reverse xl:flex-row items-center justify-center gap-4 xl:gap-16 px-4">
                  <div className="w-full xl:w-2/5 flex flex-col-reverse xl:flex-col items-center">
                    <motion.div
                      className="w-full max-w-[430px] px-4 z-[1000]"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <Blobs
                        imageUrl={selectedUserOption.imageUrl}
                        bgColor={selectedUserOption.bgColor}
                        iconLayoutId={`user-icon-${selectedUserOption.value}`}
                        animateKute={false}
                        onIconAnimationComplete={handleIconAnimationComplete}
                      />
                    </motion.div>
                    <motion.div
                      className="text-center mt-0 mb-16 xl:mb-0 xl:mt-8"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }}
                    >
                      {selectedUserOption.value === 'company' && (
                        <span className="text-black font-medium font-ibm-plex-sans">
                          {safeT('home.notRegistered')}{' '}
                          <Link href={`/${locale}/auth/signup?userType=${selectedUserOption.value}`} className="text-metallica-blue-off-charts underline">
                            {safeT('home.signUp')}
                          </Link>
                        </span>
                      )}
                    </motion.div>
                  </div>

                  <motion.div
                    className="w-full xl:w-2/5 flex flex-col items-center mb-4 xl:mb-0"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <div className="w-full max-w-md">
                      <Header
                        text={safeT('home.login')}
                        className="mb-8"
                        size="text-6xl"
                      />
                      <LoginForm
                        userType={selectedUserOption.value}
                        onSubmit={handleLogin}
                        isLoggingIn={isLoggingIn}
                        key={selectedUserOption.value}
                      />
                    </div>
                  </motion.div>
                </main>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-auto">
        <Copyright />
      </footer>
    </div>
  );
}
