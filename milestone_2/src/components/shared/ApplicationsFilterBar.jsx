import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSearch, faXmark, faChevronDown, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import DatePicker from '@/components/DatePicker';

export default function ApplicationsFilterBar({
  // Search functionality
  searchTerm = '',
  onSearchChange = () => { },
  searchPlaceholder = "Search...",

  // Status filtering
  selectedStatus = 'all',
  onStatusChange = () => { },
  statusConfig = {},

  // Primary filter (internships, positions, etc.)
  primaryFilterName = 'Filter',
  selectedPrimaryFilter = 'all',
  onPrimaryFilterChange = () => { },
  primaryFilterOptions = [],

  // Date filtering
  showDatePicker = false,
  selectedDate = null,
  onDateChange = () => { },

  // Tab selection - kept for backward compatibility but not used in UI
  showTabs = false,
  activeTab = 'all',
  onTabChange = () => { },
  tabOptions = [
    { id: 'all', label: 'All' },
    { id: 'recent', label: 'Recent' },
  ],

  // Filter actions
  onClearFilters = () => { },

  // Custom filter sections
  customFilterSections = [],

  // UI customization
  bgColor = "bg-[#D9F0F4]/60",
  filterButtonColor = "bg-white/90",
  marginBottom = "mb-8",
  primaryFilterResetLabel,

  filterSections = [], // [{ name, options, selected, onChange, resetLabel }]
}) {
  const [isCombinedFilterPopoverOpen, setIsCombinedFilterPopoverOpen] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.combined-filter-popover') && !event.target.closest('.combined-filter-button')) {
        setIsCombinedFilterPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const hasActiveCustomFilters = customFilterSections.some(section =>
    section.options.some(option => section.isSelected(option))
  );

  const hasFilters = searchTerm ||
    selectedStatus !== 'all' ||
    selectedPrimaryFilter !== 'all' ||
    selectedDate ||
    hasActiveCustomFilters;

  // Determine if any filters are active in filterSections
  const hasActiveFilters = filterSections.some(section => section.selected && section.selected !== 'all');

  return (
    <div className={`w-full ${bgColor} backdrop-blur-md p-6 rounded-xl shadow-lg ${marginBottom} border border-[#B8E1E9]/50 transition-all duration-300 hover:shadow-xl relative z-20 isolation-auto`}>

      {/* Main filter section with search and industry filter */}
      <div className="w-full flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search box */}
        <div className="flex-1 w-full md:w-auto md:max-w-[620px] flex items-center">
          <div className="relative w-full flex justify-center items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full py-3 pl-10 pr-10 appearance-none bg-white/90 backdrop-blur-sm border-2 border-[#B8E1E9] hover:border-[#5DB2C7] text-sm text-[#1a3f54] rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#5DB2C7] focus:border-[#5DB2C7] transition-all duration-300 placeholder-gray-500 h-[46px]"
            />
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-[#5DB2C7]" />
            </div>
            {searchTerm && (
              <button
                type="button"
                className="absolute inset-y-0 right-3.5 flex items-center p-1 rounded-full hover:bg-[#B8E1E9]/50 transition-colors duration-200"
                onClick={() => onSearchChange('')}
              >
                <FontAwesomeIcon icon={faXmark} className="w-4 h-4 text-[#5DB2C7] hover:text-[#2a5f74]" />
              </button>
            )}
          </div>
        </div>

        {/* Date Picker (if enabled) */}
        {showDatePicker && (
          <div className="relative w-full md:w-auto flex-shrink-0 flex items-center h-[46px]">
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={onDateChange}
              disabled={false}
            />
          </div>
        )}

        {/* Combined Filter Button and Popover */}
        <div className="relative w-full md:w-auto flex-shrink-0">
          <button
            onClick={() => setIsCombinedFilterPopoverOpen(!isCombinedFilterPopoverOpen)}
            className={`appearance-none w-full md:w-auto ${filterButtonColor} backdrop-blur-sm border-2 border-[#B8E1E9] hover:border-[#5DB2C7] text-sm text-[#1a3f54] py-3 px-4 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#5DB2C7] focus:border-[#5DB2C7] transition-all duration-300 flex items-center justify-center gap-2 combined-filter-button min-w-[150px]`}
          >
            <FontAwesomeIcon icon={faFilter} className="h-4 w-4 text-[#5DB2C7]" />
            <span>Filters</span>
            <FontAwesomeIcon icon={faChevronDown} className={`h-4 w-4 text-[#5DB2C7] transition-transform duration-300 ${isCombinedFilterPopoverOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCombinedFilterPopoverOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white backdrop-blur-md border-2 border-[#B8E1E9] rounded-xl shadow-xl z-[1000] combined-filter-popover animate-dropdown focus:outline-none p-4 space-y-4">
              {filterSections.map((section, idx) => (
                <div key={section.name || idx}>
                  <h4 className="text-sm font-semibold text-[#2a5f74] mb-2">{section.name}</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                    <div
                      className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${section.selected === 'all' ? 'bg-[#D9F0F4] font-semibold' : 'font-normal'}`}
                      onClick={() => section.onChange('all')}
                    >
                      {section.resetLabel || `All ${section.name}`}
                    </div>
                    {section.options.map(option => (
                      <div
                        key={option.id}
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${section.selected === option.id.toString() ? 'bg-[#D9F0F4] font-semibold' : 'font-normal'}`}
                        onClick={() => section.onChange(option.id.toString())}
                      >
                        {option.title || option.label || option.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* No filters text or active filters display */}
      <div className="w-full mt-4 pt-4 border-t border-[#B8E1E9]/50">
        {hasActiveFilters ? (
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm text-[#2a5f74] font-medium">Active Filters:</span>
            {filterSections.map(section => (
              section.selected && section.selected !== 'all' ? (
                <div key={section.name} className="flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 text-[#2a5f74] border-2 border-[#B8E1E9] shadow-sm hover:shadow-md transition-all duration-300 group">
                  <span className="mr-1.5">{section.name}:</span>
                  <span className="font-semibold mr-1.5">
                    {section.options.find(opt => opt.id.toString() === section.selected)?.title || section.selected}
                  </span>
                  <button
                    className="ml-1 p-0.5 rounded-full text-[#5DB2C7] hover:bg-[#B8E1E9]/60 hover:text-[#1a3f54] transition-colors duration-200"
                    onClick={() => section.onChange('all')}
                    aria-label={`Remove ${section.name} filter`}
                  >
                    <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                  </button>
                </div>
              ) : null
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No filters currently applied.</p>
        )}
      </div>
    </div>
  );
}
