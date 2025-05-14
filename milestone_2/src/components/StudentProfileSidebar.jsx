"use client";
import React from "react";
import Image from "next/image";

const statusColors = {
  current: 'bg-blue-100 text-blue-800 border-blue-400',
  completed: 'bg-green-100 text-green-800 border-green-400',
  evaluated: 'bg-purple-100 text-purple-800 border-purple-400',
};

export default function StudentProfileSidebar({ student, onClose }) {
  return (
    <div className={`fixed top-0 right-0 h-full transition-all duration-300 ease-in-out transform ${
      student ? "translate-x-0" : "translate-x-full"
    } w-1/3 z-50`}>
      {student && (
        <div className="bg-white border-l-2 border-[#5DB2C7] h-full flex flex-col shadow-lg relative">
          {/* Top bar with Internship Status and Close button */}
            <div className="flex justify-between items-center sticky top-0 bg-white z-10 px-4 py-2">
            {/* Internship Status badge */}
            <span className={`
                inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                ${statusColors[student.internshipStatus.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-400'}
            `}>
                {student.internshipStatus.toUpperCase()}
            </span>

            {/* Close button */}
            <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
            >
                ×
            </button>
            </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 px-6">
            <div className="pr-2">
              {/* Student Profile Header */}
              <div className="flex flex-col items-center py-6">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#3298BA]">
                    <Image
                      src={student.photo || '/default-avatar.png'}
                      alt={student.name}
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                {student.status === 'PRO' && (
                <span className="absolute -top-2 -right-2 px-2 py-1 bg-white rounded-full text-xs font-medium text-[#2a5f74] border border-[#3298BA]">
                {student.status}
                </span>
                )}
                </div>
                <h2 className="text-2xl font-bold text-[#3298BA] mb-1">{student.name}</h2>
                {student.email && (
                  <p className="text-gray-600 text-sm mt-1">{student.email}</p>
                )}
                {/* Centered Social Links */}
                <div className="flex gap-4 mt-3 justify-center">
                  {student.socialLinks?.linkedin && (
                    <a href={student.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[#2a5f74] hover:text-[#3298BA]">
                      <svg className="social-icon w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  )}
                  {student.socialLinks?.github && (
                    <a href={student.socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-[#2a5f74] hover:text-[#3298BA]">
                      <svg className="social-icon w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                  {student.socialLinks?.portfolio && (
                    <a href={student.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" aria-label="Portfolio" className="text-[#2a5f74] hover:text-[#3298BA]">
                      <svg className="social-icon w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.162c-.499 1.33-1.159 2.497-1.957 3.456v-3.62c.666.028 1.319.081 1.957.164zm-1.957-7.219v-3.015c.868-.034 1.721-.103 2.548-.224.238 1.027.389 2.111.446 3.239h-2.994zm0-5.014v-3.661c.806.969 1.471 2.15 1.971 3.496-.642.084-1.3.137-1.971.165zm2.703-3.267c1.237.496 2.354 1.228 3.29 2.146-.642.234-1.311.442-2.019.607-.344-.992-.775-1.91-1.271-2.753zm-7.241 13.56c-.244-1.039-.398-2.136-.456-3.279h2.994v3.057c-.865.034-1.714.102-2.538.222zm2.538 1.776v3.62c-.798-.959-1.458-2.126-1.957-3.456.638-.083 1.291-.136 1.957-.164zm-2.994-7.055c.057-1.128.207-2.212.446-3.239.827.121 1.68.19 2.548.224v3.015h-2.994zm1.024-5.179c.5-1.346 1.165-2.527 1.97-3.496v3.661c-.671-.028-1.329-.081-1.97-.165zm-2.005-.35c-.708-.165-1.377-.373-2.018-.607.937-.918 2.053-1.65 3.29-2.146-.496.844-.927 1.762-1.272 2.753zm-.549 1.918c-.264 1.151-.434 2.36-.492 3.611h-3.933c.165-1.658.739-3.197 1.617-4.518.88.361 1.816.67 2.808.907zm.009 9.262c-.988.236-1.92.542-2.797.9-.89-1.328-1.471-2.879-1.637-4.551h3.934c.058 1.265.231 2.488.5 3.651zm.553 1.917c.342.976.768 1.881 1.257 2.712-1.223-.49-2.326-1.211-3.256-2.115.636-.229 1.299-.435 1.999-.597zm9.924 0c.7.163 1.362.367 1.999.597-.931.903-2.034 1.625-3.257 2.116.489-.832.915-1.737 1.258-2.713zm.553-1.917c.27-1.163.442-2.386.501-3.651h3.934c-.167 1.672-.748 3.223-1.638 4.551-.877-.358-1.81-.664-2.797-.9zm.501-5.651c-.058-1.251-.229-2.46-.492-3.611.992-.237 1.929-.546 2.809-.907.877 1.321 1.451 2.86 1.616 4.518h-3.933z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Student Information Sections */}
              <div className="space-y-6 mb-6">
                {/* Academic Information */}
                <div className="bg-[#F0F9FB] p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-[#2a5f74] mb-3">Academic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Student ID</p>
                      <p className="font-medium">{student.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Semester</p>
                      <p className="font-medium">Semester {student.semester}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">GPA</p>
                      <p className="font-medium">{student.gpa || 'Not available'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Major</p>
                      <p className="font-medium">{student.major || 'Not available'}</p>
                    </div>

                  </div>
                </div>

                {/* Additional Sections */}
                {student.education && (
                  <div className="bg-[#F0F9FB] p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#2a5f74] mb-3">Education</h3>
                    <ul className="space-y-2">
                      {student.education.map((edu, idx) => (
                        <li key={idx}>
                          {edu.degree && <p className="font-medium">{edu.degree}</p>}
                          {edu.institution && <p className="text-sm text-gray-600">{edu.institution}</p>}
                          {edu.period && <p className="text-sm text-gray-500">{edu.period}</p>}
                          {edu.faculty && <p className="text-sm text-gray-600">Faculty: {edu.faculty}</p>}
                          {edu.semester && <p className="text-sm text-gray-600">Semester: {edu.semester}</p>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {student.skills && student.skills.length > 0 && (
                  <div className="bg-[#F0F9FB] p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#2a5f74] mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {student.skills.map((skill, idx) => (
                        <span key={idx} className="bg-[#D9F0F4] text-[#2a5f74] px-3 py-1 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {student.personalityTraits && student.personalityTraits.length > 0 && (
                  <div className="bg-[#F0F9FB] p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#2a5f74] mb-3">Personality Traits</h3>
                    <ul className="space-y-2">
                      {student.personalityTraits.map((trait, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{trait.trait}</span>
                          <span className="text-sm text-gray-600">Rating: {trait.rating}/5</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {student.jobInterests && student.jobInterests.length > 0 && (
                  <div className="bg-[#F0F9FB] p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#2a5f74] mb-3">Job Interests</h3>
                    <ul className="space-y-4">
                      {student.jobInterests.map((job, idx) => (
                        <li key={idx}>
                          <p className="font-medium">{job.title}</p>
                          <p className="text-sm text-gray-600">{job.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {student.experience && student.experience.length > 0 && (
                  <div className="bg-[#F0F9FB] p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#2a5f74] mb-3">Experience</h3>
                    <ul className="space-y-4">
                      {student.experience.map((exp, idx) => (
                        <li key={idx}>
                          <p className="font-medium">{exp.title} at {exp.company}</p>
                          <p className="text-sm text-gray-500">{exp.duration}</p>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                            {exp.responsibilities.map((task, i) => (
                              <li key={i}>{task}</li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {student.internships && student.internships.length > 0 && (
                  <div className="bg-[#F0F9FB] p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#2a5f74] mb-3">Internships</h3>
                    <ul className="space-y-4">
                      {student.internships.map((intern, idx) => (
                        <li key={idx}>
                          <p className="font-medium">{intern.title} at {intern.company}</p>
                          <p className="text-sm text-gray-500">{intern.period}</p>
                          <p className="text-sm text-gray-600">{intern.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}