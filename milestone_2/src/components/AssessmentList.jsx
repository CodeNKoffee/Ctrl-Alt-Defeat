import { useState, useEffect } from "react";
import AssessmentCard from "./AssessmentCard";
import AssessmentSidebar from "./AssessmentSidebar";
import { mockAssessments } from "../../constants/mockData";

export default function AssessmentList() {
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive grid columns logic
  const getGridColumns = () => {
    const sidebarOpen = !!selectedAssessment;
    if (sidebarOpen && windowWidth >= 768) {
      return "grid-cols-1";
    }
    if (!sidebarOpen && windowWidth < 768) {
      return "grid-cols-1";
    }
    if (!sidebarOpen && windowWidth < 1280) {
      return "grid-cols-2";
    }
    if (!sidebarOpen && windowWidth < 1536) {
      return "grid-cols-3";
    }
    return "grid-cols-4";
  };

  // Card container width - adjusted to prevent overlap
  const getCardContainerClass = () => {
    const sidebarOpen = !!selectedAssessment;
    if (sidebarOpen) {
      return "max-w-xl w-full";  // Smaller max-width when sidebar is open
    }
    return "max-w-md w-full";    // Default size when sidebar is closed
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 min-h-screen flex flex-col">
      {/* Main content area with relative positioning */}
      <div className="relative">
        {/* Assessment grid - adjusted spacing when sidebar is open */}
        <div className={`transition-all duration-300 ease-in-out ${selectedAssessment ? "md:pr-[calc(33%+24px)] lg:pr-[calc(33%+32px)]" : "pr-0"}`}>
          <div className={`grid ${getGridColumns()} gap-6`}>
            {mockAssessments.map((assessment) => (
              <div key={assessment.id} className="flex justify-center">
                <div className={`${getCardContainerClass()}`}>
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

        {/* Fixed sidebar - ensure it doesn't overlap with content */}
        <AssessmentSidebar
          assessment={selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
        />
      </div>
    </div>
  );
}