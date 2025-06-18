import React from 'react';

/**
 * StatusPills - A reusable pill filter bar for status selection.
 *
 * Props:
 * - statuses: Array<{ value: string, label: string, color?: string, badgeColor?: string }>
 * - selected: string (currently selected value)
 * - onChange: function (called with new value)
 * - pillClassName: string (optional, extra classes for each pill)
 * - allLabel: string (optional, label for the 'all' pill, default 'ALL')
 */
export default function StatusPills({
  statuses = [],
  selected = 'all',
  onChange,
  pillClassName = '',
  allLabel = 'ALL',
}) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <button
        onClick={() => onChange && onChange('all')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium h-[38px] transition-all flex items-center ${selected === 'all'
          ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#5DB2C7]'
          : 'bg-white text-gray-600 border-2 border-gray-300 hover:bg-gray-50'} ${pillClassName}`}
      >
        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
          selected === 'all' ? 'bg-[#5DB2C7]' : 'bg-gray-300'
        }`}></span>
        {allLabel}
      </button>
      {statuses.map((status) => (
        <button
          key={status.value}
          onClick={() => onChange && onChange(status.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium h-[38px] transition-all flex items-center ${selected === status.value
            ? `${status.color || 'bg-blue-100 text-blue-800 border-2 border-blue-400'}`
            : 'bg-white text-gray-600 border-2 border-gray-300 hover:bg-gray-50'} ${pillClassName}`}
        >
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
            selected === status.value ? (status.badgeColor || 'bg-blue-600') : 'bg-gray-300'
          }`}></span>
          {status.label}
        </button>
      ))}
    </div>
  );
} 