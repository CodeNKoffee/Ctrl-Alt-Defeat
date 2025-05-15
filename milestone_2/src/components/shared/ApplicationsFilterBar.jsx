import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSearch, faXmark, faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default function ApplicationsFilterBar({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedInternship,
  onInternshipChange,
  statusConfig,
  internships,
  onClearFilters
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

  return (
    <div className="w-full z-[1000px] bg-[#D9F0F4]/60 backdrop-blur-md p-6 rounded-xl shadow-lg mb-8 border border-[#B8E1E9]/50 transition-all duration-300 hover:shadow-xl">
      <div className="w-full flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search box */}
        <div className="flex-1 w-full md:w-auto md:max-w-md">
          <div className="relative w-full flex justify-center items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search by name, email, or position..."
              className="w-full py-3 pl-10 pr-10 appearance-none bg-white/90 backdrop-blur-sm border-2 border-[#B8E1E9] hover:border-[#5DB2C7] text-sm text-[#1a3f54] rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#5DB2C7] focus:border-[#5DB2C7] transition-all duration-300 placeholder-gray-500"
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

        {/* Combined Filter Button and Popover */}
        <div className="relative w-full md:w-auto">
          <button
            onClick={() => setIsCombinedFilterPopoverOpen(!isCombinedFilterPopoverOpen)}
            className="appearance-none w-full md:w-auto bg-white/90 backdrop-blur-sm border-2 border-[#B8E1E9] hover:border-[#5DB2C7] text-sm text-[#1a3f54] py-3 px-4 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#5DB2C7] focus:border-[#5DB2C7] transition-all duration-300 flex items-center justify-center gap-2 combined-filter-button min-w-[150px]"
          >
            <FontAwesomeIcon icon={faFilter} className="h-4 w-4 text-[#5DB2C7]" />
            <span>Filters</span>
            <FontAwesomeIcon icon={faChevronDown} className={`h-4 w-4 text-[#5DB2C7] transition-transform duration-300 ${isCombinedFilterPopoverOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCombinedFilterPopoverOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-md border-2 border-[#B8E1E9] rounded-xl shadow-xl z-30 combined-filter-popover animate-dropdown focus:outline-none p-4 space-y-4">
              {/* Internship Filter Section */}
              <div className="z-50">
                <h4 className="text-sm font-semibold text-[#2a5f74] mb-2">Internship Position</h4>
                <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                  <div
                    className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${selectedInternship === 'all' ? 'bg-[#D9F0F4] font-semibold' : 'font-normal'}`}
                    onClick={() => onInternshipChange('all')}
                  >
                    All Internships
                  </div>
                  {internships.map(internship => (
                    <div
                      key={internship.id}
                      className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${selectedInternship === internship.id.toString() ? 'bg-[#D9F0F4] font-semibold' : 'font-normal'}`}
                      onClick={() => onInternshipChange(internship.id.toString())}
                    >
                      {internship.title}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Filter Section */}
              <div>
                <h4 className="text-sm font-semibold text-[#2a5f74] mb-2">Status</h4>
                <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                  <div
                    className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${selectedStatus === 'all' ? 'bg-[#D9F0F4] font-semibold' : 'font-normal'}`}
                    onClick={() => onStatusChange('all')}
                  >
                    All Statuses
                  </div>
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <div
                      key={status}
                      className={`px-3 py-2 text-sm flex items-center gap-2 text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${selectedStatus === status ? 'bg-[#D9F0F4] font-semibold' : 'font-normal'}`}
                      onClick={() => onStatusChange(status)}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${config.badgeColor} border border-black/20`}></span>
                      {config.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active filters */}
      <div className="w-full flex flex-wrap gap-3 items-center mt-4 pt-4 border-t border-[#B8E1E9]/50">
        {(searchTerm || selectedStatus !== 'all' || selectedInternship !== 'all') ? (
          <>
            <span className="text-sm text-[#2a5f74] font-medium">Active Filters:</span>
            {searchTerm && (
              <div className="flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 text-[#2a5f74] border-2 border-[#B8E1E9] shadow-sm hover:shadow-md transition-all duration-300 group">
                <span className="mr-1.5">Search:</span>
                <span className="font-semibold italic mr-1.5">"{searchTerm}"</span>
                <button
                  className="ml-1 p-0.5 rounded-full text-[#5DB2C7] hover:bg-[#B8E1E9]/60 hover:text-[#1a3f54] transition-colors duration-200"
                  onClick={() => onSearchChange('')}
                  aria-label="Remove search term"
                >
                  <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                </button>
              </div>
            )}
            {selectedStatus !== 'all' && (
              <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig[selectedStatus].color} shadow-sm hover:shadow-md transition-all duration-300 group`}>
                <span className="mr-1.5">Status:</span>
                <span className="font-semibold mr-1.5">{statusConfig[selectedStatus].label}</span>
                <button
                  className="ml-1 p-0.5 rounded-full opacity-70 hover:opacity-100 transition-opacity duration-200 hover:bg-black/10"
                  onClick={() => onStatusChange('all')}
                  aria-label={`Remove status filter ${statusConfig[selectedStatus].label}`}
                >
                  <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                </button>
              </div>
            )}
            {selectedInternship !== 'all' && (
              <div className="flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 text-[#2a5f74] border-2 border-[#B8E1E9] shadow-sm hover:shadow-md transition-all duration-300 group">
                <span className="mr-1.5">Position:</span>
                <span className="font-semibold mr-1.5">{internships.find(i => i.id === parseInt(selectedInternship))?.title}</span>
                <button
                  className="ml-1 p-0.5 rounded-full text-[#5DB2C7] hover:bg-[#B8E1E9]/60 hover:text-[#1a3f54] transition-colors duration-200"
                  onClick={() => onInternshipChange('all')}
                  aria-label="Remove position filter"
                >
                  <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                </button>
              </div>
            )}
            <button
              className="ml-auto bg-[#2a5f74] hover:bg-[#1a3f54] text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-all duration-300 flex items-center"
              onClick={onClearFilters}
            >
              <FontAwesomeIcon icon={faXmark} className="w-3 h-3 mr-1.5" /> Clear All
            </button>
          </>
        ) : (
          <p className="text-sm text-gray-500 italic">No filters currently applied.</p>
        )}
      </div>
    </div>
  );
}
