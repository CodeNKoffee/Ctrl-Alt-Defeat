"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ContinueOption({ name, imageUrl, className, width, height, onClick, layoutId }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleClick = (event) => {
    event.preventDefault(); // Prevent default action to ensure immediate effect
    setIsHovered(false); // Reset hover state immediately
    onClick();
  };

  return (
    <motion.div
      id={className}
      className={`option_container ${isHovered ? 'hovered' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="circle_1">
        <div className="circle_2"></div>
        <motion.div className="image-container" layoutId={layoutId}>
          <Image
            className="logos"
            src={imageUrl}
            width={width}
            height={height}
            alt={name}
          />
        </motion.div>
      </div>
      <div className="info">
        <div className="option_name font-ibm-plex-sans">{name}</div>
      </div>
    </motion.div>
  );
}