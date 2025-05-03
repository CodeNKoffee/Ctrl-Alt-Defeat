import Image from 'next/image';

export default function CompanyProfileCard({ logo, name, email }) {
  return (
    <div className="companyprofilecard-root">
      <div className="companyprofilecard-title">Profile</div>
      <div className="companyprofilecard-logo-container">
        <Image src={logo} alt="Company Logo" width={96} height={96} className="companyprofilecard-logo" />
      </div>
      <div className="companyprofilecard-name">{name}</div>
      <a href={`mailto:${email}`} className="companyprofilecard-email">{email}</a>
    </div>
  );
} 