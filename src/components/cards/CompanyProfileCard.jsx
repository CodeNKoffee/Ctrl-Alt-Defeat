import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';

export default function CompanyProfileCard({ logo, name, email, className = '' }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  return (
    <div className={`companyprofilecard-root ${className}`}>
      <div className="companyprofilecard-title">{safeT('scad.companyDetails.profile')}</div>
      <div className="companyprofilecard-logo-container">
        <Image src={logo} alt="Company Logo" width={96} height={96} className="companyprofilecard-logo" />
      </div>
      <div className="companyprofilecard-name">{name}</div>
      <a href={`mailto:${email}`} className="companyprofilecard-email">{email}</a>
    </div>
  );
} 