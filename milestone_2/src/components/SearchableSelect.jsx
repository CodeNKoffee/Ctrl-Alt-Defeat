import React, { useState, useRef } from 'react';

export default function SearchableSelect({
  name,
  label,
  value,
  options,
  onChange,
  onBlur,
  error,
  touched,
  placeholder = '',
  disabled = false,
}) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  // Filter options based on search
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  // Handle selection
  const handleSelect = (option) => {
    onChange({ target: { name, value: option.value } });
    setSearch('');
    setOpen(false);
    if (onBlur) onBlur({ target: { name, value: option.value } });
  };

  // Floating label logic
  const isFloating = !!value || open || !!search;

  // Only allow valid option values
  const validOption = options.find(o => o.value === value);

  // On blur, if search is not empty and doesn't match a valid option, clear search and value
  const handleBlur = () => {
    setTimeout(() => {
      setOpen(false);
      if (search) {
        const match = options.find(o => o.label.toLowerCase() === search.toLowerCase());
        if (match) {
          onChange({ target: { name, value: match.value } });
          setSearch('');
        } else {
          setSearch('');
          onChange({ target: { name, value: '' } });
        }
      }
      if (onBlur) onBlur({ target: { name, value: value } });
    }, 100);
  };

  return (
    <div className="relative w-full">
      <div
        className={`w-full h-14 px-0 border-b-2 bg-transparent focus:outline-none transition-colors peer appearance-none ${error && touched ? 'border-red-500' : 'border-metallica-blue-off-charts'} ${disabled ? 'opacity-50' : ''}`}
        tabIndex={0}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
      >
        <input
          ref={inputRef}
          type="text"
          value={search || (validOption ? validOption.label : '')}
          onChange={e => setSearch(e.target.value)}
          onClick={() => setOpen(true)}
          placeholder={isFloating ? '' : placeholder}
          disabled={disabled}
          className="w-full h-14 bg-transparent border-none outline-none text-base text-gray-900 focus:ring-0 px-0 peer placeholder-transparent rtl:text-right"
          readOnly={false}
        />
        <label
          className={`absolute ltr:left-0 rtl:right-0 transition-all duration-200 pointer-events-none ${isFloating ? '-top-2.5 text-sm text-metallica-blue-off-charts' : 'top-4 text-gray-400'} ${error && touched ? 'text-red-500' : ''}`}
        >
          {label}
        </label>
        <div className="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {open && (
          <div className="absolute ltr:left-0 rtl:right-0 ltr:right-0 rtl:left-0 mt-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto rtl:text-right">
            {filteredOptions.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-400">No matches</div>
            )}
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-2 text-sm text-gray-700 hover:bg-metallica-blue-100 rounded-xl cursor-pointer ${value === option.value ? 'bg-metallica-blue-100' : ''}`}
                onMouseDown={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && touched && (
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )}
    </div>
  );
} 