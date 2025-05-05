"use client";

export default function SearchBar({placeholder, searchTerm, setSearchTerm }) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder= {placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 pl-9 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--metallica-blue-500)] focus:border-transparent text-sm"
      />
      <div className="absolute left-3 top-2.5 text-gray-400">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}