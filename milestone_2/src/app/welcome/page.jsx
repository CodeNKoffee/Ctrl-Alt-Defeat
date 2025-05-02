// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { motion, AnimatePresence } from "framer-motion";

// export default function Welcome() {
//   const [animationState, setAnimationState] = useState(0);

//   const textContent = [
//     { title: "", subtitle: "" },                             // Initial state
//     { title: "WELCOME TO", subtitle: "" },                   // Typing "WELCOME TO"
//     { title: "InternHub", subtitle: "" },                    // "InternHub" with merge
//     { title: "InternHub", subtitle: "Unlock Opportunities Today" } // Slogan with shift
//   ];

//   // Handle animation timing
//   useEffect(() => {
//     if (animationState < textContent.length - 1) {
//       const timer = setTimeout(() => {
//         setAnimationState(prevState => prevState + 1);
//       }, animationState === 1 ? 1500 : 700); // Longer delay for typing "WELCOME TO"
//       return () => clearTimeout(timer);
//     }
//   }, [animationState]);

//   // Variants for GIF and blobs
//   const gifVariants = {
//     hidden: { scale: 0.8, opacity: 0 },
//     visible: { scale: 1.2, opacity: 1, transition: { duration: 1, ease: "easeOut" } },
//   };

//   const blobVariants = {
//     initial: { scale: 0.8, opacity: 0.5 },
//     animate: { 
//       scale: [0.8, 1.1, 0.8], 
//       opacity: [0.5, 0.7, 0.5], 
//       rotate: [0, 5, 0], 
//       transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } 
//     },
//   };

//   // Letter-by-letter typing for "WELCOME TO"
//   const typingVariants = {
//     hidden: { opacity: 0 },
//     visible: (i) => ({
//       opacity: 1,
//       transition: { delay: i * 0.1 },
//     }),
//   };

//   // "Merge" animation for "InternHub" (scaling in)
//   const mergeVariants = {
//     hidden: { scale: 0, opacity: 0 },
//     visible: { scale: 1, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
//     exit: { scale: 0, opacity: 0, transition: { duration: 0.5 } },
//   };

//   // "Shift" animation for slogan (word-by-word drop)
//   const shiftVariants = {
//     hidden: { opacity: 0, y: -20 },
//     visible: (i) => ({
//       opacity: 1,
//       y: 0,
//       transition: { delay: i * 0.3, duration: 0.5 },
//     }),
//   };

//   return (
//     <div className="min-h-screen flex flex-col kontainer relative overflow-hidden">
//       {/* Animated Background Blobs */}
//       <motion.div
//         className="absolute top-0 left-0 -z-10"
//         variants={blobVariants}
//         initial="initial"
//         animate="animate"
//       >
//         <div className="w-64 h-64 rounded-full bg-[var(--metallica-blue-500)] -translate-x-1/3 -translate-y-1/3" />
//       </motion.div>
//       <motion.div
//         className="absolute bottom-0 right-0 -z-10"
//         variants={blobVariants}
//         initial="initial"
//         animate="animate"
//       >
//         <div className="w-64 h-64 rounded-full bg-[var(--metallica-blue-200)] translate-x-1/3 translate-y-1/3" />
//       </motion.div>
      
//       {/* Main content */}
//       <div className="flex-grow flex items-center justify-center">
//         <div className="row">
//           <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
//             {/* Larger GIF with adjusted positioning */}
//             <motion.div
//               className="w-52 h-52 relative -mt-26" // Moved upward with -mt-12 (negative margin-top)
//               variants={gifVariants}
//               initial="hidden"
//               animate="visible"
//             >
//               <Image 
//                 src="/images/world-creativity-and-innovation-day.gif" 
//                 alt="InternHub Logo" 
//                 fill
//                 style={{ objectFit: "contain" }}
//                 className="z-20"
//                 priority
//               />
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="hidden">Fallback content if needed</div>
//               </div>
//             </motion.div>
            
//             {/* Added space between GIF and text */}
//             <div className="h-8" /> {/* Adds 48px of vertical space */}

//             {/* Animated Title */}
//             <AnimatePresence mode="wait">
//               {animationState === 1 && (
//                 <motion.div
//                   key="welcome"
//                   className="text-4xl font-semibold font-ibm-plex-sans text-[var(--metallica-blue-600)]"
//                   initial={{ opacity: 1 }}
//                   exit={{ opacity: 0, transition: { duration: 0.5 } }}
//                 >
//                   {textContent[1].title.split("").map((letter, index) => (
//                     <motion.span
//                       key={index}
//                       custom={index}
//                       variants={typingVariants}
//                       initial="hidden"
//                       animate="visible"
//                     >
//                       {letter}
//                     </motion.span>
//                   ))}
//                 </motion.div>
//               )}
//               {animationState >= 2 && (
//                 <motion.h1
//                   key="internhub"
//                   className="text-4xl font-semibold font-ibm-plex-sans text-[var(--metallica-blue-600)]"
//                   variants={mergeVariants}
//                   initial="hidden"
//                   animate="visible"
//                 >
//                   {textContent[animationState].title}
//                 </motion.h1>
//               )}
//             </AnimatePresence>
            
