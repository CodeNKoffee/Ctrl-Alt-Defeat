// Mock user data for authentication
export const MOCK_USERS = {
  scad: {
    email: "scad@example.com",
    password: "scad123",
    name: "SCAD Admin",
    role: "scad",
    id: "scad_001"
  },
  faculty: {
    email: "faculty@example.com",
    password: "faculty123",
    name: "Faculty Member",
    role: "faculty",
    id: "faculty_001"
  },
  company: {
    email: "company@example.com",
    password: "company123",
    name: "Company Representative",
    role: "company",
    id: "company_001"
  },
  students: [
    {
      email: "student@example.com",
      password: "student123",
      name: "Student User",
      role: "student",
      accountType: "none",
      id: "student_001",
      major: "Computer Science",
      jobInterests: ["Software Engineer", "Backend Developer"],
      industries: ["Law", "Education"],
      recommendedCompanies: [3, 2],
      pastInterns: [
        { name: "Omar", companyId: 3, feedback: "Learned a lot about ML." }
      ]
    },
    {
      email: "hatem@trybytes.ai",
      password: "hatem123",
      name: "Hatem",
      role: "student",
      accountType: "PRO",
      id: "student_002",
      major: "Media Engineering & Technology",
      jobInterests: ["Frontend Developer", "UI/UX Designer"],
      industries: ["Technology", "Finance"],
      recommendedCompanies: [1, 4],
      pastInterns: [
        { name: "Omar", companyId: 1, feedback: "Great mentorship!" }
      ]
    },
    {
      email: "salmaaburahmah@gmail.com",
      password: "salma123",
      name: "Salma",
      role: "student",
      accountType: "PRO",
      id: "student_003",
      major: "Computer Science",
      jobInterests: ["UI/UX Designer", "Backend Developer"],
      industries: ["Technology", "Design"],
      recommendedCompanies: [3, 2],
      pastInterns: [
        { name: "Sara", companyId: 3, feedback: "Learned a lot about ML." }
      ]
    }
  ]
};

