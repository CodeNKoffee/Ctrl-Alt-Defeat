// WorkshopList.js
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import WorkshopCard from "./WorkshopCard";
import WorkshopSidebar from "./WorkshopSidebar";
import WorkshopInterface from "./WorkshopInterface";
import PrerecordedWorkshopInterface from "./PrerecordedWorkshopInterface";
import { sampleWorkshops } from "../../constants/mockData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function WorkshopList({ canCreate = false, onCreateWorkshop, onSelectLive, sidebarExpanded }) {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [workshops, setWorkshops] = useState(sampleWorkshops);
  const [showLiveInterface, setShowLiveInterface] = useState(false);
  const [showPrerecordedInterface, setShowPrerecordedInterface] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const router = useRouter();

  // Listen to window resize to adjust layout
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleWorkshopClick = (workshop) => {
    setSelectedWorkshop(workshop);
  };

  const handleJoinLive = (workshop) => {
    if (onSelectLive) {
      // If onSelectLive callback is provided, use it
      onSelectLive(workshop);
    } else {
      // Show live interface directly
      setShowLiveInterface(true);
    }
  };

  const handleWatchPrerecorded = (workshop) => {
    setShowPrerecordedInterface(true);
  };

  const handleBackFromLive = () => {
    setShowLiveInterface(false);
  };

  const handleBackFromPrerecorded = () => {
    setShowPrerecordedInterface(false);
  };

  // Group workshops by type for better organization
  const upcomingWorkshops = workshops.filter(ws => ws.type === 'regular' || !ws.type);
  const liveWorkshops = workshops.filter(ws => ws.type === 'live');
  const prerecordedWorkshops = workshops.filter(ws => ws.type === 'prerecorded');

  // Filter workshops based on activeFilter
  const displayWorkshops = () => {
    switch (activeFilter) {
      case 'upcoming':
        return { upcoming: upcomingWorkshops, live: [], prerecorded: [] };
      case 'live':
        return { upcoming: [], live: liveWorkshops, prerecorded: [] };
      case 'prerecorded':
        return { upcoming: [], live: [], prerecorded: prerecordedWorkshops };
      case 'all':
      default:
        return { upcoming: upcomingWorkshops, live: liveWorkshops, prerecorded: prerecordedWorkshops };
    }
  };

  const filteredWorkshops = displayWorkshops();

  // Determine grid columns based on sidebars and screen width
  const getGridColumns = () => {
    const mainSidebarOpen = sidebarExpanded !== false; // Default to true if prop not provided
    const detailSidebarOpen = !!selectedWorkshop;

    // When both sidebars are open - always show 1 card per row
    if (detailSidebarOpen && mainSidebarOpen) {
      return "grid-cols-1";
    }

    // When only detail sidebar is open (main sidebar is closed)
    if (detailSidebarOpen && !mainSidebarOpen) {
      // For smaller screens still use 1 column
      if (windowWidth < 1280) {
        return "grid-cols-1";
      }
      // For larger screens use 2 columns
      return "grid-cols-2";
    }

    // When only main sidebar is open (no detail sidebar)
    if (!detailSidebarOpen && mainSidebarOpen) {
      if (windowWidth < 768) {
        return "grid-cols-1";
      } else if (windowWidth < 1280) {
        return "grid-cols-2";
      } else if (windowWidth < 1536) {
        return "grid-cols-3";
      } else {
        return "grid-cols-3";
      }
    }

    // When both sidebars are closed - maximum columns
    if (windowWidth < 768) {
      return "grid-cols-1";
    } else if (windowWidth < 1280) {
      return "grid-cols-2";
    } else if (windowWidth < 1536) {
      return "grid-cols-3";
    } else {
      return "grid-cols-4";
    }
  };

  // Card scale based on sidebars
  const getCardScale = () => {
    if (selectedWorkshop) {
      return "w-full transform scale-100";
    }
    return "w-full";
  };

  // Get container class for the card based on sidebar states
  const getCardContainerClass = () => {
    const mainSidebarOpen = sidebarExpanded !== false;
    const detailSidebarOpen = !!selectedWorkshop;

    // When only one card per row, make it wider
    if ((detailSidebarOpen && mainSidebarOpen) || windowWidth < 768) {
      return "max-w-2xl w-full";
    }

    // Two cards per row
    if ((detailSidebarOpen && !mainSidebarOpen) ||
      (windowWidth >= 768 && windowWidth < 1280)) {
      return "max-w-md w-full";
    }

    // For 3 or more cards per row
    return "max-w-md w-full";
  };

  if (showLiveInterface && selectedWorkshop) {
    return <WorkshopInterface workshop={selectedWorkshop} onBack={handleBackFromLive} />
  }

  if (showPrerecordedInterface && selectedWorkshop) {
    return <PrerecordedWorkshopInterface workshop={selectedWorkshop} onBack={handleBackFromPrerecorded} />
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-8">
      {/* Title and filter buttons */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        {canCreate && (
          <button
            onClick={onCreateWorkshop}
            className="mt-4 sm:mt-0 bg-[#2a5f74] hover:bg-[#1a3f54] text-white px-4 py-2 rounded-lg shadow-md flex items-center transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Workshop
          </button>
        )}
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-8 pl-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === 'all'
            ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#5DB2C7]'
            : 'bg-white text-gray-600 border border-gray-300 hover:bg-[#D9F0F4] hover:text-[#2a5f74] hover:border-[#5DB2C7]'
            }`}
        >
          ALL
        </button>
        <button
          onClick={() => setActiveFilter('upcoming')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === 'upcoming'
            ? 'bg-green-100 text-green-800 border-2 border-green-600'
            : 'bg-white text-gray-600 border border-gray-300 hover:bg-green-50 hover:text-green-800 hover:border-green-600'
            }`}
        >
          UPCOMING
        </button>
        <button
          onClick={() => setActiveFilter('live')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === 'live'
            ? 'bg-red-100 text-red-800 border-2 border-red-500'
            : 'bg-white text-gray-600 border border-gray-300 hover:bg-red-50 hover:text-red-800 hover:border-red-500'
            }`}
        >
          LIVE
        </button>
        <button
          onClick={() => setActiveFilter('prerecorded')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === 'prerecorded'
            ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-500'
            : 'bg-white text-gray-600 border border-gray-300 hover:bg-yellow-50 hover:text-yellow-800 hover:border-yellow-500'
            }`}
        >
          PRERECORDED
        </button>
      </div>

      {/* Main content area with relative positioning */}
      <div className="relative">
        {/* Workshop grid - will adjust width when sidebar is open */}
        <div className={`transition-all duration-300 ease-in-out ${selectedWorkshop ? "md:pr-[55%] lg:pr-[38%]" : "pr-0"
          }`}>
          {/* Upcoming Workshops */}
          {filteredWorkshops.upcoming.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-[#2a5f74] mb-6 pl-2">Upcoming Workshops</h2>
              <div className={`grid ${getGridColumns()} gap-5`}>
                {filteredWorkshops.upcoming.map((ws) => (
                  <div key={ws.id} className="flex justify-center">
                    <div className={`w-full ${getCardContainerClass()} pr-2`}>
                      <WorkshopCard
                        workshop={ws}
                        onClick={handleWorkshopClick}
                        className={getCardScale()}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Workshops */}
          {filteredWorkshops.live.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-[#2a5f74] mb-6 pl-2">Live Workshops</h2>
              <div className={`grid ${getGridColumns()} gap-5`}>
                {filteredWorkshops.live.map((ws) => (
                  <div key={ws.id} className="flex justify-center">
                    <div className={`w-full ${getCardContainerClass()} pr-2`}>
                      <WorkshopCard
                        workshop={ws}
                        onClick={handleWorkshopClick}
                        className={getCardScale()}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prerecorded Workshops */}
          {filteredWorkshops.prerecorded.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-[#2a5f74] mb-6 pl-2">Prerecorded Workshops</h2>
              <div className={`grid ${getGridColumns()} gap-5`}>
                {filteredWorkshops.prerecorded.map((ws) => (
                  <div key={ws.id} className="flex justify-center">
                    <div className={`w-full ${getCardContainerClass()} pr-2`}>
                      <WorkshopCard
                        workshop={ws}
                        onClick={handleWorkshopClick}
                        className={getCardScale()}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show "No workshops found" when filtered list is empty */}
          {!filteredWorkshops.upcoming.length && !filteredWorkshops.live.length && !filteredWorkshops.prerecorded.length && (
            <div className="flex justify-center items-center py-16 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No workshops found for this filter</p>
            </div>
          )}
        </div>

        {/* Fixed sidebar */}
        <WorkshopSidebar
          workshop={selectedWorkshop}
          onClose={() => setSelectedWorkshop(null)}
          onJoinLive={handleJoinLive}
          onWatchPrerecorded={handleWatchPrerecorded}
        />
      </div>
    </div>
  );
}