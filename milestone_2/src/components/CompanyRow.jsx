import React from 'react';

export default function CompanyRow({ company, onClick, selected }) {
  if (!company) return null;

  return (
    <div
      className={
        "companyrow-root grid grid-cols-12 gap-2 items-center p-4 bg-white rounded-xl border border-gray-100 " +
        "transition-[background,border,box-shadow,backdrop-filter] duration-600 ease-in-out cursor-pointer group" +
        (selected ? " selected" : "")
      }
      onClick={() => onClick?.(company)}
    >
      <div className="companyrow-name-col col-span-5 font-medium text-gray-800">
        <h3 className="companyrow-name">{company.name}</h3>
      </div>
      <div className="companyrow-industry-col col-span-5 text-gray-600">
        <p className="companyrow-industry text-center">{company.industry}</p>
      </div>
      <div className="companyrow-size-col col-span-2 text-right">
        <span className={`companyrow-size-badge inline-block px-3 py-1 rounded-full text-xs font-medium group-hover:bg-white group-hover:text-metallica-blue-800 
          ${company.size.toLowerCase().includes('large') ? 'companyrow-size-large bg-blue-50 text-blue-700 border border-blue-100' :
            company.size.toLowerCase().includes('medium') ? 'companyrow-size-medium bg-purple-50 text-purple-700 border border-purple-100' :
              company.size.toLowerCase().includes('corporate') ? 'companyrow-size-default bg-amber-50 text-amber-700 border border-amber-100' :
                company.size.toLowerCase().includes('small') ? 'companyrow-size-small bg-green-50 text-green-700 border border-green-100' :
                  'companyrow-size-default bg-gray-50 text-gray-700 border border-gray-100'
          }`}>
          {company.size.split(' (')[0]}
        </span>
      </div>
    </div>
  );
}