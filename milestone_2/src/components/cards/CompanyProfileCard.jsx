import Image from 'next/image';

export default function CompanyProfileCard({ logo, name, email }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center gap-2 hover:shadow-lg transition-all border border-gray-200">
      <div className="text-lg font-bold text-gray-800 mb-2 text-center">Profile</div>
      <div className="w-24 h-24 mb-2 flex items-center justify-center">
        <Image src={logo} alt="Company Logo" width={96} height={96} className="rounded-full object-contain" />
      </div>
      <div className="text-xl font-bold text-gray-800 text-center">{name}</div>
      <a href={`mailto:${email}`} className="text-blue-600 underline text-sm hover:text-blue-800 text-center">{email}</a>
    </div>
  );
} 