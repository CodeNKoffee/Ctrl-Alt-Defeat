import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines, faClock, faCircleCheck, faFlag } from '@fortawesome/free-solid-svg-icons';

export default function ReportStatistics({
  total = 0,
  accepted = 0,
  pending = 0,
  flagged = 0
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Reports Card */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center h-full">
        <div className="flex-shrink-0 rounded-full bg-blue-50 text-blue-600 p-3 mr-3 h-12 w-12 flex items-center justify-center">
          <FontAwesomeIcon icon={faFileLines} className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider truncate">Total Reports</h3>
          <p className="text-2xl font-semibold mt-1 truncate">{total}</p>
        </div>
      </div>
      {/* Accepted Reports Card */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center h-full">
        <div className="flex-shrink-0 rounded-full bg-green-50 text-green-600 p-3 mr-3 h-12 w-12 flex items-center justify-center">
          <FontAwesomeIcon icon={faCircleCheck} className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider truncate">Accepted Reports</h3>
          <p className="text-2xl font-semibold mt-1 text-green-600 truncate">{accepted}</p>
        </div>
      </div>
      {/* Pending Reports Card */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center h-full">
        <div className="flex-shrink-0 rounded-full bg-yellow-50 text-yellow-600 p-3 mr-3 h-12 w-12 flex items-center justify-center">
          <FontAwesomeIcon icon={faClock} className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider truncate">Pending Reports</h3>
          <p className="text-2xl font-semibold mt-1 text-yellow-600 truncate">{pending}</p>
        </div>
      </div>
      {/* Flagged Reports Card */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center h-full">
        <div className="flex-shrink-0 rounded-full bg-orange-50 text-orange-600 p-3 mr-3 h-12 w-12 flex items-center justify-center">
          <FontAwesomeIcon icon={faFlag} className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider truncate">Flagged Reports</h3>
          <p className="text-2xl font-semibold mt-1 text-orange-600 truncate">{flagged}</p>
        </div>
      </div>
    </div>
  );
}
