import React from 'react';

export default function CompanyRow({ company }) {
  return (
    <div className="bg-white w-full rounded-xl border border-gray-100 p-4 flex justify-between items-center 
                    hover:bg-metallica-blue-700 hover:border-metallica-blue-800 hover:shadow-md 
                    transition-all duration-200 cursor-pointer group">
      <div className="flex-1">
        <h3 className="text-base font-medium text-gray-800 group-hover:text-white">{company.name}</h3>
      </div>
      <div className="flex-1 text-center text-gray-600 text-sm group-hover:text-white">
        <p>{company.industry}</p>
      </div>
      <div className="flex-1 text-right">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium group-hover:bg-white group-hover:text-metallica-blue-800 group-hover:border-white ${company.size.toLowerCase().includes('large') ? 'bg-blue-50 text-blue-700 border border-blue-100' :
          company.size.toLowerCase().includes('medium') ? 'bg-purple-50 text-purple-700 border border-purple-100' :
            company.size.toLowerCase().includes('small') ? 'bg-green-50 text-green-700 border border-green-100' :
              'bg-gray-50 text-gray-700 border border-gray-100'
          }`}>
          {company.size}
        </span>
      </div>
    </div>
  );
}