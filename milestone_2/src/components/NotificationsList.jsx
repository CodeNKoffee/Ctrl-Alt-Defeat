'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faClock, faBell, faFilter, faEllipsisH, faSearch, faXmark, faLock, faChevronDown, faClipboardList } from '@fortawesome/free-solid-svg-icons';

// Mock data
const MOCK_COMPANIES = [
  {
    id: "comp_001",
    name: "Tawabiry",
    logo: "/logos/tawabiry.png",
    email: "contact-us@tawabiry.com"
  },
  {
    id: "comp_002",
    name: 'Vodafone Egypt',
    logo: '/logos/tawabiry.png',
    email: 'contact@vodafone.com.eg'
  },
  {
    id: "comp_003",
    name: 'Juhayna Food Industries',
    logo: '/logos/tawabiry.png',
    email: 'contact@juhayna.com'
  },
  {
    id: "comp_004",
    name: 'Nestlé Egypt',
    logo: '/logos/tawabiry.png',
    email: 'contact@eg.nestle.com'
  },
  {
    id: "comp_005",
    name: 'Valeo Egypt',
    logo: '/logos/tawabiry.png',
    email: 'hr@valeo.com'
  }
];

const ProfileViewItem = ({ company, isPro }) => {
  return (
    <div className="flex items-start p-4 border-b hover:bg-metallica-blue-50 transition-colors duration-200 cursor-pointer">
      <div className="flex-shrink-0 mr-3">
        <div className="rounded-md overflow-hidden w-10 h-10 bg-white flex items-center justify-center border border-gray-200">
          <img
            src={company.logo}
            alt={company.name}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-sm font-medium text-[#2a5f74]">{company.name}</p>
        {isPro ? (
          <>
            <p className="text-xs text-gray-600">
              HR Manager at {company.name} viewed your profile
            </p>
            <p className="text-xs text-gray-500 mt-1">
              <FontAwesomeIcon icon={faClock} className="mr-1 text-gray-400" />
              3d
            </p>
          </>
        ) : (
          <div className="flex items-center">
            <FontAwesomeIcon icon={faLock} className="text-gray-400 mr-1 text-xs" />
            <p className="text-xs text-gray-500">
              Details locked - Upgrade to PRO to see who viewed your profile
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const NotificationItem = ({ icon, title, time, isUnread }) => {
  return (
    <div className={`flex items-start p-4 border-b hover:bg-metallica-blue-50 transition-colors duration-200 cursor-pointer ${isUnread ? 'bg-[#E2F4F7]' : ''}`}>
      <div className="flex-shrink-0 mr-3 mt-1 w-10 h-10 bg-[#D9F0F4] rounded-full flex items-center justify-center text-[#3298BA]">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-sm text-[#2a5f74]" dangerouslySetInnerHTML={{ __html: title }} />
        <p className="text-xs text-gray-500 mt-1">
          <FontAwesomeIcon icon={faClock} className="mr-1 text-gray-400" />
          {time}
        </p>
      </div>
      {isUnread && (
        <span className="flex-shrink-0 w-2 h-2 bg-[#3298BA] rounded-full mr-2 mt-2"></span>
      )}
    </div>
  );
};

const ProUpgradePrompt = ({ durationCompleted, durationRequired = 12 }) => {
  return (
    <div className="bg-gradient-to-r from-[#E2F4F7] to-[#D9F0F4] p-4 rounded-lg border border-[#5DB2C7] mb-4 mx-4 mt-4 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center mb-2">
        <span className="text-lg font-semibold text-[#2a5f74] mr-2">Unlock PRO Benefits</span>
        <span className="bg-gradient-to-r from-[#3298BA] to-[#2a5f74] text-white text-xs px-1.5 py-0.5 font-bold rounded-md shadow-sm">PRO</span>
      </div>
      <p className="text-sm text-[#2a5f74] mb-3">
        Complete {durationRequired - durationCompleted} more months of internship to unlock PRO features:
      </p>
      <ul className="text-xs text-[#2a5f74] list-disc ml-5 mb-3">
        <li>See which company representatives viewed your profile</li>
        <li>Access detailed profile analytics</li>
        <li>Get priority in internship applications</li>
        <li>Connect with SCAD Admin via video calls</li>
      </ul>
      <div className="w-full bg-white rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#5DB2C7] to-[#3298BA] h-2.5 rounded-full transition-all duration-700 ease-in-out"
          style={{ width: `${(durationCompleted / durationRequired) * 100}%` }}
        ></div>
      </div>
      <p className="text-xs text-[#2a5f74] mt-1 text-right">
        {durationCompleted}/{durationRequired} months completed
      </p>
    </div>
  );
};

export default function NotificationsList({ selectedCompanies = [], hideFilters = false }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [customNotifications, setCustomNotifications] = useState([]);

  // Get user data from Redux store
  const { currentUser } = useSelector(state => state.auth);

  // Add event listener for custom notifications
  useEffect(() => {
    const handleAddNotification = (event) => {
      if (event.detail && Array.isArray(event.detail)) {
        setCustomNotifications(prev => {
          // Filter out duplicates by id
          const existingIds = prev.map(n => n.id);
          const newNotifications = event.detail.filter(n => !existingIds.includes(n.id));
          return [...prev, ...newNotifications];
        });
      }
    };

    document.addEventListener('addNotification', handleAddNotification);
    return () => {
      document.removeEventListener('addNotification', handleAddNotification);
    };
  }, []);

  // Add useEffect for click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close filter dropdown on outside click
      if (!event.target.closest('.filter-dropdown') && !event.target.closest('.filter-button')) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
  const durationCompleted = userData?.durationCompleted || 0;

  // Sample notifications
  let baseNotifications = [
    // Student notifications (All students - normal and PRO)
    {
      id: 1,
      icon: faBuilding,
      title: '<b>TechVision</b> posted a new internship that matches your skills',
      time: '2h',
      isUnread: true,
      userType: ['student']
    },
    {
      id: 2,
      icon: faBell,
      title: 'Your internship application at <b>BrandBoost</b> was accepted',
      time: '1d',
      isUnread: true,
      userType: ['student']
    },
    {
      id: 3,
      icon: faBell,
      title: 'Your <b>Frontend Developer</b> internship starts in 5 days',
      time: '3d',
      isUnread: false,
      userType: ['student']
    },
    {
      id: 13,
      icon: faClipboardList,
      title: 'Your internship report status has been updated by SCAD',
      time: '6h',
      isUnread: true,
      userType: ['student']
    },

    // PRO student only notifications
    {
      id: 4,
      icon: faBell,
      title: 'SCAD Officer has accepted your appointment request',
      time: '3d',
      isUnread: false,
      userType: ['student'],
      requiresPro: true
    },
    {
      id: 5,
      icon: faBell,
      title: 'Alien X has accepted your appointment request',
      time: '3d',
      isUnread: false,
      userType: ['student'],
      requiresPro: true
    },
    {
      id: 6,
      icon: faBell,
      title: 'Upcoming workshop you have registered in',
      time: '3d',
      isUnread: false,
      userType: ['student'],
      requiresPro: true
    },
    {
      id: 7,
      icon: faBell,
      title: 'Alien X has sent you a message',
      time: '3d',
      isUnread: false,
      userType: ['student'],
      requiresPro: true
    },

    // Company notifications
    {
      id: 8,
      icon: faBuilding,
      title: 'Your company application has been accepted',
      time: '4h',
      isUnread: true,
      userType: ['company']
    },
    {
      id: 9,
      icon: faBell,
      title: 'Account setup successful - check your email for details',
      time: '12h',
      isUnread: true,
      userType: ['company']
    },
    {
      id: 10,
      icon: faBuilding,
      title: '3 new applicants for your <b>Backend Developer</b> internship',
      time: '1d',
      isUnread: true,
      userType: ['company']
    },

    // SCAD notifications
    {
      id: 11,
      icon: faClipboardList,
      title: '5 new student reports awaiting review',
      time: '5h',
      isUnread: true,
      userType: ['scad']
    },
    {
      id: 12,
      icon: faBuilding,
      title: '2 new company registrations pending verification',
      time: '1d',
      isUnread: true,
      userType: ['scad']
    }
  ];

  // Filter notifications based on user type and PRO status
  const filteredBaseNotifications = baseNotifications.filter(notification => {
    // Check if notification is for this user type
    const isForUserType = notification.userType && notification.userType.includes(userData?.role);

    // Check if PRO is required (only matters for students)
    const meetsProRequirement =
      !notification.requiresPro ||
      (userData?.role === 'student' && isPro && notification.requiresPro);

    return isForUserType && meetsProRequirement;
  });

  // Only show the filtered notifications
  baseNotifications = filteredBaseNotifications;

  // Combine base notifications with custom notifications
  const notifications = [...baseNotifications, ...customNotifications];

  // Companies that viewed profile (mock data)
  const companyViews = MOCK_COMPANIES.slice(0, 5);

  // Filter notifications based on search term and selected companies
  const filteredNotifications = notifications.filter(notification => {
    // Filter by search term
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase());

    // If no companies are selected or if we're not filtering by company, only use search filter
    if (selectedCompanies.length === 0) {
      return matchesSearch;
    }

    // Extract company names from the notification title
    const notificationText = notification.title.toLowerCase();

    // Check if any selected company name is mentioned in the notification
    const matchesCompany = MOCK_COMPANIES
      .filter(company => selectedCompanies.includes(company.id))
      .some(company => notificationText.includes(company.name.toLowerCase()));

    return matchesSearch && matchesCompany;
  });

  // Companies that viewed profile - filter if selectedCompanies is not empty
  const filteredCompanyViews = selectedCompanies.length > 0
    ? companyViews.filter(company => selectedCompanies.includes(company.id))
    : companyViews;

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="container mx-auto py-4">
      <div className="w-full mx-auto">
        {/* Filters section - conditionally render based on hideFilters prop */}
        {!hideFilters && (
          <div className="w-full bg-[#D9F0F4]/60 backdrop-blur-md p-6 rounded-xl shadow-lg mb-8 border border-[#B8E1E9]/50 transition-all duration-300 hover:shadow-xl">
            <div className="w-full flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex-1 w-full md:w-auto md:max-w-md">
                <div className="relative w-full flex justify-center items-center">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search notifications..."
                    className="w-full py-3 pl-10 pr-10 appearance-none bg-white/90 backdrop-blur-sm border-2 border-[#B8E1E9] hover:border-[#5DB2C7] text-sm text-[#1a3f54] rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#5DB2C7] focus:border-[#5DB2C7] transition-all duration-300 placeholder-gray-500"
                  />
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="h-4 w-4 text-[#5DB2C7]"
                    />
                  </div>
                  {searchTerm && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3.5 flex items-center p-1 rounded-full hover:bg-[#B8E1E9]/50 transition-colors duration-200"
                      onClick={clearSearch}
                    >
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="w-4 h-4 text-[#5DB2C7] hover:text-[#2a5f74]"
                      />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="appearance-none bg-white/90 backdrop-blur-sm border-2 border-[#B8E1E9] hover:border-[#5DB2C7] text-sm text-[#1a3f54] py-2 px-4 rounded-full shadow-md focus:outline-none transition-all duration-300 flex items-center gap-2 filter-button"
                  >
                    <FontAwesomeIcon icon={faFilter} className="h-4 w-4 text-[#5DB2C7]" />
                    <span>Filter</span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`h-3 w-3 text-[#5DB2C7] transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white/95 backdrop-blur-md border-2 border-[#B8E1E9] rounded-xl shadow-xl z-10 animate-dropdown focus:outline-none p-3 space-y-2 filter-dropdown">
                      <div className="px-3 py-2 text-sm font-medium text-[#2a5f74] border-b border-gray-100 pb-2 mb-1 flex items-center justify-between">
                        <span>Filter Options</span>
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
                        </button>
                      </div>
                      {/* Date Range Option */}
                      <div className="px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#F8FCFD] rounded-lg cursor-pointer transition-colors duration-200 flex items-center">
                        <span className="mr-2">Last 7 days</span>
                        {!isPro && userData?.role === 'student' && (
                          <FontAwesomeIcon icon={faLock} className="text-gray-400 ml-auto" />
                        )}
                      </div>

                      <div className="px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#F8FCFD] rounded-lg cursor-pointer transition-colors duration-200 flex items-center">
                        <span className="mr-2">Last 30 days</span>
                        {!isPro && userData?.role === 'student' && (
                          <FontAwesomeIcon icon={faLock} className="text-gray-400 ml-auto" />
                        )}
                      </div>

                      <div className="px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#F8FCFD] rounded-lg cursor-pointer transition-colors duration-200 flex items-center">
                        <span className="mr-2">All time</span>
                      </div>

                      {/* Type Options */}
                      <div className="border-t border-gray-100 my-1 pt-1"></div>

                      <div className="px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#F8FCFD] rounded-lg cursor-pointer transition-colors duration-200 flex items-center">
                        <span className="mr-2">Read notifications</span>
                        {!isPro && userData?.role === 'student' && (
                          <FontAwesomeIcon icon={faLock} className="text-gray-400 ml-auto" />
                        )}
                      </div>

                      <div className="px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#F8FCFD] rounded-lg cursor-pointer transition-colors duration-200 flex items-center">
                        <span className="mr-2">Unread notifications</span>
                        {!isPro && userData?.role === 'student' && (
                          <FontAwesomeIcon icon={faLock} className="text-gray-400 ml-auto" />
                        )}
                      </div>

                      {/* Actions */}
                      <div className="border-t border-gray-100 my-1 pt-1"></div>

                      <div className="px-3 py-2 text-sm text-[#2a5f74] hover:bg-[#F8FCFD] rounded-lg cursor-pointer transition-colors duration-200">
                        Mark all as read
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Active filters display */}
            <div className="w-full flex flex-wrap gap-3 items-center mt-4 pt-4 border-t border-[#B8E1E9]/50">
              {searchTerm ? (
                <>
                  <span className="text-sm text-[#2a5f74] font-medium">Active Filters:</span>
                  <div className="flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 text-[#2a5f74] border-2 border-[#B8E1E9] shadow-sm hover:shadow-md transition-all duration-300 group">
                    <span className="mr-1.5">Search:</span>
                    <span className="font-semibold italic mr-1.5">"{searchTerm}"</span>
                    <button
                      className="ml-1 p-0.5 rounded-full text-[#5DB2C7] hover:bg-[#B8E1E9]/60 hover:text-[#1a3f54] transition-colors duration-200"
                      onClick={clearSearch}
                      aria-label="Remove search term"
                    >
                      <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500 italic">No filters currently applied.</p>
              )}
            </div>
          </div>
        )}

        {/* Main content with tabs */}
        <div className="bg-white p-0 rounded-lg shadow space-y-4">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${activeTab === 'all' ? 'text-[#3298BA] border-b-2 border-[#3298BA]' : 'text-gray-500 hover:text-[#5DB2C7]'}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            {userData?.role === 'student' && (
              <button
                className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${activeTab === 'profile' ? 'text-[#3298BA] border-b-2 border-[#3298BA]' : 'text-gray-500 hover:text-[#5DB2C7]'}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile Views
              </button>
            )}
          </div>

          {/* Content area */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
            {activeTab === 'all' && (
              <>
                {searchTerm && filteredNotifications.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">No notifications found matching your criteria</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
                  </div>
                ) : (
                  filteredNotifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      icon={notification.icon}
                      title={notification.title}
                      time={notification.time}
                      isUnread={notification.isUnread}
                    />
                  ))
                )}
              </>
            )}

            {activeTab === 'profile' && (
              <>
                {!isPro && <ProUpgradePrompt durationCompleted={durationCompleted} />}

                <div className="p-4 border-b bg-[#F8FCFD]">
                  <h3 className="text-sm font-medium text-[#2a5f74] mb-1">
                    Companies that viewed your profile
                  </h3>
                  <p className="text-xs text-gray-500">
                    {isPro
                      ? `${selectedCompanies.length > 0 ? 'Filtered' : 'All'} companies that viewed your profile${selectedCompanies.length > 0 ? ' (filtered)' : ''}`
                      : `${filteredCompanyViews.length} companies viewed your profile recently. Upgrade to PRO to see details.`
                    }
                  </p>
                </div>

                {isPro ? (
                  <>
                    {filteredCompanyViews.length === 0 ? (
                      <div className="p-16 text-center">
                        <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium">No profile views found matching your criteria</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                      </div>
                    ) : (
                      filteredCompanyViews.map((company, index) => (
                        <ProfileViewItem
                          key={company.id || index}
                          company={company}
                          isPro={isPro}
                        />
                      ))
                    )}
                  </>
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-[#D9F0F4] rounded-full flex items-center justify-center text-[#3298BA] mx-auto mb-4">
                      <FontAwesomeIcon icon={faLock} size="lg" />
                    </div>
                    <p className="text-sm text-[#2a5f74] mb-2">
                      <span className="font-medium">{filteredCompanyViews.length} companies</span> have viewed your profile
                    </p>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                      Complete your internship duration to unlock PRO features and see which companies are interested in your profile
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add dropdown animation */}
      <style jsx global>{`
        @keyframes dropdown {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-dropdown {
          animation: dropdown 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}