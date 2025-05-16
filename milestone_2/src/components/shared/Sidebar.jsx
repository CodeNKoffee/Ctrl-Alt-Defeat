'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faHome,
  faSearch,
  faClipboardList,
  faBriefcase,
  faUser,
  faGraduationCap,
  faChartBar,
  faBuilding,
  faList,
  faFolder,
  faRightFromBracket,
  faBell,
  faVideo,
  faLock
} from '@fortawesome/free-solid-svg-icons';
import CustomButton from './CustomButton';
import { useDispatch } from 'react-redux';
import { LOGOUT_USER } from '@/store/authReducer';
import ProfileIcon from './ProfileIcon';
import ProBadge from './ProBadge';

// Icon mapping for different menu items
const iconMap = {
  home: faHome,
  browse: faSearch,
  applied: faClipboardList,
  'my-internships': faBriefcase,
  'my-reports': faChartBar,
  'my-evaluations': faClipboardList,
  workshops: faGraduationCap,
  'live-workshops': faVideo,
  profile: faUser,
  students: faGraduationCap,
  reports: faChartBar,
  companies: faBuilding,
  listings: faList,
  applications: faFolder,
  logout: faRightFromBracket,
  notifications: faBell,
  'online-assessments': faChartBar,
  statistics: faChartBar
};

// Map of sidebar items for different user types
const sidebarConfig = {
  student: [
    { id: 'home', iconId: 'home', label: 'Dashboard', path: '/dashboard/student', isPage: false },
    { id: 'browse', iconId: 'browse', label: 'Browse Internships', path: '/dashboard/student/browse-internships', isPage: false },
    { id: 'applied', iconId: 'applied', label: 'Applied Internships', path: '/dashboard/student/applied-internships', isPage: false },
    { id: 'my-internships', iconId: 'my-internships', label: 'My Internships', path: '/dashboard/student/my-internships', isPage: false },
    { id: 'my-reports', iconId: 'my-reports', label: 'My Reports', path: '/dashboard/student/my-reports', isPage: false },
    { id: 'my-evaluations', iconId: 'my-evaluations', label: 'My Evaluations', path: '/dashboard/student/my-evaluations', isPage: false },
    { id: 'workshops', iconId: 'workshops', label: 'Workshops', path: '/dashboard/student/workshops', isPage: false, requiresPro: true },
    { id: 'notifications', iconId: 'notifications', label: 'Notifications', path: '/dashboard/student/notifications', isPage: false },
    { id: 'online-assessments', iconId: 'online-assessments', label: 'Online Assessments', path: '/dashboard/student/online-assessments', isPage: false, requiresPro: true },
    { id: 'profile', iconId: 'profile', label: 'Profile', path: '/dashboard/student/profile', isPage: false },
  ],
  faculty: [
    { id: 'dashboard', iconId: 'home', label: 'Dashboard', path: '/dashboard/faculty', isPage: false },
    { id: 'student-evals', iconId: 'my-evaluations', label: 'Evaluations', path: '/dashboard/faculty/student-evals', isPage: false },
    { id: 'statistics', iconId: 'reports', label: 'Statistics', path: '/dashboard/faculty/statistics', isPage: false },
  ],
  company: [
    { id: 'companyposts', iconId: 'listings', label: 'Company Posts', path: '/dashboard/company/companyposts', isPage: false },
    { id: 'browse-internships', iconId: 'browse', label: 'Browse Internships', path: '/dashboard/company/browse-internships', isPage: false },
    { id: 'applications', iconId: 'applications', label: 'Applications', path: '/dashboard/company/applications', isPage: false },
    { id: 'current-interns', iconId: 'my-internships', label: 'Current Interns', path: '/dashboard/company/current-interns', isPage: false },
    { id: 'my-evaluations', iconId: 'my-evaluations', label: 'My Evaluations', path: '/dashboard/company/my-evaluations', isPage: false },
  ],
  scad: [
    { id: 'dashboard', iconId: 'home', label: 'Dashboard', path: '/dashboard/scad', isPage: false },
    { id: 'student-list', iconId: 'students', label: 'Student List', path: '/dashboard/scad/student-list', isPage: false },
    { id: 'browse-internships', iconId: 'browse', label: 'Browse Internships', path: '/dashboard/scad/browse-internships', isPage: false },
    { id: 'student-evals', iconId: 'my-evaluations', label: 'Student Evaluations', path: '/dashboard/scad/student-evals', isPage: false },
    { id: 'statistics', iconId: 'statistics', label: 'Statistics', path: '/dashboard/scad/statistics', isPage: false },
    { id: 'reports', iconId: 'reports', label: 'Reports', path: '/dashboard/scad/reports', isPage: false },
    { id: 'workshops', iconId: 'workshops', label: 'Workshops', path: '/dashboard/scad/workshops', isPage: false },
  ],
};

