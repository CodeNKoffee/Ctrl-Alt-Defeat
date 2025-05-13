// WorkshopList.js
import { useState } from "react";
import WorkshopCard from "./WorkshopCard";
import WorkshopSidebar from "./WorkshopSidebar";
import { sampleWorkshops } from "../../constants/mockData";

export default function WorkshopList() {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-left text-[#2a5f74] relative">
          UPCOMING WORKSHOPS
          <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
        </h1>
      </div>

      {/* Main content area with relative positioning */}
      <div className="relative">
        {/* Workshop grid - will adjust width when sidebar is open */}
        <div className={`transition-all duration-300 ease-in-out ${selectedWorkshop ? "pr-[33%]" : "pr-0"}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleWorkshops.map((ws) => (
              <WorkshopCard 
                key={ws.id} 
                workshop={ws} 
                onClick={setSelectedWorkshop} 
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