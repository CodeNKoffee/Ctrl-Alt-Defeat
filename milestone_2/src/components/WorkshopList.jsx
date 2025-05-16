// WorkshopList.js
import { useState } from "react";
import { useRouter } from 'next/navigation';
import WorkshopCard from "./WorkshopCard";
import WorkshopSidebar from "./WorkshopSidebar";
import WorkshopInterface from "./WorkshopInterface";
import PrerecordedWorkshopInterface from "./PrerecordedWorkshopInterface";
import { sampleWorkshops } from "../../constants/mockData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function WorkshopList({ canCreate = false, onCreateWorkshop, onSelectLive }) {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [workshops, setWorkshops] = useState(sampleWorkshops);
  const [showLiveInterface, setShowLiveInterface] = useState(false);
  const [showPrerecordedInterface, setShowPrerecordedInterface] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const router = useRouter();

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
      <div className="flex items-center space-x-2 mb-8">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === 'all'
              ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#5DB2C7]'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
        >
          ALL
        </button>
        <button
          onClick={() => setActiveFilter('upcoming')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === 'upcoming'
              ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#5DB2C7]'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
        >
          UPCOMING
        </button>
        <button
          onClick={() => setActiveFilter('live')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === 'live'
              ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#5DB2C7]'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
        >
          LIVE
        </button>
        <button
          onClick={() => setActiveFilter('prerecorded')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === 'prerecorded'
              ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#5DB2C7]'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
        >
          PRERECORDED
        </button>
      </div>

      {/* Main content area with relative positioning */}
      <div className="relative">
        {/* Workshop grid - will adjust width when sidebar is open */}
        <div className={`transition-all duration-300 ease-in-out ${selectedWorkshop ? "pr-0 lg:pr-[33%]" : "pr-0"}`}>
          {/* Upcoming Workshops */}
          {filteredWorkshops.upcoming.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-[#2a5f74] mb-6">Upcoming Workshops</h2>
              <div className={`grid grid-cols-1 ${selectedWorkshop ? "sm:grid-cols-1 lg:grid-cols-2 gap-0 -mx-1" : "sm:grid-cols-2 lg:grid-cols-3 gap-6"}`}>
                {filteredWorkshops.upcoming.map((ws) => (
                  <WorkshopCard
                    key={ws.id}
                    workshop={ws}
                    onClick={handleWorkshopClick}
                    className={selectedWorkshop ? "w-full transition-all duration-300 transform scale-[0.85] m-1" : "w-full"}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Live Workshops */}
          {filteredWorkshops.live.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-[#2a5f74] mb-6">Live Workshops</h2>
              <div className={`grid grid-cols-1 ${selectedWorkshop ? "sm:grid-cols-1 lg:grid-cols-2 gap-0 -mx-1" : "sm:grid-cols-2 lg:grid-cols-3 gap-6"}`}>
                {filteredWorkshops.live.map((ws) => (
                  <WorkshopCard
                    key={ws.id}
                    workshop={ws}
                    onClick={handleWorkshopClick}
                    className={selectedWorkshop ? "w-full transition-all duration-300 transform scale-[0.85] m-1" : "w-full"}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Prerecorded Workshops */}
          {filteredWorkshops.prerecorded.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-[#2a5f74] mb-6">Prerecorded Workshops</h2>
              <div className={`grid grid-cols-1 ${selectedWorkshop ? "sm:grid-cols-1 lg:grid-cols-2 gap-0 -mx-1" : "sm:grid-cols-2 lg:grid-cols-3 gap-6"}`}>
                {filteredWorkshops.prerecorded.map((ws) => (
                  <WorkshopCard
                    key={ws.id}
                    workshop={ws}
                    onClick={handleWorkshopClick}
                    className={selectedWorkshop ? "w-full transition-all duration-300 transform scale-[0.85] m-1" : "w-full"}
                  />
                ))}
              </div>
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