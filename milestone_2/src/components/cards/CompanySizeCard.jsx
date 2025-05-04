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
    <div className="companysizecard-root">
      <div className="companysizecard-title">Company Size</div>
      <div className="companysizecard-bar-container" style={{ position: 'relative' }}>
        <div className="companysizecard-bar-with-radius">
          <div className="companysizecard-bar">
            {sizeRanges.map((range, idx) => (
              <div key={range.key} className="companysizecard-bar-segment">
                <div
                  className={`companysizecard-bar-label${activeKey === range.key ? ' companysizecard-bar-label-active' : ''}`}
                >
                  {range.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Chevron arrow outside the bar, positioned below the selected chunk */}
        {(() => {
          const idx = sizeRanges.findIndex(r => r.key === activeKey);
          if (idx === -1) return null;
          return (
            <div
              className="companysizecard-bar-here-outer"
              style={{
                position: 'absolute',
                left: `calc(${(idx + 0.5) * (100 / sizeRanges.length)}% - 12px)`, // 12px is half arrow width
                top: '48px', // adjust as needed to be just below the bar
                width: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              <span className="companysizecard-bar-arrow">▼</span>
            </div>
          );
        })()}
      </div>
    </div>
  );
} 