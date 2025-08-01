const getCurrentYear = () => {
  return new Date().getFullYear();
};

const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Creates a typing animation effect for text
 * @param {string} text - The text to animate
 * @param {Object} options - Animation options
 * @param {number} options.delay - Delay between each character (default: 200)
 * @param {number} options.duration - Duration of each character animation (default: 1.5)
 * @returns {Object} - Animation variants for Framer Motion
 */
const createTypingAnimation = (text, options = {}) => {
  const { delay = 200, duration = 1.5 } = options;

  return {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: {
        delay: i * (delay / 1000), // Convert ms to seconds
        duration: duration,
        ease: "easeOut"
      }
    })
  };
};

export { getCurrentYear, capitalizeWords, createTypingAnimation };