import { useState, useEffect } from "react";
import AssessmentCard from "./AssessmentCard";
import AssessmentSidebar from "./AssessmentSidebar";
import { mockAssessments } from "../../constants/mockData";

export default function AssessmentList() {
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  // Reset the sidebar content when a new assessment is selected
  useEffect(() => {
    if (selectedAssessment) {
      setSelectedAssessment(selectedAssessment);
    }
  }, [selectedAssessment]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 min-h-screen flex flex-col">
    
      {/* Main content area with relative positioning */}
      <div className="relative">
        {/* Assessment grid - will adjust width when sidebar is open */}
        <div className={`transition-all duration-300 ease-in-out ${selectedAssessment ? "pr-0 lg:pr-[33%]" : "pr-0"}`}>
          <div className={`grid grid-cols-1 ${selectedAssessment ? "sm:grid-cols-1 lg:grid-cols-2 gap-0 -mx-1" : "sm:grid-cols-2 lg:grid-cols-3 gap-6"}`}>
            {mockAssessments.map((assessment) => (
              <AssessmentCard
                key={assessment.id}
                assessment={assessment}
                onClick={setSelectedAssessment}
                className={selectedAssessment ? "w-full transition-all duration-300 transform scale-[0.85] m-1" : "w-full"}
              />
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