"use client";
import { useState } from 'react';
import ApplicationsFilterBar from './ApplicationsFilterBar';

export default function CardTable({
  title = "",
  data = [],
  filterFunction = () => true,
  emptyMessage = "No items found",
  searchConfig = {
    searchTerm: '',
    onSearchChange: () => { },
    placeholder: 'Search...',
    hideSearchBar: false
  },
  filterConfig = {
    showFilter: false,
    filterOptions: [],
    selectedFilter: '',
    onFilterChange: () => { },
    filterLabel: "Filter"
  },
  renderCard,
  renderContainer,
  customSearchBar = null
}) {
  const {
    searchTerm = '',
    onSearchChange,
    placeholder = "Search...",
    hideSearchBar = false
  } = searchConfig;

  const {
    showFilter = false,
    filterOptions = [],
    selectedFilter = '',
    onFilterChange,
    filterLabel = "Filter"
  } = filterConfig;

  const filteredData = data.filter(filterFunction);

  const Container = renderContainer
    ? ({ children }) => renderContainer({ children })
    : ({ children }) => <div className="w-full space-y-3">{children}</div>;

  return (
    <div className="w-full">
      {/* Title */}
      {title && (
        <h1 className="text-3xl font-bold mb-6 text-left text-[#2a5f74] relative">
          {title}
          <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
        </h1>
      )}

      {/* Combined Search & Filter Bar */}
      {(!hideSearchBar || showFilter) && (
        <div className="w-full mb-4">
          <ApplicationsFilterBar
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            selectedStatus={filterConfig.selectedFilter || 'all'}
            onStatusChange={filterConfig.onFilterChange || (() => {})}
            selectedInternship={searchConfig.selectedInternship || 'all'}
            onInternshipChange={searchConfig.onInternshipChange || (() => {})}
            statusConfig={filterConfig.statusConfig || {}}
            internships={filterConfig.internships || []}
            onClearFilters={filterConfig.onClearFilters || (() => {})}
          />
        </div>
      )}

      {/* Cards Container - Only show content when we have data or if we need to display an empty message */}
      {(filteredData.length > 0 || data.length > 0) && (
        <Container>
          {filteredData.length > 0 ? (
            filteredData.map((item) => renderCard(item))
          ) : (
            data.length > 0 && (
              <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
                {emptyMessage}
              </div>
            )
          )}
        </Container>
      )}
    </div>
  );
}