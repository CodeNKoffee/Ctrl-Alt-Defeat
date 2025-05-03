export default function CompanyIndustryCard({ industry, icon, registrationMessage }) {
  return (
    <div className="companyindustrycard-root">
      <div className="companyindustrycard-title">
        Industry
        {icon && <span className="companyindustrycard-icon">{icon}</span>}
      </div>
      <div className="companyindustrycard-industry">{industry}</div>
      <div className="companyindustrycard-registration">{registrationMessage}</div>
    </div>
  );
} 