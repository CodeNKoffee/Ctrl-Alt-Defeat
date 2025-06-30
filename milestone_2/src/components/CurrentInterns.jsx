"use client";
import { useState, useEffect } from "react";
import { mockStudents } from '../../constants/mockData';
import InternRow from './InternRow';
import CompanyEvaluationModal from './CompanyEvaluationModal';
import StatusPills from './shared/StatusPills';

// Helper to infer internship status from period
const inferStatus = (period) => {
  if (!period) return 'current';
  const is2023 = period.includes('2023');
  const isEvaluated = Math.random() < 0.3; // Randomly mark some completed as evaluated
  if (is2023) return isEvaluated ? 'evaluated' : 'completed';
  return 'current';
};

// Calculate end date (3 months after start date)
const calculateEndDate = (period) => {
  if (!period) return null;
  const yearMatch = period.match(/\d{4}/);
  if (!yearMatch) return null;
  const year = parseInt(yearMatch[0], 10);
  const month = period.toLowerCase().includes('summer') ? 6 : 0; // July (6) or January (0)
  const startDate = new Date(year, month, 1);
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 3); // Add 3 months
  return `${endDate.getMonth() + 1} ${endDate.getFullYear()}`; // Format as "Month Year"
};

// Transform mockStudents into intern data
const transformStudentsToInterns = (students) => {
  if (!Array.isArray(students)) {
    console.error('transformStudentsToInterns: students is not an array', students);
    return [];
  }
  return students
    .filter(student => student.internships && student.internships.length > 0)
    .map(student => {
      const internship = student.internships[0]; // Use first internship
      const status = inferStatus(internship.period);
      const department = student.department || 'N/A'; // Assuming student object might have department
      const timePeriod = internship.period || 'N/A'; // Or derive more specifically if needed

      return {
        id: student.id,
        name: student.name,
        jobTitle: internship.title,
        status: status,
        company: internship.company,
        profilePic: student.photo,
        skills: student.skills,
        degree: student.education[0]?.degree,
        jobInterests: student.jobInterests,
        startDate: internship.period,
        endDate: (status === 'completed' || status === 'evaluated') ? calculateEndDate(internship.period) : null,
        description: internship.description,
        department: department,
        timePeriod: timePeriod,
      };
    });
};

export default function CurrentInterns({ searchTerm, selectedStatus = 'all', onStatusChange }) {
  const [interns, setInterns] = useState([]);
  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);

  // Statuses to display
  const displayStatuses = [
    { value: 'current', label: 'CURRENT', color: 'bg-blue-100 text-blue-800 border-2 border-blue-400', badgeColor: 'bg-blue-600' },
    { value: 'completed', label: 'COMPLETED', color: 'bg-green-100 text-green-800 border-2 border-green-400', badgeColor: 'bg-green-600' },
    { value: 'evaluated', label: 'EVALUATED', color: 'bg-purple-100 text-purple-800 border-2 border-purple-400', badgeColor: 'bg-purple-600' },
  ];

  useEffect(() => {
    // Initialize interns from mockData or a fetch call
    const initialInterns = mockStudents ? transformStudentsToInterns(mockStudents) : [];
    setInterns(initialInterns);
  }, []); // Runs once on mount

  const handleSelectIntern = (id) => {
    console.log(`Selected intern with id: ${id}`);
  };

  const handleEvaluateIntern = (id) => {
    const intern = interns.find(intern => intern.id === id);
    setSelectedIntern(intern);
    setEvaluationModalOpen(true);
  };

  const handleSubmitEvaluation = (data) => {
    console.log("Evaluation submitted:", data);
    // Here you would typically send this to your backend
    // For now, just close the modal and maybe update the intern's status
    const updatedInterns = interns.map(intern => {
      if (intern.id === selectedIntern?.id) {
        return { ...intern, status: 'evaluated' };
      }
      return intern;
    });
    setInterns(updatedInterns);
  };

  // Filter logic using props
  const filteredInterns = interns.filter(intern => {
    const search = searchTerm?.toLowerCase() || '';
    const matchesSearch =
      !search ||
      intern.name.toLowerCase().includes(search) ||
      intern.jobTitle.toLowerCase().includes(search) ||
      intern.company.toLowerCase().includes(search) ||
      (intern.department && intern.department.toLowerCase().includes(search));

    const matchesStatus = selectedStatus === 'all' || intern.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto py-4 mb-4 flex flex-col items-start">
      {/* Evaluation Modal */}
      {evaluationModalOpen && selectedIntern && (
        <CompanyEvaluationModal
          isOpen={evaluationModalOpen}
          onClose={() => setEvaluationModalOpen(false)}
          onSubmit={handleSubmitEvaluation}
          evaluationToEdit={null}
        />
      )}
      <div className="w-full space-y-4">
        {filteredInterns.map((intern) => (
          <InternRow
            key={intern.id}
            intern={intern}
            onSelect={handleSelectIntern}
            onEvaluate={handleEvaluateIntern}
          />
        ))}
        {filteredInterns.length === 0 && (
          <div className="p-16 text-center">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No interns found matching your criteria</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}