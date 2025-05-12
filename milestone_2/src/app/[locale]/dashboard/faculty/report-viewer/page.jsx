"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ReportViewer from "@/components/ReportViewer";
import Header from "@/components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function FacultyReportViewerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get('id');
  const [isSaving, setIsSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  
  // Sample reports data - in a real app, this would come from an API call
  const [reports] = useState({
    "1": {
      title: 'Backend Development Internship Final Report',
      studentName: 'David Lee',
      companyName: 'TechCorp Inc.',
      submissionDate: '2025-04-15',
      introduction: 'This report outlines my experience as a backend developer intern at TechCorp from January to April 2025. During this period, I worked on server-side development, database optimization, and API design, gaining valuable industry experience.',
      body: 'During my three-month internship at TechCorp Inc., I was assigned to the backend development team working on the company\'s cloud infrastructure services. I worked alongside senior developers and DevOps engineers to improve the scalability and reliability of their microservices architecture.\n\nMy primary responsibilities included implementing new API endpoints, optimizing database queries, and writing unit tests for existing functionality. I also participated in code reviews and daily stand-up meetings, which helped me understand the importance of communication in a professional development environment.\n\nOne of the major projects I contributed to was the optimization of the data retrieval system, which previously experienced performance issues with large datasets. I implemented query optimization techniques and caching strategies that resulted in a 60% improvement in response times.\n\nThe technical skills I gained during this internship include:\n- Node.js and Express.js for API development\n- MongoDB optimization techniques\n- Docker containerization\n- CI/CD pipeline configuration with Jenkins\n- Test-driven development practices\n\nBeyond technical skills, I also developed important professional skills such as project planning, time management, and technical documentation. The experience of working in an agile team taught me how to break down complex problems and collaborate effectively with team members of varying expertise levels.\n\nMy coursework in Database Systems and Advanced Programming provided a solid foundation for this internship. The theoretical concepts I learned were directly applicable to the real-world challenges I faced, particularly when working with database optimization and system architecture.'
    },
    "2": {
      title: 'Frontend Development Internship Final Report',
      studentName: 'Sarah Wilson',
      companyName: 'Web Solutions Ltd.',
      submissionDate: '2025-04-10',
      introduction: 'This report details my experience as a frontend developer intern at Web Solutions Ltd. from January to March 2025. I worked on user interface design and implementation using modern web technologies like React and TailwindCSS.',
      body: 'During my internship at Web Solutions Ltd., I worked with the frontend development team on various client projects. The company specializes in creating custom web applications for businesses across different industries.\n\nMy main responsibilities included implementing UI components according to design specifications, fixing cross-browser compatibility issues, and optimizing application performance. I collaborated closely with designers and backend developers to ensure seamless integration of all system components.\n\nA significant project I contributed to was the redesign of a healthcare provider\'s patient portal. I implemented responsive components that improved accessibility and user experience, particularly for users with disabilities. This project taught me the importance of inclusive design and adherence to WCAG guidelines.\n\nThroughout the internship, I gained proficiency in:\n- React.js and state management with Redux\n- Styled Components and CSS-in-JS approaches\n- Frontend testing with Jest and React Testing Library\n- Webpack configuration and optimization\n- Client-side performance optimization techniques\n\nThe internship also helped me develop soft skills such as client communication, requirement analysis, and presenting technical concepts to non-technical stakeholders. I learned to balance aesthetic design with technical constraints, which is crucial for successful frontend development.\n\nThe knowledge from my Human-Computer Interaction and Web Development courses proved invaluable during this experience. Understanding usability principles and web standards helped me contribute meaningful improvements to projects right from the start of my internship.'
    },
    "3": {
      title: 'Full Stack Developer Internship Final Report',
      studentName: 'Michael Brown',
      companyName: 'Digital Innovations',
      submissionDate: '2025-04-05',
      introduction: 'This report summarizes my experience as a full stack developer intern at Digital Innovations from December 2024 to March 2025. I worked on both frontend and backend aspects of web application development for multiple client projects.',
      body: 'My internship at Digital Innovations provided comprehensive exposure to the entire web development stack. As a full stack intern, I rotated between frontend and backend teams to gain experience in all aspects of application development.\n\nOn the frontend, I worked with React and Angular frameworks to build interactive user interfaces. I implemented responsive designs, managed state across complex applications, and optimized components for better performance. On the backend, I developed REST APIs using Node.js and Express, configured database schemas using MongoDB and PostgreSQL, and implemented authentication systems.\n\nA significant achievement during my internship was developing an internal tool that automated the generation of client reports. This tool reduced the time required to create reports by 75% and decreased human error. I was responsible for the entire implementation, from database design to user interface.\n\nThe technical skills I enhanced during this internship include:\n- Full-stack JavaScript development (React, Node.js)\n- Database design and optimization (SQL and NoSQL)\n- OAuth implementation and security best practices\n- GraphQL API development\n- Serverless architecture using AWS Lambda\n\nI also gained valuable insights into project management methodologies, particularly Scrum and Kanban. Participating in sprint planning, daily stand-ups, and retrospectives helped me understand how to prioritize tasks and contribute effectively to team goals.\n\nThe combination of my Software Engineering and Cloud Computing courses provided excellent preparation for this internship. The concepts of system design, clean code practices, and distributed computing were directly applicable to the work I performed at Digital Innovations.'
    }
  });
  
  const [report, setReport] = useState(null);
  const [overallFeedback, setOverallFeedback] = useState('');

  useEffect(() => {
    // Fetch report data based on ID
    if (reportId && reports[reportId]) {
      setReport(reports[reportId]);
    }
  }, [reportId, reports]);

  const goBack = () => {
    router.push("/en/dashboard/faculty");
  };

  const handleSaveFeedback = () => {
    setIsSaving(true);
    
    // Simulate saving to database
    setTimeout(() => {
      setIsSaving(false);
      setSavedFeedback(true);
      
      // Reset saved status after 3 seconds
      setTimeout(() => {
        setSavedFeedback(false);
      }, 3000);
    }, 1000);
  };

  if (!report) {
    return (
      <DashboardLayout userType="faculty">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-metallica-blue-600 text-xl">Loading report...</p>
          <p className="text-gray-500 mt-2">If this persists, the report may not exist</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="faculty">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <button 
              onClick={goBack}
              className="mr-4 flex items-center text-metallica-blue-700 hover:text-metallica-blue-900 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              <span>Back to Reports</span>
            </button>
            <Header text="Report Review & Annotation" size="text-3xl md:text-4xl" />
          </div>
          <div className="flex items-center">
            <span className="text-metallica-blue-700 mr-2 text-sm">Student: <strong>{report.studentName}</strong></span>
            <span className="bg-metallica-blue-100 text-metallica-blue-800 px-2 py-1 rounded text-xs">
              Submitted: {new Date(report.submissionDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <p className="text-metallica-blue-800 mb-6">
            Select any text in the report below to highlight important sections or add comments. Your annotations will appear in the sidebar.
          </p>
          
          <div className="min-h-[600px]">
            <ReportViewer report={report} />
          </div>
          
          <div className="mt-8 pt-6 border-t border-metallica-blue-200">
            <h3 className="text-lg font-semibold text-metallica-blue-800 mb-3">Overall Feedback</h3>
            <textarea
              value={overallFeedback}
              onChange={(e) => setOverallFeedback(e.target.value)}
              placeholder="Provide overall feedback on the student's report..."
              className="w-full min-h-[150px] p-3 border border-metallica-blue-300 rounded focus:ring-2 focus:ring-metallica-blue-500 focus:border-metallica-blue-500 outline-none"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveFeedback}
                disabled={isSaving}
                className={`flex items-center px-4 py-2 rounded ${
                  isSaving || savedFeedback 
                    ? 'bg-metallica-blue-400 cursor-not-allowed' 
                    : 'bg-metallica-blue-600 hover:bg-metallica-blue-700'
                } text-white transition-colors`}
              >
                {savedFeedback ? (
                  <>
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    <span>{isSaving ? 'Saving...' : 'Save Feedback'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}