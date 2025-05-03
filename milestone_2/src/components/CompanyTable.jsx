"use client"; 
import React from 'react';
import CompanyRow from './CompanyRow';
import { useState } from 'react';
import SearchBar from './SearchBar';

export const mockCompanies = [
  {
    name: 'Tech Corp',
    industry: 'Tech',
    size: 'Large',
  },
  {
    name: 'Finance Inc',
    industry: 'Finance',
    size: 'Medium',
  },
  {
    name: 'Health LLC',
    industry: 'Healthcare',
    size: 'Small',
  },
  {
    name: 'Microsoft',
    industry: 'Tech',
    size: 'Corporate',
  },
  {
    name: 'LSE',
    industry: 'Electrical Engineering',
    size: 'Medium',
  },
  {
    name: 'Urban Cafe',
    industry: 'Food & Beverage',
    size: 'Small',
  },
  {
    name: 'Global Media',
    industry: 'Entertainment',
    size: 'Corporate',
  },
  {
    name: 'Cloud Networks',
    industry: 'IT Services',
    size: 'Corporate',
  },
  {
    name: 'Creative Designs',
    industry: 'Marketing',
    size: 'Medium',
  },
  {
    name: 'Siemens',
    industry: 'Technology',
    size: 'Medium',
  },
];

export default function CompanyTable() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = mockCompanies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center">
      {/* Header Section */}
      <div className="w-full max-w-4xl mb-8">
        <h1 
          className="text-3xl font-bold mb-4 mt-6"
          style={{ color: 'var(--metallica-blue-950)' }}
        >
          Company Applications
        </h1>
        
       {/* Search Bar - Now with self-contained styling */}
       <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Table Section */}
      <div className="w-full max-w-4xl text-sm mt-4">
        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-2 mb-2 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-5">Company</div>
          <div className="col-span-5">Industry</div>
          <div className="col-span-2 text-right">Size</div>
        </div>

        {/* Company Rows */}
        <div className="space-y-3">
          {filteredCompanies.map((company) => (
            <div 
              key={company.name}
              className="grid grid-cols-12 gap-2 items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-200"
            >
              <div className="col-span-5 font-medium text-gray-800">
                {company.name}
              </div>
              <div className="col-span-5 text-gray-600">
                {company.industry}
              </div>
              <div className="col-span-2 text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  company.size === 'Large' ? 'bg-blue-100 text-blue-800' :
                  company.size === 'Medium' ? 'bg-purple-100 text-purple-800' :
                  company.size === 'Corporate' ? 'bg-amber-100 text-amber-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {company.size}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCompanies.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No companies found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
}