//             {/* Animated Subtitle with Delay */}
//             {animationState >= 3 && (
//               <motion.div className="text-xl text-[var(--metallica-blue-400)]">
//                 {textContent[3].subtitle.split(" ").map((word, index) => (
//                   <motion.span
//                     key={index}
//                     custom={index}
//                     variants={shiftVariants}
//                     initial="hidden"
//                     animate="visible"
//                     className="inline-block mr-2"
//                     transition={{ delay: 2 + index * 0.3, duration: 0.5 }} // Added 0.5s delay after InternHub
//                   >
//                     {word}
//                   </motion.span>
//                 ))}
//               </motion.div>
//             )}

//             {/* Animated Button */}
//             {animationState === textContent.length - 1 && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 2, duration: 0.8 }} // Adjusted delay to account for slogan
//                 className="mt-8"
//               >
//                 <a 
//                   href="/continue" 
//                   className="px-8 py-3 bg-[var(--metallica-blue-700)] text-white rounded-full font-medium hover:bg-[var(--metallica-blue-800)] transition-colors"
//                 >
//                   Get Started
//                 </a>
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Welcome() {
  const [animationState, setAnimationState] = useState(0);

  const textContent = [
    { title: "", subtitle: "" },                             // Initial state
    { title: "WELCOME TO", subtitle: "" },                   // Typing "WELCOME TO"
    { title: "InternHub", subtitle: "" },                    // "InternHub" with merge
    { title: "InternHub", subtitle: "Unlock Opportunities Today" } // Slogan with shift
  ];

  // Handle animation timing with explicit states for delay
  useEffect(() => {
    if (animationState < textContent.length - 1) {
      const timer = setTimeout(() => {
        if (animationState === 2) {
          setTimeout(() => setAnimationState(3), 1000); // 1-second delay for slogan
        } else {
          setAnimationState(prevState => prevState + 1);
        }
      }, animationState === 1 ? 1500 : 700); // Longer delay for typing "WELCOME TO"
      return () => clearTimeout(timer);
    }
  }, [animationState]);

  // Variants for GIF and blobs
  const gifVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1.2, opacity: 1, transition: { duration: 1, ease: "easeOut" } },
  };

  const blobVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: { 
      scale: [0.8, 1.1, 0.8], 
      opacity: [0.5, 0.7, 0.5], 
      rotate: [0, 5, 0], 
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } 
    },
  };

  // Letter-by-letter typing for "WELCOME TO"
  const typingVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: { delay: i * 0.1 },
    }),
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
      transition: { delay: i * 0.3, duration: 0.5 },
    }),
  };

  return (
    <div className="min-h-screen flex flex-col kontainer relative overflow-hidden">
      {/* Animated Background Blobs */}
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
      
      {/* Main content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="row">
          <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
            {/* Larger GIF with adjusted positioning */}
            <motion.div
              className="w-60 h-60 relative -mt-12"
              variants={gifVariants}
              initial="hidden"
              animate="visible"
            >
              <Image 
                src="/images/world-creativity-and-innovation-day.gif" 
                alt="InternHub Logo" 
                fill
                style={{ objectFit: "contain" }}
                className="z-20"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="hidden">Fallback content if needed</div>
              </div>
            </motion.div>
            
            {/* Added space between GIF and text */}
            <div className="h-16" /> {/* 48px of vertical space */}
            
            {/* Animated Title */}
            <AnimatePresence mode="wait">
              {animationState === 1 && (
                <motion.div
                  key="welcome"
                  className="text-6xl font-semibold font-ibm-plex-serif text-[var(--metallica-blue-600)]"
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
                  key="internhub"
                  className="text-6xl font-semibold font-ibm-plex-sans"
                  variants={mergeVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <span className="text-[#B0BEC5]">Intern</span>
                  <span className="text-[var(--metallica-blue-600)]">Hub</span>
                </motion.h1>
              )}
            </AnimatePresence>
            
            {/* Animated Subtitle with Delay */}
            {animationState >= 3 && (
              <motion.div className="text-xl text-[var(--metallica-blue-400)]">
                {textContent[3].subtitle.split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    custom={index}
                    variants={shiftVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-block mr-2"
                    transition={{ delay: 0.5 + index * 0.3, duration: 0.5 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>
            )}

            {/* Added space between GIF and text */}
            <div className="h-8" /> {/* 48px of vertical space */}
            
            {/* Animated Button */}
            {animationState === textContent.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
                className="mt-8"
              >
                <a 
                  href="/continue" 
                  className="px-8 py-3 bg-[var(--metallica-blue-700)] text-white rounded-full font-medium hover:bg-[var(--metallica-blue-800)] transition-colors"
                >
                  Get Started
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}