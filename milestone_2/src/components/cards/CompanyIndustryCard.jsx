export default function CompanyIndustryCard({ industry, icon, registrationMessage }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center gap-2 hover:shadow-lg transition-all border border-gray-200 min-w-[180px]">
      <div className="text-lg font-bold text-gray-800 text-center flex flex-col items-center gap-2">
        Industry
        {icon && <span className="text-4xl mt-1">{icon}</span>}
      </div>
      <div className="text-base font-semibold text-gray-700 text-center">{industry}</div>
      <div className="text-xs text-gray-500 text-center mt-2">{registrationMessage}</div>
    </div>
  );
} 