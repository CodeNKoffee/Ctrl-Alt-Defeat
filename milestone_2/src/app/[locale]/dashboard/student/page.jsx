"use client"
import { useState } from 'react';
import StudentCard from "../../../../components/StudentCard";
import StudentDetails from "../../../../components/StudentDetails";
import '../../../../components/styles/StudentProfile.css';

export default function Student() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const toggleDetails = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="main">
          <div className="student-profile">
            <StudentCard isOpen={isDetailsOpen} toggleDetails={toggleDetails} />
            <StudentDetails isOpen={isDetailsOpen} />
          </div>
        </div>
      </div>
    </div>
  );
}