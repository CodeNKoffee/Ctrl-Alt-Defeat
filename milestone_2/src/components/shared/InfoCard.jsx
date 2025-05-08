import React from 'react';

export default function InfoCard({
  title,
  subtitle,
  label,
  leftIcon,
  rightTop,
  rightBottom,
  onClick,
  className = '',
  ...rest
}) {
  return (
    <div className={`mb-3 w-full max-w-3xl mx-auto ${className}`} {...rest}>
      <button
        onClick={onClick}
        className="group flex flex-col p-4 w-full bg-[#E2F4F7] rounded-lg border-2 border-[#5DB2C7] hover:shadow-md transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] gap-4 relative font-['IBM_Plex_Sans'] overflow-hidden"
      >
        <div className="flex items-start gap-4">
          {/* Left Icon/Profile */}
          <div className="flex flex-col items-center w-24 flex-shrink-0 space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
              {leftIcon}
            </div>
            {label && <div>{label}</div>}
          </div>
          {/* Center: Title & Subtitle */}
          <div className="flex-1 min-w-0 ml-2">
            <div className="flex flex-col space-y-1">
              <h3 className="text-lg font-bold text-gray-800 text-left">{title}</h3>
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-gray-600 text-left">{subtitle}</p>
              </div>
            </div>
          </div>
          {/* Right: Top & Bottom */}
          <div className="flex flex-col items-end w-28 flex-shrink-0 space-y-2">
            {rightTop && <span className="font-semibold text-sm">{rightTop}</span>}
            {rightBottom && <span className="text-xs text-gray-500">{rightBottom}</span>}
          </div>
        </div>
      </button>
    </div>
  );
} 