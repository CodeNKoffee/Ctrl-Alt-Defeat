// /app/internships/page.jsx
'use client'; 
import { useState } from "react";
import CompanyCreatePost from "@/components/CompanyCreatePost";

export default function InternshipsPage() {
  const [postPreview, setPostPreview] = useState({
    title: '',
    description: '',
    startDate: '',
    duration: '',
    jobType: 'Full-time',
    jobSetting: 'On-site',
    paid: 'Paid',
    salary: '',
    requirements: '',
    skills: [],
  });

  const handleFormChange = (updatedForm) => {
    setPostPreview(updatedForm);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create Internship Post</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Form */}
        <div className="lg:w-1/2">
          <CompanyCreatePost onFormChange={handleFormChange} />
        </div>
        
        {/* Right side - Live Preview */}
        <div className="lg:w-1/2 mt-8 lg:mt-0">
          <h2 className="text-xl font-semibold mb-4">Post Preview</h2>
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">
                  {postPreview.title || "Job Title"}
                </h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <span className="mr-4">{postPreview.jobSetting || "Job Setting"}</span>
                  <span>{postPreview.jobType || "Job Type"}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {postPreview.paid || "Payment Status"}
                </span>
                {postPreview.paid === 'Paid' && postPreview.salary && (
                  <p className="text-green-600 font-medium mt-1">{postPreview.salary}</p>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-4">
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-700 mb-4 text-sm">
                {postPreview.description || "Job description will appear here..."}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-1">Start Date</h4>
                  <p className="text-gray-700 text-sm">
                    {postPreview.startDate || "Not specified"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Duration</h4>
                  <p className="text-gray-700 text-sm">
                    {postPreview.duration || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {postPreview.requirements && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Requirements</h4>
                <p className="text-gray-700 text-sm">{postPreview.requirements}</p>
              </div>
            )}
            
            {postPreview.skills.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {postPreview.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
