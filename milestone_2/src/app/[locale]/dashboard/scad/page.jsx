'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_COMPANIES } from '../../../../../constants/mockData';
import CompanyTable from '@/components/CompanyTable';

export default function ScadDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userSession = sessionStorage.getItem('userSession') || localStorage.getItem('userSession');
    if (!userSession) {
      router.push('/en/auth/login');
      return;
    }

    // Verify user role
    const { role } = JSON.parse(userSession);
    if (role !== 'scad') {
      router.push('/en');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-metallica-blue-50 to-white px-8 py-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-medium text-metallica-blue-00 mb-2 font-ibm-plex-sans">SCAD Dashboard</h1>
        <CompanyTable companies={MOCK_COMPANIES} />
      </div>
    </div>
  );
}