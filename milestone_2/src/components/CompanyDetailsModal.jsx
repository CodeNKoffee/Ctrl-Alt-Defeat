import React, { useState } from "react";
import Image from "next/image";
import { faTimes, faCheck, faExpand, faFilePdf, faFileImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BORDER = "border-2 border-[#497184]";
const ROUNDED = "rounded-xl";
const BG = "bg-[#eaf3f6]";

export default function CompanyDetailsModal({ open, onClose, company }) {
  if (!open || !company) return null;

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
        <div className="px-8 py-2 bg-[#497184] text-white text-lg font-medium rounded-t-lg tracking-wide w-fit mt-0 ml-0 mb-4" style={{ letterSpacing: 2 }}>
          Company Details
        </div>
        <div className="p-6 pt-0 flex flex-col gap-8">
          {/* Top Row: Profile & Notepad */}
          <div className="flex gap-8 mb-2">
            {/* Profile Card */}
            <div className={`flex flex-col items-center justify-center ${BORDER} ${ROUNDED} bg-[#eaf3f6] p-6 min-w-[220px] max-w-[240px] flex-shrink-0`}>
              <Image
                className="rounded-full border border-gray-200 bg-white"
                src={company.logo}
                alt="Company Logo"
                width={100}
                height={100}
              />
              <div className="mt-4 text-2xl font-bold text-[#1d343c]">{company.name}</div>
              <div className="mt-2 text-sm italic text-[#497184] text-center">{company.email}</div>
            </div>
            {/* Notepad */}
            <div className="flex-1 flex flex-col">
              <div className="text-[#497184] text-lg font-semibold mb-2" style={{ letterSpacing: 1 }}>Note Pad</div>
              <div className={`flex flex-col gap-0 ${BORDER} ${ROUNDED} bg-[#eaf3f6] px-4 py-3`}>
                {notes.map((note, idx) => (
                  <input
                    key={idx}
                    type="text"
                    className="w-full bg-transparent outline-none text-base text-[#274353] border-0 border-b border-[#497184] focus:ring-0 focus:border-[#497184] px-0 mb-2"
                    style={{ borderRadius: 0 }}
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
            {/* Documentation (large box) */}
            <div className={`col-span-2 ${BORDER} ${ROUNDED} bg-[#eaf3f6] min-h-[180px] p-4 flex flex-col`}>
              {company.documentation && company.documentation.length > 0 ? (
                <ul className="list-disc pl-5 text-[#274353]">
                  {company.documentation.map((doc, idx) => (
                    <li key={idx} className="mb-2 flex items-center gap-2">
                      {renderDocIcon(doc)}
                      <span className="font-semibold">{doc.type}</span>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="underline text-[#497184] hover:text-[#274353]">View</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-[#497184] italic">No documentation uploaded</span>
              )}
            </div>
            {/* Industry & Size (stacked) */}
            <div className="flex flex-col gap-8 h-full">
              <div className={`${BORDER} ${ROUNDED} bg-[#eaf3f6] p-4 flex flex-col items-center justify-center min-h-[80px]`}>
                <div className="text-[#497184] font-semibold mb-1">Industry</div>
                <div className="text-[#274353] text-center">{company.industry}</div>
              </div>
              <div className={`${BORDER} ${ROUNDED} bg-[#eaf3f6] p-4 flex flex-col items-center justify-center min-h-[80px]`}>
                <div className="text-[#497184] font-semibold mb-1">Company Size</div>
                <div className="text-[#274353] text-center">{company.size}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Accept/Reject Buttons (outside main border, centered) */}
        <div className="flex justify-center gap-8 mb-6">
          <button className="flex items-center gap-2 bg-[#497184] text-white font-semibold rounded-md px-8 py-3 text-lg shadow hover:bg-[#274353] transition-colors border-2 border-[#497184]">
            <FontAwesomeIcon icon={faCheck} className="w-5 h-5" /> Accept
          </button>
          <button className="flex items-center gap-2 bg-[#ba4949] text-white font-semibold rounded-md px-8 py-3 text-lg shadow hover:bg-[#8a2323] transition-colors border-2 border-[#ba4949]">
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" /> Reject
          </button>
        </div>
      </div>
    </div>
  );
} 