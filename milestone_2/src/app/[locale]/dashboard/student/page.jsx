'use client';
import { useState, useEffect } from 'react';
import StudentProfile from '@/components/StudentProfile';

export default function StudentDashboard() {
  // Preload the student data as soon as the page loads
  useEffect(() => {
    const preloadStudentData = async () => {
      try {
        // Check if data already exists in localStorage
        const existingData = localStorage.getItem('studentProfileData');

        // If data doesn't exist, we could either:
        // 1. Load default data from a server
        // 2. Use default data from the StudentProfile component
        // Here we'll just ensure the localStorage cache is warmed

        if (!existingData) {
          // This would be replaced with an API call in a real app
          // For now we'll just let the StudentProfile component handle the default data
          console.log('No cached student data found, will use defaults');
        } else {
          // Parse the data to ensure it's valid
          const parsedData = JSON.parse(existingData);
          console.log('Preloaded student profile data successfully');
        }
      } catch (error) {
        console.error('Error preloading student data:', error);
      }
    };

    preloadStudentData();
  }, []);

  return (
    <div className="h-full w-full">
      <StudentProfile />
    </div>
  );
}