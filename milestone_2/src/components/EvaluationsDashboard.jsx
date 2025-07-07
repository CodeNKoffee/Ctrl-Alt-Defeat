"use client";
import React, { useState, useEffect } from "react";
import Evaluation from "./Evaluation";
import SearchBar from "./shared/SearchBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimesCircle, faCalendar, faEdit, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import CompanyEvaluationModal from "./CompanyEvaluationModal";
import CustomButton from './shared/CustomButton';
import ApplicationsFilterBar from "./shared/ApplicationsFilterBar";
import DeleteTileConfirmation from "./DeleteTileConfirmation";
import { useTranslation } from 'react-i18next';
import { createSafeT } from '../lib/translationUtils';

export default function EvaluationsDashboard({ evaluations: initialEvaluations, stakeholder = "other" }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(stakeholder === "company" ? "submitted" : "submitted");
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isFiltersActive, setIsFiltersActive] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [evaluations, setEvaluations] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [evaluationToEdit, setEvaluationToEdit] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null);

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

    if (stakeholder === "student" || stakeholder === "company") {
      tabEvaluations = tabEvaluations.filter(ev => ev.status === activeTab);
    }

    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      console.log("Searching for:", search);
      tabEvaluations = tabEvaluations.filter(ev => {
        const matchFound = (ev.studentName && ev.studentName.toLowerCase().includes(search)) ||
          (ev.supervisorName && ev.supervisorName.toLowerCase().includes(search)) ||
          (ev.companyName && ev.companyName.toLowerCase().includes(search)) ||
          (ev.company && ev.company.toLowerCase().includes(search)) ||
          (ev.internshipTitle && ev.internshipTitle.toLowerCase().includes(search)) ||
          (ev.major && ev.major.toLowerCase().includes(search));

        if (!matchFound) {
          console.log("No match for evaluation:", ev);
        }
        return matchFound;
      });
      console.log("After search filter:", tabEvaluations);
    }

    if (startDate) {
      const start = new Date(startDate);
      tabEvaluations = tabEvaluations.filter(ev => {
        // Try different possible date fields
        const evDate = ev.date ? new Date(ev.date) :
          ev.startDate ? new Date(ev.startDate) : null;
        return evDate && evDate >= start;
      });
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      tabEvaluations = tabEvaluations.filter(ev => {
        // Try different possible date fields
        const evDate = ev.date ? new Date(ev.date) :
          ev.endDate ? new Date(ev.endDate) :
            ev.startDate ? new Date(ev.startDate) : null;
        return evDate && evDate <= end;
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
    // Ensure we're comparing the right types (convert both to numbers for safety)
    const idToDelete = typeof evaluationId === 'string' ? parseInt(evaluationId) : evaluationId;
    const updatedEvaluations = evaluations.filter(item => {
      const itemId = typeof item.id === 'string' ? parseInt(item.id) : item.id;
      return itemId !== idToDelete;
    });
    setEvaluations(updatedEvaluations);
    setShowDeleteConfirm(false);
    setEvaluationToDelete(null);
  };

  const confirmDelete = (evaluationId) => {
    setEvaluationToDelete(evaluationId);
    setShowDeleteConfirm(true);
  };

  const handleEditEvaluation = (evaluation) => {
    setEvaluationToEdit(evaluation);
    setShowEditModal(true);
  };

  const handleModalSubmit = (updatedFields) => {
    // Handle ID type comparisons properly
    const editId = typeof evaluationToEdit?.id === 'string' ? parseInt(evaluationToEdit.id) : evaluationToEdit?.id;

    const updatedEvaluations = evaluations.map(ev => {
      const evId = typeof ev.id === 'string' ? parseInt(ev.id) : ev.id;
      return evId === editId ? { ...ev, ...updatedFields } : ev;
    });
    setEvaluations(updatedEvaluations);

    // Modal will close itself after the feedback animation
  };

  // First let's create a method to get the appropriate empty state message
  const getEmptyStateMessage = () => {
    // If search term is active, show a more specific message about filtering
    if (searchTerm.trim() !== '') {
      const type = activeTab === 'submitted' ? safeT('company.evaluationsDashboard.tabs.submittedEvaluations').toLowerCase() : safeT('company.evaluationsDashboard.tabs.savedAsDraft').toLowerCase();
      return safeT('company.evaluationsDashboard.emptyStates.noSearchResults')
        .replace('{type}', type)
        .replace('{searchTerm}', searchTerm);
    }

    // Default messages based on tab and stakeholder
    if (stakeholder === "student") {
      return activeTab === "submitted"
        ? safeT('company.evaluationsDashboard.emptyStates.noSubmittedEvaluations')
        : safeT('company.evaluationsDashboard.emptyStates.noDraftEvaluations');
    } else if (stakeholder === "company") {
      return activeTab === "submitted"
        ? safeT('company.evaluationsDashboard.emptyStates.noSubmittedEvaluations')
        : safeT('company.evaluationsDashboard.emptyStates.noDraftEvaluations');
    } else {
      return safeT('company.evaluationsDashboard.emptyStates.noEvaluations');
    }
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-2 md:px-2">
        {/* <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border border-metallica-blue-200">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex-shrink-0 bg-[var(--metallica-blue-100)] rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[var(--metallica-blue-700)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
              </div>
              <div>
                <p className="text-sm text-gray-400"></p>
                <div className="text-2xl font-semibold text-[#2a5f74] mb-4">
                  {stakeholder === "student"
                    ? "Your Company Internship Evaluations"
                    : stakeholder === "company"
                    ? "Your Student Evaluations"
                    : "Student Evaluations"}
                </div>
                <div className="text-gray-700 mb-2">
                  {stakeholder === "student"
                    ? " Below are the evaluations you submitted for the companies where you completed internships and evaluations you have saved as drafts and are awaiting your submission."
                    : stakeholder === "company"
                    ? "Below are the evaluations you submitted for your interns. You can view both submitted and draft evaluations."
                    : "Below are the evaluations of students that have completed their internships at the various companies they have access to through the system."}
                </div>
              </div>
            </div>
          </div> */}
        {(stakeholder == "faculty") &&
          <ApplicationsFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder={`Search ${activeTab === 'submitted' ? 'submitted' : 'draft'} evaluations by student, company or supervisor...`}
            selectedStatus={activeTab}
            onStatusChange={setActiveTab}
            // customFilterSections={customFilterSections}
            primaryFilterName="Filters"
          />
        }

        {(stakeholder === "student" || stakeholder === "company") && (
          <div className="flex justify-start mb-6 px-4 gap-10">
            <div className="inline-flex rounded-full bg-gray-100 p-1">
              <button
                onClick={() => setActiveTab("submitted")}
                className={`px-6 py-2 rounded-full font-semibold transition-colors bg-[#eaf3f7] text-metallica-blue-700 ${activeTab === "submitted"
                  ? "px-6 py-2 rounded-full font-semibold transition-colors bg-metallica-blue-600 text-white"
                  : "px-6 py-2 rounded-full font-semibold transition-colors bg-[#eaf3f7] text-metallica-blue-700"
                  }`}
              >
                {safeT('company.evaluationsDashboard.tabs.submittedEvaluations')}
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`px-6 py-2 rounded-full font-semibold transition-colors bg-[#eaf3f7] text-metallica-blue-700 ${activeTab === "saved"
                  ? "px-6 py-2 rounded-full font-semibold transition-colors bg-metallica-blue-600 text-white"
                  : "px-6 py-2 rounded-full font-semibold transition-colors bg-[#eaf3f7] text-metallica-blue-700"
                  }`}
              >
                {safeT('company.evaluationsDashboard.tabs.savedAsDraft')}
              </button>
            </div>
          </div>
        )}

        {/* {stakeholder !== "student" && (
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
        )} */}

        <div className="w-full flex flex-wrap justify-between gap-2 relative bg-[#f4fafd] rounded-2xl shadow-md p-6">
          {filteredEvaluations && filteredEvaluations.length > 0 ? (
            filteredEvaluations.map((evaluation, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 flex-grow-0 basis-[23%] max-w-[23%] min-w-[270px] mb-16"
              >
                {stakeholder === "company" ? (
                  <div className="bg-white rounded-xl shadow p-5 border border-[#E2F4F7] flex flex-col gap-3 h-full relative">
                    {/* Draft badge for company drafts, styled as absolute top-left corner */}
                    {activeTab === "saved" && (
                      <span className="absolute top-0 left-0 bg-amber-100 text-amber-800 px-2 py-1 text-xs font-medium z-40 rounded-tl-xl rounded-br-xl" style={{ boxShadow: '0 2px 6px 0 rgba(0,0,0,0.04)' }}>{safeT('company.evaluationsDashboard.labels.draft')}</span>
                    )}
                    {/* Edit & Delete icons only for drafts */}
                    {activeTab === "saved" && (
                      <div className="absolute top-3 right-3 flex gap-2 z-10">
                        <button
                          className="text-metallica-blue-600 hover:text-metallica-blue-800 p-1"
                          title={safeT('company.evaluationsDashboard.actions.editEvaluation')}
                          onClick={() => handleEditEvaluation(evaluation)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 p-1"
                          title={safeT('company.evaluationsDashboard.actions.deleteEvaluation')}
                          onClick={() => confirmDelete(evaluation.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    )}
                    <div className="mb-2 flex flex-col items-center">
                      {/* Student/company avatar */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#f4fafd] to-[#eaf3f7] shadow flex items-center justify-center mb-2 border-4 border-[#F8E7BE]">
                        <img
                          src={evaluation.studentAvatar || evaluation.companyLogo || '/images/student-icon.png'}
                          alt={evaluation.studentName || evaluation.company || 'Avatar'}
                          className="w-12 h-12 object-contain rounded-full"
                        />
                      </div>
                      <div className="font-bold text-[#2A5F74] text-lg mb-1 text-center tracking-wide drop-shadow">{evaluation.studentName || evaluation.company}</div>
                      <div className="text-sm text-[#4C798B] mb-1 text-center">{evaluation.internshipTitle || evaluation.supervisor}</div>
                      <div className="text-xs text-gray-500 mb-1 text-center">{safeT('company.evaluationsDashboard.labels.company')} {evaluation.company}</div>
                      <div className="text-xs text-gray-500 mb-1 text-center">{safeT('company.evaluationsDashboard.labels.date')} {evaluation.date}</div>
                    </div>
                    {/* Fun star rating if available */}
                    {typeof evaluation.overallRating === 'number' && (
                      <div className="flex items-center justify-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${star <= (evaluation.overallRating || 0) ? 'text-yellow-400' : 'text-gray-200'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                          </svg>
                        ))}
                      </div>
                    )}
                    {/* See more button opens modal */}
                    <button
                      className="mt-2 text-metallica-blue-700 hover:underline text-xs font-semibold self-end"
                      onClick={() => setExpandedIndex(idx)}
                    >
                      {safeT('company.evaluationsDashboard.actions.seeMore')}
                    </button>
                    {/* Modal for expanded details */}
                    {expandedIndex === idx && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full relative animate-fade-in overflow-y-auto max-h-[80vh]">
                          <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-metallica-blue-700 text-xl"
                            onClick={() => setExpandedIndex(null)}
                            aria-label={safeT('company.evaluationsDashboard.actions.close')}
                          >
                            <FontAwesomeIcon icon={faTimesCircle} />
                          </button>
                          <div className="flex flex-col items-center mb-4">
                            <div
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                background: feedbackType === 'submit' ? '#22C55E' : '#318FA8',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <FontAwesomeIcon icon={faCheck} style={{ fontSize: 32, color: 'white' }} />
                            </div>
                            <div className="font-bold text-[#2A5F74] text-lg mb-1 text-center tracking-wide drop-shadow">{evaluation.company}</div>
                            <div className="text-xs text-[#4C798B] mb-1 text-center">{evaluation.supervisor}</div>
                          </div>
                          <div className="mb-4">
                            <div className="font-semibold text-[#2A5F74] mb-2 flex items-center gap-2">
                              <span>{safeT('company.evaluationsDashboard.labels.skillsAndProfessional')}</span>
                              <span className="text-xs bg-[#F8E7BE] text-[#B58525] rounded-full px-2 py-0.5 font-bold">{Object.keys(evaluation.skillRatings).length} {safeT('company.evaluationsDashboard.labels.skills')}</span>
                            </div>
                            <ul className="grid grid-cols-2 gap-2">
                              {Object.entries(evaluation.skillRatings).map(([skill, rating]) => (
                                <li key={skill} className="flex items-center gap-2 bg-[#f4fafd] rounded-lg px-2 py-1 shadow-sm">
                                  <span className="text-xs font-medium text-[#2A5F74] flex-1">{skill}</span>
                                  <span className="inline-flex items-center gap-1 font-bold text-[#B58525] text-base">
                                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="#F8E7BE" /><text x="50%" y="55%" textAnchor="middle" fill="#B58525" fontSize="10" fontWeight="bold" dy=".3em">{rating}</text></svg>
                                  </span>
                                </li>
                              ))}
                            </ul>
                            {evaluation.skillOther && (
                              <div className="mt-2 text-xs text-gray-500 italic">{safeT('company.evaluationsDashboard.labels.other')} {evaluation.skillOther}</div>
                            )}
                          </div>
                          <div className="mb-4">
                            <div className="font-semibold text-[#2A5F74] mb-2 flex items-center gap-2">
                              <span>{safeT('company.evaluationsDashboard.labels.technical')}</span>
                              <span className="text-xs bg-[#F8E7BE] text-[#B58525] rounded-full px-2 py-0.5 font-bold">{Object.keys(evaluation.technical).length} {safeT('company.evaluationsDashboard.labels.items')}</span>
                            </div>
                            <ul className="space-y-2">
                              {Object.entries(evaluation.technical).map(([attr, val]) => (
                                <li key={attr} className="bg-[#f4fafd] rounded-lg px-2 py-1 shadow-sm">
                                  <span className="font-medium text-[#4C798B]">{attr}:</span>
                                  <span className="ml-2 text-xs">{val}</span>
                                </li>
                              ))}
                            </ul>
                            {evaluation.technicalOther && (
                              <div className="mt-2 text-xs text-gray-500 italic">{safeT('company.evaluationsDashboard.labels.other')} {evaluation.technicalOther}</div>
                            )}
                          </div>
                          {evaluation.comments && (
                            <div className="mb-2">
                              <div className="font-semibold text-[#2A5F74] mb-1 flex items-center gap-2">
                                <span>{safeT('company.evaluationsDashboard.labels.comments')}</span>
                                <span className="text-xs bg-[#F8E7BE] text-[#B58525] rounded-full px-2 py-0.5 font-bold">💬</span>
                              </div>
                              <div className="text-xs text-gray-700 bg-[#f4fafd] rounded-lg px-2 py-1 shadow-sm">{evaluation.comments}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Evaluation
                    evaluation={evaluation}
                    expanded={expandedIndex === idx}
                    onExpand={() => handleExpand(idx)}
                    stakeholder={stakeholder}
                    isDraft={stakeholder === "student" && activeTab === "saved"}
                    onUpdate={handleUpdateEvaluation}
                    onDelete={handleDeleteEvaluation}
                  >
                  </Evaluation>
                )}
              </div>
            ))
          ) : (
            <div className="w-full p-16 text-center">
              <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">{getEmptyStateMessage()}</p>
              <p className="text-gray-400 text-sm mt-1">{safeT('company.evaluationsDashboard.emptyStates.adjustFilters')}</p>

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-4 py-2 bg-[#D9F0F4] text-[#2A5F74] rounded-full text-sm font-medium hover:bg-[#B8E1E9] transition-colors duration-200 flex items-center mx-auto"
                >
                  <span>{safeT('company.evaluationsDashboard.actions.clearSearchFilter')}</span>
                  <FontAwesomeIcon icon={faTimesCircle} className="ml-2 h-3 w-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {stakeholder !== "company" && expandedIndex !== null && (
          <div
            className="fixed inset-0 bg-black/20 z-10"
            onClick={() => setExpandedIndex(null)}
            aria-hidden="true"
          />
        )}
      </div>

      {stakeholder === "company" && showEditModal && (
        <CompanyEvaluationModal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setEvaluationToEdit(null); }}
          onSubmit={handleModalSubmit}
          evaluationToEdit={evaluationToEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteTileConfirmation
          type="evaluation"
          onConfirm={() => handleDeleteEvaluation(evaluationToDelete)}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}
