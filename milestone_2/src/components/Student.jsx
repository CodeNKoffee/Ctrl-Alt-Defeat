"use client";
import Image from "next/image";

const statusColors = {
  current: 'bg-blue-100 text-blue-800 border-blue-400',
  completed: 'bg-green-100 text-green-800 border-green-400',
  evaluated: 'bg-purple-100 text-purple-800 border-purple-400',
};


export default function Student({ student, onViewProfile }) {
  const { id, name, photo, major, semester, status, internshipStatus} = student;

  return (
    <div className="bg-[#F0F9FB] rounded-lg p-6 w-[280px] shadow-sm border-2 border-[#5DB2C7]
      transform transition-all duration-300 ease-in-out cursor-pointer
      hover:scale-110 hover:shadow-2xl hover:border-[#3298BA]">

      <div className="flex flex-col items-center space-y-4">
        <span className={`absolute top-2 left-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
          ${statusColors[internshipStatus.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-400'}`}
        >
          {internshipStatus.toUpperCase()}
        </span>
        {/* Profile Image */}
        <div className="relative">
          <div className="w-20 bg-[#FFFFFF] h-20 rounded-full overflow-hidden border-2 border-[#3298BA]">
            <Image
              src={photo || '/default-avatar.png'}
              alt={name}
              width={80}
              height={80}
              className="object-cover"
              priority
            />
          </div>
          
        {/* Status Indicator: Only visible if status is "PRO" */}
        {status === 'PRO' && (
          <span className="absolute -top-2 -right-2 px-2 py-1 bg-white rounded-full text-xs font-medium text-[#2a5f74] border border-[#3298BA]">
            {status}
          </span>
        )}
        </div>

        {/* Student Info */}
        <div className="text-center space-y-1">
          <h3 className="font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-700">{major}</p>
          <span className="text-sm text-gray-700">Semester {semester}</span>
        </div>

        {/* View Profile Button */}
        <button
          onClick={onViewProfile}
          className="px-6 py-2 bg-white text-sm font-medium text-[#2a5f74] border-2 border-[#3298BA] rounded-full
            hover:bg-[#D9F0F4] transition-colors"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}