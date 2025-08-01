import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';

export default function CompanyIndustryCard({ industry, icon, registrationMessage, className = '' }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  return (
    <div className={`companyindustrycard-root ${className}`}>
      <div className="companyindustrycard-title">
        {safeT('scad.companyDetails.industry')}
        <div className="companyindustrycard-icon-container">
          {icon && <span className="companyindustrycard-icon">{icon}</span>}
        </div>
      </div>
      <div className="companyindustrycard-industry">{industry}</div>
      <div className="companyindustrycard-registration">{registrationMessage}</div>
    </div>
  );
} 