function StatisticsView() {
  const ReportStatsCard = () => (
    <div className="w-full">
      <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-metallica-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Decorative bubbles */}
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-[#E8F7FB] rounded-full opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute right-24 -bottom-6 w-20 h-20 bg-[#F0FBFF] rounded-full opacity-40 group-hover:translate-y-1 transition-transform duration-500"></div>

        {/* Content */}
        <div className="flex items-start gap-4 relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#86CBDA] to-[#5DB2C7] rounded-full p-3 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17a4 4 0 004 0m4-2a4 4 0 00-8 0m4-6v2m0 4h.01M12 11a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          </div>

          <div className="text-left w-full">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D9F0F4] text-[#2a5f74] mb-2">
              INSIGHTS & REPORTS
            </div>

            <h2 className="text-2xl font-semibold text-[#2a5f74] mb-3 group-hover:text-[#3298BA] transition-colors duration-300">
              Real-Time Statistics & Reporting
            </h2>

            <div className="bg-gradient-to-r from-[#EBF7FA] to-[#F7FBFD] p-4 rounded-xl border border-[#D9F0F4] mb-4 text-gray-700">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>Track accepted, rejected, and flagged reports per internship cycle</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>Monitor average review time across faculty</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>View top courses most used in internships</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>Discover top-rated companies based on student evaluations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3298BA] mr-2">✓</span>
                  <span>Identify companies with highest internship participation</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#D9F0F4] text-metallica-blue-700 font-medium px-4 py-2 rounded-lg border-l-4 border-[#5DB2C7] shadow-sm w-fit">
              Generate comprehensive reports based on real-time statistics for strategic decision making.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen px-6 py-6">
      <ViewSection title="STATISTICS DASHBOARD">
        <ReportStatsCard />
      </ViewSection>
      <div>
        <Stats />
      </div>
    </main>
  );
}