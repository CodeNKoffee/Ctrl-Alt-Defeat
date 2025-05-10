import React from 'react';

export default function NoResults({
  mainMessage = 'No results found matching your criteria',
  subMessage = 'Try adjusting your search or filter',
  className = ''
}) {
  return (
    <div className={`p-16 text-center ${className}`}>
      <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <p className="text-gray-500 font-medium">{mainMessage}</p>
      <p className="text-gray-400 text-sm mt-1">{subMessage}</p>
    </div>
  );
} 