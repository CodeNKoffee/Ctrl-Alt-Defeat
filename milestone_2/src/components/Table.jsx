"use client";
import SearchBar from "./SearchBar";
import React from "react";

export default function DataTable({
  title = "",
  data = [],
  columns = [],
  emptyMessage = "No items found",
  searchTerm = "",
  setSearchTerm = () => {},
  searchPlaceholder = "Search...",
  searchConfig = {},
  filterConfig = {}
}) {
  const getSpanClass = (span) => {
    const spans = {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
      5: 'col-span-5',
      6: 'col-span-6',
      7: 'col-span-7',
      8: 'col-span-8',
      9: 'col-span-9',
      10: 'col-span-10',
      11: 'col-span-11',
      12: 'col-span-12'
    };
    return spans[span] || 'col-span-1';
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header Section */}
      <div className="w-full mb-6">
        {title && (
          <h1 className="text-3xl font-bold text-left text-[#2a5f74] relative">
            {title}
            <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
          </h1>
        )}
      </div>

      {/* Search + Filter Section */}
      <div className="w-full mb-4">
        <div className="flex items-start gap-4 w-full">
          {/* Search Bar */}
          <div className="flex-1 min-w-[200px]">
            <SearchBar 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder={searchConfig.placeholder || searchPlaceholder}
              className="py-1.5 h-8 rounded-none"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => filterConfig.setShowFilters(!filterConfig.showFilters)}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 h-8 border border-gray-300 text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors rounded-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>{filterConfig.showFilters ? 'Hide Filters' : 'Filters'}</span>
          </button>

          {/* Filter Panel - Appears inline when shown */}
          {filterConfig.showFilters && (
            <div className="flex-1 flex items-center gap-4 min-w-0">
              <div className="flex-1 min-w-[150px]">
                <select
                  value={filterConfig.filters.major}
                  onChange={(e) =>
                    filterConfig.setFilters({ ...filterConfig.filters, major: e.target.value })
                  }
                  className="w-full h-8 px-3 py-1.5 border border-gray-300 text-sm rounded-none bg-white"
                >
                  <option value="">Filter By Major</option>
                  {filterConfig.majorOptions.map((major) => (
                    <option key={major} value={major}>
                      {major}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[150px]">
                <select
                  value={filterConfig.filters.status}
                  onChange={(e) =>
                    filterConfig.setFilters({ ...filterConfig.filters, status: e.target.value })
                  }
                  className="w-full h-8 px-3 py-1.5 border border-gray-300 text-sm rounded-none bg-white"
                >
                  <option value="">Filter By Status</option>
                  {filterConfig.statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={filterConfig.clearFilters}
                className="text-xs text-gray-700 hover:text-gray-800 hover:underline whitespace-nowrap"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full bg-white shadow-lg border border-gray-200">
        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-4 py-4 px-6 bg-gray-50 border-b border-gray-200">
          {columns.map(column => (
            <div 
              key={column.key}
              className={`${getSpanClass(column.span)} 
                ${column.align === 'right' ? 'text-right' : 'text-left'}
                text-xs font-semibold text-gray-500 uppercase tracking-wide`}
            >
              {column.label}
            </div>
          ))}
        </div>

        {/* Data Rows */}
        <div className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <div 
              key={item.id || index}
              className="grid grid-cols-12 gap-4 py-4 px-6 items-center hover:bg-gray-50 transition-colors"
            >
              {columns.map(column => (
                <div 
                  key={`${item.id || index}-${column.key}`}
                  className={`${getSpanClass(column.span)} 
                    ${column.align === 'right' ? 'text-right' : 'text-left'}
                    ${column.className || ''}
                    text-sm text-gray-700`}
                >
                  {column.render ? column.render(item) : item[column.key]}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {data.length === 0 && (
          <div className="p-12 text-center text-gray-500 text-base">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}