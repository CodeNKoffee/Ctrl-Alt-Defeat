"use client";

import Image from "next/image";

export default function ContinueOption({ name, imageUrl, className, width, height, onClick }) {
  return (
    <div id={className} className="option_container" onClick={onClick}>
      <div className="circle_1">
        <div className="circle_2"></div>
        <div className="image-container">
          <Image
            className="logos"
            src={imageUrl}
            width={width}
            height={height}
            alt={name}
          />
        </div>
      </div>
      <div className="info">
        <div className="option_name font-ibm-plex-sans">{name}</div>
      </div>
    </div>
  );
}