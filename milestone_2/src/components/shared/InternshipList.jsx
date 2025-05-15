"use client";
import { useState } from 'react';
import CardTable from './CardTable';
import DatePicker from '../DatePicker';
import InternshipRow from './InternshipRow';
import NoResults from './NoResults';
import Report from "../Report";

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
    <div className="bg-white rounded-2xl shadow-md p-4 sticky top-4">
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
  isRecommended = false,
  // New: allow parent to control search/filter state
 
  searchTerm: controlledSearchTerm,
  setSearchTerm: controlledSetSearchTerm,
  activeTab: controlledActiveTab,
  setActiveTab: controlledSetActiveTab,
  selectedDate: controlledSelectedDate,
  setSelectedDate: controlledSetSelectedDate,
}) {
  // Use controlled state if provided, otherwise fallback to internal state
  const [internalSearchTerm, internalSetSearchTerm] = useState('');
  const [internalActiveTab, internalSetActiveTab] = useState('all');
  const [internalSelectedDate, internalSetSelectedDate] = useState(null);
 const [reportingInternship, setReportingInternship] = useState(false);
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

  return (
    <>
      {reportingInternship ? (
        <Report
          isOpen={true}
          onClose={handleReportClose}
          onAddTile={handleReportAddTile}
        />
      ) : (
        <div className="w-full px-4 py-6 space-y-4">
          <div className="w-full max-w-5xl mx-auto px-2 md:px-6">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-metallica-blue-200">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex-shrink-0 bg-[var(--metallica-blue-100)] rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[var(--metallica-blue-700)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400"></p>
                  <div className="text-2xl font-semibold text-[#2a5f74] mb-4"> {type=="my"?"Your Internships  Dashboard": type=="applied"?"Track Your Internship Applications":type=="recommended"?"Your Personalized Internship Matches":"Browse Career-Building Internships"}</div>
                  {type=="my"? <div className="text-gray-700 mb-2"> Manage all your internships in one place.
                  <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                  <li> Current internships are ongoing</li>
                  <li> Completed internships are awaiting your report and evaluation submissions</li>
                  <li> Evaluated ones have been reviewed by your supervisor</li>
                  </ul> 
                <p className="text-metallica-blue-700 font-medium">
                 Use the filters to sort through your internship history or search for specific opportunities.
                 </p>
                 </div>
                 :type=="applied"?<div className="text-gray-700 mb-2">Welcome to your personal internship tracking dashboard. Here you can monitor the status of all your internship applications in real-time.
                  <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                  <li><span className="text-metallica-blue-700 font-medium">Pending: </span> Your application has been submitted and is under review</li>
                  <li><span className="text-metallica-blue-700 font-medium">Finalized: </span> Your application has been reviewed and you've been shortlisted as one of the top candidates</li>
                  <li><span className="text-metallica-blue-700 font-medium">Accepted: </span> Congratulations! Your application has been approved</li>
                  <li><span className="text-metallica-blue-700 font-medium">Rejected: </span> Unfortunately, your application was not selected this time</li>
                  </ul> 
                <p className="text-metallica-blue-700 font-medium">
                 Need help with your pending applications? Contact your career advisor for guidance on follow-up strategies or preparation for upcoming interviews.
                </p>
                  </div>: type=="recommended"?<div className="text-gray-700 mb-2">This page showcases internship opportunities specifically curated for you based on your unique profile and preferences.
                  <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                  <p className="text-metallica-blue-700 font-medium">How These Recommendations Work:</p>
                  <li>Matched to your specified job interests and career goals</li>
                  <li> Filtered by your preferred industries and work environments</li>
                  <li>Includes positions highly rated by previous SCAD interns</li>
                  <li>Updated regularly as new opportunities become available</li>
                  </ul> 
                <p className="text-metallica-blue-700 font-medium">
                 Take time to explore these tailored suggestions—they represent opportunities where your specific talents and interests could truly shine. 
                </p>
                  </div>:<div className="text-gray-700 mb-2"> Explore curated internship opportunities provided by SCAD and our partner companies. These positions are designed to give you real-world experience while building your professional portfolio.
                  <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                    <p className="text-metallica-blue-700 font-medium">Why These Opportunities Matter:</p>
                  <li>Potential for academic credit and professional references</li>
                  <li> Networking connections that could lead to full-time employment</li>
                  <li>Portfolio-building projects to showcase your skills</li>
                  </ul> 
                <p className="text-metallica-blue-700 font-medium">
                  Remember to watch our informational video "What Makes Your Internship Count" to learn how to maximize your internship experience and ensure it contributes meaningfully to your academic requirements.
                </p>
                  </div>}
                  
                </div>
              </div>
            </div>
          </div>
          <div className="w-full max-w-3xl mx-auto">
            {/* Unified CardTable with ApplicationsFilterBar for search and filter */}
            <CardTable
              title=""
              data={internships}
              filterFunction={filterFunction}
              emptyMessage={
                <NoResults
                  mainMessage={`No internships found matching your criteria`}
                  subMessage="Try adjusting your search or filter"
                />
              }
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
                  isRecommended={isRecommended}
                  onTriggerReportCreate={handleTriggerReportCreate}
                />
              )}
            />
            {/* Custom Filter Panel (optional, if you want to keep it) */}
            {customFilterPanel && (
              <div className="w-full mb-4">{customFilterPanel}</div>
            )}
            {/* Date Picker (optional, if you want to keep it) */}
            {showDatePicker && (
              <div className="w-full flex justify-end mb-4">
                <DatePicker
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                />
              </div>
            )}
          </div>
          {/* Sidebar */}
          {showSidebar && (
            <div className="w-full lg:w-1/3">
              <InternshipVideoSidebar userMajor={userMajor} />
            </div>
          )}
        </div>
      )}
    </>
  );
}

