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
          {mockAssessments.length === 0 ? (
            <div className="p-16 text-center">
              <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No assessments found matching your criteria</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
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
          )}
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