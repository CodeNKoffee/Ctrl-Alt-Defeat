"use client";

export default function Filter({ 
  options = [], 
  selectedValue = "", 
  onChange, 
  label = "Filter", 
  placeholder = "All", 
  id = "filter"
}) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const selectTextColor = selectedValue ? "text-gray-800" : "text-gray-500";

  return (
    <div className="relative w-full">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={selectedValue}
        onChange={handleChange}
        className={`w-full p-2 pl-9 pr-3 rounded-full border border-gray-300 
                  focus:outline-none focus:ring-2 focus:ring-[var(--metallica-blue-500)] 
                  focus:border-transparent text-sm appearance-none bg-white
                  cursor-pointer ${selectTextColor}`}
      >
        <option value="" className="text-gray-400">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option} className="text-gray-800">
            {option}
          </option>
        ))}
      </select>
      <div className="absolute left-3 top-2.5 text-gray-400 pointer-events-none">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </div>
    </div>
  );
}