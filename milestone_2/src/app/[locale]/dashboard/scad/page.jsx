'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { MOCK_COMPANIES } from '../../../../../constants/mockData';
import CompanyTable from '@/components/CompanyTable';
import CallModal from '@/components/CallModal';
import CallInterface from '@/components/CallInterface';
import CallNotification from '@/components/CallNotification';

export default function ScadDashboard() {
  const router = useRouter();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const isInCall = useSelector((state) => state.call.isInCall);
  const currentUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    // Check if user is logged in
    const userSessionData = sessionStorage.getItem('userSession') || localStorage.getItem('userSession');
    if (!userSessionData) {
      router.push('/en/auth/login');
      return;
    }

    // Verify user role
    const effectiveUser = currentUser || JSON.parse(userSessionData);
    if (effectiveUser?.role !== 'scad') {
      console.warn('Non-SCAD user accessed SCAD dashboard, redirecting...');
      router.push(effectiveUser?.role === 'student' ? '/en/dashboard/student' : '/en');
    }
  }, [router, currentUser]);

  // --- Handlers --- 
  const openCallModal = () => setIsCallModalOpen(true);
  const closeCallModal = () => setIsCallModalOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-metallica-blue-50 to-white px-8 py-6 relative">
      {isInCall && (
        <div className="fixed inset-0 z-50">
          <CallInterface />
          <CallNotification />
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium text-metallica-blue-900 mb-2 font-ibm-plex-sans">SCAD Dashboard</h1>
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium text-gray-600 hidden sm:inline">
              Call PRO Students
            </span>
            <div className="relative">
              <button
                onClick={openCallModal}
                className="relative p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-md cursor-pointer"
                aria-label="Start a video call with students"
                title="Call PRO Students"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
              <span className="absolute -inset-1 rounded-full animate-ping bg-indigo-300 opacity-75 pointer-events-none" style={{ animationDuration: '3s' }}></span>
            </div>
          </div>
        </div>
        <CompanyTable companies={MOCK_COMPANIES} />
      </div>

      <CallModal isOpen={isCallModalOpen} onClose={closeCallModal} />
    </div>
  );
}