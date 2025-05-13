"use client"
import { useState } from "react";

export default function ReportTiles({ tiles, onEditClick, onDeleteClick }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tiles.map((tile, index) => (
        <div key={index} className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-2">{tile.internshipTitle}</h3>
          <p className="text-sm text-gray-600 mb-1">{tile.companyOrgName}</p>
          <p className="text-sm text-gray-600 mb-1">{tile.tasks}</p>
          <p className="text-sm text-gray-600 mb-1">Satisfaction: {tile.satisfaction}</p>
          <p className="text-sm text-gray-600">Recommendation: {tile.recommendation}</p>
          {expandedIndex === index && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">Introduction: {tile.introduction}</p>
              <p className="text-sm text-gray-600">Company Description: {tile.companyDesc}</p>
              <p className="text-sm text-gray-600">Evaluation: {tile.evaluation}</p>
              <p className="text-sm text-gray-600">Conclusion: {tile.conclusion}</p>
              <p className="text-sm text-gray-600">References: {tile.references}</p>
              <p className="text-sm text-gray-600">Appendices: {tile.appendencies}</p>
            </div>
          )}
          <div className="mt-2 space-x-2">
            <button onClick={() => onEditClick(index)} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
            <button onClick={() => onDeleteClick(index)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
            <button onClick={() => toggleExpand(index)} className="px-3 py-1 bg-green-500 text-white rounded">
              {expandedIndex === index ? "Collapse" : "View Full Report"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}