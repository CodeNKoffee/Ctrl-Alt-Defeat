"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ContinueOption from "@/components/ContinueOption";
import { usersOptions } from "../../../constants/index";
import Header from "@/components/Header";
import Copyright from "@/components/Copyright";
import { useRouter } from "next/navigation";
import { createTypingAnimation } from "../../../utils";

export default function Home() {
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(() => {
    // Check if welcome animation has been shown before
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('welcomeShown');
    }
    return true;
  });
  const [animationState, setAnimationState] = useState(0);

  const textContent = [
    { title: "", subtitle: "" },                             // Initial state
    { title: "Welcome to", subtitle: "" },                   // Typing "WELCOME TO"
    { title: "InternHub", subtitle: "" },                    // "InternHub" with merge
    { title: "InternHub", subtitle: "WHERE  EXPERIENCE  BEGINS" } // Slogan with shift
  ];

  // Create typing animation variants
  const typingVariants = createTypingAnimation(textContent[1].title, {
    delay: 100,  // Reduced from 150ms to 100ms
    duration: 1  // Reduced from 2s to 1s
  });

  // Handle animation timing with explicit states for delay
  useEffect(() => {
    if (!showWelcome) return; // Skip animation if welcome is not shown

    if (animationState < textContent.length - 1) {
      const timer = setTimeout(() => {
        if (animationState === 2) {
          setTimeout(() => setAnimationState(3), 1000); // Reduced from 2000ms to 1000ms
        } else {
          setAnimationState(prevState => prevState + 1);
        }
      }, animationState === 1 ? 2000 : 500); // Reduced from 3000ms/1000ms to 2000ms/500ms
      return () => clearTimeout(timer);
    } else {
      // After welcome animation completes, wait 1 second then show continue options
      const timer = setTimeout(() => {
        setShowWelcome(false);
        // Mark welcome as shown in session storage
        sessionStorage.setItem('welcomeShown', 'true');
      }, 1000); // Reduced from 2000ms to 1000ms
      return () => clearTimeout(timer);
    }
  }, [animationState, showWelcome]);

  const handleOptionClick = (userType) => {
    router.push(`/en/auth/login?userType=${userType}`);
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

  return (
    <div className="min-h-screen flex flex-col kontainer relative overflow-hidden">
      {/* Animated Background Blobs - Only show during welcome screen */}
      {/* {showWelcome && (
        <>
          <motion.div
            className="absolute top-0 left-0 -z-10"
            variants={blobVariants}
            initial="initial"
            animate="animate"
          >
            <div className="w-64 h-64 rounded-full bg-[var(--metallica-blue-500)] -translate-x-1/3 -translate-y-1/3" />
          </motion.div>
          <motion.div
            className="absolute bottom-0 right-0 -z-10"
            variants={blobVariants}
            initial="initial"
            animate="animate"
          >
            <div className="w-64 h-64 rounded-full bg-[var(--metallica-blue-200)] translate-x-1/3 translate-y-1/3" />
          </motion.div>
        </>
      )} */}

      <AnimatePresence mode="wait">
        {showWelcome ? (
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
                      className="absolute top-full mt-2 text-3xl tracking-[.25em] text-[var(--metallica-blue-600)] text-center "
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
        ) : (
          <motion.div
            key="continue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-grow"
          >
            <div className="row h-full">
              <div className="main">
                <div className="flex flex-col items-center justify-center flex-grow">
                  {/* Header */}
                  <div className="w-full flex justify-center mb-8">
                    <Header
                      text="Continue As"
                      className="continue-text"
                      isFullWidth={true}
                      size="1xl"
                    />
                  </div>

                  {/* Continue Options */}
                  <div className="continue_options">
                    {usersOptions.map((option) => (
                      <ContinueOption
                        key={option.value}
                        name={option.name}
                        imageUrl={option.imageUrl}
                        className={option.class}
                        width={option.dimension}
                        height={option.dimension}
                        onClick={() => handleOptionClick(option.value)}
                      />
                    ))}
                  </div>

                  {/* Motivational Text */}
                  <div className="motivational-text font-ibm-plex-sans">
                    Tailored experience for every role.
                  </div>
                </div>
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