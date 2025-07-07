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
  faBrain,
  faChartLine,
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
  faLock,
  faListAlt,
  faSpinner,
  faGlobe,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import CustomButton from './CustomButton';
import { useDispatch } from 'react-redux';
import { LOGOUT_USER } from '@/store/authReducer';
import ProfileIcon from './ProfileIcon';
import ProBadge from './ProBadge';

// Language configuration
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

// Icon mapping for different menu items
const iconMap = {
  home: faHome,
  browse: faSearch,
  applied: faFolder,
  'my-internships': faBriefcase,
  'my-reports': faChartBar,
  'my-evaluations': faClipboardList,
  workshops: faGraduationCap,
  'live-workshops': faVideo,
  profile: faUser,
  students: faGraduationCap,
  'student-list': faListAlt,
  reports: faChartBar,
  companies: faBuilding,
  listings: faList,
  applications: faFolder,
  logout: faRightFromBracket,
  notifications: faBell,
  'online-assessments': faBrain,
  statistics: faChartLine
};

// Map of sidebar items for different user types
const sidebarConfig = {
  student: [
    { id: 'home', iconId: 'home', label: 'Dashboard', path: '/dashboard/student', isPage: false },
    { id: 'browse', iconId: 'browse', label: 'Browse Internships', path: '/dashboard/student/browse-internships', isPage: false },
    { id: 'applied', iconId: 'applied', label: 'My Applications', path: '/dashboard/student/applied-internships', isPage: false },
    { id: 'my-internships', iconId: 'my-internships', label: 'My Internships', path: '/dashboard/student/my-internships', isPage: false },
    { id: 'my-reports', iconId: 'my-reports', label: 'My Reports', path: '/dashboard/student/my-reports', isPage: false },
    { id: 'my-evaluations', iconId: 'my-evaluations', label: 'My Evaluations', path: '/dashboard/student/my-evaluations', isPage: false },
    { id: 'workshops', iconId: 'workshops', label: 'Workshops', path: '/dashboard/student/workshops', isPage: false, requiresPro: true },
    { id: 'notifications', iconId: 'notifications', label: 'Notifications', path: '/dashboard/student/notifications', isPage: false },
    { id: 'online-assessments', iconId: 'online-assessments', label: 'Online Assessments', path: '/dashboard/student/online-assessments', isPage: false, requiresPro: true },
    { id: 'profile', iconId: 'profile', label: 'My Profile', path: '/dashboard/student/profile', isPage: false },
  ],
  faculty: [
    { id: 'dashboard', iconId: 'home', label: 'Dashboard', path: '/dashboard/faculty', isPage: false },
    { id: 'student-evals', iconId: 'my-evaluations', label: 'Evaluations', path: '/dashboard/faculty/student-evals', isPage: false },
    { id: 'statistics', iconId: 'statistics', label: 'Statistics', path: '/dashboard/faculty/statistics', isPage: false },
  ],
  company: [
    { id: 'companyposts', iconId: 'listings', label: 'My Posts', path: '/dashboard/company/companyposts', isPage: false },
    { id: 'browse-internships', iconId: 'browse', label: 'Browse Internships', path: '/dashboard/company/browse-internships', isPage: false },
    { id: 'applications', iconId: 'applications', label: 'My Applicants', path: '/dashboard/company/applications', isPage: false },
    { id: 'current-interns', iconId: 'my-internships', label: 'My Interns', path: '/dashboard/company/current-interns', isPage: false },
    { id: 'my-evaluations', iconId: 'my-evaluations', label: 'My Evaluations', path: '/dashboard/company/my-evaluations', isPage: false },
  ],
  scad: [
    { id: 'dashboard', iconId: 'home', label: 'Dashboard', path: '/dashboard/scad', isPage: false },
    { id: 'student-list', iconId: 'student-list', label: 'Student List', path: '/dashboard/scad/student-list', isPage: false },
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [hoveredTooltip, setHoveredTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const itemRefs = useRef({});
  const languageDropdownRef = useRef(null);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const sidebarItems = sidebarConfig[userType] || [];

  // Extract locale from pathname
  const locale = pathname.split('/')[1] || 'en';

  // Get current language info
  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

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

  // Handle click outside language dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Add a brief delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 800));

      dispatch({ type: LOGOUT_USER });

      // Clear session and local storage for user data only
      // Keep welcomeShown flags to prevent welcome animation on logout
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('userSession');
        localStorage.removeItem('userSession');
        // Don't remove welcomeShown flags to avoid showing animation again after logout
      }

      router.push(`/${locale}/`);
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  // Handle tooltip display
  const handleTooltipShow = (itemId, label, event) => {
    if (!isExpanded) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top + rect.height / 2 - 20, // Center vertically
        left: rect.right + 12 // Position to the right with some spacing
      });
      setHoveredTooltip({ id: itemId, label });
    }
  };

  const handleTooltipHide = () => {
    setHoveredTooltip(null);
  };

  // Handle language change
  const handleLanguageChange = (languageCode) => {
    const pathSegments = pathname.split('/');
    pathSegments[1] = languageCode; // Replace the locale segment
    const newPath = pathSegments.join('/');

    setShowLanguageDropdown(false);
    router.push(newPath);
  };

  return (
    <div
      className={`z-30 bg-[#E2F4F7] h-screen flex flex-col border-r border-[#5DB2C7] sticky top-0 transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20'}`}
      style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[#5DB2C7] flex items-center justify-between bg-[#E2F4F7]">
        {/* Logo and Portal Text */}
        <div className={`flex items-center transition-all duration-300 ${isExpanded ? 'justify-start w-full opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
          <Image
            src="/logos/internhub-logo.png"
            alt="InternHub Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <div className="font-young-serif font-bold whitespace-nowrap text-lg ml-2 tracking-wide">
            <span className="text-[#B0BEC5]">Intern</span>
            <span className="text-[#2a5f74]">Hub</span>
          </div>
        </div>
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`w-9 h-9 flex items-center justify-center rounded-full text-[#5DB2C7] bg-[#E2F4F7] border border-[#5DB2C7] hover:bg-[#D9F0F4] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5DB2C7] focus:ring-offset-2 ${!isExpanded ? 'absolute left-1/2 -translate-x-1/2' : ''}`}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          style={{ boxShadow: 'none' }}
        >
          <FontAwesomeIcon
            icon={isExpanded ? faChevronLeft : faChevronRight}
            className="text-lg"
          />
        </button>
      </div>

      {/* Sidebar Content (Navigation Items) */}
      <div className="flex-1 overflow-y-auto pt-4 overflow-x-hidden mt-2 relative sidebar-content z-20">
        <ul className="space-y-1 relative z-10">
          {localizedItems.map(item => {
            const isActive = getIsActive(item);
            const icon = iconMap[item.iconId] || faHome;
            const isAccessible = hasProAccess(item);

            const commonClasses = "w-full flex items-center p-2.5 transition-all duration-200 text-base relative z-10 rounded-xl group";
            const activeClasses = "text-[#2a5f74] font-semibold border border-[#3298BA] bg-transparent shadow-sm focus:ring-1 focus:ring-[#3298BA] px-1.5";
            const inactiveClasses = "text-[#2a5f74] hover:bg-[#D9F0F4]";
            const disabledClasses = "text-gray-400 cursor-not-allowed opacity-60";
            const alignmentClass = isExpanded ? "justify-start" : "justify-center";

            const itemContent = (
              <>
                <span className={`flex-shrink-0 flex items-center ${isExpanded ? 'w-6 ml-1' : 'w-auto'} justify-center text-base`}>
                  <FontAwesomeIcon
                    icon={icon}
                    size="lg"
                    className={`transition-all duration-200 ${isActive ? 'text-[#3298BA]' : isAccessible ? 'text-[#2a5f74]/70' : 'text-gray-400'}`}
                  />
                </span>
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${isExpanded ? 'ml-3 opacity-100 w-full' : 'ml-0 opacity-0 w-0'} font-medium text-left`}
                  style={isExpanded ? { maxWidth: '100%' } : {}}
                >
                  {item.label}
                </span>
                {item.requiresPro && !isAccessible && isExpanded && (
                  <span className="ml-auto">
                    <FontAwesomeIcon icon={faLock} className="text-gray-400 h-4 w-4" />
                  </span>
                )}
              </>
            );

            if (item.isPage) {
              return (
                <li key={item.id} className="px-1.5">
                  {isAccessible ? (
                    <Link
                      href={item.path}
                      className={`${commonClasses} ${alignmentClass} ${isActive ? activeClasses : inactiveClasses}`}
                      onClick={() => !isExpanded && setIsExpanded(false)}
                      ref={el => itemRefs.current[item.id] = el}
                      onMouseEnter={(e) => handleTooltipShow(item.id, item.label, e)}
                      onMouseLeave={handleTooltipHide}
                    >
                      {itemContent}
                    </Link>
                  ) : (
                    <div
                      className={`${commonClasses} ${alignmentClass} ${disabledClasses}`}
                      ref={el => itemRefs.current[item.id] = el}
                      onMouseEnter={(e) => handleTooltipShow(item.id, `PRO feature - ${item.label}`, e)}
                      onMouseLeave={handleTooltipHide}
                    >
                      {itemContent}
                    </div>
                  )}
                </li>
              );
            } else if (onViewChange) {
              return (
                <li key={item.id} className="px-1.5">
                  {isAccessible ? (
                    <button
                      onClick={() => handleViewChange(item.id)}
                      className={`${commonClasses} ${alignmentClass} ${isActive ? activeClasses : inactiveClasses}`}
                      ref={el => itemRefs.current[item.id] = el}
                      onMouseEnter={(e) => handleTooltipShow(item.id, item.label, e)}
                      onMouseLeave={handleTooltipHide}
                    >
                      {itemContent}
                    </button>
                  ) : (
                    <div
                      className={`${commonClasses} ${alignmentClass} ${disabledClasses}`}
                      ref={el => itemRefs.current[item.id] = el}
                      onMouseEnter={(e) => handleTooltipShow(item.id, `PRO feature - ${item.label}`, e)}
                      onMouseLeave={handleTooltipHide}
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
      <div className="mt-auto px-4 py-4 mb-2">
        {/* Language Selector */}
        <div className="relative mb-3" ref={languageDropdownRef}>
          {isExpanded ? (
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="w-full flex items-center justify-between bg-[#5DB2C7]/20 rounded-xl p-3 transition-all duration-200 hover:bg-[#5DB2C7]/30 border border-[#E0ECF2] group"
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faGlobe}
                  className="text-[#2a5f74] h-4 w-4"
                />
                <span className="text-[#2a5f74] font-medium text-sm">
                  {currentLanguage.flag} {currentLanguage.name}
                </span>
              </div>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-[#2a5f74] h-3 w-3 transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`}
              />
            </button>
          ) : (
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="w-full flex items-center justify-center bg-[#5DB2C7]/20 rounded-xl p-3 transition-all duration-200 hover:bg-[#5DB2C7]/30 border border-[#E0ECF2]"
              onMouseEnter={(e) => handleTooltipShow('language', 'Language', e)}
              onMouseLeave={handleTooltipHide}
            >
              <FontAwesomeIcon
                icon={faGlobe}
                className="text-[#2a5f74] h-4 w-4"
              />
            </button>
          )}

          {/* Language Dropdown */}
          {showLanguageDropdown && (
            <div className={`absolute bottom-full mb-2 ${isExpanded ? 'left-0 right-0' : 'left-1/2 -translate-x-1/2 w-48'} bg-white rounded-lg shadow-lg border border-[#E0ECF2] z-50 overflow-hidden`}>
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-150 ${currentLanguage.code === language.code ? 'bg-[#5DB2C7]/10 text-[#2a5f74] font-medium' : 'text-gray-700'
                    }`}
                >
                  <span className="text-base">{language.flag}</span>
                  <span className="text-sm">{language.name}</span>
                  {currentLanguage.code === language.code && (
                    <span className="ml-auto w-2 h-2 bg-[#5DB2C7] rounded-full"></span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {isExpanded ? (
          <div className="flex items-center bg-[#5DB2C7]/20 rounded-xl p-3 transition-all duration-200 cursor-pointer gap-3 border border-[#E0ECF2]">
            <div className="flex-shrink-0 mr-2">
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
              size="md"
              showStatus={false}
            />
          </div>
        )}
      </div>

      {/* Sidebar Footer (Logout Button) */}
      <div className={`w-full p-4 border-t border-[#5DB2C7] transition-all duration-200 flex ${isExpanded ? 'justify-start' : 'justify-center'}`}>
        {isExpanded ? (
          <CustomButton
            variant="danger"
            onClick={handleLogout}
            icon={faRightFromBracket}
            text="Logout"
            width="w-full"
            className="rounded-lg"
            isLoading={isLoggingOut}
            loadingText="Logging out..."
            useAnimatedDots={true}
            disabled={isLoggingOut}
          />
        ) : (
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`p-2.5 w-10 h-10 rounded-full flex items-center justify-center bg-[#E2F4F7] text-red-600 hover:bg-red-100 transition-all duration-200 border border-[#E0ECF2] focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2 ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-label="Logout"
            onMouseEnter={(e) => handleTooltipShow('logout', isLoggingOut ? "Logging out..." : "Logout", e)}
            onMouseLeave={handleTooltipHide}
          >
            {isLoggingOut ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" size="lg" />
            ) : (
              <FontAwesomeIcon icon={faRightFromBracket} size="lg" />
            )}
          </button>
        )}
      </div>

      {/* Custom Instant Tooltip - Only shows when sidebar is collapsed */}
      {hoveredTooltip && !isExpanded && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            {hoveredTooltip.label}
            {/* Small arrow pointing left */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1">
              <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}