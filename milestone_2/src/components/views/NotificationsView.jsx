'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import NotificationsList from '../NotificationsList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faFilter, faLock, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import ProBadge from '../shared/ProBadge';

// Mock data - in real app this would come from an API
const MOCK_COMPANIES = [
  {
    id: "comp_001",
    name: "Tawabiry",
    logo: "/logos/tawabiry.png"
  },
  {
    id: "comp_002",
    name: 'Vodafone Egypt',
    logo: '/logos/tawabiry.png'
  },
  {
    id: "comp_003",
    name: 'Juhayna Food Industries',
    logo: '/logos/tawabiry.png'
  },
  {
    id: "comp_004",
    name: 'Nestlé Egypt',
    logo: '/logos/tawabiry.png'
  },
  {
    id: "comp_005",
    name: 'Valeo Egypt',
    logo: '/logos/tawabiry.png'
  }
];

export default function NotificationsView() {
  const [showCompanyFilter, setShowCompanyFilter] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  // Get user data from Redux store
  const { currentUser } = useSelector(state => state.auth);

  // Get user data using a fallback mechanism
  const getUserData = () => {
    if (currentUser) return currentUser;

    // Fallback to session/local storage if Redux state isn't available
    const userSessionData = typeof window !== 'undefined' ?
      sessionStorage.getItem('userSession') || localStorage.getItem('userSession') : null;

    if (userSessionData) {
      try {
        return JSON.parse(userSessionData);
      } catch (e) {
        console.error('Error parsing user data', e);
        return null;
      }
    }

    return null;
  };

  const userData = getUserData();
  const isPro = userData?.accountType === 'PRO';
  const userType = userData?.role || 'student';

  const toggleCompanyFilter = () => {
    if (isPro || userType !== 'student') {
      setShowCompanyFilter(!showCompanyFilter);
    }
  };

  const toggleCompanySelection = (companyId) => {
    setSelectedCompanies(prev => {
      if (prev.includes(companyId)) {
        return prev.filter(id => id !== companyId);
      } else {
        return [...prev, companyId];
      }
    });
  };

  const clearCompanyFilters = () => {
    setSelectedCompanies([]);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header with PRO filter button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#2a5f74]">Notifications</h1>
          <p className="text-sm text-gray-600 mt-1">
            Stay updated with your latest activities and profile views
          </p>
        </div>

        {/* PRO-only company filter button - only visible for PRO users or non-student users */}
        {(isPro || userType !== 'student') && (
          <div className="mt-4 sm:mt-0 relative">
            <button
              onClick={toggleCompanyFilter}
              className="flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-gradient-to-r from-[#3298BA] to-[#2a5f74] text-white shadow-md hover:shadow-lg"
            >
              <FontAwesomeIcon
                icon={faBuilding}
                className="mr-2"
              />
              <span>Filter by Company</span>

              {isPro && (
                <span className="ml-2">
                  <ProBadge size="sm" />
                </span>
              )}
            </button>

            {/* Company filter dropdown */}
            {showCompanyFilter && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 border border-gray-200 py-2 animate-fadeIn">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-[#2a5f74]">Filter by Company</h3>
                    <button
                      onClick={toggleCompanyFilter}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto py-1">
                  {MOCK_COMPANIES.map(company => (
                    <div
                      key={company.id}
                      onClick={() => toggleCompanySelection(company.id)}
                      className="px-4 py-2 flex items-center hover:bg-[#F8FCFD] cursor-pointer"
                    >
                      <div className="w-6 h-6 mr-3 flex-shrink-0">
                        {selectedCompanies.includes(company.id) ? (
                          <div className="w-5 h-5 bg-[#3298BA] rounded flex items-center justify-center text-white">
                            <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 border border-gray-300 rounded"></div>
                        )}
                      </div>
                      <div className="flex items-center flex-1">
                        <div className="w-6 h-6 rounded-md overflow-hidden bg-white mr-2 border border-gray-200">
                          <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-sm text-gray-700">{company.name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedCompanies.length > 0 && (
                  <div className="px-4 py-2 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {selectedCompanies.length} companies selected
                      </span>
                      <button
                        onClick={clearCompanyFilters}
                        className="text-xs text-[#3298BA] hover:text-[#2a5f74]"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Company Filters Display */}
      {selectedCompanies.length > 0 && (
        <div className="bg-[#F8FCFD] rounded-lg p-4 mb-4 border border-[#D9F0F4]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-[#2a5f74] font-medium">Filtered by:</span>
            {selectedCompanies.map(companyId => {
              const company = MOCK_COMPANIES.find(c => c.id === companyId);
              return (
                <div key={companyId} className="flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white text-[#2a5f74] border border-[#B8E1E9] shadow-sm">
                  <div className="w-4 h-4 rounded-md overflow-hidden bg-white mr-2">
                    <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                  </div>
                  <span>{company.name}</span>
                  <button
                    className="ml-2 p-0.5 rounded-full text-[#5DB2C7] hover:bg-[#B8E1E9]/60 hover:text-[#1a3f54]"
                    onClick={() => toggleCompanySelection(companyId)}
                    aria-label={`Remove ${company.name} filter`}
                  >
                    <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
            <button
              onClick={clearCompanyFilters}
              className="text-xs text-[#3298BA] hover:text-[#2a5f74] ml-2"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Notifications list component */}
      <NotificationsList selectedCompanies={selectedCompanies} />
    </div>
  );
} 