// Mock companies data for SCAD dashboard
export const MOCK_COMPANIES = [
  {
    id: "comp_001",
    name: "Tawabiry",
    alt: "Tawabiry",
    email: "contact-us@tawabiry.com",
    logo: "/logos/tawabiry.png",
    industry: "Software as a Service",
    size: "Small (1-50 employees)",
    documentation: [
      { type: "registration", url: "/docs/company-registration.pdf" },
    ],
    status: "pending"
  },
  {
    id: "comp_002",
    name: 'Vodafone Egypt',
    alt: 'Vodafone Egypt',
    email: 'contact@vodafone.com.eg',
    logo: '/logos/tawabiry.png',
    industry: 'Telecommunications',
    size: 'Corporate (500+ employees)',
    documentation: [
      { type: "registration", url: "/docs/company-registration.pdf" },
    ],
    status: "pending"
  },
  {
    id: "comp_003",
    name: 'Juhayna Food Industries',
    alt: 'Juhayna Food Industries',
    email: 'contact@juhayna.com',
    logo: '/logos/tawabiry.png',
    industry: 'Food Production',
    size: 'Large (101-500 employees)',
    documentation: [
      { type: "registration", url: "/docs/company-registration.pdf" },
    ],
    status: "pending"
  },
  {
    id: "comp_004",
    name: 'Nestlé Egypt',
    industry: 'Food & Beverages',
    size: 'Corporate (500+ employees)',
    email: 'contact@eg.nestle.com',
    logo: '/logos/tawabiry.png',
    documentation: [
      { type: "registration", url: "/docs/company-registration.pdf" },
    ],
    status: "pending"
  },
  {
    id: "comp_005",
    name: 'Valeo Egypt',
    alt: 'Valeo Egypt',
    industry: 'Automotive',
    size: 'Large (101-500 employees)',
    email: 'hr@valeo.com',
    logo: '/logos/tawabiry.png',
    documentation: [
      { type: "taxCard", url: "/docs/tax-card.pdf" },
    ],
    status: "pending"
  },
  {
    id: "comp_006",
    name: 'Fawry',
    alt: 'Fawry',
    industry: 'Financial Services',
    size: 'Medium (51-100 employees)',
    email: 'support@fawry.com',
    logo: '/logos/tawabiry.png',
    documentation: [
      { type: "taxId", url: "/docs/tax-id.pdf" },
    ],
    status: "pending"
  },
  {
    id: "comp_007",
    name: 'Careem Egypt',
    alt: 'Careem Egypt',
    industry: 'Internet',
    size: 'Medium (51-100 employees)',
    email: 'info@careem.com',
    logo: '/logos/tawabiry.png',
    documentation: [
      { type: "registration", url: "/docs/company-registration.pdf" },
    ],
    location: 'Multinational (Egypt)'
  },
  {
    id: "comp_008",
    name: 'Edita Food Industries',
    alt: 'Edita Food Industries',
    industry: 'Food Production',
    size: 'Large (101-500 employees)',
    email: 'contact@edita.com.eg',
    logo: '/logos/tawabiry.png',
    documentation: [
      { type: "taxCard", url: "/docs/tax-card.pdf" },
    ],
    status: "pending"
  },
  {
    id: "comp_009",
    name: 'Deloitte Egypt',
    alt: 'Deloitte Egypt',
    industry: 'Consulting',
    size: 'Large (101-500 employees)',
    email: 'contact@deloitte.com.eg',
    logo: '/logos/tawabiry.png',
    documentation: [
      { type: "registration", url: "/docs/company-registration.pdf" },
    ],
    status: "pending"
  },
  {
    id: "comp_010",
    name: 'KPMG Egypt',
    alt: 'KPMG Egypt',
    industry: 'Consulting',
    size: 'Large (101-500 employees)',
    email: 'contact@kpmg.com.eg',
    logo: '/logos/tawabiry.png',
    documentation: [
      { type: "registration", url: "/docs/company-registration.pdf" },
    ],
    status: "pending"
  },
  {
    id: "comp_011",
    name: 'PwC Egypt',
    alt: 'PwC Egypt',
    industry: 'Consulting',
    size: 'Large (101-500 employees)',
    email: 'contact@pwc.com.eg',
    logo: '/logos/tawabiry.png',
    documentation: [
      { type: "registration", url: "/docs/company-registration.pdf" },
    ],
    status: "pending"
  },
  {
    id: "comp_012",
    name: 'EY Egypt',
    alt: 'EY Egypt',
    industry: 'Consulting',
    size: 'Large (101-500 employees)',
    email: 'contact@ey.com.eg',
    logo: '/logos/tawabiry.png',
    documentation: [
      { type: "registration", url: "/docs/company-registration.pdf" },
    ],
    status: "pending"
  },
  {
    id: "comp_013",
    name: 'Gates Of Egypt',
    alt: 'Gates Of Egypt',
    industry: 'Tourism',
    size: 'Small (1-50 employees)',
    email: 'contact@gates-of-egypt.com',
    logo: '/logos/tawabiry.png',
    documentation: [
      { type: "registration", url: "/docs/company-registration.pdf" },
    ],
    status: "pending"
  },
];

