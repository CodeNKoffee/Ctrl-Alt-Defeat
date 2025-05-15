"use client";
import React, { useState, useEffect } from "react";
import Evaluation from "./Evaluation";
import SearchBar from "./shared/SearchBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimesCircle, faCalendar } from '@fortawesome/free-solid-svg-icons';

export default function EvaluationsDashboard({ evaluations: initialEvaluations, stakeholder = "other" }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("submitted");
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isFiltersActive, setIsFiltersActive] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    setEvaluations(initialEvaluations || []);
  }, [initialEvaluations]);

  const handleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setIsFiltersActive(false);
  };

  const clearStartDate = () => {
    setStartDate('');
  };

  const clearEndDate = () => {
    setEndDate('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    setIsFiltersActive(searchTerm.trim() !== '' || startDate !== '' || endDate !== '');
  }, [searchTerm, startDate, endDate]);

  useEffect(() => {
    if (!evaluations || evaluations.length === 0) {
      setFilteredEvaluations([]);
      return;
    }

    let tabEvaluations = [...evaluations];
    
    if (stakeholder === "student") {
      if (activeTab === "submitted") {
        tabEvaluations = evaluations.slice(0, 3);
      } else {
        tabEvaluations = evaluations.slice(3);
      }
    }

    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      tabEvaluations = tabEvaluations.filter(evaluation => 
        evaluation.companyName?.toLowerCase().includes(search) ||
        evaluation.supervisorName?.toLowerCase().includes(search) ||
        evaluation.studentName?.toLowerCase().includes(search)
      );
    }
    
    if (startDate) {
      const start = new Date(startDate);
      tabEvaluations = tabEvaluations.filter(evaluation => {
        const evalDate = new Date(evaluation.submissionDate || evaluation.date);
        return evalDate >= start;
      });
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      tabEvaluations = tabEvaluations.filter(evaluation => {
        const evalDate = new Date(evaluation.submissionDate || evaluation.date);
        return evalDate <= end;
      });
    }
    
    setFilteredEvaluations(tabEvaluations);
  }, [evaluations, activeTab, searchTerm, startDate, endDate, stakeholder]);

  const handleUpdateEvaluation = (updatedEvaluation) => {
    const updatedEvaluations = evaluations.map(item => 
      item.id === updatedEvaluation.id ? updatedEvaluation : item
    );
    setEvaluations(updatedEvaluations);
  };

  const handleDeleteEvaluation = (evaluationId) => {
    const updatedEvaluations = evaluations.filter(item => item.id !== evaluationId);
    setEvaluations(updatedEvaluations);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 md:px-6">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-metallica-blue-200">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-shrink-0 bg-[var(--metallica-blue-100)] rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[var(--metallica-blue-700)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
          </div>
          <div>
            <p className="text-sm text-gray-400"></p>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-4">{stakeholder === "student" ? "Your Company Internship Evaluations": "Student Evaluations"}</div>
            <div className="text-gray-700 mb-2">{stakeholder === "student" ? " Below are the evaluations you submitted for the companies where you completed internships and evaluations you have saved as drafts and are awaiting your submission.": "Below are the evaluations of students that have completed their internships at the various companies they have access to through the system."}
            </div>
          </div>
        </div>
      </div>

      {stakeholder === "student" && (
        <div className="flex justify-start mb-6 px-4 gap-10">
          <div className="inline-flex rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab("submitted")}
              className={`px-6 py-2 rounded-full font-semibold transition-colors bg-[#eaf3f7] text-metallica-blue-700 ${
                activeTab === "submitted"
                ? "px-6 py-2 rounded-full font-semibold transition-colors bg-metallica-blue-600 text-white" 
              : "px-6 py-2 rounded-full font-semibold transition-colors bg-[#eaf3f7] text-metallica-blue-700"
              }`}
            >
              Submitted Evaluations
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-6 py-2 rounded-full font-semibold transition-colors bg-[#eaf3f7] text-metallica-blue-700 ${
                activeTab === "saved"
                ? "px-6 py-2 rounded-full font-semibold transition-colors bg-metallica-blue-600 text-white" 
              : "px-6 py-2 rounded-full font-semibold transition-colors bg-[#eaf3f7] text-metallica-blue-700"
              }`}
            >
              Saved as Draft
            </button>
          </div>
        </div>
      )}

      {stakeholder !== "student" && (
        <div className="mt-8 bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl text-metallica-blue-800 font-semibold mb-4 md:mb-0">Student Evaluations</h2>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-grow">
              <SearchBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Search by student, company or supervisor..."
                className="w-full"
              />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className={`flex-shrink-0 flex items-center justify-center px-4 py-2.5 rounded-lg transition-colors ${isFiltersActive ? 'bg-metallica-blue-600 text-white' : 'bg-metallica-blue-100 text-metallica-blue-800'}`}
            >
              <FontAwesomeIcon icon={faFilter} className={showFilters ? "mr-2" : ""} />
              {showFilters && <span>Filters</span>}
              {isFiltersActive && (
                <span className="ml-2 bg-white text-metallica-blue-800 rounded-full w-5 h-5 inline-flex items-center justify-center text-xs font-bold">
                  {(searchTerm ? 1 : 0) + (startDate ? 1 : 0) + (endDate ? 1 : 0)}
                </span>
              )}
            </button>
            
            {isFiltersActive && (
              <button 
                onClick={clearFilters}
                className="flex-shrink-0 flex items-center justify-center px-4 py-2.5 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
              >
                <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                <span>Clear</span>
              </button>
            )}
          </div>
          
          {isFiltersActive && (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-metallica-blue-100 text-metallica-blue-800 text-sm">
                  Search: {searchTerm}
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="ml-2 text-metallica-blue-800 hover:text-metallica-blue-600 focus:outline-none"
                  >
                    <FontAwesomeIcon icon={faTimesCircle} className="h-3 w-3" />
                  </button>
                </span>
              )}
              {startDate && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-metallica-blue-100 text-metallica-blue-800 text-sm">
                  <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                  From: {formatDate(startDate)}
                  <button 
                    onClick={clearStartDate}
                    className="ml-2 text-metallica-blue-800 hover:text-metallica-blue-600 focus:outline-none"
                  >
                    <FontAwesomeIcon icon={faTimesCircle} className="h-3 w-3" />
                  </button>
                </span>
              )}
              {endDate && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-metallica-blue-100 text-metallica-blue-800 text-sm">
                  <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                  To: {formatDate(endDate)}
                  <button 
                    onClick={clearEndDate}
                    className="ml-2 text-metallica-blue-800 hover:text-metallica-blue-600 focus:outline-none"
                  >
                    <FontAwesomeIcon icon={faTimesCircle} className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
          
          {showFilters && (
            <div className="mb-6 p-4 bg-metallica-blue-50 rounded-lg border border-metallica-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-metallica-blue-800 mb-1">
                    Date Range
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <label htmlFor="startDate" className="block text-xs text-gray-600 mb-1">Start Date</label>
                      <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-metallica-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-metallica-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="endDate" className="block text-xs text-gray-600 mb-1">End Date</label>
                      <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                        className="w-full px-3 py-2 border border-metallica-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-metallica-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-metallica-blue-800 mb-1">
                    Search Options
                  </label>
                  <p className="text-sm text-gray-600">
                    Use the search box above to filter evaluations by student name, company name, or supervisor name.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
            
      <div className="w-full flex flex-wrap justify-start gap-6 relative bg-[#f4fafd] rounded-2xl shadow-md p-6">
        {filteredEvaluations && filteredEvaluations.length > 0 ? (
          filteredEvaluations.map((evaluation, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 flex-grow-0 basis-[23%] max-w-[23%] min-w-[270px] mb-16"
            >
              <Evaluation
                evaluation={evaluation}
                expanded={expandedIndex === idx}
                onExpand={() => handleExpand(idx)}
                stakeholder={stakeholder}
                isDraft={stakeholder === "student" && activeTab === "saved"}
                onUpdate={handleUpdateEvaluation}
                onDelete={handleDeleteEvaluation}
              />
            </div>
          ))
        ) : (
          <div className="w-full text-center text-gray-400 py-10">
            {stakeholder === "student" 
              ? activeTab === "submitted" 
                ? "No submitted evaluations found." 
                : "No draft evaluations found."
              : "No evaluations found."
            }
          </div>
        )}
      </div>
      
      {expandedIndex !== null && (
        <div 
          className="fixed inset-0 bg-black/20 z-10" 
          onClick={() => setExpandedIndex(null)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
