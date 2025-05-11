"use client";
import PostTiles from '@/components/PostTiles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSearch, faXmark, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef, useEffect } from 'react';

export default function CompanyPost() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCombinedFilterPopoverOpen, setIsCombinedFilterPopoverOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    jobType: [],
    jobSetting: [],
    paymentStatus: []
  });
  
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

  // Handle filter selection
  const handleFilterClick = (category, value) => {
    setActiveFilters(prev => {
      const newFilters = {...prev};
      
      // If "All" option is selected, clear other selections in the category
      if (value === 'all') {
        newFilters[category] = [];
        return newFilters;
      }
      
      // If the value is already selected, remove it; otherwise, add it
      if (newFilters[category].includes(value)) {
        newFilters[category] = newFilters[category].filter(item => item !== value);
      } else {
        newFilters[category] = [...newFilters[category], value];
      }
      
      return newFilters;
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters({
      jobType: [],
      jobSetting: [],
      paymentStatus: []
    });
    setSearchTerm('');
  };

  // Check if a filter is active
  const isFilterActive = (category, value) => {
    return activeFilters[category].includes(value);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return Object.values(activeFilters).some(arr => arr.length > 0) || searchTerm;
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-left text-[#2a5f74] relative">
          INTERNSHIP POSTS
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#2a5f74]"></span>
        </h1>
        
        {/* Modern search and filter bar */}
        <div className="w-full bg-[#D9F0F4]/60 backdrop-blur-md p-6 rounded-xl shadow-lg mb-8 border border-[#B8E1E9]/50 transition-all duration-300 hover:shadow-xl">
          <div className="w-full flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search box */}
            <div className="flex-1 w-full md:w-auto md:max-w-md">
              <div className="relative w-full flex justify-center items-center">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, description, or skills..."
                  className="w-full py-3 pl-10 pr-10 appearance-none bg-white/90 backdrop-blur-sm border-2 border-[#B8E1E9] hover:border-[#5DB2C7] text-sm text-[#1a3f54] rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#5DB2C7] focus:border-[#5DB2C7] transition-all duration-300 placeholder-gray-500"
                />
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="h-4 w-4 text-[#5DB2C7]"
                  />
                </div>
                {searchTerm && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3.5 flex items-center p-1 rounded-full hover:bg-[#B8E1E9]/50 transition-colors duration-200"
                    onClick={() => setSearchTerm('')}
                  >
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="w-4 h-4 text-[#5DB2C7] hover:text-[#2a5f74]"
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Combined Filter Button and Popover */}
            <div className="relative w-full md:w-auto">
              <button
                onClick={() => setIsCombinedFilterPopoverOpen(!isCombinedFilterPopoverOpen)}
                className={`appearance-none w-full md:w-auto backdrop-blur-sm border-2 text-sm py-3 px-4 rounded-full shadow-md transition-all duration-300 flex items-center justify-center gap-2 combined-filter-button min-w-[150px]
                  ${hasActiveFilters() 
                    ? "bg-[#5DB2C7] text-white border-[#5DB2C7] hover:bg-[#4AA0B5]" 
                    : "bg-white/90 text-[#1a3f54] border-[#B8E1E9] hover:border-[#5DB2C7]"
                  }`}
              >
                <FontAwesomeIcon icon={faFilter} className={`h-4 w-4 ${hasActiveFilters() ? "text-white" : "text-[#5DB2C7]"}`} />
                <span>Filters</span>
                {hasActiveFilters() && (
                  <span className="bg-white text-[#5DB2C7] text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {activeFilters.jobType.length + activeFilters.jobSetting.length + activeFilters.paymentStatus.length + (searchTerm ? 1 : 0)}
                  </span>
                )}
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`h-4 w-4 ${hasActiveFilters() ? "text-white" : "text-[#5DB2C7]"} transition-transform duration-300 ${isCombinedFilterPopoverOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {isCombinedFilterPopoverOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-md border-2 border-[#B8E1E9] rounded-xl shadow-xl z-30 combined-filter-popover animate-dropdown focus:outline-none p-4 space-y-4">
                  {/* Job Type Filter Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#2a5f74] mb-2">Job Type</h4>
                    <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                      <div 
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${activeFilters.jobType.length === 0 ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('jobType', 'all')}
                      >
                        All Types
                      </div>
                      <div 
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${isFilterActive('jobType', 'Full-time') ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('jobType', 'Full-time')}
                      >
                        Full-time
                      </div>
                      <div 
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${isFilterActive('jobType', 'Part-time') ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('jobType', 'Part-time')}
                      >
                        Part-time
                      </div>
                      <div 
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${isFilterActive('jobType', 'Internship') ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('jobType', 'Internship')}
                      >
                        Internship
                      </div>
                    </div>
                  </div>

                  {/* Job Setting Filter Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#2a5f74] mb-2">Job Setting</h4>
                    <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                      <div 
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${activeFilters.jobSetting.length === 0 ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('jobSetting', 'all')}
                      >
                        All Settings
                      </div>
                      <div 
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${isFilterActive('jobSetting', 'Remote') ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('jobSetting', 'Remote')}
                      >
                        Remote
                      </div>
                      <div 
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${isFilterActive('jobSetting', 'On-site') ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('jobSetting', 'On-site')}
                      >
                        On-site
                      </div>
                      <div 
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${isFilterActive('jobSetting', 'Hybrid') ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('jobSetting', 'Hybrid')}
                      >
                        Hybrid
                      </div>
                    </div>
                  </div>

                  {/* Payment Status Filter Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#2a5f74] mb-2">Payment Status</h4>
                    <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                      <div 
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${activeFilters.paymentStatus.length === 0 ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('paymentStatus', 'all')}
                      >
                        All Statuses
                      </div>
                      <div 
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${isFilterActive('paymentStatus', 'Paid') ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('paymentStatus', 'Paid')}
                      >
                        Paid
                      </div>
                      <div 
                        className={`px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#D9F0F4] rounded-lg cursor-pointer transition-colors duration-200 ${isFilterActive('paymentStatus', 'Unpaid') ? 'bg-[#D9F0F4] font-semibold' : ''}`}
                        onClick={() => handleFilterClick('paymentStatus', 'Unpaid')}
                      >
                        Unpaid
                      </div>
                    </div>
                  </div>

                  {/* Clear All Filters Button */}
                  {hasActiveFilters() && (
                    <div className="pt-2 border-t border-[#B8E1E9]">
                      <button
                        onClick={clearAllFilters}
                        className="w-full bg-[#2a5f74] hover:bg-[#1a3f54] text-white py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-300 flex items-center justify-center"
                      >
                        <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5 mr-2" /> Clear All Filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Display active filters as tags */}
          {hasActiveFilters() && (
            <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-[#B8E1E9]/50">
              {searchTerm && (
                <div className="group flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 text-[#2a5f74] border border-[#B8E1E9] shadow-sm">
                  <span className="mr-1.5">Search:</span>
                  <span className="font-semibold italic mr-1.5">"{searchTerm}"</span>
                  <button
                    className="ml-1 p-1 rounded-full text-[#5DB2C7] hover:bg-[#B8E1E9]/60 hover:text-[#1a3f54] transition-colors duration-200"
                    onClick={() => setSearchTerm('')}
                  >
                    <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                  </button>
                </div>
              )}

              {activeFilters.jobType.map(type => (
                <div key={type} className="group flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100/80 text-green-700 border border-green-200 shadow-sm">
                  <span className="mr-1.5">Type:</span>
                  <span className="font-semibold mr-1.5">{type}</span>
                  <button
                    className="ml-1 p-1 rounded-full text-green-500 hover:bg-green-200 hover:text-green-800 transition-colors duration-200"
                    onClick={() => handleFilterClick('jobType', type)}
                  >
                    <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {activeFilters.jobSetting.map(setting => (
                <div key={setting} className="group flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-100/80 text-indigo-700 border border-indigo-200 shadow-sm">
                  <span className="mr-1.5">Setting:</span>
                  <span className="font-semibold mr-1.5">{setting}</span>
                  <button
                    className="ml-1 p-1 rounded-full text-indigo-500 hover:bg-indigo-200 hover:text-indigo-800 transition-colors duration-200"
                    onClick={() => handleFilterClick('jobSetting', setting)}
                  >
                    <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {activeFilters.paymentStatus.map(status => (
                <div key={status} className="group flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100/80 text-amber-700 border border-amber-200 shadow-sm">
                  <span className="mr-1.5">Status:</span>
                  <span className="font-semibold mr-1.5">{status}</span>
                  <button
                    className="ml-1 p-1 rounded-full text-amber-500 hover:bg-amber-200 hover:text-amber-800 transition-colors duration-200"
                    onClick={() => handleFilterClick('paymentStatus', status)}
                  >
                    <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {hasActiveFilters() && (
                <button
                  onClick={clearAllFilters}
                  className="ml-auto bg-[#2a5f74] hover:bg-[#1a3f54] text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-all duration-300 flex items-center"
                >
                  <FontAwesomeIcon icon={faXmark} className="w-3 h-3 mr-1.5" /> Clear All
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Pass the searchTerm and filters to the PostTiles component */}
        <div>
          <PostTiles 
            searchOverride={searchTerm} 
            filterOverride={{
              jobType: activeFilters.jobType,
              jobSetting: activeFilters.jobSetting,
              paymentStatus: activeFilters.paymentStatus
            }}
          />
        </div>
      </div>

      {/* Add animations */}
      <style jsx global>{`
        @keyframes dropdown {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-dropdown {
          animation: dropdown 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}