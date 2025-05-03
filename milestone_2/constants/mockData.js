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
  student: {
    email: "student@example.com",
    password: "student123",
    name: "Student User",
    role: "student",
    id: "student_001"
  }
};

// Mock companies data for SCAD dashboard
export const MOCK_COMPANIES = [
  {
    id: "comp_001",
    name: "Tech Solutions Inc.",
    alt: "Tech Solutions Inc.",
    email: "contact@techsolutions.com",
    logo: "/images/company-logo-1.png",
    industry: "Information Technology",
    size: "Large (101-500 employees)",
    documentation: [
      { type: "registration", url: "/docs/reg1.pdf" },
      { type: "taxCard", url: "/docs/tax1.pdf" }
    ],
    status: "pending"
  },
  {
    id: "comp_002",
    name: "Innovate Labs",
    alt: "Innovate Labs",
    email: "info@innovatelabs.com",
    logo: "/images/company-logo-2.png",
    industry: "Research & Development",
    size: "Medium (51-100 employees)",
    documentation: [
      { type: "registration", url: "/docs/reg2.pdf" },
      { type: "taxId", url: "/docs/tax2.pdf" }
    ],
    status: "pending"
  },
  {
    id: "comp_003",
    name: "Tawabiry",
    alt: "Tawabiry",
    email: "contact-us@tawabiry.com",
    logo: "/logos/tawabiry.png",
    industry: "Software as a Service (SaaS)",
    size: "Small (1-50 employees)",
    documentation: [
      { type: "registration", url: "/docs/reg3.pdf" },
      { type: "taxId", url: "/docs/tax3.pdf" }
    ],
    status: "pending"
  }
];
