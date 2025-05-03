"use client";

import Image from "next/image";

export default function ContinueOption({ name, imageUrl, className, width, height, onClick }) {
  return (
    <div
      id={className}
      className="option_container cursor-pointer"
      onClick={onClick}
    >
      <div className="circle_1">
        <div className="image-container">
          <Image
            src={imageUrl}
            alt={name}
            width={width}
            height={height}
            className="logos"
          />
        </div>
      </div>
      <div className="circle_2"></div>
      <div className="info">
        <div className="option_name">{name}</div>
      </div>
    </div>
  );
}