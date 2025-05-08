import React from 'react';

export default function StatusBadge({ children, color, className = '', ...rest }) {
  // Default to blue if no color is provided
  const bgColor = color || 'bg-blue-100';
  const textColor = color ? '' : 'text-blue-800';
  const borderColor = color ? '' : 'border-blue-800';

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${bgColor} ${textColor} ${borderColor} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
} 