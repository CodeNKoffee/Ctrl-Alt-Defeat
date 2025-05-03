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
      <div className="flex flex-col gap-6 w-full max-w-xl mx-auto items-center">
        <div className="flex flex-col md:flex-row gap-6 w-full items-center">
          <CompanyProfileCard logo={companyLogo} name={companyName} email={companyEmail} />
          <CompanyIndustryCard industry={industry} icon={industryIcons[industry]} registrationMessage={registrationMessage} />
        </div>
        <CompanySizeCard size={size} />
        <CompanyDocumentsCard documents={docs} />
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-2 w-full items-center">
          <button className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all flex items-center justify-center w-full md:w-auto text-lg gap-2" onClick={onCollapse}>
            <FontAwesomeIcon icon={faCheck} className="text-xl" /> Accept
          </button>
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center justify-center w-full md:w-auto text-lg gap-2">
            <FontAwesomeIcon icon={faTimes} className="text-xl" /> Reject
          </button>
        </div>
        <button className="mt-4 flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold transition-all" onClick={onExpand}>
          <FontAwesomeIcon icon={faChevronUp} /> Collapse Details
        </button>
      </div>
    );
  }

  // Layout for 'small' variant
  return (
    <div className="flex flex-col gap-6 w-full max-w-xs mx-auto items-center">
      <CompanyProfileCard logo={companyLogo} name={companyName} email={companyEmail} />
      <CompanyIndustryCard industry={industry} icon={industryIcons[industry]} registrationMessage={registrationMessage} />
      <CompanySizeCard size={size} />
      <div className="flex flex-col gap-4 justify-center mt-2 w-full items-center">
        <button className="bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-all flex items-center justify-center w-full text-base gap-2" onClick={onExpand}>
          <FontAwesomeIcon icon={faChevronDown} /> View Details
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center justify-center w-full text-base gap-2">
          <FontAwesomeIcon icon={faTimes} /> Reject
        </button>
      </div>
    </div>
  );
} 