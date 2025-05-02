"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ContinueOption({ name, imageUrl, className, width, height }) {
  const router = useRouter();

  const handleClick = () => {
    // Remove 'option_' from className to get the user type
    const userType = className.replace('option_', '');
    router.push(`/login?userType=${userType}`);
  };

  return (
    <div id={className} className="option_container" onClick={handleClick}>
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