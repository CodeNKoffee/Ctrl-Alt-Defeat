"use client";
import { useState } from 'react';
import CardTable from './shared/CardTable';
import DatePicker from '../DatePicker';
import InternshipRow from './InternshipRow';
import NoResults from './NoResults';
import Report from "../Report"; // Import the Report component

const statusColors = {
  // Applied internship statuses
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  accepted: 'bg-green-100 text-green-800 border-green-400',
  finalized: 'bg-purple-100 text-purple-800 border-purple-400',
  rejected: 'bg-red-100 text-red-800 border-red-400',

  // My internship statuses
  current: 'bg-blue-100 text-blue-800 border-blue-400',
  completed: 'bg-green-100 text-green-800 border-green-400',
  evaluated: 'bg-purple-100 text-purple-800 border-purple-400',
};

export default function InternshipList({
  title = "INTERNSHIPS",
  internships = [],
  type = "regular", // "regular", "my", "applied"
  statuses = [],
  customFilterPanel,
  onApplicationCompleted,
  appliedInternshipIds = new Set(),
  showDatePicker = true,
  showSidebar = false,
  userMajor = "Computer Science",
  isRecommended = false,
  onTriggerReportCreate, // Accept this prop from parent
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [reportingInternship, setReportingInternship] = useState(null); // New state

  // Default statuses if none provided
  const displayStatuses = statuses.length > 0 ? statuses :
    type === "my" ? ['current', 'completed', 'evaluated'] :
      type === "applied" ? ['pending', 'accepted', 'finalized', 'rejected'] :
        [];

  const filterFunction = (internship) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      internship.title.toLowerCase().includes(searchLower) ||
      internship.company.toLowerCase().includes(searchLower) ||
      (internship.skills && internship.skills.some(skill =>
        skill.toLowerCase().includes(searchLower))
      );

    const matchesStatus =
      activeTab === 'all' ||
      internship.status?.toLowerCase() === activeTab;

    const matchesDate = !selectedDate || (
      (type === "applied" && internship.appliedDate && new Date(internship.appliedDate).toDateString() === new Date(selectedDate).toDateString()) ||
      (type !== "applied" && internship.startDate && new Date(internship.startDate).toDateString() === new Date(selectedDate).toDateString())
    );

    // For "applied" type, only show internships with applied statuses
    if (type === "applied") {
      const isApplied = displayStatuses.includes(internship.status?.toLowerCase());
      return matchesSearch && matchesStatus && matchesDate && isApplied;
    }

    // For "my" type, only show internships with my statuses
    if (type === "my") {
      const isMine = displayStatuses.includes(internship.status?.toLowerCase());
      return matchesSearch && matchesStatus && matchesDate && isMine;
    }

    // For regular internships, show all
    return matchesSearch && matchesStatus && matchesDate;
  };

  const handleTriggerReportCreate = (internship) => {
    // If parent provided onTriggerReportCreate, call that instead
    if (onTriggerReportCreate) {
      onTriggerReportCreate(internship);
      return;
    }

    // Otherwise, use the internal state approach
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

  // Only render the ReportCreationDashboard as a modal if we're using the internal state approach
  // (i.e., parent didn't provide onTriggerReportCreate)
  if (reportingInternship && !onTriggerReportCreate) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-metallica-blue-700 text-2xl font-bold"
            onClick={() => setReportingInternship(null)}
            aria-label="Close"
          >
            &times;
          </button>
          <ReportCreationDashboard
            onAddTile={handleReportAddTile}
            onCancel={() => setReportingInternship(null)}
            initialReport={reportingInternship}
          />
        </div>
      </div>
    );
  }

  // Build filterConfig and searchConfig for CardTable
  const searchConfig = {
    searchTerm,
    onSearchChange: setSearchTerm,
    selectedInternship: undefined, // You can add internship filter if needed
    onInternshipChange: undefined, // You can add internship filter if needed
    hideSearchBar: false,
  };

  const filterConfig = {
    showFilter: true,
    selectedFilter: activeTab,
    onFilterChange: setActiveTab,
    statusConfig: statusColors, // or your status config object for color
    internships: [], // You can pass internship list if you want internship filter
    onClearFilters: () => {
      setSearchTerm('');
      setActiveTab('all');
      setSelectedDate(null);
    },
  };

  return (
    <div className="w-full">
      <CardTable
        title={title}
        data={internships}
        filterFunction={filterFunction}
        searchConfig={searchConfig}
        filterConfig={filterConfig}
        renderCard={(internship) => (
          <InternshipRow
            key={internship.id}
            internship={internship}
            type={type}
            statusColors={statusColors}
            onApplicationCompleted={onApplicationCompleted}
            isApplied={appliedInternshipIds.has(internship.id)}
            onTriggerReportCreate={handleTriggerReportCreate} // Pass the handler down
          />
        )}
      />
    </div>
  );
}