import React from 'react';
import Image from 'next/image';

/**
 * ProfileIcon component for displaying user profile images
 * @param {Object} props - Component props
 * @param {string} [props.src] - Source URL of the profile image
 * @param {string} [props.alt='Profile'] - Alt text for the image
 * @param {string} [props.size='md'] - Size of the profile icon ('sm', 'md', 'lg', 'xl')
 * @param {boolean} [props.showStatus=false] - Whether to show online status indicator
 * @param {string} [props.status='offline'] - Status of the user ('online', 'away', 'busy', 'offline')
 * @param {string} [props.className] - Additional CSS classes
 */
const ProfileIcon = ({
  src,
  alt = 'Profile',
  size = 'md',
  showStatus = false,
  status = 'offline',
  className = ''
}) => {
  // Default image if none provided
  const imageSrc = src || '/images/default-avatar.png';

  // Size classes mapping
  const sizeClasses = {
    'sm': 'w-8 h-8',
    'md': 'w-10 h-10',
    'lg': 'w-12 h-12',
    'xl': 'w-16 h-16'
  };

  // Status color mapping
  const statusColors = {
    'online': 'bg-green-500',
    'away': 'bg-yellow-500',
    'busy': 'bg-red-500',
    'offline': 'bg-gray-400'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white shadow-sm`}>
        {src ? (
          <Image
            src={imageSrc}
            alt={alt}
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-metallica-blue-100 flex items-center justify-center text-metallica-blue-800 font-medium">
            {alt.substring(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      {showStatus && (
        <span className={`absolute bottom-0 right-0 block rounded-full ${statusColors[status]}`} style={{
          width: size === 'sm' ? '8px' : '10px',
          height: size === 'sm' ? '8px' : '10px',
          border: '1.5px solid white'
        }}></span>
      )}
    </div>
  );
};

export default ProfileIcon; 