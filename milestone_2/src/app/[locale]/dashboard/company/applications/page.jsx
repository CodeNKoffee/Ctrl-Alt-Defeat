"use client";

import React, { useState } from "react";
import ApplicationsList from "@/components/ApplicationsList";
import ApplicationsFilterBar from "@/components/shared/ApplicationsFilterBar";

export default function CompanyApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedInternship, setSelectedInternship] = useState('all');

  // Status configuration (same as in ApplicationsList)
  const STATUS_CONFIG = {
    pending: {
      label: "PENDING",
      color: "bg-yellow-100 text-yellow-800 border border-yellow-400",
      badgeColor: "bg-yellow-600",
    },
    accepted: {
      label: "ACCEPTED",
      color: "bg-green-100 text-green-800 border border-green-400",
      badgeColor: "bg-green-600",
    },
    rejected: {
      label: "REJECTED",
      color: "bg-red-100 text-red-800 border border-red-400",
      badgeColor: "bg-red-600",
    },
    finalized: {
      label: "FINALIZED",
      color: "bg-purple-100 text-purple-800 border border-purple-400",
      badgeColor: "bg-purple-600",
    },
    current: {
      label: "CURRENT INTERN",
      color: "bg-blue-100 text-blue-800 border border-blue-400",
      badgeColor: "bg-blue-600",
    },
    completed: {
      label: "COMPLETED",
      color: "bg-green-100 text-green-800 border border-green-400",
      badgeColor: "bg-green-600",
    }
  };

  // Mock internships data
  const MOCK_INTERNSHIPS = [
    { id: 1, title: "Frontend Developer Intern" },
    { id: 2, title: "UI/UX Design Intern" },
    { id: 3, title: "Backend Developer Intern" },
    { id: 4, title: "Data Analyst Intern" },
    { id: 5, title: "Marketing Intern" }
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedInternship('all');
  };

  return (
    <>
      <style jsx global>{`
        /* Ensure proper stacking context */
        .dropdown-overlay {
          z-index: 9999 !important;
          position: relative;
        }
        
        .application-list-item {
          z-index: 0 !important;
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 p-4 isolate">
        <div className="container mx-auto px-4 py-8">
          <div className="w-full max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-left text-[#2a5f74] relative">
              APPLICATIONS MANAGEMENT
              <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#2a5f74]"></span>
            </h1>

            {/* Filter Bar Component */}
            <div className="dropdown-overlay">
              <ApplicationsFilterBar
                // Search props
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search by name, email, or position..."

                // Status filter props
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                statusConfig={STATUS_CONFIG}

                // Primary filter (internships) props
                primaryFilterName="Internship Position"
                selectedPrimaryFilter={selectedInternship}
                onPrimaryFilterChange={setSelectedInternship}
                primaryFilterOptions={MOCK_INTERNSHIPS}

                // Filter actions
                onClearFilters={clearFilters}
              />
            </div>

            {/* Applications List */}
            <div className="application-list-item">
              <ApplicationsList
                searchTerm={searchTerm}
                selectedStatus={selectedStatus}
                selectedInternship={selectedInternship}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 