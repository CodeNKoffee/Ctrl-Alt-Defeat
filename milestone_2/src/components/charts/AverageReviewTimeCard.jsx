import { FiClock } from 'react-icons/fi';

export default function AverageReviewTimeCard({ value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
        <FiClock className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm text-gray-500">Avg Review Time</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
