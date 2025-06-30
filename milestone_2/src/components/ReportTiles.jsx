"use client"
import { useState } from "react";

import { useRouter } from "next/navigation";

import StatusBadge from "./shared/StatusBadge";


export default function ReportTiles({ tiles, onEditClick, onDeleteClick }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const router = useRouter();

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const navigateToReportViewer = (index) => {
    // In a real application, you would pass the report ID as a parameter
    router.push("/en/dashboard/student/report-viewer");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tiles.length === 0 ? (
        <div className="col-span-full p-16 text-center">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No reports found matching your criteria</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        tiles.map((tile, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden break-words">
            <h1 className="text-lg font-bold text-gray-800 mb-2 break-words">Report Summary</h1>
            <h3>Internship Title:</h3>
            <p>{tile.internshipTitle}</p>
            <h3>Organization Name:</h3>
            <p className="text-sm text-gray-600 mb-1 break-words">{tile.companyOrgName}</p>
            <h3>Performed Tasks:</h3>
            <p className="text-sm text-gray-600 mb-1 break-words">{tile.tasks}</p>
            <p className="text-sm text-gray-600 mb-1 break-words">Satisfaction: {tile.satisfaction}</p>
            <p className="text-sm text-gray-600 break-words">Recommendation: {tile.recommendation}</p>

            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">Major:</p>
              <StatusBadge color="bg-blue-100 text-blue-800">{tile.major}</StatusBadge>
            </div>

            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">Helpful Courses:</p>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(tile.selectedCourses) && tile.selectedCourses.map((course, idx) => (
                  <StatusBadge key={idx} color="bg-green-100 text-green-800">{course}</StatusBadge>
                ))}
              </div>
            </div>

            {expandedIndex === index && (
              <div className="mt-4 space-y-2">
                <h3>Introduction:</h3>
                <p className="text-sm text-gray-600">{tile.introduction}</p>
                <h3>Company Description:</h3>
                <p className="text-sm text-gray-600">{tile.companyDesc}</p>
                <h3>Evaluation:</h3>
                <p className="text-sm text-gray-600">{tile.evaluation}</p>
                <h3>Conclusion:</h3>
                <p className="text-sm text-gray-600">{tile.conclusion}</p>
                <h3>References:</h3>
                <p className="text-sm text-gray-600">{tile.references}</p>
                <h3>Appendices:</h3>
                <p className="text-sm text-gray-600">{tile.appendencies}</p>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => onEditClick(index)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">Edit</button>
              <button onClick={() => onDeleteClick(index)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">Delete</button>
              <button onClick={() => toggleExpand(index)} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition">
                {expandedIndex === index ? "Collapse" : "View Full Report"}
              </button>
              <button
                onClick={() => navigateToReportViewer(index)}
                className="inline-flex items-center px-4 py-2 bg-[var(--metallica-blue-600)] text-white rounded-lg hover:bg-[var(--metallica-blue-700)] transition shadow-sm hover:shadow-md"
                title="View report with annotation features"
              >
                <span className="font-medium">View</span>
                <div className="w-px h-4 mx-2 bg-[var(--metallica-blue-300)]"></div>
                <span className="text-xs">Read & Annotate</span>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}