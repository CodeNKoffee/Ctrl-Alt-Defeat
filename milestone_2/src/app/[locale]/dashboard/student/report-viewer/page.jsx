"use client";

import { useState } from "react";
import ReportViewer from "@/components/ReportViewer";
import Header from "@/components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function ReportViewerPage() {
  const router = useRouter();
  
  // In a real application, you would fetch the report data based on the id from params
  // For demonstration purposes, we'll use sample data
  const [report] = useState({
    title: 'Web Development Internship Final Report',
    introduction: 'This report presents my experience as a web development intern at InnovateTech from January to April 2025. During this internship, I worked on multiple projects using JavaScript, React, and Node.js, gaining valuable industry experience and technical skills.',
    body: 'During my three-month internship at InnovateTech, I was assigned to the front-end development team working on the company\'s client dashboard application. The team consisted of senior developers, UX designers, and other interns, all working collaboratively in an agile environment.\n\nMy primary responsibilities included implementing new UI components according to design specifications, fixing bugs in existing features, and participating in code reviews. I worked closely with senior developers who provided guidance and feedback throughout the internship.\n\nOne of the major projects I contributed to was the analytics dashboard redesign. I implemented several data visualization components using Chart.js and optimized them for performance. This project challenged me to learn about efficient rendering techniques and state management in complex React applications.\n\nThe most valuable technical skills I gained include:\n- Advanced React hooks and patterns\n- State management with Redux\n- Responsive design implementation\n- Performance optimization techniques\n- Git workflow in a team environment\n\nBeyond technical skills, I also developed important soft skills such as communication, time management, and problem-solving. The weekly team meetings and daily stand-ups helped me understand the importance of clear communication in a professional environment.\n\nMy academic coursework in Web Development and Data Structures provided a solid foundation for this internship. The theoretical concepts I learned in these courses were directly applicable to real-world problems I encountered, particularly when optimizing component rendering and managing application state.'
  });

  const goBack = () => {
    router.push("/en/dashboard/student/my-reports");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <button 
          onClick={goBack}
          className="mr-4 flex items-center text-metallica-blue-700 hover:text-metallica-blue-900 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          <span>Back to Reports</span>
        </button>
        <Header text="Report Viewer & Annotation" size="text-4xl" />
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <p className="text-metallica-blue-800 mb-6">
          Select any text in the report below to highlight important sections or add comments. Your annotations will appear in the sidebar.
        </p>
        
        <div className="min-h-[600px]">
          <ReportViewer report={report} />
        </div>
      </div>
    </div>
  );
}