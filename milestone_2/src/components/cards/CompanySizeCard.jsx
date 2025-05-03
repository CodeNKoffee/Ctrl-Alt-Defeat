const sizeRanges = [
  { label: '<=50', key: 'small' },
  { label: '51-100', key: 'medium' },
  { label: '101-500', key: 'large' },
  { label: '500+', key: 'corporate' },
];

function getRangeKey(size) {
  if (!size) return 'small';
  const s = size.toLowerCase();
  if (s.includes('corporate')) return 'corporate';
  if (s.includes('large')) return 'large';
  if (s.includes('medium')) return 'medium';
  return 'small';
}

export default function CompanySizeCard({ size }) {
  const activeKey = getRangeKey(size);
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-all border border-gray-200 w-full">
      <div className="text-lg font-bold text-gray-800 mb-2 text-center">Company Size</div>
      <div className="w-full flex flex-col items-center">
        <div className="flex w-full max-w-xs justify-between items-end relative">
          {sizeRanges.map((range, idx) => (
            <div key={range.key} className="flex flex-col items-center w-1/4">
              <div
                className={`h-8 w-full rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200
                  ${activeKey === range.key ? 'bg-blue-500 text-white scale-110 shadow-lg border-2 border-blue-700' : 'bg-blue-100 text-blue-800'}
                `}
              >
                {range.label}
              </div>
              {activeKey === range.key && (
                <div className="text-xs text-blue-600 mt-1 animate-bounce font-bold flex flex-col items-center">
                  <span className="inline-block">▼</span>
                  <span>Here</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 