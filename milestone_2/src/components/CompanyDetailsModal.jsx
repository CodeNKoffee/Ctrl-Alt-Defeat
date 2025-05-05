import React, { useState } from "react";
import Image from "next/image";
import { faTimes, faCheck, faExpand, faFilePdf, faFileImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BORDER = "border-2 border-[#497184]";
const ROUNDED = "rounded-xl";
const BG = "bg-[#eaf3f6]";

export default function CompanyDetailsModal({ open, onClose, companyName, companyEmail, companyLogo, industry, size, documentation = [] }) {
  if (!open) return null;

  // Notepad state (4 notes for Figma style)
  const [notes, setNotes] = useState(["", "", "", ""]);
  const handleNoteChange = (idx, value) => {
    setNotes((prev) => prev.map((n, i) => (i === idx ? value : n)));
  };

  // Render document icon
  const renderDocIcon = (doc) => {
    const url = doc.url || doc.name || "";
    if (url.endsWith('.pdf')) return <FontAwesomeIcon icon={faFilePdf} className="text-[#497184] w-5 h-5 mr-2" />;
    if (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg')) return <FontAwesomeIcon icon={faFileImage} className="text-[#497184] w-5 h-5 mr-2" />;
    return <FontAwesomeIcon icon={faFilePdf} className="text-[#497184] w-5 h-5 mr-2" />;
  };

  // Compose docs array for card
  const docs = Array.isArray(documentation)
    ? documentation
    : documentation
      ? [{ url: documentation, name: documentation, type: documentation.split('.').pop() }]
      : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className={`relative w-full max-w-4xl mx-auto ${BG} ${BORDER} ${ROUNDED} p-0`} style={{ boxShadow: '0 2px 8px #49718410' }}>
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-[#497184] hover:text-[#274353] bg-white/80 rounded-full p-2 border border-gray-200 shadow"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
        </button>
        {/* Tab Header */}
        <div className="w-fit mb-4 px-4 py-2 bg-metallica-blue-700 text-white text-lg font-bold rounded-br-lg">
          Company Details
        </div>
        <div className="p-6 pt-0 flex flex-col gap-8">
          {/* Top Row: Profile & Notepad */}
          <div className="flex gap-8 mb-2">
            {/* Profile Card (inlined) */}
            <div className={`flex flex-col items-center justify-center ${BORDER} ${ROUNDED} bg-[#eaf3f6] p-6 min-w-[220px] max-w-[240px] flex-shrink-0`}>
              <div className="companyprofilecard-title text-metallica-blue-950 font-semibold mb-2">Profile</div>
              <div className="companyprofilecard-logo-container mb-2">
                <Image src={companyLogo} alt="Company Logo" width={96} height={96} className="companyprofilecard-logo rounded-full border border-gray-200 bg-white" />
              </div>
              <div className="companyprofilecard-name text-2xl font-bold text-metallica-blue-950">{companyName}</div>
              <a href={`mailto:${companyEmail}`} className="companyprofilecard-email text-sm italic text-metallica-blue-700 text-center mt-1">{companyEmail}</a>
            </div>
            {/* Notepad */}
            <div className="flex-1 flex flex-col">
              <div className="text-metallica-blue-950 text-lg font-semibold mb-2" style={{ letterSpacing: 1 }}>Note Pad</div>
              <div className={`relative flex flex-col gap-0 ${BORDER} ${ROUNDED} bg-[#eaf3f6] px-4 py-3`} style={{ minHeight: 140 }}>
                {/* Lined background */}
                {/* Inputs */}
                {notes.map((note, idx) => (
                  <input
                    key={idx}
                    type="text"
                    className="note-input relative z-10 w-full bg-transparent outline-none text-base text-metallica-blue-950 border-0 focus:ring-0 focus:border-[#497184] px-0 mb-2"
                    style={{ borderRadius: 0, marginTop: idx === 0 ? 0 : 8, position: 'relative', height: 25 }}
                    placeholder={idx === 0 ? "" : undefined}
                    value={note}
                    onChange={e => handleNoteChange(idx, e.target.value)}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Bottom Row: Documentation, Industry, Size */}
          <div className="grid grid-cols-3 gap-8 mb-2">
            {/* Documentation (large box, inlined) */}
            <div className={`col-span-2 ${BORDER} ${ROUNDED} bg-[#eaf3f6] min-h-[180px] p-4 flex flex-col`}>
              <div className="companydocumentscard-title text-metallica-blue-950 font-semibold mb-2">Verification Documents</div>
              <div className="companydocumentscard-list">
                {docs.length === 0 && <div className="companydocumentscard-empty text-metallica-blue-700 italic">No documents provided.</div>}
                {docs.map((doc, idx) => (
                  <div key={idx} className="companydocumentscard-item flex items-center gap-3 mb-2">
                    {/* File Icon logic */}
                    {(() => {
                      const type = doc.type || doc.url;
                      if (!type) return <FontAwesomeIcon icon={faFilePdf} className="text-gray-400 text-2xl" />;
                      if (type.toLowerCase().includes('pdf')) return <FontAwesomeIcon icon={faFilePdf} className="text-red-500 text-2xl" />;
                      if (type.toLowerCase().includes('png') || type.toLowerCase().includes('jpg') || type.toLowerCase().includes('jpeg')) return <FontAwesomeIcon icon={faFileImage} className="text-blue-400 text-2xl" />;
                      return <FontAwesomeIcon icon={faFilePdf} className="text-metallica-blue-500 text-2xl" />;
                    })()}
                    <div className="companydocumentscard-item-info flex flex-col">
                      <span className="companydocumentscard-item-name font-semibold">{doc.name || doc.url.split('/').pop()}</span>
                      <span className="companydocumentscard-item-type text-xs">{(doc.type || doc.url.split('.').pop() || '').toUpperCase()}</span>
                    </div>
                    <a href={doc.url} download className="companydocumentscard-download ml-auto text-metallica-blue-700 hover:text-metallica-blue-900" title="Download">
                      <FontAwesomeIcon icon={faFilePdf} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
            {/* Industry & Size (stacked, inlined) */}
            <div className="flex flex-col gap-8 h-full">
              {/* Industry Card (inlined) */}
              <div className={`${BORDER} ${ROUNDED} bg-[#eaf3f6] p-4 flex flex-col items-center justify-center min-h-[80px]`}>
                <div className="companyindustrycard-title text-metallica-blue-950 font-semibold mb-1 flex items-center gap-2">
                  Industry
                </div>
                <div className="companyindustrycard-industry text-metallica-blue-700 text-center">{industry}</div>
                {/* Registration message omitted in modal for now */}
              </div>
              {/* Size Card (inlined) */}
              <div className={`${BORDER} ${ROUNDED} bg-[#eaf3f6] p-4 flex flex-col items-center justify-center min-h-[80px]`}>
                <div className="companysizecard-title text-metallica-blue-950 font-semibold mb-1">Company Size</div>
                <div className="w-full flex items-center gap-2 mt-2">
                  {['<=50', '51-100', '101-500', '500+'].map((label, idx) => {
                    let activeIdx = 0;
                    if (size?.toLowerCase().includes('corporate')) activeIdx = 3;
                    else if (size?.toLowerCase().includes('large')) activeIdx = 2;
                    else if (size?.toLowerCase().includes('medium')) activeIdx = 1;
                    else activeIdx = 0;
                    return (
                      <div key={label} className={`flex-1 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all
                        ${idx === activeIdx ? 'bg-metallica-blue-700 text-white' : 'bg-metallica-blue-200 text-metallica-blue-800'}`}
                      >
                        {label}
                        {idx === activeIdx && <span className="ml-1 text-base">▼</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Accept/Reject Buttons (outside main border, centered) */}
        <div className="flex justify-center gap-8 mb-6">
          <button className="flex items-center gap-2 bg-metallica-blue-700 text-white font-bold rounded-full px-8 py-3 text-lg shadow hover:bg-metallica-blue-900 transition-colors border-2 border-metallica-blue-700">
            <FontAwesomeIcon icon={faCheck} className="w-5 h-5" /> Accept
          </button>
          <button className="flex items-center gap-2 bg-red-500 text-white font-bold rounded-full px-8 py-3 text-lg shadow hover:bg-red-700 transition-colors border-2 border-red-500">
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" /> Reject
          </button>
        </div>
      </div>
    </div>
  );
} 