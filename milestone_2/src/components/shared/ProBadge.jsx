import React from 'react';

export default function ProBadge({ size = 'md', className = '' }) {
  const sizeClasses = {
    'sm': 'text-xs px-1 py-0.5',
    'md': 'text-xs px-1.5 py-0.5',
    'lg': 'text-sm px-2 py-0.5',
  };

  return (
    <span
      className={`bg-gradient-to-r from-[#3298BA] to-[#2a5f74] text-white font-bold rounded-md shadow-sm ${sizeClasses[size]} ${className}`}
    >
      PRO
    </span>
  );
} 