"use client";

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search companies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full py-2 pl-9 pr-4 appearance-none bg-white/80 backdrop-blur-sm border-2 hover:border-metallica-blue-300 hover:cursor-pointer text-sm text-gray-800 px-4 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-metallica-blue-300 focus:border-metallica-blue-400 transition-all duration-300"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}