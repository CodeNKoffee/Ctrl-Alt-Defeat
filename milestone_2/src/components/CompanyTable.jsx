"use client";
import React, { useState } from 'react';
import SearchBar from './SearchBar';
import IndustryFilter from './IndustryFilter';
import CompanyDetails from './CompanyDetails';
import CompanyDetailsSmall from './CompanyDetailsSmall';
import CompanyDetailsModal from './CompanyDetailsModal';
import { INDUSTRIES } from '../../constants';

export default function CompanyTable({ companies }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCompany, setModalCompany] = useState(null);

  // Updated filtering logic
  const filteredCompanies = companies.filter(company => {
    const nameMatch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const industrySearchMatch = company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const industryFilterMatch = selectedIndustry ? company.industry === selectedIndustry : true;

    return (nameMatch || industrySearchMatch) && industryFilterMatch;
  });

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setIsExpanded(false);
  };

  const handleExpand = () => setIsExpanded(true);
  const handleCollapse = () => setIsExpanded(false);

  const handleRowClick = (company) => {
    setSelectedCompany(company);
  };

  const handleCloseSidebar = () => {
    setSelectedCompany(null);
    setIsExpanded(false);
  };

  // Modal logic
  const handleExpandModal = (company) => {
    setModalCompany(company);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalCompany(null);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      {/* Header Section */}
      <div className="w-full max-w-6xl mb-8 mx-auto">
        <h1 className="text-2xl font-bold text-metallica-blue-950/90 mb-6 mt-4">
          Company Applications
        </h1>
        <p className="text-gray-500 text-sm mb-8">Manage company applications</p>

        {/* Filter Controls Container */}
        <div className="w-full flex flex-col md:flex-row justify-between gap-4 bg-metallica-blue-100/50 backdrop-blur-sm p-3 rounded-2xl border border-gray-100 shadow-sm mb-6">
          <div className="w-full md:w-1/3">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>

          {/* Industry Filter Dropdown */}
          <div className="w-full md:w-1/3">
            <IndustryFilter
              selectedIndustry={selectedIndustry}
              setSelectedIndustry={setSelectedIndustry}
              industries={INDUSTRIES}
            />
          </div>
        </div>
      </div>

      <div className={`relative flex w-full justify-center transition-all duration-300 ${selectedCompany ? 'pr-[420px]' : ''}`}>
        {/* Table Section */}
        <div className={`w-full max-w-6xl ${selectedCompany ? 'max-w-4xl' : ''} text-sm transition-all duration-300`}>
          {/* Column Headers */}
          <div className="grid grid-cols-12 gap-2 mb-3 px-4 text-xs font-medium text-gray-500 tracking-wide">
            <div className="col-span-5">COMPANY</div>
            <div className="col-span-5">INDUSTRY</div>
            <div className="col-span-2 text-right">SIZE</div>
          </div>

          {/* Company Rows */}
          <div className="space-y-2">
            {filteredCompanies.map((company) => (
              <div
                key={company.name}
                className={`grid grid-cols-12 gap-2 items-center p-4 bg-white rounded-xl border border-gray-100 
                          hover:bg-gradient-to-r hover:from-metallica-blue-950 hover:to-metallica-blue-200/60
                          hover:border-metallica-blue-200 hover:shadow-lg hover:backdrop-blur-sm
                          transition-[background,border,box-shadow,backdrop-filter] duration-300 ease-in-out cursor-pointer group
                          ${selectedCompany && selectedCompany.name === company.name ? 'ring-2 ring-metallica-blue-300 bg-metallica-blue-50' : ''}`}
                onClick={() => handleRowClick(company)}
              >
                <div className="col-span-5 font-medium text-gray-800 group-hover:text-white">
                  {company.name}
                </div>
                <div className="col-span-5 text-gray-600 group-hover:text-white">
                  {company.industry}
                </div>
                <div className="col-span-2 text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium group-hover:bg-white group-hover:text-metallica-blue-800 group-hover:border-white ${company.size.toLowerCase().includes('large') ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                    company.size.toLowerCase().includes('medium') ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                      company.size.toLowerCase().includes('corporate') ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        company.size.toLowerCase().includes('small') ? 'bg-green-50 text-green-700 border border-green-100' :
                          'bg-gray-50 text-gray-700 border border-gray-100'
                    }`}>
                    {company.size.split(' (')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCompanies.length === 0 && (
            <div className="p-16 text-center">
              <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No companies found matching your criteria</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>

        {/* Sidebar for Company Details */}
        {selectedCompany && (
          <div
            className="fixed top-0 right-0 h-screen w-1/3 bg-metallica-blue-50/90 backdrop-blur-md shadow-xl z-50 flex flex-col border-l border-metallica-blue-100 animate-slide-in"
            style={{ minWidth: 420, maxWidth: 500 }}
          >
            <div className="flex justify-end p-4">
              <button
                onClick={handleCloseSidebar}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-white/80 border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-white transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <CompanyDetails
                variant="big"
                companyName={selectedCompany.name}
                companyEmail={selectedCompany.email}
                companyLogo={selectedCompany.logo}
                industry={selectedCompany.industry}
                size={selectedCompany.size}
                documentation={selectedCompany.documentation}
                onExpand={() => { }}
                onCollapse={handleCloseSidebar}
              />
            </div>
          </div>
        )}
      </div>
      {/* Company Details Modal */}
      <CompanyDetailsModal open={modalOpen} onClose={handleCloseModal} company={modalCompany} />
      <style jsx global>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        body {
          background: #f8fafc;
        }
      `}</style>
    </div>
  );
}