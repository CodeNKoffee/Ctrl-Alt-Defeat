// Sample workshop data
export const sampleWorkshops = [
  {
    id: "ws1",
    title: "Introduction to Machine Learning",
    description: "Learn the fundamentals of machine learning algorithms and techniques in this introductory workshop. We'll cover basic concepts, supervised and unsupervised learning, and practical applications.",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours later
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80",
    instructor: "Dr. Sarah Johnson",
    instructorBio: "Data Science Lead at TechCorp with 15+ years of experience in machine learning and AI. PhD in Computer Science from MIT.",
    instructorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80",
    category: "TECHNOLOGY",
    agenda: [
      "Introduction to ML concepts",
      "Supervised vs. Unsupervised Learning",
      "Data preprocessing techniques",
      "Building your first ML model",
      "Q&A and practical examples"
    ],
    location: "Online",
    maxAttendees: 50
  },
  {
    id: "ws2",
    title: "Resume Building Workshop",
    description: "Craft a standout resume that gets you noticed by recruiters and hiring managers. This workshop covers modern resume formats, content strategies, and tailoring your resume for specific roles.",
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80",
    instructor: "Mark Reynolds",
    instructorBio: "Career Coach and former HR Director with experience at Fortune 500 companies. Helped over 1,000 professionals land their dream jobs.",
    instructorImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80",
    category: "CAREER",
    agenda: [
      "Modern resume formats and structures",
      "Highlighting your achievements effectively",
      "ATS optimization techniques",
      "Common resume mistakes to avoid",
      "Tailoring your resume for specific roles"
    ],
    location: "Online",
    maxAttendees: 30
  },
  {
    id: "ws3",
    title: "Effective Technical Interview Preparation",
    description: "Prepare for technical interviews with confidence. This workshop covers common coding challenges, system design questions, and behavioral interview techniques specific to tech roles.",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours later
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80",
    instructor: "Alex Chen",
    instructorBio: "Senior Software Engineer at GoogleX with experience interviewing hundreds of candidates. Previously worked at Facebook and Amazon.",
    instructorImage: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80",
    category: "TECHNOLOGY",
    agenda: [
      "Technical interview overview and types",
      "Data structures and algorithms review",
      "System design interview approach",
      "Behavioral question strategies",
      "Mock interview practice"
    ],
    location: "Online",
    maxAttendees: 20
  },
  {
    id: "ws4",
    title: "Leadership Development for New Managers",
    description: "Transition successfully from individual contributor to effective manager. Learn essential leadership skills, team management techniques, and strategies for navigating common challenges.",
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours later
    imageUrl: "https://images.unsplash.com/photo-1557425955-df376b5903c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80",
    instructor: "Dr. Lisa Martinez",
    instructorBio: "Executive Coach and Leadership Development Expert with 20+ years of experience training managers at multinational companies.",
    instructorImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80",
    category: "LEADERSHIP",
    agenda: [
      "Transitioning from contributor to manager",
      "Building and leading effective teams",
      "Giving constructive feedback",
      "Managing difficult conversations",
      "Strategic planning and goal setting"
    ],
    location: "Online",
    maxAttendees: 25
  }
]; 