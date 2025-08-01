import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';

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
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const activeKey = getRangeKey(size);
  return (
    <div className="companysizecard-root">
      <div className="companysizecard-title">{safeT('scad.companyDetails.companySize')}</div>
      <div className="companysizecard-bar-container">
        <div className="companysizecard-bar">
          {sizeRanges.map((range, idx) => (
            <div key={range.key} className="companysizecard-bar-segment">
              <div
                className={`companysizecard-bar-label${activeKey === range.key ? ' companysizecard-bar-label-active' : ''}`}
              >
                {range.label}
              </div>
              {activeKey === range.key && (
                <div className="companysizecard-bar-here">
                  <span className="companysizecard-bar-arrow">▼</span>
                  {/* <span>Here</span> */}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 