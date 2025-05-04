export default function CompanyIndustryCard({ industry, icon, registrationMessage, className = '' }) {
  return (
    <div className={`companyindustrycard-root ${className}`}>
      <div className="companyindustrycard-title">
        Industry
        <div className="companyindustrycard-icon-container">
          {icon && <span className="companyindustrycard-icon">{icon}</span>}
        </div>
      </div>
      <div className="companyindustrycard-industry">{industry}</div>
      <div className="companyindustrycard-registration">{registrationMessage}</div>
    </div>
  );
} 