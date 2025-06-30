"use client";
import React, { useState, useEffect } from 'react';
import CardTable from './CardTable';
import DatePicker from '../DatePicker';
import InternshipRow from './InternshipRow';
import NoResults from './NoResults';
import Report from "../Report";
import ApplicationsFilterBar from './ApplicationsFilterBar';
import StatusBadge from './StatusBadge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTimes, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import InternshipVideoSidebar from './InternshipVideoSidebar';
import ReportCreationDashboard from '../ReportCreationDashboard';

const statusColors = {
  // Applied internship statuses
  pending: 'bg-yellow-100 text-yellow-800 border-2 border-yellow-400',
  accepted: 'bg-green-100 text-green-800 border-2 border-green-400',
  finalized: 'bg-purple-100 text-purple-800 border-2 border-purple-400',
  rejected: 'bg-red-100 text-red-800 border-2 border-red-400',

  // My internship statuses
  current: 'bg-blue-100 text-blue-800 border-2 border-blue-400',
  completed: 'bg-green-100 text-green-800 border-2 border-green-400',
  evaluated: 'bg-purple-100 text-purple-800 border-2 border-purple-400',
};

export default function InternshipList({
  title = "INTERNSHIPS",
  internships = [],
  type = "regular", // "regular", "my", "applied"
  statuses = [],
  customFilterPanel,
  onApplicationCompleted,
  appliedInternshipIds = new Set(),
  showDatePicker = false,
  showSidebar = false,
  userMajor = "Computer Science",
  isRecommended = false,
  padding = "px-4 py-6",
  // New: allow parent to control search/filter state
  videoSidebarProps = {},
  searchTerm: controlledSearchTerm,
  setSearchTerm: controlledSetSearchTerm,
  activeTab: controlledActiveTab,
  setActiveTab: controlledSetActiveTab,
  selectedDate: controlledSelectedDate,
  setSelectedDate: controlledSetSelectedDate,
}) {
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [reportingInternship, setReportingInternship] = useState(false);

  // Use controlled state if provided, otherwise fallback to internal state
  const [internalSearchTerm, internalSetSearchTerm] = useState('');
  const [internalActiveTab, internalSetActiveTab] = useState('all');
  const [internalSelectedDate, internalSetSelectedDate] = useState(null);

  const searchTerm = controlledSearchTerm !== undefined ? controlledSearchTerm : internalSearchTerm;
  const setSearchTerm = controlledSetSearchTerm || internalSetSearchTerm;
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  const setActiveTab = controlledSetActiveTab || internalSetActiveTab;
  const selectedDate = controlledSelectedDate !== undefined ? controlledSelectedDate : internalSelectedDate;
  const setSelectedDate = controlledSetSelectedDate || internalSetSelectedDate;

  // Default statuses if none provided
  const displayStatuses = statuses.length > 0 ? statuses :
    type === "my" ? ['current', 'completed', 'evaluated'] :
      type === "applied" ? ['pending', 'accepted', 'finalized', 'rejected'] :
        [];

  // Status configuration for different internship types
  const STATUS_CONFIG = {
    // For applied internships
    pending: {
      label: "PENDING",
      color: "bg-yellow-100 text-yellow-800 border-2 border-yellow-400",
      badgeColor: "bg-yellow-600",
    },
    accepted: {
      label: "ACCEPTED",
      color: "bg-green-100 text-green-800 border-2 border-green-400 ",
      badgeColor: "bg-green-600",
    },
    rejected: {
      label: "REJECTED",
      color: "bg-red-100 text-red-800 border-2 border-red-400 ",
      badgeColor: "bg-red-600",
    },
    finalized: {
      label: "FINALIZED",
      color: "bg-purple-100 text-purple-800 border-2 border-purple-400",
      badgeColor: "bg-purple-600",
    },
    // For my internships
    current: {
      label: "CURRENT",
      color: "bg-blue-100 text-blue-800 border-2 border-blue-400",
      badgeColor: "bg-blue-600",
    },
    completed: {
      label: "COMPLETED",
      color: "bg-green-100 text-green-800 border-2 border-green-400",
      badgeColor: "bg-green-600",
    },
    evaluated: {
      label: "EVALUATED",
      color: "bg-purple-100 text-purple-800 border-2 border-purple-400",
      badgeColor: "bg-purple-600",
    }
  };
  const STATUS_CONFIG_HOVER = {
    // For applied internships
    pending: {
      label: "PENDING",
      color: "bg-white text-gray-600 border border-gray-300 hover:bg-yellow-100 hover:text-yellow-800 hover:border-yellow-400",
      badgeColor: "bg-yellow-600",
    },
    accepted: {
      label: "ACCEPTED",
      color: "bg-white text-gray-600 border border-gray-300 hover:bg-green-100 hover:text-green-800 hover:border-green-400",
      badgeColor: "bg-green-600",
    },
    rejected: {
      label: "REJECTED",
      color: "bg-white text-gray-600 border border-gray-300 hover:bg-red-100 hover:text-red-800 hover:border-red-400",
      badgeColor: "bg-red-600",
    },
    finalized: {
      label: "FINALIZED",
      color: "bg-white text-gray-600 border border-gray-300 hover:bg-purple-100 hover:text-purple-800 hover:border-purple-400",
      badgeColor: "bg-purple-600",
    },
    // For my internships
    current: {
      label: "CURRENT",
      color: "bg-white text-gray-600 border border-gray-300 hover:bg-blue-200 hover:text-blue-900 hover:border-blue-500",
      badgeColor: "bg-blue-600",
    },
    completed: {
      label: "COMPLETED",
      color: "bg-white text-gray-600 border border-gray-300 hover:bg-green-100 hover:text-green-800 hover:border-green-400",
      badgeColor: "bg-green-600",
    },
    evaluated: {
      label: "EVALUATED",
      color: "bg-white text-gray-600 border border-gray-300 hover:bg-purple-100 hover:text-purple-800 hover:border-purple-400",
      badgeColor: "bg-purple-600",
    }
  };

  // Generate status config for the current type view
  const getFilterStatusConfig = () => {
    const config = {};

    if (type === 'applied') {
      ['pending', 'accepted', 'rejected', 'finalized'].forEach(status => {
        if (STATUS_CONFIG[status]) {
          config[status] = STATUS_CONFIG[status];
        }
      });
    } else if (type === 'my') {
      ['current', 'completed', 'evaluated'].forEach(status => {
        if (STATUS_CONFIG[status]) {
          config[status] = STATUS_CONFIG[status];
        }
      });
    }

    return config;
  };

  // Get the active status config for the current type
  const activeStatusConfig = getFilterStatusConfig();

  // Get unique industries from internships
  const industries = React.useMemo(() => {
    const uniqueIndustries = [...new Set(internships.map(internship => internship.industry))];
    return uniqueIndustries
      .filter(Boolean)
      .map(industry => ({ id: industry, title: industry }));
  }, [internships]);

  // Filter internships based on search term, status, industry, and date
  useEffect(() => {
    let results = [...internships];

    // Filter by search term
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      results = results.filter(internship =>
        internship.title?.toLowerCase().includes(searchTermLower) ||
        internship.company?.toLowerCase().includes(searchTermLower) ||
        internship.industry?.toLowerCase().includes(searchTermLower) ||
        internship.locationType?.toLowerCase().includes(searchTermLower)
      );
    }

    // Filter by status for applied/my internships
    if (selectedStatus !== 'all' && (type === 'applied' || type === 'my')) {
      results = results.filter(internship => internship.status === selectedStatus);
    }

    // Filter by industry
    if (selectedIndustry !== 'all') {
      results = results.filter(internship => internship.industry === selectedIndustry);
    }

    // Filter by date
    if (selectedDate) {
      const dateToCheck = new Date(selectedDate);
      results = results.filter(internship => {
        let internshipDate;

        if (type === 'applied') {
          internshipDate = new Date(internship.appliedDate);
        } else if (type === 'my') {
          internshipDate = new Date(internship.startDate);
        } else {
          internshipDate = new Date(internship.postedDate);
        }

        return (
          internshipDate.getDate() === dateToCheck.getDate() &&
          internshipDate.getMonth() === dateToCheck.getMonth() &&
          internshipDate.getFullYear() === dateToCheck.getFullYear()
        );
      });
    }

    // Apply tab filtering (recent vs all)
    if (activeTab === 'recent' && type !== 'applied' && type !== 'my') {
      const now = new Date();
      // Consider recent as posted within the last 14 days
      const twoWeeksAgo = new Date(now.setDate(now.getDate() - 14));

      results = results.filter(internship => {
        const postedDate = new Date(internship.postedDate);
        return postedDate >= twoWeeksAgo;
      });
    }

    setFilteredInternships(results);
  }, [internships, searchTerm, selectedStatus, selectedIndustry, selectedDate, activeTab, type]);

  // Determine the appropriate date field label
  const getDateFieldLabel = () => {
    if (type === 'applied') return "Applied Date";
    if (type === 'my') return "Start Date";
    return "Posted Date";
  };

  // Handle clearing all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedIndustry('all');
    setSelectedDate(null);
    setActiveTab('all');
  };

  const handleTriggerReportCreate = (internship) => {
    setReportingInternship(internship);
  };

  const handleReportClose = () => {
    setReportingInternship(null);
  };

  const handleReportAddTile = (data) => {
    // Handle any data submission from the report if necessary
    // For now, just closes the report view
    setReportingInternship(null);
    // You might want to trigger a data refresh or navigation here
  };

  // Build searchConfig and filterConfig for CardTable
  const searchConfig = {
    searchTerm,
    onSearchChange: setSearchTerm,
    placeholder: 'Search by job title, company, or skills...',
    hideSearchBar: false,
  };

  const filterConfig = {
    showFilter: true,
    selectedFilter: activeTab,
    onFilterChange: setActiveTab,
    statusConfig: statusColors, // color mapping for statuses
    internships: [], // can be filled if you want internship filter
    onClearFilters: () => {
      setSearchTerm('');
      setActiveTab('all');
      setSelectedDate(null);
    },
  };

  // Only show tabs in browser view, not in home/recommended view
  const shouldShowTabs = !isRecommended && type !== 'applied' && type !== 'my';

  // Only show status filters for applied and my internships
  const shouldShowStatusFilters = type === 'applied' || type === 'my';

  return (
    <>
      {reportingInternship ? (
        <ReportCreationDashboard
          onAddTile={handleReportAddTile}
          onCancel={handleReportClose}
          initialReport={reportingInternship}
          isEditMode={false}
        />
      ) : (
        <div className={`w-full ${padding} space-y-4`}>
          {/* Filter and Search Section */}
          <div className="w-full max-w-6xl mx-auto">
            {/* Custom Filter Panel (if provided) */}
            {customFilterPanel && (
              <div className="mb-4">{customFilterPanel}</div>
            )}

            {/* ApplicationsFilterBar - Simplified with just search and filter */}
            {!customFilterPanel && (
              <div className="mb-6 relative isolation-auto">
                <ApplicationsFilterBar
                  // Search functionality
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  searchPlaceholder={type === 'recommended' ? "Search recommended internships ...." : `Search your ${type === 'my' ? 'internships' : 'applications'} by job title or company name ....`}

                  // Industry filtering
                  primaryFilterName="Filter"
                  selectedPrimaryFilter={selectedIndustry}
                  onPrimaryFilterChange={setSelectedIndustry}
                  primaryFilterOptions={industries}

                  // Status filtering (only for applied/my)
                  selectedStatus={(type === 'applied' || type === 'my') ? selectedStatus : undefined}
                  onStatusChange={(type === 'applied' || type === 'my') ? setSelectedStatus : undefined}
                  statusConfig={(type === 'applied' || type === 'my') ? activeStatusConfig : {}}

                  // Date filtering
                  showDatePicker={showDatePicker}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}

                  // Disable tabs within the filter bar
                  showTabs={false}

                  // Filter actions
                  onClearFilters={clearFilters}

                  // UI customization
                  bgColor="bg-[#D9F0F4]/60"
                />
              </div>
            )}

            {/* Status Filter Pills - Only for applied and my internships */}
            {shouldShowStatusFilters && (
              <div className="w-full max-w-6xl mx-auto mb-6">
                <div className="flex flex-wrap gap-2 items-center">
                  <button
                    onClick={() => setSelectedStatus('all')}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium h-[38px] transition-all flex items-center ${selectedStatus === 'all'
                      ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#5DB2C7]'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-[#D9F0F4] hover:text-[#2a5f74] hover:border-[#5DB2C7]'
                      }`}
                  >
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${selectedStatus === 'all' ? 'bg-[#5DB2C7]' : 'bg-gray-300'
                      }`}></span>
                    ALL
                  </button>

                  {/* Status pills based on type */}
                  {displayStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium h-[38px] transition-all flex items-center ${selectedStatus === status
                        ? STATUS_CONFIG[status].color
                        : STATUS_CONFIG_HOVER[status].color
                        }`}
                    >
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${selectedStatus === status ? STATUS_CONFIG[status].badgeColor : 'bg-gray-300'
                        }`}></span>
                      {STATUS_CONFIG[status].label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main content area with grid layout for sidebar and internship list */}
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main content (internship list) */}
              <div className={`${showSidebar ? 'lg:w-2/3' : 'w-full'}`}>

                {/* Internship List */}
                <div className="space-y-3 relative">
                  {filteredInternships.length === 0 ? (
                    <div className="p-16 text-center">
                      <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">No internships found matching your criteria</p>
                      <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
                    </div>
                  ) : (
                    filteredInternships.map(internship => (
                      <InternshipRow
                        key={internship.id}
                        internship={internship}
                        type={type}
                        onApplicationCompleted={onApplicationCompleted}
                        isApplied={appliedInternshipIds?.has(internship.id)}
                        onTriggerReportCreate={handleTriggerReportCreate}
                        isRecommended={isRecommended}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Sidebar (only shown if showSidebar is true) */}
              {showSidebar && (
                <div className="lg:w-1/3">
                  <InternshipVideoSidebar userMajor={userMajor} {...videoSidebarProps} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

