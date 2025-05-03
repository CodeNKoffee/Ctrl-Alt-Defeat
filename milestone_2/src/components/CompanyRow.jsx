import React from 'react';

export default function CompanyRow({ company }) { 
  return (
    <div className="bg-white rounded-lg border p-4 flex justify-between items-center font-ibm-plex-sans">
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{company.name}</h3>
      </div>
      <div className="flex-1 text-center">
        <p>{company.industry}</p>
      </div>
      <div className="flex-1 text-right">
        <p>{company.size}</p>
      </div>
    </div>
  );
}