"use client";
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formatDate = (isoDate) => {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function InfoCard({
  title,
  subtitle,
  label,
  rightTop,
  rightBottom,
  leftIcon,
  children,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHeightAnimating, setIsHeightAnimating] = useState(false);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const router = useRouter();

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsHeightAnimating(true);
      setTimeout(() => {
        setIsDescriptionVisible(true);
      }, 400);
    } else {
      setIsDescriptionVisible(false);
      setTimeout(() => {
        setIsHeightAnimating(false);
        setIsOpen(false);
      }, 600);
    }
  };

  return (
    <div className={`p-6 bg-[#E2F4F7] rounded-lg border-2 border-[#5DB2C7] ${className}`}>
      <div className="flex items-start gap-4">
        {/* Left: Icon and Label */}
        {(leftIcon || label) && (
          <div className="flex flex-col items-center w-24 flex-shrink-0 space-y-3">
            {leftIcon}
            {label && <p className="text-sm font-medium text-gray-500 text-center">{label}</p>}
          </div>
        )}

        {/* Center: Title and Subtitle */}
        <div className="flex-1 min-w-0 ml-2">
          <div className="flex flex-col space-y-1">
            {title && <h3 className="text-lg font-bold text-gray-800 text-left">{title}</h3>}
            {subtitle && (
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-gray-600 text-left">{subtitle}</p>
              </div>
            )}
            {children}
          </div>
        </div>

        {/* Right: Additional Info */}
        {(rightTop || rightBottom) && (
          <div className="flex flex-col items-end w-32 flex-shrink-0 space-y-2">
            {rightTop && (
              <span className={`font-semibold text-sm ${rightTop.includes('Paid') ? 'text-green-600' : 'text-gray-600'}`}>
                {rightTop}
              </span>
            )}
            {rightBottom && (
              <span className="text-xs text-gray-500">
                {rightBottom}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
