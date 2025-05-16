// WorkshopList.js
import { useState } from "react";
import { useRouter } from 'next/navigation';
import WorkshopCard from "./WorkshopCard";
import WorkshopSidebar from "./WorkshopSidebar";
import { sampleWorkshops } from "../../constants/mockData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function WorkshopList({ canCreate = false, onCreateWorkshop, onSelectLive }) {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [workshops, setWorkshops] = useState(sampleWorkshops);
  const router = useRouter();

  const handleWorkshopClick = (workshop) => {
    if (workshop.type === 'live') {
      if (onSelectLive) {
        // If onSelectLive callback is provided, use it
        onSelectLive(workshop);
      } else {
        // Fallback to router navigation if no callback provided
        router.push(`/dashboard/student/workshops/live/${workshop.id}`);
      }
    } else {
      setSelectedWorkshop(workshop);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="flex flex-wrap justify-between items-center">
        {/* <h1 className="text-3xl font-bold text-left text-[#2a5f74] relative">
          UPCOMING WORKSHOPS
          <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
        </h1> */}

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

      {/* Main content area with relative positioning */}
      <div className="relative">
        {/* Workshop grid - will adjust width when sidebar is open */}
        <div className={`transition-all duration-300 ease-in-out ${selectedWorkshop ? "pr-0 lg:pr-[33%]" : "pr-0"}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((ws) => (
              <WorkshopCard
                key={ws.id}
                workshop={ws}
                onClick={handleWorkshopClick}
              />
            ))}
          </div>
        </div>

        {/* Fixed sidebar */}
        <WorkshopSidebar
          workshop={selectedWorkshop}
          onClose={() => setSelectedWorkshop(null)}
        />
      </div>
    </div>
  );
}