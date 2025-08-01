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
import { useTranslation } from 'react-i18next';
import { createSafeT } from '../../lib/translationUtils';
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
  onTriggerReportCreate,
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
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

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
      label: safeT('student.dashboard.statusPills.pending'),
      color: "bg-yellow-100 text-yellow-800 border-2 border-yellow-400",
      badgeColor: "bg-yellow-600",
    },
    accepted: {
      label: safeT('student.dashboard.statusPills.accepted'),
      color: "bg-green-100 text-green-800 border-2 border-green-400 ",
      badgeColor: "bg-green-600",
    },
    rejected: {
      label: safeT('student.dashboard.statusPills.rejected'),
      color: "bg-red-100 text-red-800 border-2 border-red-400 ",
      badgeColor: "bg-red-600",
    },
    finalized: {
      label: safeT('student.dashboard.statusPills.finalized'),
      color: "bg-purple-100 text-purple-800 border-2 border-purple-400",
      badgeColor: "bg-purple-600",
    },
    // For my internships
    current: {
      label: safeT('student.dashboard.statusPills.current'),
      color: "bg-blue-100 text-blue-800 border-2 border-blue-400",
      badgeColor: "bg-blue-600",
    },
    completed: {
      label: safeT('student.dashboard.statusPills.completed'),
      color: "bg-green-100 text-green-800 border-2 border-green-400",
      badgeColor: "bg-green-600",
    },
    evaluated: {
      label: safeT('student.dashboard.statusPills.evaluated'),
      color: "bg-purple-100 text-purple-800 border-2 border-purple-400",
      badgeColor: "bg-purple-600",
    }
  };
  const STATUS_CONFIG_HOVER = {
    // For applied internships
    pending: {
      label: safeT('student.dashboard.statusPills.pending'),
      color: "bg-white text-gray-600 border border-gray-300 hover:bg-yellow-100 hover:text-yellow-800 hover:border-yellow-400",
      badgeColor: "bg-yellow-600",
    },
    accepted: {
      label: safeT('student.dashboard.statusPills.accepted'),
      color: "bg-white text-gray-600 border border-gray-300 hover:bg-green-100 hover:text-green-800 hover:border-green-400",
      badgeColor: "bg-green-600",
    },
    rejected: {
      label: safeT('student.dashboard.statusPills.rejected'),
      color: "bg-white text-gray-600 border border-gray-300 hover:bg-red-100 hover:text-red-800 hover:border-red-400",
      badgeColor: "bg-red-600",
    },
    finalized: {
      label: safeT('student.dashboard.statusPills.finalized'),
      color: "bg-white text-gray-600 border border-gray-300 hover:bg-purple-100 hover:text-purple-800 hover:border-purple-400",
      badgeColor: "bg-purple-600",
    },
    // For my internships
    current: {
      label: safeT('student.dashboard.statusPills.current'),
      color: "bg-white text-gray-600 border border-gray-300 hover:bg-blue-200 hover:text-blue-900 hover:border-blue-500",
      badgeColor: "bg-blue-600",
    },
    completed: {
      label: safeT('student.dashboard.statusPills.completed'),
      color: "bg-white text-gray-600 border border-gray-300 hover:bg-green-100 hover:text-green-800 hover:border-green-400",
      badgeColor: "bg-green-600",
    },
    evaluated: {
      label: safeT('student.dashboard.statusPills.evaluated'),
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
    if (activeTab !== 'all' && (type === 'applied' || type === 'my')) {
      results = results.filter(internship => internship.status === activeTab);
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
  }, [internships, searchTerm, selectedIndustry, selectedDate, activeTab, type]);

  // Determine the appropriate date field label
  const getDateFieldLabel = () => {
    if (type === 'applied') return "Applied Date";
    if (type === 'my') return "Start Date";
    return "Posted Date";
  };

  // Handle clearing all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedIndustry('all');
    setSelectedDate(null);
    setActiveTab('all');
  };

  const handleTriggerReportCreate = (internship) => {
    // If parent provided onTriggerReportCreate, call that instead
    if (onTriggerReportCreate) {
      onTriggerReportCreate(internship);
    } else {
      setReportingInternship(internship);
    }
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
      {/* Only show internal report creation if parent didn't provide onTriggerReportCreate */}
      {reportingInternship && !onTriggerReportCreate ? (
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
                  selectedStatus={(type === 'applied' || type === 'my') ? activeTab : undefined}
                  onStatusChange={(type === 'applied' || type === 'my') ? setActiveTab : undefined}
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
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium h-[38px] transition-all flex items-center ${activeTab === 'all'
                      ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#5DB2C7]'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-[#D9F0F4] hover:text-[#2a5f74] hover:border-[#5DB2C7]'
                      }`}
                  >
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${activeTab === 'all' ? 'bg-[#5DB2C7]' : 'bg-gray-300'
                      }`}></span>
                    {safeT('student.dashboard.statusPills.all')}
                  </button>

                  {/* Status pills based on type */}
                  {displayStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setActiveTab(status)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium h-[38px] transition-all flex items-center ${activeTab === status
                        ? STATUS_CONFIG[status].color
                        : STATUS_CONFIG_HOVER[status].color
                        }`}
                    >
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${activeTab === status ? STATUS_CONFIG[status].badgeColor : 'bg-gray-300'
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
                    <NoResults
                      mainMessage={safeT('common.noResults.noInternships')}
                      subMessage={safeT('common.noResults.tryAdjusting')}
                    />
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