export default function Sidebar({ userType, onViewChange, currentView, currentUser, onToggle }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [prevView, setPrevView] = useState(currentView);
  const [activeItemPosition, setActiveItemPosition] = useState(null);
  const itemRefs = useRef({});

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const sidebarItems = sidebarConfig[userType] || [];

  // Extract locale from pathname
  const locale = pathname.split('/')[1] || 'en';

  // Add locale to paths
  const localizedItems = sidebarItems.map(item => ({
    ...item,
    path: `/${locale}${item.path}`
  }));

  // Check for mobile devices and set initial state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse on mobile
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    };

    // Set on first load
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update indicator position when active item changes
  useEffect(() => {
    if (isExpanded) {
      const currentActiveItem = localizedItems.find(item => getIsActive(item));
      if (currentActiveItem && itemRefs.current[currentActiveItem.id]) {
        const element = itemRefs.current[currentActiveItem.id];
        const rect = element.getBoundingClientRect();
        const sidebarRect = element.closest('.sidebar-content').getBoundingClientRect();
        setActiveItemPosition({
          top: rect.top - sidebarRect.top,
          height: rect.height,
        });
      }
    }
  }, [currentView, pathname, isExpanded]);

  // Close sidebar when view changes
  useEffect(() => {
    if (currentView !== prevView) {
      // Remove auto-collapse on view change
      // setIsExpanded(false);
      setPrevView(currentView);
    }
  }, [currentView, prevView]);

  const toggleSidebar = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onToggle) {
      onToggle(newExpandedState);
    }
  };

  // Handle view change with auto-collapse
  const handleViewChange = (itemId) => {
    // Call the parent's onViewChange
    if (onViewChange) {
      onViewChange(itemId);
    }

    // Remove auto-collapse sidebar after navigation
    // setIsExpanded(false);
  };

  // Determine active item based on current pathname or view
  const getIsActive = (item) => {
    if (item.isPage) {
      // For path-based navigation, compare with pathname
      return pathname === item.path || pathname.startsWith(item.path + '/');
    } else if (onViewChange) {
      // For view-based navigation, compare with currentView
      return currentView === item.id;
    }
    return false;
  };

  // Check if user has access to a PRO feature
  const hasProAccess = (item) => {
    if (!item.requiresPro) return true;
    return currentUser?.accountType === 'PRO';
  };

  // Handle logout
  const handleLogout = () => {
    dispatch({ type: LOGOUT_USER });

    // Clear session and local storage for user data only
    // Keep welcomeShown flags to prevent welcome animation on logout
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('userSession');
      localStorage.removeItem('userSession');
      // Don't remove welcomeShown flags to avoid showing animation again after logout
    }

    router.push(`/${locale}/`);
  };

  return (
    <div
      className={`bg-[#E2F4F7] h-screen flex flex-col sticky top-0 transform transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20'}`}
      style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
    >
      {/* Sidebar Header */}
      <div className="p-3 border-b border-[#5DB2C7]/30 flex items-center justify-between relative">
        {/* Logo and Optional Portal Text */}
        <div className={`flex items-center transition-all duration-300 ease-in-out ${isExpanded ? 'justify-start w-full opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
          <Image
            src="/logos/internhub-logo.png"
            alt="InternHub Logo"
            width={32}
            height={32}
            className="transition-all duration-300 ease-in-out object-contain"
          />
          <div
            className={`font-young-serif font-bold whitespace-nowrap transition-all duration-300 ease-in-out text-lg ml-2`}
          >
            <span className="text-[#B0BEC5]">Intern</span>
            <span className="text-[#2a5f74]">Hub</span>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-metallica-blue-700 bg-white hover:bg-metallica-blue-50 hover:-translate-y-0.5 hover:scale-105 transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-metallica-blue-500 focus:ring-offset-2 ${!isExpanded ? 'absolute left-1/2 -translate-x-1/2' : ''}`}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <FontAwesomeIcon
            icon={isExpanded ? faChevronLeft : faChevronRight}
            className="transition-transform duration-300 ease-in-out"
            size="sm"
          />
        </button>
      </div>

      {/* Sidebar Content (Navigation Items) */}
      <div className="flex-1 overflow-y-auto pt-2 overflow-x-hidden mt-2 relative sidebar-content">
        {/* Moving background indicator */}
        {isExpanded && activeItemPosition && (
          <>
            {/* Border overlay (behind tab content) */}
            <div
              className="absolute left-1.5 right-0 border border-[#5DB2C7] rounded-l-full z-0 transition-all duration-300 ease-in-out"
              style={{
                top: `${activeItemPosition.top}px`,
                height: `${activeItemPosition.height}px`,
                borderRight: "none"
              }}
            />

            {/* Content background (above border) */}
            <div
              className="absolute left-2 right-0 bg-[#f5fbfd] rounded-l-full z-[1] transition-all duration-300 ease-in-out"
              style={{
                top: `${activeItemPosition.top + 1}px`,
                height: `${activeItemPosition.height - 2}px`
              }}
            />
          </>
        )}

        <ul className="space-y-1 relative z-10">
          {localizedItems.map(item => {
            const isActive = getIsActive(item);
            const icon = iconMap[item.iconId] || faHome;
            const isAccessible = hasProAccess(item);

            const commonClasses = "w-full flex items-center p-3 transition-all duration-300 ease-in-out text-sm relative z-10";
            const activeClasses = isExpanded
              ? "text-[#2a5f74] font-medium"
              : "bg-[#f5fbfd] text-[#2a5f74] rounded-lg shadow-sm";
            const inactiveClasses = "text-[#2a5f74] hover:bg-[#f5fbfd]/70 rounded-lg";
            const disabledClasses = "text-gray-400 cursor-not-allowed";
            const alignmentClass = isExpanded ? "justify-start" : "justify-center";

            const itemContent = (
              <>
                <span className={`flex-shrink-0 flex items-center ${isExpanded ? 'w-6 ml-1' : 'w-auto'} justify-center`}>
                  <FontAwesomeIcon
                    icon={icon}
                    size="lg"
                    className={`transition-all duration-300 ease-in-out ${isActive ? 'text-[#2a5f74]' : isAccessible ? 'text-[#2a5f74]/70' : 'text-gray-400'}`}
                  />
                </span>
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'ml-3 opacity-100 max-w-[150px]' : 'ml-0 opacity-0 max-w-0'
                    }`}
                >
                  {item.label}
                </span>

                {item.requiresPro && !isAccessible && isExpanded && (
                  <span className="ml-auto">
                    <FontAwesomeIcon icon={faLock} className="text-gray-400 h-3 w-3" />
                  </span>
                )}
              </>
            );

            if (item.isPage) {
              return (
                <li key={item.id}>
                  {isAccessible ? (
                    <Link
                      href={item.path}
                      className={`${commonClasses} ${alignmentClass} ${isActive ? activeClasses : inactiveClasses}`}
                      onClick={() => !isExpanded && setIsExpanded(false)}
                      ref={el => itemRefs.current[item.id] = el}
                    >
                      {itemContent}
                    </Link>
                  ) : (
                    <div
                      className={`${commonClasses} ${alignmentClass} ${disabledClasses}`}
                      ref={el => itemRefs.current[item.id] = el}
                      title="PRO feature"
                    >
                      {itemContent}
                    </div>
                  )}
                </li>
              );
            } else if (onViewChange) {
              return (
                <li key={item.id}>
                  {isAccessible ? (
                    <button
                      onClick={() => handleViewChange(item.id)}
                      className={`${commonClasses} ${alignmentClass} ${isActive ? activeClasses : inactiveClasses}`}
                      ref={el => itemRefs.current[item.id] = el}
                    >
                      {itemContent}
                    </button>
                  ) : (
                    <div
                      className={`${commonClasses} ${alignmentClass} ${disabledClasses}`}
                      ref={el => itemRefs.current[item.id] = el}
                      title="PRO feature"
                    >
                      {itemContent}
                    </div>
                  )}
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>

      {/* User Profile Section at bottom */}
      <div className="mt-auto px-3 py-2 mb-2">
        {isExpanded ? (
          <div className="flex items-center bg-[#f5fbfd] rounded-xl p-3 shadow-sm hover:bg-[#f5fbfd]/80 transition-all duration-200 cursor-pointer">
            <div className="flex-shrink-0 mr-3">
              <ProfileIcon
                src={currentUser?.profileImage}
                alt={currentUser?.name || ""}
                size="md"
                showStatus={false}
              />
            </div>
            <div className="flex flex-col overflow-hidden">
              <div className="flex items-center gap-2">
                {currentUser && (
                  <span className="font-semibold text-[#2a5f74] text-base truncate">
                    {currentUser.name}
                  </span>
                )}
                {currentUser?.accountType === 'PRO' && <ProBadge size="sm" />}
              </div>
              <span className="text-gray-500 text-xs capitalize truncate">
                {userType}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <ProfileIcon
              src={currentUser?.profileImage}
              alt={currentUser?.name || ""}
              size="lg"
              showStatus={false}
              className="transform scale-110"
            />
          </div>
        )}
      </div>

      {/* Sidebar Footer (Logout Button) */}
      <div className={`w-full p-3 border-t border-[#5DB2C7]/30 transition-all duration-300 ease-in-out flex ${isExpanded ? 'justify-start' : 'justify-center'}`}>
        {isExpanded ? (
          <CustomButton
            variant="danger"
            onClick={handleLogout}
            icon={faRightFromBracket}
            text="Logout"
            width="w-full"
          />
        ) : (
          <button
            onClick={handleLogout}
            className="p-2.5 w-11 h-11 rounded-full flex items-center justify-center bg-white text-red-600 hover:bg-red-50 hover:-translate-y-0.5 hover:scale-105 transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            aria-label="Logout"
          >
            <FontAwesomeIcon icon={faRightFromBracket} size="lg" />
          </button>
        )}
      </div>
    </div>
  );
} 