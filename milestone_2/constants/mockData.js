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

// Faculty and SCAD Report Data - shared between both views
export const facultyScadReports = {
  "1": {
    id: "1",
    reportNumber: 'RPT-001',
    title: 'Backend Development Internship Final Report',
    studentName: 'David Lee',
    studentMajor: 'Computer Science',
    companyName: 'TechCorp Inc.',
    submissionDate: '2025-04-15',
    status: 'pending',
    introduction: 'This report outlines my experience as a backend developer intern at TechCorp from January to April 2025. During this period, I worked on server-side development, database optimization, and API design, gaining valuable industry experience.',
    body: 'During my three-month internship at TechCorp Inc., I was assigned to the backend development team working on the company\'s cloud infrastructure services. I worked alongside senior developers and DevOps engineers to improve the scalability and reliability of their microservices architecture.\n\nMy primary responsibilities included implementing new API endpoints, optimizing database queries, and writing unit tests for existing functionality. I also participated in code reviews and daily stand-up meetings, which helped me understand the importance of communication in a professional development environment.\n\nOne of the major projects I contributed to was the optimization of the data retrieval system, which previously experienced performance issues with large datasets. I implemented query optimization techniques and caching strategies that resulted in a 60% improvement in response times.\n\nThe technical skills I gained during this internship include:\n- Node.js and Express.js for API development\n- MongoDB optimization techniques\n- Docker containerization\n- CI/CD pipeline configuration with Jenkins\n- Test-driven development practices\n\nBeyond technical skills, I also developed important professional skills such as project planning, time management, and technical documentation. The experience of working in an agile team taught me how to break down complex problems and collaborate effectively with team members of varying expertise levels.\n\nMy coursework in Database Systems and Advanced Programming provided a solid foundation for this internship. The theoretical concepts I learned were directly applicable to the real-world challenges I faced, particularly when working with database optimization and system architecture.',
    highlights: [
      // { start: 52, end: 122, color: '#FFFBC9' }, // "server-side development, database optimization, and API design"
      // { start: 327, end: 397, color: '#D4F1F9' }, // "improve the scalability and reliability of their microservices architecture"
      // { start: 658, end: 721, color: '#D1F5D3' }  // "resulted in a 60% improvement in response times"
    ],
    comments: [
      // { position: 112, text: "Good focus on key backend skills" },
      // { position: 389, text: "Impressive technical challenge to tackle as an intern" },
      // { position: 695, text: "Quantifiable results - excellent addition to the report!" }
    ],
    feedback: 'This report demonstrates strong technical skills and clear documentation.',
    statusReason: ''
  },
  "2": {
    id: "2",
    reportNumber: 'RPT-002',
    title: 'Frontend Development Internship Final Report',
    studentName: 'Sarah Wilson',
    studentMajor: 'Computer Engineering',
    companyName: 'Web Solutions Ltd.',
    submissionDate: '2025-04-10',
    status: 'flagged',
    introduction: 'This report details my experience as a frontend developer intern at Web Solutions Ltd. from January to March 2025. I worked on user interface design and implementation using modern web technologies like React and TailwindCSS.',
    body: 'During my internship at Web Solutions Ltd., I worked with the frontend development team on various client projects. The company specializes in creating custom web applications for businesses across different industries.\n\nMy main responsibilities included implementing UI components according to design specifications, fixing cross-browser compatibility issues, and optimizing application performance. I collaborated closely with designers and backend developers to ensure seamless integration of all system components.\n\nA significant project I contributed to was the redesign of a healthcare provider\'s patient portal. I implemented responsive components that improved accessibility and user experience, particularly for users with disabilities. This project taught me the importance of inclusive design and adherence to WCAG guidelines.\n\nThroughout the internship, I gained proficiency in:\n- React.js and state management with Redux\n- Styled Components and CSS-in-JS approaches\n- Frontend testing with Jest and React Testing Library\n- Webpack configuration and optimization\n- Client-side performance optimization techniques\n\nThe internship also helped me develop soft skills such as client communication, requirement analysis, and presenting technical concepts to non-technical stakeholders. I learned to balance aesthetic design with technical constraints, which is crucial for successful frontend development.\n\nThe knowledge from my Human-Computer Interaction and Web Development courses proved invaluable during this experience. Understanding usability principles and web standards helped me contribute meaningful improvements to projects right from the start of my internship.',
    highlights: [
      { start: 52, end: 148, color: '#D4F1F9' }, // "user interface design and implementation using modern web technologies like React and TailwindCSS"
      { start: 412, end: 483, color: '#FFDBF2' }, // "optimizing application performance. I collaborated closely with designers"
      { start: 557, end: 642, color: '#FFFBC9' }  // "responsive components that improved accessibility and user experience, particularly"
    ],
    comments: [
      { position: 137, text: "Need more details on specific React features used" },
      { position: 465, text: "Good example of cross-functional collaboration" },
      { position: 642, text: "This section lacks specific examples of accessibility improvements made" }
    ],
    feedback: 'The report shows good UI/UX understanding but lacks detail on accessibility improvements.',
    statusReason: 'Needs clarification on accessibility implementation.'
  },
  "3": {
    id: "3",
    reportNumber: 'RPT-003',
    title: 'Full Stack Developer Internship Final Report',
    studentName: 'Michael Brown',
    studentMajor: 'Computer Science',
    companyName: 'Digital Innovations',
    submissionDate: '2025-04-05',
    status: 'rejected',
    introduction: 'This report summarizes my experience as a full stack developer intern at Digital Innovations from December 2024 to March 2025. I worked on both frontend and backend aspects of web application development for multiple client projects.',
    body: 'My internship at Digital Innovations provided comprehensive exposure to the entire web development stack. As a full stack intern, I rotated between frontend and backend teams to gain experience in all aspects of application development.\n\nOn the frontend, I worked with React and Angular frameworks to build interactive user interfaces. I implemented responsive designs, managed state across complex applications, and optimized components for better performance. On the backend, I developed REST APIs using Node.js and Express, configured database schemas using MongoDB and PostgreSQL, and implemented authentication systems.\n\nA significant achievement during my internship was developing an internal tool that automated the generation of client reports. This tool reduced the time required to create reports by 75% and decreased human error. I was responsible for the entire implementation, from database design to user interface.\n\nThe technical skills I enhanced during this internship include:\n- Full-stack JavaScript development (React, Node.js)\n- Database design and optimization (SQL and NoSQL)\n- OAuth implementation and security best practices\n- GraphQL API development\n- Serverless architecture using AWS Lambda\n\nI also gained valuable insights into project management methodologies, particularly Scrum and Kanban. Participating in sprint planning, daily stand-ups, and retrospectives helped me understand how to prioritize tasks and contribute effectively to team goals.\n\nThe combination of my Software Engineering and Cloud Computing courses provided excellent preparation for this internship. The concepts of system design, clean code practices, and distributed computing were directly applicable to the work I performed at Digital Innovations.',
    highlights: [
      { start: 241, end: 302, color: '#D1F5D3' }, // "I implemented responsive designs, managed state across complex"
      { start: 472, end: 572, color: '#FFFBC9' }, // "developing an internal tool that automated the generation of client reports. This tool reduced"
      { start: 577, end: 607, color: '#FFDBF2' }  // "by 75% and decreased human error"
    ],
    comments: [
      { position: 98, text: "Report is vague about specific project contributions" },
      { position: 313, text: "No concrete examples of state management implementation" },
      { position: 607, text: "Claims appear exaggerated without supporting evidence" }
    ],
    feedback: 'Report is vague about specific project contributions. Please provide more concrete examples.',
    statusReason: 'Did not meet the minimum requirements.'
  },
  "4": {
    id: "4",
    reportNumber: 'RPT-004',
    title: 'Data Science Internship Final Report',
    studentName: 'Emma Johnson',
    studentMajor: 'Information Systems',
    companyName: 'Data Insights Corp',
    submissionDate: '2025-04-12',
    status: 'accepted',
    introduction: 'This report documents my data science internship at Data Insights Corp from February to April 2025. During this time, I worked on data analysis, machine learning model development, and data visualization projects.',
    body: 'My internship at Data Insights Corp allowed me to apply theoretical knowledge to practical data science challenges. I was part of a specialized team focused on building predictive analytics solutions for retail clients.\n\nMy primary responsibilities included cleaning and preprocessing large datasets, implementing machine learning algorithms, and creating interactive dashboards to visualize insights. I collaborated with data engineers to ensure proper data pipelines and with business analysts to align technical solutions with client needs.\n\nA key project I contributed to was developing a customer segmentation model for a major retail chain. Using clustering algorithms and behavioral analysis, I helped identify distinct customer segments that informed the client\'s marketing strategy. My model achieved a 25% improvement in campaign conversion rates during initial testing.\n\nThrough this internship, I enhanced my skills in:\n- Python data science libraries (Pandas, NumPy, Scikit-learn)\n- Statistical analysis and hypothesis testing\n- Machine learning model development and validation\n- Data visualization with Tableau and Matplotlib\n- Big data processing using Spark\n\nBeyond technical skills, I improved my ability to communicate complex analyses to non-technical stakeholders. Translating data insights into actionable business recommendations was a significant learning experience.\n\nMy Statistical Methods and Machine Learning coursework provided essential foundations for this internship. Understanding the mathematical principles behind algorithms helped me make informed choices when selecting and tuning models for specific business problems.',
    highlights: [
      { start: 354, end: 428, color: '#D4F1F9' }, // "creating interactive dashboards to visualize insights. I collaborated with"
      { start: 571, end: 662, color: '#D1F5D3' }, // "customer segments that informed the client\'s marketing strategy. My model achieved a 25%"
      { start: 811, end: 881, color: '#FFDBF2' }  // "Statistical analysis and hypothesis testing"
    ],
    comments: [
      { position: 428, text: "Excellent cross-functional collaboration example" },
      { position: 662, text: "Great quantifiable result with business impact" }
    ],
    feedback: 'Excellent application of data science concepts and clear business impact.',
    statusReason: ''
  },
  "5": {
    id: "5",
    reportNumber: 'RPT-005',
    title: 'Mobile App Development Internship Report',
    studentName: 'James Rodriguez',
    studentMajor: 'Software Engineering',
    companyName: 'AppWorks Inc.',
    submissionDate: '2025-04-08',
    status: 'pending',
    introduction: 'This report details my experience as a mobile application development intern at AppWorks Inc. from January to March 2025, where I contributed to the development of cross-platform mobile applications using React Native.',
    body: 'During my internship at AppWorks Inc., I worked with the mobile development team on creating and enhancing applications for both iOS and Android platforms. The company focuses on delivering high-quality mobile solutions for clients in various industries including healthcare, finance, and retail.\n\nMy main responsibilities included implementing new features, fixing bugs, writing unit tests, and optimizing application performance. I participated in the entire development lifecycle, from initial planning and design discussions to deployment and user feedback analysis.\n\nA major project I worked on was a health and fitness tracking application that interfaced with wearable devices. I implemented the Bluetooth connectivity module and developed a real-time data synchronization system that maintained data integrity even with intermittent connectivity. This feature received positive feedback from beta testers and was highlighted in the product release notes.\n\nThrough this internship, I gained proficiency in:\n- React Native and cross-platform development\n- State management using Redux and Context API\n- Native module integration on iOS and Android\n- Automated testing for mobile applications\n- Continuous integration for mobile deployment\n\nThe internship also taught me valuable lessons about mobile UX design considerations, performance optimization for resource-constrained devices, and the importance of thorough testing across different device configurations.\n\nMy Mobile Application Development and UI/UX Design courses provided excellent theoretical background for this internship. Understanding platform-specific design guidelines and development constraints helped me contribute effectively from the beginning of my internship.',
    highlights: [
      // { start: 133, end: 183, color: '#FFFBC9' }, // "cross-platform mobile applications using React Native"
      // { start: 532, end: 662, color: '#D1F5D3' }, // "Bluetooth connectivity module and developed a real-time data synchronization system that maintained data integrity"
      // { start: 1021, end: 1121, color: '#D4F1F9' }  // "performance optimization for resource-constrained devices, and the importance of thorough testing"
    ],
    comments: [
      // { position: 183, text: "Good technology choice for the project requirements" },
      // { position: 622, text: "Excellent technical solution for a challenging problem" },
      // { position: 1121, text: "Shows good understanding of mobile development constraints" }
    ],
    feedback: 'Good technology choice and strong technical solution for mobile development.',
    statusReason: ''
  },
  "6": {
    id: "6",
    reportNumber: 'RPT-006',
    title: 'UX/UI Design Internship Final Report',
    studentName: 'Olivia Chen',
    studentMajor: 'Information Systems',
    companyName: 'Creative Solutions',
    submissionDate: '2025-04-17',
    status: 'accepted',
    introduction: 'This report outlines my experience as a UX/UI design intern at Creative Solutions from January to April 2025, where I worked on various digital product design projects and user experience research initiatives.',
    body: 'During my internship at Creative Solutions, I participated in a variety of UX/UI projects, collaborating with both designers and developers. My responsibilities included conducting user research, creating wireframes, and developing interactive prototypes. I was able to apply my academic knowledge in real-world scenarios, and my mentor provided constructive feedback that helped me refine my skills.\n\nOne of my main achievements was leading a usability testing session, which resulted in actionable insights for the team. This experience greatly improved my proficiency in Figma and enhanced my communication and teamwork abilities. Overall, the internship deepened my understanding of user-centered design and the importance of iterative development.\n\nI worked on the redesign of an e-commerce application, focusing on improving the checkout process to reduce cart abandonment. Through user interviews and journey mapping, I identified key pain points and proposed design solutions that resulted in a 15% decrease in abandonment rate during A/B testing.\n\nThe technical skills I developed during this internship include:\n- Proficiency in design tools (Figma, Adobe XD)\n- User research methodologies and usability testing\n- Information architecture and interaction design\n- Design system creation and maintenance\n- Prototyping and design handoff to development teams\n\nI also gained valuable experience in collaborating with cross-functional teams, presenting design decisions to stakeholders, and balancing user needs with business requirements.\n\nMy User Experience Design and Human-Computer Interaction courses provided a strong foundation for this internship. The principles of cognitive psychology, usability heuristics, and design thinking methodologies were directly applicable to my daily work at Creative Solutions.',
    highlights: [
      { start: 204, end: 292, color: '#FFDBF2' }, // "creating wireframes, and developing interactive prototypes. I was able to apply my academic knowledge"
      { start: 457, end: 597, color: '#D1F5D3' }, // "deepened my understanding of user-centered design and the importance of iterative development.\n\nI worked on the redesign of an e-commerce application"
      { start: 732, end: 812, color: '#FFFBC9' }  // "resulted in a 15% decrease in abandonment rate during A/B testing"
    ],
    comments: [
      { position: 292, text: "Great application of academic concepts" },
      { position: 562, text: "Excellent practical application of UX principles" },
      { position: 812, text: "Impressive measurable business impact" }
    ],
    feedback: 'Great application of academic concepts and impressive measurable business impact.',
    statusReason: ''
  }
};

// Retain other exports
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
  // ...rest of the original reports...
];


//Courses by Major:

export const CSEN_Courses = [
  'Software Engineering',
  'Databses I',
  'Databases II',
  'Introduction to Communication Networks',
  'Data Structures and Algorithms'
]

export const DMET_Courses = [
  'Computer Graphics',
  'Introduction to Media Engineering',
  'Web Technologies and Usability',
  'Visualization and Animation'
]

export const BioTech_Courses = [
  'Physiology and Anatomy I',
  'Physical Chemistry',
  'General and Pharmaceutical Microbiology',
  'Physiology and Anatomy II',
]

export const Law_Courses = [
  'Introduction to Common Law',
  'The Constitutional Law',
  'Criminology and Penology',
  'Civil Law',
  'Criminal Law'
]