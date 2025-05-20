import { useState } from "react";
import { MOCK_EVALUATIONS } from "../../../../../../constants/mockData";
import EvaluationsDashboard from "@/components/EvaluationsDashboard";
import ApplicationsFilterBar from "@/components/shared/ApplicationsFilterBar";

export default function StudentEvalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Get unique statuses from MOCK_EVALUATIONS
  const uniqueStatuses = [
    ...new Set(MOCK_EVALUATIONS.map(evalObj => evalObj.status))
  ].filter(Boolean).map(status => ({ id: status, title: status }));

  // Filter evaluations by search and status
  const filteredEvals = MOCK_EVALUATIONS.filter(evalObj => {
    const matchesSearch =
      evalObj.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evalObj.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evalObj.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || evalObj.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const customFilterSections = [
    {
      title: "Status",
      options: [{ label: "All Statuses", value: "all" }, ...uniqueStatuses.map(s => ({ label: s.title, value: s.id }))],
      isSelected: option => selectedStatus === option.value,
      onSelect: option => setSelectedStatus(option.value)
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4fafd] py-10 px-4">
      <div className="max-w-6xl mx-auto mb-6">
        <ApplicationsFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search evaluations by student, company, or title ..."
          onClearFilters={() => { setSearchTerm(""); setSelectedStatus("all"); }}
          customFilterSections={customFilterSections}
        />
      </div>
      <EvaluationsDashboard evaluations={filteredEvals} stakeholder={"other"} />
    </div>
  );
}
