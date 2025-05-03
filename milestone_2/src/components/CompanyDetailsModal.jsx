import React, { useState } from "react";
import Image from "next/image";
import { faTimes, faFilePdf, faFileImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CompanyDetailsModal({ open, onClose, company }) {
  if (!open || !company) return null;

  // Notepad state (3 notes)
  const [notes, setNotes] = useState(["", "", ""]);
  const handleNoteChange = (idx, value) => {
    setNotes((prev) => prev.map((n, i) => (i === idx ? value : n)));
  };

  // Render document icon
  const renderDocIcon = (doc) => {
    const url = doc.url || doc.name || "";
    if (url.endsWith('.pdf')) return <FontAwesomeIcon icon={faFilePdf} className="text-metallica-blue-700 w-5 h-5 mr-2" />;
    if (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg')) return <FontAwesomeIcon icon={faFileImage} className="text-metallica-blue-700 w-5 h-5 mr-2" />;
    return <FontAwesomeIcon icon={faFilePdf} className="text-metallica-blue-700 w-5 h-5 mr-2" />;
  };

  // Company size bar logic
  const sizeSteps = ["<=50", "51-100", "101-500", "500+"];
  const getActiveStep = () => {
    if (company.size.includes("<=50")) return 0;
    if (company.size.includes("51-100")) return 1;
    if (company.size.includes("101-500")) return 2;
    return 3;
  };
  const activeStep = getActiveStep();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 w-full max-w-2xl mx-auto flex flex-col gap-8 overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 bg-white/80 rounded-full p-2 border border-gray-200 shadow"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
        </button>

        {/* Logo & Contact */}
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            <Image
              className="rounded-full border border-gray-200 bg-white"
              src={company.logo}
              alt="Company Logo"
              width={96}
              height={96}
            />
          </div>
          <div>
            <div className="text-2xl font-bold text-metallica-blue-900 mb-1">{company.name}</div>
            <a href={`mailto:${company.email}`} className="text-base text-metallica-blue-600 underline hover:text-metallica-blue-800">{company.email}</a>
          </div>
        </div>

        {/* Industry & Registration */}
        <div className="flex items-center gap-6 bg-metallica-blue-50/60 rounded-xl p-4 border border-metallica-blue-100">
          <div className="flex-shrink-0">
            <Image
              className="rounded-full border border-gray-200"
              src={company.logo}
              alt="Industry Logo"
              width={56}
              height={56}
            />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-700 mb-1">Industry</div>
            <div className="text-lg text-gray-800 mb-1">{company.industry}</div>
            <div className="text-xs text-gray-500">Registered on 01 May, 2025</div>
          </div>
        </div>

        {/* Company Size */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="font-semibold text-base text-gray-800 mb-2">Company Size</div>
          <div className="flex items-center gap-2 mb-2">
            {sizeSteps.map((step, idx) => (
              <div
                key={step}
                className={`flex-1 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                  ${idx === activeStep ? 'bg-metallica-blue-700 text-white' : 'bg-metallica-blue-200 text-metallica-blue-800'}`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-metallica-blue-50/60 rounded-xl border border-metallica-blue-100 p-4">
          <div className="font-semibold text-base text-gray-800 mb-2">Documentation</div>
          <div className="flex flex-col gap-2">
            {company.documentation && company.documentation.length > 0 ? company.documentation.map((doc, idx) => (
              <div key={idx} className="flex items-center bg-white rounded-lg border border-gray-100 px-3 py-2">
                {renderDocIcon(doc)}
                <span className="text-sm text-gray-700">{doc.name || (doc.url ? doc.url.split('/').pop() : '')}</span>
                {doc.url && (
                  <a href={doc.url} download className="ml-3 text-blue-600 hover:text-blue-800 text-xs underline">Download</a>
                )}
              </div>
            )) : <span className="text-sm text-gray-400">No documents uploaded</span>}
          </div>
        </div>

        {/* Notepad */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-2">
          <div className="font-semibold text-base text-gray-800 mb-2">Note Pad</div>
          <div className="flex flex-col gap-2">
            {notes.map((note, idx) => (
              <input
                key={idx}
                type="text"
                className="note-input border border-metallica-blue-200 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-metallica-blue-400"
                placeholder="Add notes here..."
                value={note}
                onChange={e => handleNoteChange(idx, e.target.value)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 