"use client";
import { useState } from 'react';
import SearchBar from './SearchBar';
import Filter from './Filter';

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
  return spans[span] || 'col-span-12';
};

export default function DataTable({
  title = "",
  data = [],
  columns = [],
  filterFunction,
  emptyMessage = "No items found",
  searchConfig = {},
  filterConfig = {}
}) {
  const { 
    searchTerm = '', 
    onSearchChange, 
    placeholder = "Search Companies..." 
  } = searchConfig;
  
  const { 
    showFilter = false,
    filterOptions = [],
    selectedFilter = '',
    onFilterChange,
    filterLabel = "Filter",
    filterPlaceholder = "All" 
  } = filterConfig;

  const filteredData = data.filter(item => filterFunction(item, searchTerm, selectedFilter));

  return (
    <div className="flex flex-col items-center">
      {/* Header Section */}
      <div className="w-full max-w-4xl mb-8">
        {title && (
          <h1 className="text-3xl font-bold mb-4 mt-6" style={{ color: 'var(--metallica-blue-600)' }}>
            {title}
          </h1>
        )}
        
        {/* Search and Filter Row */}
        <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:space-x-4">
          <div className="flex-1">
            <SearchBar 
              searchTerm={searchTerm} 
              setSearchTerm={onSearchChange} 
              placeholder={placeholder}
            />
          </div>
          {showFilter && (
            <div className="flex-1">
              <Filter 
                options={filterOptions}
                selectedValue={selectedFilter}
                onChange={onFilterChange}
                label={filterLabel}
                placeholder={filterPlaceholder}
              />
            </div>
          )}
        </div>
      </div>

      {/* Table Section - remains unchanged */}
      <div className="w-full max-w-4xl text-sm mt-4">
        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-4 mb-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
          {columns.map(column => (
            <div 
              key={column.key}
              className={`${getSpanClass(column.span)} ${
                column.align === 'right' ? 'text-right' : 'text-left'
              } pl-4`}
            >
              {column.label}
            </div>
          ))}
        </div>

        {/* Data Rows */}
        <div className="space-y-2">
          {filteredData.map((item, index) => (
            <div 
              key={item.id || index}
              className="grid grid-cols-12 gap-4 items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              {columns.map(column => (
                <div 
                  key={`${item.id || index}-${column.key}`}
                  className={`${getSpanClass(column.span)} ${
                    column.align === 'right' ? 'text-right' : 'text-left'
                  } px-4 ${column.className || ''}`}
                  style={{
                    minWidth: column.minWidth || 'auto',
                    maxWidth: column.maxWidth || 'none',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: column.truncate ? 'ellipsis' : 'clip'
                  }}
                >
                  {column.render ? column.render(item) : item[column.key]}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredData.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {typeof emptyMessage === 'function' 
              ? emptyMessage(searchTerm)
              : emptyMessage
                .replace(/{searchTerm}/g, searchTerm)
            }
          </div>
        )}
      </div>
    </div>
  );
}