"use client";

import Image from "next/image";
import { faFilePdf, faFileImage, faExpand } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
export default function CompanyDetailsSmall({ companyName, companyEmail, companyLogo, industry, size, documentation, onExpand, onExpandModal }) {
  // Helper to render documentation files with icons
  const renderDocIcon = (doc) => {
    const url = doc.url || doc.name || "";
    if (url.endsWith('.pdf')) return <FontAwesomeIcon icon={faFilePdf} className="text-metallica-blue-700 w-5 h-5 mr-2" />;
    if (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg')) return <FontAwesomeIcon icon={faFileImage} className="text-metallica-blue-700 w-5 h-5 mr-2" />;
    return <FontAwesomeIcon icon={faFilePdf} className="text-metallica-blue-700 w-5 h-5 mr-2" />;
  };

  // Company size bar logic
  const sizeSteps = ["<=50", "51-100", "101-500", "500+"];
  const getActiveStep = () => {
    if (size.includes("<=50")) return 0;
    if (size.includes("51-100")) return 1;
    if (size.includes("101-500")) return 2;
    return 3;
  };
  const activeStep = getActiveStep();

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-md mx-auto flex flex-col gap-6 relative">
      {/* Expand Modal Icon */}
      <button
        className="absolute top-4 right-4 text-metallica-blue-700 hover:text-metallica-blue-900 bg-white/80 rounded-full p-2 border border-gray-200 shadow"
        onClick={onExpandModal}
        title="Expand details"
      >
        <FontAwesomeIcon icon={faExpand} className="w-5 h-5" />
      </button>
      {/* Logo & Contact */}
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <Image
            className="rounded-full border border-gray-200 bg-white"
            src={companyLogo}
            alt="Company Logo"
            width={72}
            height={72}
          />
        </div>
        <div>
          <div className="text-lg font-semibold text-metallica-blue-900 mb-1">{companyName}</div>
          <a href={`mailto:${companyEmail}`} className="text-sm text-metallica-blue-600 underline hover:text-metallica-blue-800">{companyEmail}</a>
        </div>
      </div>

      {/* Industry & Registration */}
      <div className="flex items-center gap-4 bg-metallica-blue-50/60 rounded-xl p-4 border border-metallica-blue-100">
        <div className="flex-shrink-0">
          <Image
            className="rounded-full border border-gray-200"
            src={companyLogo}
            alt="Industry Logo"
            width={40}
            height={40}
          />
        </div>
        <div>
          <div className="text-xs font-bold text-gray-700 mb-1">Industry</div>
          <div className="text-sm text-gray-800 mb-1">{industry}</div>
          <div className="text-xs text-gray-500">Registered on 01 May, 2025</div>
        </div>
      </div>

      {/* Company Size */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="font-semibold text-sm text-gray-800 mb-2">Company Size</div>
        <div className="flex items-center gap-2 mb-2">
          {sizeSteps.map((step, idx) => (
            <div
              key={step}
              className={`flex-1 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all
                ${idx === activeStep ? 'bg-metallica-blue-700 text-white' : 'bg-metallica-blue-200 text-metallica-blue-800'}`}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* Documentation */}
      <div className="bg-metallica-blue-50/60 rounded-xl border border-metallica-blue-100 p-4">
        <div className="font-semibold text-sm text-gray-800 mb-2">Documentation</div>
        <div className="flex flex-col gap-2">
          {documentation && documentation.length > 0 ? documentation.map((doc, idx) => (
            <div key={idx} className="flex items-center bg-white rounded-lg border border-gray-100 px-3 py-2">
              {renderDocIcon(doc)}
              <span className="text-xs text-gray-700">{doc.name || (doc.url ? doc.url.split('/').pop() : '')}</span>
            </div>
          )) : <span className="text-xs text-gray-400">No documents uploaded</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-2">
        <button
          className="flex-1 flex items-center justify-center gap-2 bg-metallica-blue-700 text-white font-semibold rounded-xl py-3 text-base shadow hover:bg-metallica-blue-800 transition-colors"
          onClick={onExpand}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Accept
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white font-semibold rounded-xl py-3 text-base shadow hover:bg-red-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Reject
        </button>
      </div>
    </div>
  );
}