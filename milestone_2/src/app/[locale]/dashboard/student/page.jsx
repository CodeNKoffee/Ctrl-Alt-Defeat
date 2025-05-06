'use client';
import { useState } from 'react';
import StudentProfile from '@/components/StudentProfile';

export default function StudentDashboard() {
  return (
    <div className="h-full w-full">
      <StudentProfile />
    </div>
  );
}