// Mock data for applied internships
export const MOCK_APPLIED_INTERNSHIPS = [
  {
    id: 1,
    title: "UI Designer",
    company: "Dribble",
    type: "Part-time",
    jobType: "Part-time",
    jobSetting: "Remote",
    paid: true,
    rate: "$20/hr",
    appliedDate: "2021-06-03",
    startDate: "2025-01-15",
    duration: "3 months",
    skills: ["Figma", "User Research", "Prototyping", "UI Design", "Wireframing", "Usability Testing", "Adobe XD"],
    description: "Help design user-friendly interfaces and improve user experience for our products.",
    details: "Dribble, a leading design platform, offers hands-on experience with real-world design challenges and client projects.",
    requirements: "Design students proficient in Figma with user research experience preferred...",
    status: "pending"
  },
  {
    id: 2,
    title: "Frontend Developer Intern",
    company: "TechVision",
    type: "Full-time",
    jobType: "Full-time",
    jobSetting: "Remote",
    paid: true,
    rate: "$0/hr",
    appliedDate: "2021-06-03",
    startDate: "2025-01-15",
    duration: "3 months",
    skills: ["JavaScript", "React", "TypeScript", "Redux", "HTML5", "CSS3", "REST APIs"],
    description: "Join our team to work on exciting projects and gain hands-on experience in frontend development.",
    details: "TechVision leads in software development, pioneering web technology innovation for over a decade with cutting-edge solutions.",
    requirements: "Applicants should be pursuing a Computer Science degree with basic JavaScript/React knowledge...",
    status: "accepted"
  },
  {
    id: 3,
    title: "Marketing Coordinator",
    company: "BrandBoost",
    type: "Part-time",
    jobType: "Part-time",
    jobSetting: "Hybrid",
    paid: false,
    rate: "$0/hr",
    appliedDate: "2021-06-03",
    startDate: "2025-02-01",
    duration: "6 months",
    skills: ["SEO", "Content Creation", "Social Media", "Google Analytics", "Email Marketing", "Copywriting", "Market Research"],
    description: "Assist in marketing campaigns and help boost our brand presence online.",
    details: "BrandBoost, a premier digital marketing agency, empowers businesses to establish and grow their online presence effectively.",
    requirements: "Marketing/Communications students with social media knowledge and strong writing skills preferred...",
    status: "finalized"
  },
  {
    id: 4,
    title: "Data Science Intern",
    company: "Thndr",
    type: "Full-time",
    jobType: "Full-time",
    jobSetting: "On-site",
    paid: true,
    rate: "$0/hr",
    appliedDate: "2021-06-03",
    startDate: "2025-03-01",
    duration: "4 months",
    skills: ["Python", "Machine Learning", "Data Analysis", "SQL", "Pandas", "NumPy", "Data Visualization"],
    description: "Work with our data team to analyze large datasets and derive insights.",
    details: "Thndr, an innovative fintech startup, transforms the investment landscape using advanced AI-powered analytics and insights.",
    requirements: "Data Science/CS majors with Python proficiency and basic ML understanding needed...",
    status: "rejected"
  }
];
export const mockStudents = [
  {
    id: "61-1959",
    name: "Farid Khaled",
    photo: "/images/boy1.png",
    major: "DMET",
    semester: "4",
    status: "Regular",
    gpa: 1.3
  },
  {
    id: "55-5727",
    name: "Salma Tarek",
    photo: "/images/girl1.png",
    major: "Mechatronics Engineering",
    semester: "8",
    status: "Regular",
    gpa: 2.3
  },
  {
    id: "58-16143",
    name: "Amr Baher",
    photo: "/images/boy2.png",
    major: "Business Management",
    semester: "6",
    status: "PRO",
    gpa: 1.7
  },
  {
    id: "52-4567",
    name: "Layla Khaled",
    photo: "/images/girl2.png",
    major: "Product Design",
    semester: "8",
    status: "PRO",
    gpa: 2.7
  },
  {
    id: "64-5123",
    name: "Khaled Ahmed",
    photo: "/images/boy3.png",
    major: "IET",
    semester: "2",
    status: "Regular",
    gpa: 3.0
  },
  {
    id: "58-0454",
    name: "Habiba Mahmoud",
    photo: "/images/girl3.png",
    major: "Pharmacy",
    semester: "6",
    status: "PRO",
    gpa: 1.0
  },
  {
    id:"61-7128",
    name: "Hala Khaled",
    photo: "/images/girl4.png",
    major: "Business Informatics",
    semester: "4",
    status: "Regular",
    gpa: 2.0
  },
  {
    id:"55-6188",
    name:"Hatem Soliman",
    photo:"/images/boy4.png",
    major:"MET",
    semester:"6",
    status:"PRO",
    gpa:1.7
  }
];
export const reports = [
  {
    id: "RPT-001",
    studentName: "Alex Johnson",
    studentId: "S12345",
    major: "DMET",
    company: "Tech Innovations Inc.",
    internshipDuration: "12 weeks",
    reportTitle: "Digital Media Internship Experience",
    submissionDate: "2023-05-15",
    status: "ACCEPTED"
  },
  {
    id: "RPT-002",
    studentName: "Maria Garcia",
    studentId: "S12346",
    major: "IET",
    company: "PowerGrid Solutions",
    internshipDuration: "10 weeks",
    reportTitle: "Industrial Systems Analysis Internship",
    submissionDate: "2023-05-18",
    status: "PENDING"
  },
  {
    id: "RPT-003",
    studentName: "James Wilson",
    studentId: "S12347",
    major: "MET",
    company: "Auto Dynamics",
    internshipDuration: "8 weeks",
    reportTitle: "Manufacturing Engineering Internship",
    submissionDate: "2023-05-20",
    status: "FLAGGED"
  },
  {
    id: "RPT-004",
    studentName: "Sarah Lee",
    studentId: "S12348",
    major: "Management",
    company: "Global Finance Corp",
    internshipDuration: "12 weeks",
    reportTitle: "Marketing Strategy Internship Report",
    submissionDate: "2023-05-22",
    status: "REJECTED" 
  },
  {
    id: "RPT-005",
    studentName: "David Kim",
    studentId: "S12349",
    major: "BI",
    company: "DataSystems LLC",
    internshipDuration: "14 weeks",
    reportTitle: "Business Data Analysis Internship",
    submissionDate: "2023-05-25",
    status: "ACCEPTED"
  },
  {
    id: "RPT-006",
    studentName: "Emma Thompson",
    studentId: "S12350",
    major: "Law",
    company: "Legal Associates LLP",
    internshipDuration: "10 weeks",
    reportTitle: "Corporate Law Internship Report",
    submissionDate: "2023-05-28",
    status: "PENDING"
  },
  {
    id: "RPT-007",
    studentName: "Michael Brown",
    studentId: "S12351",
    major: "Applied Arts",
    company: "Creative Design Studio",
    internshipDuration: "12 weeks",
    reportTitle: "Graphic Design Internship Portfolio",
    submissionDate: "2023-05-30",
    status: "ACCEPTED"
  },
  {
    id: "RPT-008",
    studentName: "Olivia Davis",
    studentId: "S12352",
    major: "DMET",
    company: "Digital Media Solutions",
    internshipDuration: "8 weeks",
    reportTitle: "Animation Internship Experience",
    submissionDate: "2023-06-01",
    status: "FLAGGED"
  },
  {
    id: "RPT-009",
    studentName: "Daniel Wilson",
    studentId: "S12353",
    major: "IET",
    company: "Industrial Automation Co.",
    internshipDuration: "16 weeks",
    reportTitle: "Process Control Systems Internship",
    submissionDate: "2023-06-03",
    status: "PENDING"
  },
  {
    id: "RPT-010",
    studentName: "Sophia Martinez",
    studentId: "S12354",
    major: "Management",
    company: "Market Leaders Inc.",
    internshipDuration: "10 weeks",
    reportTitle: "Business Development Internship Report",
    submissionDate: "2023-06-05",
    status: "ACCEPTED"
  },
  {
    id: "RPT-011",
    studentName: "Ethan Parker",
    studentId: "S12355",
    major: "Pharmacy",
    company: "Metro Health Pharmaceuticals",
    internshipDuration: "12 weeks",
    reportTitle: "Clinical Pharmacy Internship Experience",
    submissionDate: "2023-06-08",
    status: "ACCEPTED"
  },
  {
    id: "RPT-012",
    studentName: "Ava Rodriguez",
    studentId: "S12356",
    major: "DMET",
    company: "Virtual Reality Studios",
    internshipDuration: "14 weeks",
    reportTitle: "VR Content Development Internship",
    submissionDate: "2023-06-10",
    status: "PENDING"
  },
  {
    id: "RPT-013",
    studentName: "Noah Chen",
    studentId: "S12357",
    major: "BI",
    company: "Analytics Pro",
    internshipDuration: "10 weeks",
    reportTitle: "Business Intelligence Systems Internship",
    submissionDate: "2023-06-12",
    status: "FLAGGED",
  },
  {
    id: "RPT-014",
    studentName: "Isabella Wong",
    studentId: "S12358",
    major: "Applied Arts",
    company: "Urban Design Collective",
    internshipDuration: "8 weeks",
    reportTitle: "Product Design Internship Portfolio",
    submissionDate: "2023-06-15",
    status: "ACCEPTED"
  },
  {
    id: "RPT-015",
    studentName: "Liam O'Brien",
    studentId: "S12359",
    major: "Pharmacy",
    company: "Community Care Pharmacy",
    internshipDuration: "16 weeks",
    reportTitle: "Retail Pharmacy Operations Internship",
    submissionDate: "2023-06-18",
    status: "PENDING"
  }
];

