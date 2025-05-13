'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faClock, faBell, faFilter, faEllipsisH, faSearch, faXmark, faLock } from '@fortawesome/free-solid-svg-icons';

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

export default function NotificationsList() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
  const durationCompleted = userData?.durationCompleted || 0;

  // Sample notifications
  const notifications = [
    {
      id: 1,
      icon: faBuilding,
      title: '<b>TechVision</b> posted a new internship that matches your skills',
      time: '2h',
      isUnread: true
    },
    {
      id: 2,
      icon: faBell,
      title: 'Your internship application at <b>BrandBoost</b> was accepted',
      time: '1d',
      isUnread: true
    },
    {
      id: 3,
      icon: faBell,
      title: 'Your <b>Frontend Developer</b> internship starts in 5 days',
      time: '3d',
      isUnread: false
    }
  ];

  // Filter notifications based on search term
  const filteredNotifications = notifications.filter(notification => {
    return notification.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Companies that viewed profile (mock data)
  const companyViews = MOCK_COMPANIES.slice(0, 5);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="container mx-auto py-4">
      <div className="w-full mx-auto">
        {/* Filters section */}
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
              <button className="appearance-none bg-white/90 backdrop-blur-sm border-2 border-[#B8E1E9] hover:border-[#5DB2C7] text-sm text-[#1a3f54] py-2 px-4 rounded-full shadow-md focus:outline-none transition-all duration-300 flex items-center gap-2">
                <FontAwesomeIcon icon={faFilter} className="h-4 w-4 text-[#5DB2C7]" />
                <span>Filter</span>
              </button>
              <button className="appearance-none bg-white/90 backdrop-blur-sm border-2 border-[#B8E1E9] hover:border-[#5DB2C7] text-sm text-[#1a3f54] py-2 px-4 rounded-full shadow-md focus:outline-none transition-all duration-300 flex items-center gap-2">
                <FontAwesomeIcon icon={faEllipsisH} className="h-4 w-4 text-[#5DB2C7]" />
              </button>
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
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${activeTab === 'profile' ? 'text-[#3298BA] border-b-2 border-[#3298BA]' : 'text-gray-500 hover:text-[#5DB2C7]'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Views
            </button>
          </div>

          {/* Content area */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
            {activeTab === 'all' && (
              <>
                {searchTerm && filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 font-medium">No notifications found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
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
                      ? 'See which companies are interested in your profile'
                      : `${companyViews.length} companies viewed your profile recently. Upgrade to PRO to see details.`
                    }
                  </p>
                </div>

                {companyViews.map((company, index) => (
                  <ProfileViewItem
                    key={company.id || index}
                    company={company}
                    isPro={isPro}
                  />
                ))}

                {!isPro && companyViews.length > 0 && (
                  <div className="p-4 text-center border-t">
                    <p className="text-sm text-[#2a5f74] mb-2">
                      <span className="font-medium">{companyViews.length} companies</span> have viewed your profile
                    </p>
                    <p className="text-xs text-gray-500">
                      Complete your internship duration to unlock PRO features and see who's interested in your profile
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}