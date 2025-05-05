"use client";
import { useState } from 'react';
import SearchBar from './SearchBar';
import IndustryFilter from './Filter';

export default function CardTable({
  title = "",
  data = [],
  filterFunction,
  emptyMessage = "No items found",
  searchConfig = {},
  filterConfig = {},
  renderCard // New prop for custom card rendering
}) {
  const { 
    searchTerm = '', 
    onSearchChange, 
    placeholder = "Search..." 
  } = searchConfig;
  
  const { 
    showFilter = false,
    filterOptions = [],
    selectedFilter = '',
    onFilterChange,
    filterLabel = "Filter" 
  } = filterConfig;

  const filteredData = data.filter(item => 
    filterFunction(item, searchTerm, selectedFilter)
  );

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
              <IndustryFilter 
                industries={filterOptions}
                selectedIndustry={selectedFilter}
                onIndustryChange={onFilterChange}
                label={filterLabel}
              />
            </div>
          )}
        </div>
      </div>

      {/* Card Grid Section */}
      <div className="w-full max-w-4xl space-y-3">
        {filteredData.map((item) => (
          renderCard(item)
        ))}

        {filteredData.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {typeof emptyMessage === 'function' 
              ? emptyMessage(searchTerm)
              : emptyMessage.replace(/{searchTerm}/g, searchTerm)
            }
          </div>
        )}
      </div>
    </div>
  );
}