export const reportsMockData = [
  {
    id: 1,
    reportNumber: 'RPT-001',
    studentName: "David Lee",
    studentMajor: "Computer Science",
    internshipTitle: "Backend Developer Internship",
    companyName: "TechCorp Inc.",
    submissionDate: "2025-04-15",
    status: "pending"
  },
  {
    id: 2,
    reportNumber: 'RPT-002',
    studentName: "Sarah Wilson",
    studentMajor: "Computer Engineering",
    internshipTitle: "Frontend Developer Internship",
    companyName: "Web Solutions Ltd.",
    submissionDate: "2025-04-10",
    status: "pending"
  },
  {
    id: 3,
    reportNumber: 'RPT-003',
    studentName: "Michael Brown",
    studentMajor: "Computer Science",
    internshipTitle: "Full Stack Developer Internship",
    companyName: "Digital Innovations",
    submissionDate: "2025-04-05",
    status: "pending"
  },
  {
    id: 4,
    reportNumber: 'RPT-004',
    studentName: "Emma Johnson",
    studentMajor: "Information Systems",
    internshipTitle: "Data Analysis Internship",
    companyName: "Data Insights Corp",
    submissionDate: "2025-04-12",
    status: "flagged"
  },
  {
    id: 5,
    reportNumber: 'RPT-005',
    studentName: "James Rodriguez",
    studentMajor: "Software Engineering",
    internshipTitle: "Mobile App Developer Internship",
    companyName: "AppWorks Inc.",
    submissionDate: "2025-04-08",
    status: "rejected"
  },
  {
    id: 6,
    reportNumber: 'RPT-006',
    studentName: "Olivia Chen",
    studentMajor: "Information Systems",
    internshipTitle: "UX/UI Design Internship",
    companyName: "Creative Solutions",
    submissionDate: "2025-04-17",
    status: "accepted"
  },
  {
    id: 7,
    reportNumber: 'RPT-007',
    studentName: "Fatima Al-Masri",
    studentMajor: "Business Administration",
    internshipTitle: "Marketing Analyst Internship",
    companyName: "MarketMinds",
    submissionDate: "2025-04-18",
    status: "pending"
  },
  {
    id: 8,
    reportNumber: 'RPT-008',
    studentName: "Mohamed El-Sayed",
    studentMajor: "Electrical Engineering",
    internshipTitle: "Embedded Systems Internship",
    companyName: "ElectroTech",
    submissionDate: "2025-04-19",
    status: "accepted"
  },
  {
    id: 9,
    reportNumber: 'RPT-009',
    studentName: "Layla Hassan",
    studentMajor: "Graphic Design",
    internshipTitle: "UI/UX Design Internship",
    companyName: "Designify",
    submissionDate: "2025-04-20",
    status: "flagged"
  },
  {
    id: 10,
    reportNumber: 'RPT-010',
    studentName: "Omar Khaled",
    studentMajor: "Civil Engineering",
    internshipTitle: "Site Engineer Internship",
    companyName: "BuildRight",
    submissionDate: "2025-04-21",
    status: "rejected"
  },
  {
    id: 11,
    reportNumber: 'RPT-011',
    studentName: "Sara Nabil",
    studentMajor: "Pharmacy",
    internshipTitle: "Clinical Research Internship",
    companyName: "PharmaPlus",
    submissionDate: "2025-04-22",
    status: "accepted"
  },
  {
    id: 12,
    reportNumber: 'RPT-012',
    studentName: "Youssef Adel",
    studentMajor: "Mechanical Engineering",
    internshipTitle: "CAD Design Internship",
    companyName: "AutoMech",
    submissionDate: "2025-04-23",
    status: "pending"
  },
  {
    id: 13,
    reportNumber: 'RPT-013',
    studentName: "Mona Fathy",
    studentMajor: "Accounting",
    internshipTitle: "Audit Internship",
    companyName: "FinCheck",
    submissionDate: "2025-04-24",
    status: "flagged"
  },
  {
    id: 14,
    reportNumber: 'RPT-014',
    studentName: "Karim Mostafa",
    studentMajor: "Architecture",
    internshipTitle: "Architectural Design Internship",
    companyName: "UrbanVisions",
    submissionDate: "2025-04-25",
    status: "accepted"
  },
  {
    id: 15,
    reportNumber: 'RPT-015',
    studentName: "Nourhan Samir",
    studentMajor: "Computer Science",
    internshipTitle: "AI Research Internship",
    companyName: "DeepThink",
    submissionDate: "2025-04-26",
    status: "pending"
  },
  {
    id: 16,
    reportNumber: 'RPT-016',
    studentName: "Hassan Tarek",
    studentMajor: "Political Science",
    internshipTitle: "Policy Analyst Internship",
    companyName: "GovInsight",
    submissionDate: "2025-04-27",
    status: "rejected"
  }
];

