"use client";
import Image from "next/image";
import CustomButton from './shared/CustomButton';
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';

const statusColors = {
  current: 'bg-blue-100 text-blue-800 border-blue-400',
  completed: 'bg-green-100 text-green-800 border-green-400',
  evaluated: 'bg-purple-100 text-purple-800 border-purple-400',
};


export default function Student({ student, onViewProfile }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const { id, name, photo, major, semester, status, internshipStatus } = student;

  return (
    <div className="bg-[#F0F9FB] rounded-lg p-6 shadow-sm border-2 border-[#5DB2C7]
      transform transition-all duration-150 ease-in-out cursor-pointer
      hover:scale-105 hover:shadow-2xl hover:border-[#3298BA]">

      <div className="flex flex-col items-center space-y-4">
        <span className={`absolute top-2 right-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
          ${statusColors[internshipStatus.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-400'}`}
        >
          {safeT(`scad.studentList.tabs.${internshipStatus.toLowerCase()}`)}
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
          <span className="text-sm text-gray-700">{safeT('scad.studentDirectory.filters.semester')} {semester}</span>
        </div>

        {/* View Profile Button */}
        <CustomButton

          variant="primary"
          text={safeT('scad.student.viewProfile')}
          // icon={nextStatus === 'rejected' ? faTimesCircle :
          //   (nextStatus === 'completed' ? faCheckCircle : faClock)}
          onClick={onViewProfile}
          width="w-40"
        />
      </div>
    </div>
  );
}