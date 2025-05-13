"use client";
import { useState } from 'react';
import CardTable from './CardTable';
import DatePicker from '../DatePicker';
import InternshipRow from './InternshipRow';
import NoResults from './NoResults';

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

// Video Sidebar Component
function InternshipVideoSidebar({ userMajor }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
      <h3 className="text-lg font-semibold text-[#2a5f74] mb-3">Internship Requirements</h3>
      <div className="space-y-3">
        <div className="relative rounded-lg overflow-hidden aspect-video group">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/KPD8C7c6P1w?si=46fIIWYEYW58AoJO"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
          <div className="absolute bottom-0 left-0 right-0 bg-[#2a5f74]/70 text-white text-xs py-2 px-3 pointer-events-none">
            Watch: Internships for {userMajor || 'Your Major'}
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Learn which internships count toward your graduation requirements based on your major and academic plan.
        </p>
        <div className="border-t pt-3">
          <h4 className="font-medium text-[#2a5f74] mb-2">Quick Resources</h4>
          <ul className="text-sm space-y-2">
            <li>
              <a href="#" className="text-[#3298BA] hover:underline">Academic Requirements Guide</a>
            </li>
            <li>
              <a href="#" className="text-[#3298BA] hover:underline">Contact Academic Advisor</a>
            </li>
            <li>
              <a href="#" className="text-[#3298BA] hover:underline">FAQs About Internships</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

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
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);

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

  return (
    <div className="w-full">
      {/* Search Bar - stays at full width above the content/sidebar split */}
      <CardTable
        title=""
        data={[]}
        filterFunction={() => true}
        emptyMessage=""
        searchConfig={{
          searchTerm: searchTerm,
          onSearchChange: setSearchTerm,
          placeholder: 'Search by job title, company, or skills...',
          hideSearchBar: false
        }}
        filterConfig={{ showFilter: false }}
        renderCard={() => null}
      />

      {/* Container for the content (filters, tabs, cards) AND the sidebar */}
      <div className="flex flex-col lg:flex-row gap-5 items-start mt-4">

        {/* Main Content Column (filters, tabs, internship cards) */}
        <div className="lg:flex-1 space-y-4">
          {customFilterPanel && (
            <div>{customFilterPanel}</div>
          )}

          {displayStatuses.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              {/* Status Tabs */}
              <div className="flex flex-wrap gap-2">
                {['all', ...displayStatuses].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                      ${activeTab === tab
                        ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#3298BA]'
                        : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {showDatePicker && (
                <DatePicker
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                />
              )}
            </div>
          )}

          {/* Internship Cards */}
          <CardTable
            data={internships}
            filterFunction={filterFunction}
            emptyMessage={
              <NoResults
                mainMessage={`No internships found matching your criteria`}
                subMessage="Try adjusting your search or filter"
              />
            }
            searchConfig={{
              hideSearchBar: true // Important: search bar is not repeated here
            }}
            filterConfig={{ showFilter: false }}
            renderCard={(internship) => (
              <InternshipRow
                key={internship.id}
                internship={internship}
                type={type}
                statusColors={statusColors}
                onApplicationCompleted={onApplicationCompleted}
                isApplied={appliedInternshipIds.has(internship.id)}
              />
            )}
          />
        </div>

        {/* Sidebar Column */}
        {showSidebar && (
          <div className="lg:w-80">
            <InternshipVideoSidebar userMajor={userMajor} />
          </div>
        )}
      </div>
    </div>
  );
} 