export const reportDetailsMockData = [
  // ACCEPTED
  {
    reportNumber: 'RPT-001',
    status: 'accepted',
    text: `During my internship at Creative Solutions, I participated in a variety of UX/UI projects, collaborating with both designers and developers. My responsibilities included conducting user research, creating wireframes, and developing interactive prototypes. I was able to apply my academic knowledge in real-world scenarios, and my mentor provided constructive feedback that helped me refine my skills. One of my main achievements was leading a usability testing session, which resulted in actionable insights for the team. This experience greatly improved my proficiency in Figma and enhanced my communication and teamwork abilities. Overall, the internship deepened my understanding of user-centered design and the importance of iterative development.`,
    highlights: [
      { start: 0, end: 120, color: "#bbf7d0" }
    ],
    comments: [
      { author: "Dr. Ahmed", text: "Excellent summary of your learning experience!", position: 10 },
      { author: "Dr. Ahmed", text: "Great collaboration skills shown.", position: 100 }
    ],
    feedback: {
      summary: "Outstanding work!",
      details: "Your report is clear, insightful, and well-structured. Keep it up!",
      facultyReason: "Student demonstrated strong understanding and teamwork."
    }
  },
  // FLAGGED
  {
    reportNumber: 'RPT-002',
    status: 'flagged',
    text: `During my internship at Creative Solutions, I participated in a variety of UX/UI projects, collaborating with both designers and developers. My responsibilities included conducting user research, creating wireframes, and developing interactive prototypes. I was able to apply my academic knowledge in real-world scenarios, and my mentor provided constructive feedback that helped me refine my skills. One of my main achievements was leading a usability testing session, which resulted in actionable insights for the team. This experience greatly improved my proficiency in Figma and enhanced my communication and teamwork abilities. Overall, the internship deepened my understanding of user-centered design and the importance of iterative development.`,
    highlights: [
      { start: 70, end: 180, color: "#fde68a" }
    ],
    comments: [
      { author: "Dr. Smith", text: "Objectives are unclear. Please specify.", position: 80 },
      { author: "Dr. Smith", text: "Results section is incomplete.", position: 120 }
    ],
    feedback: {
      summary: "Flagged for missing details.",
      details: "The report does not specify objectives or methods.",
      facultyReason: "Flagged because the student did not clarify objectives or provide a complete results section."
    }
  },
  // REJECTED
  {
    reportNumber: 'RPT-003',
    status: 'rejected',
    text: `During my internship at Creative Solutions, I participated in a variety of UX/UI projects, collaborating with both designers and developers. My responsibilities included conducting user research, creating wireframes, and developing interactive prototypes. I was able to apply my academic knowledge in real-world scenarios, and my mentor provided constructive feedback that helped me refine my skills. One of my main achievements was leading a usability testing session, which resulted in actionable insights for the team. This experience greatly improved my proficiency in Figma and enhanced my communication and teamwork abilities. Overall, the internship deepened my understanding of user-centered design and the importance of iterative development.`,
    highlights: [
      { start: 60, end: 180, color: "#fecaca" }
    ],
    comments: [
      { author: "Dr. Lee", text: "Methodology section is missing.", position: 80 },
      { author: "Dr. Lee", text: "No analysis or reflection provided.", position: 120 }
    ],
    feedback: {
      summary: "Rejected due to missing methodology and analysis.",
      details: "Please include a detailed methodology and reflect on your experience.",
      facultyReason: "Rejected because the report lacks methodology and analysis."
    }
  },
  // PENDING
  {
    reportNumber: 'RPT-004',
    status: 'pending',
    text: `During my internship at Creative Solutions, I participated in a variety of UX/UI projects, collaborating with both designers and developers. My responsibilities included conducting user research, creating wireframes, and developing interactive prototypes. I was able to apply my academic knowledge in real-world scenarios, and my mentor provided constructive feedback that helped me refine my skills. One of my main achievements was leading a usability testing session, which resulted in actionable insights for the team. This experience greatly improved my proficiency in Figma and enhanced my communication and teamwork abilities. Overall, the internship deepened my understanding of user-centered design and the importance of iterative development.`,
    highlights: [],
    comments: [],
    feedback: null
  },
  // ACCEPTED
  {
    reportNumber: 'RPT-005',
    status: 'accepted',
    text: `During my internship at Creative Solutions, I participated in a variety of UX/UI projects, collaborating with both designers and developers. My responsibilities included conducting user research, creating wireframes, and developing interactive prototypes. I was able to apply my academic knowledge in real-world scenarios, and my mentor provided constructive feedback that helped me refine my skills. One of my main achievements was leading a usability testing session, which resulted in actionable insights for the team. This experience greatly improved my proficiency in Figma and enhanced my communication and teamwork abilities. Overall, the internship deepened my understanding of user-centered design and the importance of iterative development.`,
    highlights: [
      { start: 0, end: 120, color: "#bbf7d0" }
    ],
    comments: [
      { author: "Dr. Ahmed", text: "Excellent summary of your learning experience!", position: 10 },
      { author: "Dr. Ahmed", text: "Great collaboration skills shown.", position: 100 }
    ],
    feedback: {
      summary: "Outstanding work!",
      details: "Your report is clear, insightful, and well-structured. Keep it up!",
      facultyReason: "Student demonstrated strong understanding and teamwork."
    }
  },
  // FLAGGED
  {
    reportNumber: 'RPT-006',
    status: 'flagged',
    text: `During my internship at Creative Solutions, I participated in a variety of UX/UI projects, collaborating with both designers and developers. My responsibilities included conducting user research, creating wireframes, and developing interactive prototypes. I was able to apply my academic knowledge in real-world scenarios, and my mentor provided constructive feedback that helped me refine my skills. One of my main achievements was leading a usability testing session, which resulted in actionable insights for the team. This experience greatly improved my proficiency in Figma and enhanced my communication and teamwork abilities. Overall, the internship deepened my understanding of user-centered design and the importance of iterative development.`,
    highlights: [
      { start: 70, end: 180, color: "#fde68a" }
    ],
    comments: [
      { author: "Dr. Smith", text: "Objectives are unclear. Please specify.", position: 80 },
      { author: "Dr. Smith", text: "Results section is incomplete.", position: 120 }
    ],
    feedback: {
      summary: "Flagged for missing details.",
      details: "The report does not specify objectives or methods.",
      facultyReason: "Flagged because the student did not clarify objectives or provide a complete results section."
    }
  },
  // REJECTED
  {
    reportNumber: 'RPT-007',
    status: 'rejected',
    text: `During my internship at Creative Solutions, I participated in a variety of UX/UI projects, collaborating with both designers and developers. My responsibilities included conducting user research, creating wireframes, and developing interactive prototypes. I was able to apply my academic knowledge in real-world scenarios, and my mentor provided constructive feedback that helped me refine my skills. One of my main achievements was leading a usability testing session, which resulted in actionable insights for the team. This experience greatly improved my proficiency in Figma and enhanced my communication and teamwork abilities. Overall, the internship deepened my understanding of user-centered design and the importance of iterative development.`,
    highlights: [
      { start: 60, end: 180, color: "#fecaca" }
    ],
    comments: [
      { author: "Dr. Lee", text: "Methodology section is missing.", position: 80 },
      { author: "Dr. Lee", text: "No analysis or reflection provided.", position: 120 }
    ],
    feedback: {
      summary: "Rejected due to missing methodology and analysis.",
      details: "Please include a detailed methodology and reflect on your experience.",
      facultyReason: "Rejected because the report lacks methodology and analysis."
    }
  },
  // PENDING
  {
    reportNumber: 'RPT-008',
    status: 'pending',
    text: `During my internship at Creative Solutions, I participated in a variety of UX/UI projects, collaborating with both designers and developers. My responsibilities included conducting user research, creating wireframes, and developing interactive prototypes. I was able to apply my academic knowledge in real-world scenarios, and my mentor provided constructive feedback that helped me refine my skills. One of my main achievements was leading a usability testing session, which resulted in actionable insights for the team. This experience greatly improved my proficiency in Figma and enhanced my communication and teamwork abilities. Overall, the internship deepened my understanding of user-centered design and the importance of iterative development.`,
    highlights: [],
    comments: [],
    feedback: null
  }
];
