"use client";

export default function InternshipRow({ internship }) {
return (
    <div className="flex items-start p-4 bg-[#E2F4F7] rounded-lg border-2 border-[#5DB2C7] hover:shadow-md transition-all duration-200 mb-3 gap-6 relative font-['IBM_Plex_Sans']">
        {/* Left: Logo and Company */}
        <div className="flex flex-col items-center w-24 flex-shrink-0 space-y-3 font-['IBM_Plex_Sans']">
            <div className="w-12 h-12 rounded-full bg-gray-300"></div>
            <p className="text-sm font-medium text-gray-500 text-center font-['IBM_Plex_Sans']">
                {internship.company}
            </p>
        </div>

        {/* Center: Job Details */}
      <div className="flex-1 min-w-0 font-['IBM_Plex_Sans']">
        <div className="flex flex-col space-y-1">
          <h3 className="text-lg font-bold text-gray-800 font-['IBM_Plex_Sans']">
            {internship.title}
          </h3>
          <div className="flex flex-col space-y-2">
            <p className="text-sm text-gray-600 font-['IBM_Plex_Sans']">{internship.type}</p>
          {/* Container for location badge */}
        <div className="inline-flex">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-800 font-['IBM_Plex_Sans']">
            {internship.locationType}
            </span>
        </div>
             </div>
        </div>
      </div>

         {/* Right: Compensation */}
            <div className="flex flex-col items-end w-28 flex-shrink-0 space-y-2 font-['IBM_Plex_Sans']">
                <span className={`font-semibold text-sm font-['IBM_Plex_Sans'] ${
                internship.paid ? 'text-green-600' : 'text-gray-600'
                }`}>
                {internship.paid ? '$ Paid' : 'Unpaid'}
                </span>
            </div>

            {/* Bottom Right: Posted Date */}
        <span className="absolute bottom-2 right-2 text-xs text-gray-500 font-['IBM_Plex_Sans']">
            posted {internship.postedDate}
        </span>
    </div>
);
}