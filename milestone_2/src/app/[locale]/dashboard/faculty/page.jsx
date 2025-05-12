"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import ReportsTable from '@/components/ReportsTable';
import { reportsMockData } from '../../../../../constants/mockData';

export default function FacultyDashboard() {
  const [reports, setReports] = useState(reportsMockData);
  const getStatusClass = (status) => {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'flagged': 'bg-orange-100 text-orange-800',
      'rejected': 'bg-red-100 text-red-800',
      'accepted': 'bg-green-100 text-green-800',
      'reviewed': 'bg-blue-100 text-blue-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <DashboardLayout userType="faculty">
      <div className="container mx-auto px-4 py-8">
        <Header text="Faculty Dashboard" size="text-6xl" />
        <ReportsTable
          reports={reports}
          userType="faculty"
        />
      </div>
    </DashboardLayout>
  );
}