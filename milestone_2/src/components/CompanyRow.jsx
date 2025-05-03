import React from 'react';

export default function CompanyRow({ company }) {
  return (
    <div className="companyrow-root">
      <div className="companyrow-name-col">
        <h3 className="companyrow-name">{company.name}</h3>
      </div>
      <div className="companyrow-industry-col">
        <p className="companyrow-industry">{company.industry}</p>
      </div>
      <div className="companyrow-size-col">
        <span className={`companyrow-size-badge ${company.size.toLowerCase().includes('large') ? 'companyrow-size-large' :
          company.size.toLowerCase().includes('medium') ? 'companyrow-size-medium' :
            company.size.toLowerCase().includes('small') ? 'companyrow-size-small' :
              'companyrow-size-default'
          }`}>
          {company.size}
        </span>
      </div>
    </div>
  );
}