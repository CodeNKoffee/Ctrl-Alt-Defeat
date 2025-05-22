"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ContinueOption({ name, imageUrl, className, width, height, onClick, layoutId }) {
  return (
    <motion.div
      id={className}
      className="option_container"
      onClick={onClick}
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