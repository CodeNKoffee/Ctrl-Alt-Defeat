import { useState, useEffect } from "react";
import AssessmentCard from "./AssessmentCard";
import AssessmentSidebar from "./AssessmentSidebar";
import { mockAssessments } from "../../constants/mockData";

export default function AssessmentList({ sidebarExpanded }) {
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

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

  // Reset the sidebar content when a new assessment is selected
  useEffect(() => {
    if (selectedAssessment) {
      setSelectedAssessment(selectedAssessment);
    }
  }, [selectedAssessment]);

  // Determine grid columns based on sidebars and screen width
  const getGridColumns = () => {
    const mainSidebarOpen = sidebarExpanded !== false; // Default to true if prop not provided
    const detailSidebarOpen = !!selectedAssessment;

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

  // Get container class for the card based on sidebar states
  const getCardContainerClass = () => {
    const mainSidebarOpen = sidebarExpanded !== false;
    const detailSidebarOpen = !!selectedAssessment;

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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 min-h-screen flex flex-col">
      {/* Title */}
      {/* <div className="mb-8">
        <h1 className="text-3xl font-bold text-left text-[#2a5f74] relative">
          AVAILABLE ASSESSMENTS
          <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#2a5f74]"></span>
        </h1>
      </div> */}

      {/* Main content area with relative positioning */}
      <div className="relative">
        {/* Assessment grid - will adjust width when sidebar is open */}
        <div className={`transition-all duration-300 ease-in-out ${selectedAssessment ? "md:pr-[55%] lg:pr-[38%]" : "pr-0"}`}>
          <div className={`grid ${getGridColumns()} gap-5`}>
            {mockAssessments.map((assessment) => (
              <div key={assessment.id} className="flex justify-center">
                <div className={`w-full ${getCardContainerClass()} pr-2`}>
                  <AssessmentCard
                    assessment={assessment}
                    onClick={setSelectedAssessment}
                    className="w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed sidebar */}
        <AssessmentSidebar
          assessment={selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
        />
      </div>
    </div>
  );
}