import React from 'react';

export default function InfoCardContainer({ children, className = '', ...rest }) {
  return (
    <div
      className={`mb-3 w-full max-w-3xl mx-auto bg-[#E2F4F7] rounded-lg border-2 border-[#5DB2C7] p-4 font-['IBM_Plex_Sans'] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
} 