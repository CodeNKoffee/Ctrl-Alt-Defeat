'use client';

import Image from "next/image";

export default function ContinueOption({ name, imageUrl, className }) {
  return (
    <div id={className} className="option_container">
      <div className="cirlce_1">
        <div className="image-container">
          <Image
            src={imageUrl}
            alt={name}
            width={144}
            height={144}
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
        <div className="option_name font-ibm-plex-sans">{name}</div>
      </div>
      <div className="circle_2"></div>
    </div>
  );
} 