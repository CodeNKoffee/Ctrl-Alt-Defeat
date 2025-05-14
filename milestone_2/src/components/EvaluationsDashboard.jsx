"use client";
import React, { useState } from "react";
import Evaluation from "./Evaluation";

export default function EvaluationsDashboard({ evaluations, stakeholder = "other" }) {
  // Only one expanded at a time, like ReportTiles
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 md:px-6">
      {/* Info box at the top, like my-reports */}
      <div className="bg-white rounded-xl shadow p-6 mb-8 flex flex-col md:flex-row items-center gap-4 border border-[#E2F4F7]">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div>
            <h2 className="text-2xl font-bold text-[#2A5F74]">My Evaluations</h2>
            <p className="text-[#4C798B] text-sm">All your submitted company evaluations are shown below.</p>
          </div>
        </div>
      </div>
      {/* Evaluations grid, consistent sizing and spacing */}
      <div className="w-full flex flex-wrap justify-start gap-6">
        {evaluations && evaluations.length > 0 ? (
          evaluations.map((evaluation, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 flex-grow-0 basis-[23%] max-w-[23%] min-w-[270px]"
            >
              <Evaluation
                evaluation={evaluation}
                expanded={expandedIndex === idx}
                onExpand={() => handleExpand(idx)}
                stakeholder={stakeholder}
              />
            </div>
          ))
        ) : (
          <div className="w-full text-center text-gray-400 py-10">No evaluations yet.</div>
        )}
      </div>
    </div>
  );
}
