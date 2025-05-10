// View a list of suggested companies based on my job interests, industry and recommendations from past interns

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import InternshipList from '@/components/shared/InternshipList';
import StudentProfile from '@/components/StudentProfile';
import { getRecommendedInternshipsForStudent } from '../../../../../constants/internshipData';
import { getRegularInternships, getRecommendedInternships, getAppliedInternships, getMyInternships } from '../../../../../constants/internshipData';

// Dashboard Home View Component
function DashboardHomeView({ onApplicationCompleted, appliedInternshipIds }) {
  const [personalizedInternships, setPersonalizedInternships] = useState([]);
  const { currentUser, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const userData = currentUser || JSON.parse(sessionStorage.getItem('userSession') || localStorage.getItem('userSession') || '{}');
    if (userData) {
      const recommendations = getRecommendedInternshipsForStudent(userData);
      setPersonalizedInternships(recommendations);
    }
  }, [currentUser]);

  return (
    <div className="container mx-auto px-4 pt-0 pb-8">
      <InternshipList
        title=""
        internships={personalizedInternships}
        type="regular"
        onApplicationCompleted={onApplicationCompleted}
        appliedInternshipIds={appliedInternshipIds}
      />
    </div>
  );
}

// Using the actual page components for each view
function BrowseInternshipsView({ onApplicationCompleted, appliedInternshipIds }) {
  const [filterType, setFilterType] = useState('all');

  const internshipsToDisplay = filterType === 'all'
    ? getRegularInternships()
    : getRecommendedInternships();

  return (
    <div className="container mx-auto px-4 pt-0 pb-8">
      <InternshipList
        title=""
        internships={internshipsToDisplay}
        type="regular"
        onApplicationCompleted={onApplicationCompleted}
        appliedInternshipIds={appliedInternshipIds}
        customFilterPanel={
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${filterType === 'all'
                ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#3298BA]'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('recommended')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${filterType === 'recommended'
                ? 'bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#3298BA]'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
            >
              Recommended
            </button>
          </div>
        }
      />
    </div>
  );
}

function AppliedInternshipsView() {
  return (
    <div className="container mx-auto px-4 pt-0 pb-8">
      <InternshipList
        title=""
        internships={getAppliedInternships()}
        type="applied"
        statuses={['pending', 'accepted', 'finalized', 'rejected']}
      />
    </div>
  );
}

function MyInternshipsView() {
  return (
    <div className="container mx-auto px-4 pt-0 pb-8">
      <InternshipList
        title=""
        internships={getMyInternships()}
        type="my"
        statuses={['current', 'completed', 'evaluated']}
      />
    </div>
  );
}

function ProfileView() {
  return (
    <div className="p-6">
      <StudentProfile />
    </div>
  );
}

// Define the page components map with all views including profile
const viewComponents = {
  'home': DashboardHomeView,
  'browse': BrowseInternshipsView,
  'applied': AppliedInternshipsView,
  'my-internships': MyInternshipsView,
  'profile': ProfileView
};

export default function StudentDashboardPage() {
  const [appliedIdsSet, setAppliedIdsSet] = useState(new Set());

  const handleApplicationCompleted = (internshipId) => {
    setAppliedIdsSet(prevSet => new Set(prevSet).add(internshipId));
  };

  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash && viewComponents[hash]) {
        return hash;
      }
    }
    return 'home';
  });

  const getInitialTitle = (viewId) => {
    switch (viewId) {
      case 'home':
        return "RECOMMENDED OPPORTUNITIES";
      case 'browse':
        return "INTERNSHIP OPPORTUNITIES";
      case 'applied':
        return "APPLIED INTERNSHIPS";
      case 'my-internships':
        return "MY INTERNSHIPS";
      case 'profile':
        return "STUDENT PROFILE";
      default:
        return "RECOMMENDED OPPORTUNITIES";
    }
  };
  const [currentTitle, setCurrentTitle] = useState(() => getInitialTitle(currentView));

  const handleViewChange = (viewId) => {
    setCurrentView(viewId);
    setCurrentTitle(getInitialTitle(viewId));
  };

  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.replace('#', '');
        if (hash && viewComponents[hash] && hash !== currentView) {
          handleViewChange(hash);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  const CurrentViewComponent = viewComponents[currentView];

  // Prepare props for the current view component
  let viewProps = {};
  if (currentView === 'home' || currentView === 'browse') {
    viewProps = {
      onApplicationCompleted: handleApplicationCompleted,
      appliedInternshipIds: appliedIdsSet,
    };
  }

  return (
    <DashboardLayout
      userType="student"
      title={currentTitle} // Pass title directly
      currentViewId={currentView} // Pass currentViewId for sidebar active state
      onViewChange={handleViewChange} // For sidebar navigation
    >
      {CurrentViewComponent && <CurrentViewComponent {...viewProps} />}
    </DashboardLayout>
  );
}
