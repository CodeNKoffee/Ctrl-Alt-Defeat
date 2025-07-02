"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from 'react-redux';
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
import { useRouter } from "next/navigation";
import { createTypingAnimation } from "../../../utils";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

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

  const textContent = [
    { title: "", subtitle: "" },                             // Initial state
    { title: "Welcome to", subtitle: "" },                   // Typing "WELCOME TO"
    { title: "InternHub", subtitle: "" },                    // "InternHub" with merge
    { title: "InternHub", subtitle: "WHERE  EXPERIENCE  BEGINS" } // Slogan with shift
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

  const handleOptionClick = (userType) => {
    const userDetails = usersOptions.find(option => option.value === userType);
    if (userDetails) {
      setSelectedUserOption(userDetails);
      setClickedOptionId(userDetails.value);
      setIsIconAnimating(true);
      setIsTransitioning(true);

      // Start the 3D flip transition
      setTimeout(() => {
        setView('login');
        setIsTransitioning(false);
      }, 800); // Half of the total transition time
    }
  };

  const handleBackToOptions = () => {
    setIsTransitioning(true);

    // Start the reverse flip animation
    setTimeout(() => {
      setSelectedUserOption(null);
      setClickedOptionId(null);
      setIsIconAnimating(false);
      setView('options');
      setIsTransitioning(false);
    }, 800);
  };

  const handleLogin = async (values) => {
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

    router.push(`/en/dashboard/${userType}`);
  };

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

  // New 3D flip transition variants
  const flipTransitionVariants = {
    initial: {
      rotateY: 0,
      scale: 1,
      opacity: 1
    },
    flip: {
      rotateY: 90,
      scale: 0.8,
      opacity: 0.3,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    final: {
      rotateY: 180,
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    exit: {
      rotateY: 270,
      scale: 0.8,
      opacity: 0.3,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  // Reverse flip for going back (counter-clockwise rotation)
  const reverseFlipVariants = {
    initial: {
      rotateY: 180,
      scale: 1,
      opacity: 1
    },
    flip: {
      rotateY: 270, // Rotate counter-clockwise to 270° (opposite direction)
      scale: 0.8,
      opacity: 0.3,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    final: {
      rotateY: 360, // Complete counter-clockwise rotation to 360° (same as 0°)
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    exit: {
      rotateY: 450, // Continue counter-clockwise for exit
      scale: 0.8,
      opacity: 0.3,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col kontainer relative overflow-hidden">
      <ToastContainer />
      <AnimatePresence mode="popLayout">
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
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow"
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d"
            }}
          >
            <motion.div
              className="row h-full"
              variants={isTransitioning ? flipTransitionVariants : {}}
              initial="initial"
              animate={isTransitioning ? "flip" : "initial"}
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden"
              }}
            >
              <div className="main">
                <div className="flex flex-col items-center justify-center flex-grow">
                  {/* Header */}
                  <motion.div
                    exit={{ opacity: selectedUserOption ? 0 : 1, transition: { duration: 0.4 } }}
                  >
                    <Header
                      text="Continue As"
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
                        whileHover={{
                          scale: 1.05,
                          rotateY: 5,
                          transition: { duration: 0.2 }
                        }}
                        style={{
                          transformStyle: "preserve-3d",
                          perspective: "1000px"
                        }}
                      >
                        <ContinueOption
                          name={option.name}
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
                    exit={{ opacity: selectedUserOption ? 0 : 1, transition: { duration: 0.4 } }}
                  >
                    <div className="motivational-text font-ibm-plex-sans">
                      Tailored experience for every role.
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {view === 'login' && selectedUserOption && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow flex flex-col pt-12 md:pt-0"
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d"
            }}
          >
            <motion.div
              className="flex-grow flex flex-col pt-12 md:pt-0"
              variants={reverseFlipVariants}
              initial="initial"
              animate={isTransitioning ? "flip" : "final"}
              exit="exit"
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden"
              }}
            >
              <div className="absolute top-5 left-5 z-50">
                <BackButton onClick={handleBackToOptions} />
              </div>
              <div className="flex-grow flex items-center justify-center py-8">
                <main className="w-full flex flex-col-reverse xl:flex-row items-center justify-center gap-4 xl:gap-16 px-4">
                  <div className="w-full xl:w-2/5 flex flex-col-reverse xl:flex-col items-center">
                    <motion.div
                      className="w-full max-w-[430px] px-4 z-[1000]"
                      initial={{ opacity: 0, rotateY: -90 }}
                      animate={{
                        opacity: 1,
                        rotateY: 0,
                        transition: {
                          delay: isTransitioning ? 0.4 : 0.2,
                          duration: 0.6,
                          ease: "easeOut"
                        }
                      }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <Blobs
                        imageUrl={selectedUserOption.imageUrl}
                        bgColor={selectedUserOption.bgColor}
                        iconLayoutId={`user-icon-${selectedUserOption.value}`}
                        animateKute={!isIconAnimating && view === 'login'}
                        onIconAnimationComplete={handleIconAnimationComplete}
                      />
                    </motion.div>
                    <motion.div
                      className="text-center mt-0 mb-16 xl:mb-0 xl:mt-8"
                      initial={{ opacity: 0, y: 20, rotateY: -90 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        rotateY: 0,
                        transition: {
                          delay: isTransitioning ? 0.6 : 0.4,
                          duration: 0.5,
                          ease: "easeOut"
                        }
                      }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {selectedUserOption.value === 'company' && (
                        <span className="text-black font-medium font-ibm-plex-sans">
                          Not registered yet?{' '}
                          <Link href={`/en/auth/signup?userType=${selectedUserOption.value}`} className="text-metallica-blue-off-charts underline">
                            Sign up
                          </Link>
                        </span>
                      )}
                    </motion.div>
                  </div>

                  <motion.div
                    className="w-full xl:w-2/5 flex flex-col items-center mb-4 xl:mb-0"
                    initial={{ opacity: 0, x: 50, rotateY: 90 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      rotateY: 0,
                      transition: {
                        delay: isTransitioning ? 0.5 : 0.3,
                        duration: 0.5,
                        ease: "easeOut"
                      }
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="w-full max-w-md">
                      <Header
                        text="Login"
                        className="mb-8"
                        size="text-6xl"
                      />
                      <LoginForm
                        userType={selectedUserOption.value}
                        onSubmit={handleLogin}
                        key={selectedUserOption.value}
                      />
                    </div>
                  </motion.div>
                </main>
              </div>
            </motion.div>
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