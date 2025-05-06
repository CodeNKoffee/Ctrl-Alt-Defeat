import Image from "next/image";
import { faExpand, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BORDER = "border-2 border-[#497184]";
const ROUNDED = "rounded-xl";
const BG = "bg-[#eaf3f6]";

export default function CompanyDetailsBig({ version, companyName, companyEmail, companyLogo, industry, size, documentation, onCollapse, onExpandModal }) {
  return (
    <div className={`relative max-w-5xl mx-auto mt-6 p-0 ${BG}`} style={{ fontFamily: 'inherit' }}>
      {/* Expand Button */}
      <button
        className="absolute top-4 right-4 text-[#497184] hover:text-[#274353] bg-white/80 rounded-full p-2 border border-gray-200 shadow"
        onClick={onExpandModal}
        title="Expand details"
      >
        <FontAwesomeIcon icon={faExpand} className="w-5 h-5" />
      </button>
      {/* Main Card Border */}
      <div className={`p-6 pb-0 ${BORDER} ${ROUNDED} bg-[#eaf3f6]`} style={{ boxShadow: '0 2px 8px #49718410' }}>
        {/* Tab Header */}
        <div className="-mt-8 -ml-6 mb-4 w-fit px-8 py-2 bg-[#497184] text-white text-lg font-medium rounded-t-lg tracking-wide" style={{ letterSpacing: 2 }}>
          Company Details
        </div>
        {/* Top Row: Profile & Notepad */}
        <div className="flex gap-8 mb-8">
          {/* Profile Card */}
          <div className={`flex flex-col items-center justify-center ${BORDER} ${ROUNDED} bg-[#eaf3f6] p-6 min-w-[220px] max-w-[240px] flex-shrink-0`}>
            <Image
              className="rounded-full border border-gray-200 bg-white"
              alt="Company Logo"
              src={companyLogo}
              width={100}
              height={100}
            />
            <div className="mt-4 text-2xl font-bold text-[#1d343c]">{companyName}</div>
            <div className="mt-2 text-sm italic text-[#497184] text-center">{companyEmail}</div>
          </div>
          {/* Notepad */}
          <div className="flex-1 flex flex-col">
            <div className="text-[#497184] text-lg font-semibold mb-2" style={{ letterSpacing: 1 }}>Note Pad</div>
            <div className={`flex flex-col gap-0 ${BORDER} ${ROUNDED} bg-[#eaf3f6] px-4 py-3`}>
              {[0, 1, 2, 3].map(i => (
                <input
                  key={i}
                  type="text"
                  className="w-full bg-transparent outline-none text-base text-[#274353] border-0 border-b border-[#497184] focus:ring-0 focus:border-[#497184] px-0 mb-2"
                  style={{ borderRadius: 0 }}
                  placeholder={i === 0 ? "" : undefined}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Bottom Row: Documentation, Industry, Size */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          {/* Documentation (large box) */}
          <div className={`col-span-2 ${BORDER} ${ROUNDED} bg-[#eaf3f6] min-h-[180px] p-4 flex flex-col`}>
            {/* You can add a title or icon here if needed */}
            {documentation && documentation.length > 0 ? (
              <ul className="list-disc pl-5 text-[#274353]">
                {documentation.map((doc, idx) => (
                  <li key={idx} className="mb-2 flex items-center gap-2">
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
              <div className="text-[#274353] text-center">{industry}</div>
            </div>
            <div className={`${BORDER} ${ROUNDED} bg-[#eaf3f6] p-4 flex flex-col items-center justify-center min-h-[80px]`}>
              <div className="text-[#497184] font-semibold mb-1">Company Size</div>
              <div className="text-[#274353] text-center">{size}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Accept/Reject Buttons (outside main border, centered) */}
      <div className="flex justify-center gap-8 mt-8">
        <button className="flex items-center gap-2 bg-[#497184] text-white font-semibold rounded-md px-8 py-3 text-lg shadow hover:bg-[#274353] transition-colors border-2 border-[#497184]">
          <FontAwesomeIcon icon={faCheck} className="w-5 h-5" /> Accept
        </button>
        <button className="flex items-center gap-2 bg-[#ba4949] text-white font-semibold rounded-md px-8 py-3 text-lg shadow hover:bg-[#8a2323] transition-colors border-2 border-[#ba4949]">
          <FontAwesomeIcon icon={faTimes} className="w-5 h-5" /> Reject
        </button>
      </div>
    </div>
  );
}