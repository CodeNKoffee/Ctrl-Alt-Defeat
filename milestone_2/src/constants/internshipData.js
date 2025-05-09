// Unified mock internship data with all properties needed across different views
export const allInternships = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechVision",
    type: "Full-time",
    locationType: "REMOTE",
    jobSetting: "Remote",
    paid: true,
    rate: "$20/hr",
    postedDate: "2 days ago",
    appliedDate: "2024-04-15",
    startDate: "2025-01-15",
    industry: "Technology",
    duration: "3 months",
    skills: ["JavaScript", "React", "TypeScript", "Redux", "HTML5", "CSS3", "REST APIs"],
    description: "Join our team to work on exciting projects and gain hands-on experience in frontend development.",
    details: "TechVision is an industry-leading software development company that has been at the forefront of web technology innovation for over a decade...",
    requirements: "Applicants should be pursuing a Computer Science degree with basic JavaScript/React knowledge...",
    status: "current", // For my-internships
    applicationStatus: "accepted" // For applied-internships
  },
  {
    id: 2,
    title: "Marketing Coordinator",
    company: "BrandBoost",
    type: "Part-time",
    locationType: "HYBRID",
    jobSetting: "Hybrid",
    paid: false,
    rate: "$0/hr",
    postedDate: "1 week ago",
    appliedDate: "2024-04-10",
    startDate: "2025-02-01",
    industry: "Marketing",
    duration: "6 months",
    skills: ["SEO", "Content Creation", "Social Media", "Google Analytics", "Email Marketing", "Copywriting", "Market Research"],
    description: "Assist in marketing campaigns and help boost our brand presence online.",
    details: "BrandBoost is a premier digital marketing agency that has helped over 500 businesses establish and grow their online presence...",
    requirements: "Marketing/Communications students with social media knowledge and strong writing skills preferred...",
    status: "completed", // For my-internships
    applicationStatus: "finalized" // For applied-internships
  },
  {
    id: 3,
    title: "Data Science Intern",
    company: "Thndr",
    type: "Full-time",
    locationType: "ON-SITE",
    jobSetting: "On-site",
    paid: true,
    rate: "$25/hr",
    postedDate: "3 days ago",
    appliedDate: "2024-04-05",
    startDate: "2025-03-01",
    industry: "Technology",
    duration: "4 months",
    skills: ["Python", "Machine Learning", "Data Analysis", "SQL", "Pandas", "NumPy", "Data Visualization"],
    description: "Work with our data team to analyze large datasets and derive insights.",
    details: "Thndr is an innovative fintech startup that's transforming the investment landscape through AI-powered analytics...",
    requirements: "Data Science/CS majors with Python proficiency and basic ML understanding needed...",
    status: "evaluated", // For my-internships
    applicationStatus: "rejected" // For applied-internships
  },
  {
    id: 4,
    title: "UX Design Intern",
    company: "CreativeMinds",
    type: "Contract",
    locationType: "REMOTE",
    jobSetting: "Remote",
    paid: true,
    rate: "$22/hr",
    postedDate: "5 days ago",
    appliedDate: "2024-04-01",
    startDate: "2025-06-01",
    industry: "Design",
    duration: "4 months",
    skills: ["Figma", "User Research", "Prototyping", "UI Design", "Wireframing", "Usability Testing", "Adobe XD"],
    description: "Help design user-friendly interfaces and improve user experience for our products.",
    details: "CreativeMinds is a globally recognized design consultancy that has been shaping exceptional user experiences since 2012...",
    requirements: "Design students proficient in Figma with user research experience preferred...",
    status: "current", // For my-internships
    applicationStatus: "pending" // For applied-internships
  },
  {
    id: 5,
    title: "Biomedical Research Assistant",
    company: "HealthInnovate",
    type: "Full-time",
    locationType: "ON-SITE",
    jobSetting: "On-site",
    paid: false,
    rate: "$0/hr",
    postedDate: "2 weeks ago",
    startDate: "2025-04-01",
    industry: "Healthcare",
    duration: "6 months",
    skills: ["Research", "Data Collection", "Analysis", "Lab Techniques", "Scientific Writing", "Statistics", "Clinical Protocols"],
    description: "Assist in ongoing biomedical research projects and contribute to data collection and analysis.",
    details: "HealthInnovate is a pioneering medical research organization dedicated to advancing healthcare technology and treatments...",
    requirements: "Biology/Medical students with research experience and strong analytical skills needed...",
    status: "completed",
    applicationStatus: null // Not applied to
  }
];

// Helper functions to filter internships for different views
export const getRegularInternships = () => {
  return allInternships;
};

export const getMyInternships = () => {
  return allInternships.filter(internship =>
    ["current", "completed", "evaluated"].includes(internship.status)
  );
};

export const getAppliedInternships = () => {
  return allInternships.filter(internship =>
    internship.applicationStatus !== null
  ).map(internship => ({
    ...internship,
    status: internship.applicationStatus // Use applicationStatus as status for applied view
  }));
}; 