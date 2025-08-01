import React from 'react';
import { useTranslation } from 'react-i18next';
import { createSafeT } from '../../lib/translationUtils';

export default function NoResults({
  mainMessage = null,
  subMessage = null,
  type = null,
  className = ''
}) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  // Determine the main message
  const getMainMessage = () => {
    if (mainMessage) {
      return mainMessage;
    }

    if (type) {
      return safeT('common.noResults.notFound').replace('{type}', type);
    }

    return safeT('common.noResults.noResultsGeneric');
  };

  // Determine the sub message
  const getSubMessage = () => {
    if (subMessage) {
      return subMessage;
    }

    return safeT('common.noResults.tryAdjusting');
  };

  return (
    <div className={`p-16 text-center ${className}`}>
      <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <p className="text-gray-500 font-medium">{getMainMessage()}</p>
      <p className="text-gray-400 text-sm mt-1">{getSubMessage()}</p>
    </div>
  );
} 