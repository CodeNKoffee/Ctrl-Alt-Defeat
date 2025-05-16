import React from 'react';

const ReportsInfoCard = () => {
  return (
    <div className="w-full mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute left-40 bottom-4 w-16 h-16 bg-[#D9F0F4] rounded-full opacity-40 group-hover:translate-x-2 transition-transform duration-500"></div>
        <div className="absolute right-20 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>
        
        <div className="flex items-start gap-4 w-full md:w-auto relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              DOCUMENTATION
            </div>
            <div className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">Your Internship Reports</div>
            <div className="text-gray-700 mb-3 relative">
              <p className="mb-3">Track and manage all your internship report submissions and drafts in one place.</p>
              
              {/* Card content with improved styling */}
              <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4">
                <p className="text-metallica-blue-700 font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-[#3298BA] rounded-full mr-2"></span>
                  Benefits of Thorough Reporting:
                </p>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Document your achievements and skills gained</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Reflect on learning outcomes from your experience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Create a professional portfolio of your work</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3298BA] mr-2">✓</span>
                    <span>Fulfill academic requirements for internship credit</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-metallica-blue-700 font-medium bg-[#D9F0F4] px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm">
                Remember to review feedback from faculty on your submitted reports to improve future submissions!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsInfoCard;
