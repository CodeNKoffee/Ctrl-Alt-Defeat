import Image from "next/image";
import CompanyProfileCard from './cards/CompanyProfileCard';
import CompanyIndustryCard from './cards/CompanyIndustryCard';
import CompanySizeCard from './cards/CompanySizeCard';
import CompanyDocumentsCard from './cards/CompanyDocumentsCard';
import { faChevronDown, faChevronUp, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Example industry icon mapping (expand as needed)
const industryIcons = {
  'Software as a Service (SaaS)': '🧑‍💻',
  'Telecommunications': '📡',
  'Food Production': '🍞',
  'Food & Beverages': '🥤',
  'Automotive': '🚗',
  'Financial Services': '💳',
  'Internet': '🌐',
  // ... add more as needed
};

export default function CompanyDetails({
  variant = 'small',
  companyName,
  companyEmail,
  companyLogo,
  industry,
  size,
  documentation = [],
  onExpand,
  onCollapse
}) {
  // Compose registration message
  const registrationMessage = `Registered on 01 May, 2025`;
  // Compose docs array for card
  const docs = Array.isArray(documentation)
    ? documentation
    : documentation
      ? [{ url: documentation, name: documentation, type: documentation.split('.').pop() }]
      : [];

  // Layout for 'big' variant
  if (variant === 'big') {
    return (
      <div className="companydetails-root companydetails-big">
        <div className="companydetails-header-row">
          <CompanyProfileCard logo={companyLogo} name={companyName} email={companyEmail} />
          <CompanyIndustryCard industry={industry} icon={industryIcons[industry]} registrationMessage={registrationMessage} />
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
      <CompanyIndustryCard industry={industry} icon={industryIcons[industry]} registrationMessage={registrationMessage} />
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