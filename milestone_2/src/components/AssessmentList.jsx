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

  // Card container width
  const getCardContainerClass = () => {
    const sidebarOpen = !!selectedAssessment;
    if (sidebarOpen || windowWidth < 768) {
      return "max-w-2xl w-full";
    }
    if (!sidebarOpen && windowWidth >= 768 && windowWidth < 1280) {
      return "max-w-md w-full";
    }
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
        <div className={`transition-all duration-300 ease-in-out ${selectedAssessment ? "md:pr-[50%] lg:pr-[33%]" : "pr-0"}`}>
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