import Image from "next/image";
import CompanyProfileCard from './cards/CompanyProfileCard';
import CompanyIndustryCard from './cards/CompanyIndustryCard';
import CompanySizeCard from './cards/CompanySizeCard';
import CompanyDocumentsCard from './cards/CompanyDocumentsCard';
import { faChevronDown, faChevronUp, faCheck, faTimes, faExpand } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { INDUSTRY_ICONS } from '../constants/industryIcons';

export default function CompanyDetails({
  variant = 'small',
  companyName,
  companyEmail,
  companyLogo,
  industry,
  size,
  documentation = [],
  onExpand,
  onCollapse,
  onExpandModal
}) {
  // Compose registration message
  const registrationMessage = `Registered on 03 May, 2025`;
  // Compose docs array for card
  const docs = Array.isArray(documentation)
    ? documentation
    : documentation
      ? [{ url: documentation, name: documentation, type: documentation.split('.').pop() }]
      : [];

  // Get the appropriate icon for the industry
  const industryIcon = INDUSTRY_ICONS[industry] || '🏢'; // Default icon if industry not found

  // Layout for 'big' variant
  if (variant === 'big') {
    return (
      <div className="companydetails-root companydetails-big relative">
        <button
          className="absolute top-4 right-4 text-metallica-blue-700 hover:text-metallica-blue-900 bg-  rounded-full p-2 border border-gray-200 shadow"
          onClick={onExpandModal}
          title="Expand details"
        >
          <FontAwesomeIcon icon={faExpand} className="w-5 h-5" />
        </button>
        <div className="companydetails-header-row">
          <CompanyProfileCard logo={companyLogo} name={companyName} email={companyEmail} />
          <CompanyIndustryCard industry={industry} icon={industryIcon} registrationMessage={registrationMessage} />
        </div>
        <CompanySizeCard size={size} />
        <CompanyDocumentsCard documents={docs} />
        <div className="companydetails-action-row">
          <button className="companydetails-accept-btn" onClick={onCollapse}>
            <FontAwesomeIcon icon={faCheck} className="companydetails-action-icon" /> Accept
          </button>
          <button className="companydetails-reject-btn">
            <FontAwesomeIcon icon={faTimes} className="companydetails-action-icon" /> Reject
          </button>
        </div>
        <button className="companydetails-collapse-btn" onClick={onExpand}>
          <FontAwesomeIcon icon={faChevronUp} /> Collapse Details
        </button>
      </div>
    );
  }

  // Layout for 'small' variant
  return (
    <div className="companydetails-root companydetails-small">
      <CompanyProfileCard logo={companyLogo} name={companyName} email={companyEmail} />
      <CompanyIndustryCard industry={industry} icon={industryIcon} registrationMessage={registrationMessage} />
      <CompanySizeCard size={size} />
      <div className="companydetails-action-row companydetails-action-row-small">
        <button className="companydetails-accept-btn companydetails-accept-btn-small" onClick={onExpand}>
          <FontAwesomeIcon icon={faChevronDown} /> View Details
        </button>
        <button className="companydetails-reject-btn companydetails-reject-btn-small">
          <FontAwesomeIcon icon={faTimes} /> Reject
        </button>
      </div>
    </div>
  );
} 