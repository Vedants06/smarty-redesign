export interface CourseData {
  id: number;
  title: string;
  instructor: string;
  rating: number;
  students: string;
  duration: string;
  price: string;
  originalPrice: string;
  image: string;
  category: string;
  bestseller?: boolean;
  level: string;
  isFree: boolean;
  stripeProductId?: string; // Stripe Price ID — set for all paid courses
}

export interface CourseDetail extends CourseData {
  description: string;
  instructorBio: string;
  instructorAvatar: string;
  instructorCourses: number;
  instructorStudents: string;
  curriculum: { section: string; lessons: { title: string; duration: string }[] }[];
  reviews: { name: string; avatar: string; rating: number; date: string; comment: string }[];
  lastUpdated: string;
  language: string;
  subtitles: string[];
  whatYouLearn: string[];
  youtubePlaylistId?: string; // YouTube playlist ID — used when user has access
}

export const courses: CourseData[] = [
  {
    id: 1, title: "Complete AI & Machine Learning Bootcamp 2025", instructor: "Dr. Sarah Chen",
    rating: 4.9, students: "142K", duration: "52h", price: "$12.99", originalPrice: "$89.99",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
    category: "Artificial Intelligence", bestseller: true, level: "Beginner",
    isFree: false,
    stripeProductId: "price_AI_BOOTCAMP_2025", // Replace with real Stripe Price ID
  },
  {
    id: 2, title: "MERN Stack: Full-Stack Web Development Masterclass", instructor: "Hitesh Choudhary",
    rating: 4.8, students: "98K", duration: "48h", price: "$0", originalPrice: "$79.99",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&q=80",
    category: "Web Development", bestseller: true, level: "Intermediate",
    isFree: true,
    // No stripeProductId — free course
  },
  {
    id: 3, title: "AWS Solutions Architect – Professional Certification", instructor: "Priya Patel",
    rating: 4.7, students: "67K", duration: "38h", price: "$14.99", originalPrice: "$99.99",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    category: "Cloud Computing", bestseller: false, level: "Advanced",
    isFree: false,
    stripeProductId: "price_AWS_ARCHITECT", // Replace with real Stripe Price ID
  },
  {
    id: 4, title: "Deep Learning with PyTorch & Transformers", instructor: "Alex Kim",
    rating: 4.9, students: "53K", duration: "42h", price: "$13.99", originalPrice: "$94.99",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&q=80",
    category: "Artificial Intelligence", bestseller: true, level: "Advanced",
    isFree: false,
    stripeProductId: "price_DEEP_LEARNING_PT", // Replace with real Stripe Price ID
  },
  {
    id: 5, title: "Next.js & React – The Complete Guide (2025)", instructor: "Maria Santos",
    rating: 4.8, students: "115K", duration: "44h", price: "$10.99", originalPrice: "$84.99",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80",
    category: "Web Development", bestseller: false, level: "Beginner",
    isFree: false,
    stripeProductId: "price_NEXTJS_COMPLETE", // Replace with real Stripe Price ID
  },
  {
    id: 6, title: "Kubernetes & Docker: DevOps Deployment Mastery", instructor: "David Okonkwo",
    rating: 4.7, students: "45K", duration: "34h", price: "$12.99", originalPrice: "$74.99",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&q=80",
    category: "Cloud Computing", bestseller: false, level: "Intermediate",
    isFree: false,
    stripeProductId: "price_K8S_DOCKER", // Replace with real Stripe Price ID
  },
];

export const courseDetails: Record<number, CourseDetail> = {
  1: {
    ...courses[0],
    description: "Master AI and Machine Learning from scratch. This comprehensive bootcamp covers everything from Python fundamentals to advanced deep learning architectures, including GPT, diffusion models, and reinforcement learning. Build 15+ real-world projects with hands-on labs.",
    instructorBio: "Dr. Sarah Chen is a former Google Brain researcher with 12+ years of experience in AI/ML. She holds a PhD in Computer Science from Stanford and has published 40+ papers in top-tier conferences including NeurIPS and ICML.",
    instructorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
    instructorCourses: 8,
    instructorStudents: "320K",
    lastUpdated: "March 2025",
    language: "English",
    subtitles: ["English", "Spanish", "Hindi", "Japanese"],
    whatYouLearn: [
      "Build production-ready ML models from scratch",
      "Master PyTorch, TensorFlow, and scikit-learn",
      "Understand Transformer architectures and LLMs",
      "Deploy models to cloud with MLOps pipelines",
      "Build and fine-tune GPT-style models",
      "Computer Vision with CNNs and diffusion models",
    ],
    curriculum: [
      { section: "Getting Started with Python & Math", lessons: [
        { title: "Course Overview & Setup", duration: "12min" },
        { title: "Python Crash Course for ML", duration: "45min" },
        { title: "Linear Algebra Essentials", duration: "38min" },
        { title: "Probability & Statistics Refresher", duration: "42min" },
      ]},
      { section: "Machine Learning Fundamentals", lessons: [
        { title: "Supervised vs Unsupervised Learning", duration: "28min" },
        { title: "Linear & Logistic Regression", duration: "55min" },
        { title: "Decision Trees & Random Forests", duration: "48min" },
        { title: "Model Evaluation & Metrics", duration: "35min" },
      ]},
      { section: "Deep Learning & Neural Networks", lessons: [
        { title: "Neural Network Architecture", duration: "52min" },
        { title: "Backpropagation Deep Dive", duration: "40min" },
        { title: "CNNs for Computer Vision", duration: "58min" },
        { title: "RNNs and LSTMs", duration: "45min" },
      ]},
      { section: "Transformers & LLMs", lessons: [
        { title: "Attention is All You Need", duration: "50min" },
        { title: "Building GPT from Scratch", duration: "65min" },
        { title: "Fine-tuning Large Language Models", duration: "55min" },
        { title: "Prompt Engineering & RAG", duration: "42min" },
      ]},
    ],
    reviews: [
      { name: "Michael T.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", rating: 5, date: "2 weeks ago", comment: "The best ML course I've ever taken. Dr. Chen explains complex concepts with incredible clarity. The project-based approach made everything click." },
      { name: "Aisha K.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", rating: 5, date: "1 month ago", comment: "Went from zero ML knowledge to building my own transformer model. The curriculum is extremely well-structured and up-to-date." },
      { name: "Carlos R.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80", rating: 4, date: "1 month ago", comment: "Excellent content and great pacing. I wish there were a few more exercises in the early sections, but overall outstanding quality." },
    ],
  },
  2: {
    ...courses[1],
    description: "Become a full-stack developer with the MERN stack. Build and deploy production-grade applications using MongoDB, Express.js, React, and Node.js. Includes authentication, payments, real-time features, and deployment to AWS. This course uses the Chai aur Code MERN playlist — completely free, no payment required.",
    instructorBio: "Hitesh Choudhary is a full-stack developer, educator, and founder of Chai aur Code. With millions of YouTube subscribers and a passion for teaching, he breaks down complex web development concepts into practical, beginner-friendly lessons.",
    instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    instructorCourses: 5,
    instructorStudents: "210K",
    lastUpdated: "February 2025",
    language: "Hindi / English",
    subtitles: ["English", "Hindi"],
    // Chai aur Code - Complete MERN Stack playlist
    // https://www.youtube.com/playlist?list=PLu71SKxNbfoBGh_8p_NS-ZAh6463zF8dN
    youtubePlaylistId: "PLu71SKxNbfoBGh_8p_NS-ZAh6463zF8dN",
    whatYouLearn: [
      "Build full-stack apps with MongoDB, Express, React, Node",
      "Implement JWT authentication and OAuth",
      "Create RESTful APIs and GraphQL endpoints",
      "Deploy to AWS with CI/CD pipelines",
      "Real-time features with WebSockets",
      "Payment integration with Stripe",
    ],
    curriculum: [
      { section: "Project Setup & Tooling", lessons: [
        { title: "Environment Setup & VS Code Config", duration: "15min" },
        { title: "Git Workflow & Best Practices", duration: "22min" },
        { title: "Project Architecture Overview", duration: "18min" },
      ]},
      { section: "Backend with Node.js & Express", lessons: [
        { title: "Building RESTful APIs", duration: "50min" },
        { title: "MongoDB & Mongoose ODM", duration: "55min" },
        { title: "Authentication with JWT", duration: "48min" },
        { title: "Error Handling & Middleware", duration: "35min" },
      ]},
      { section: "Frontend with React", lessons: [
        { title: "React Fundamentals & Hooks", duration: "60min" },
        { title: "State Management Patterns", duration: "45min" },
        { title: "Routing & Protected Routes", duration: "38min" },
        { title: "API Integration & Data Fetching", duration: "42min" },
      ]},
    ],
    reviews: [
      { name: "Emily W.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80", rating: 5, date: "3 weeks ago", comment: "James is an incredible instructor. I built my first full-stack app and landed a junior dev role within 3 months of completing this course!" },
      { name: "Raj M.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80", rating: 5, date: "1 month ago", comment: "Very practical and project-driven. The deployment section alone was worth the price." },
    ],
  },
};

// For courses without full details, generate a sensible fallback
export function getCourseDetail(id: number): CourseDetail | null {
  if (courseDetails[id]) return courseDetails[id];
  const course = courses.find(c => c.id === id);
  if (!course) return null;
  return {
    ...course,
    description: `A comprehensive course on ${course.category}. Learn everything you need to know about ${course.title.toLowerCase()} with hands-on projects and real-world applications.`,
    instructorBio: `${course.instructor} is an experienced educator and industry professional with extensive knowledge in ${course.category}.`,
    instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    instructorCourses: 4,
    instructorStudents: course.students,
    lastUpdated: "January 2025",
    language: "English",
    subtitles: ["English"],
    whatYouLearn: [
      `Master core ${course.category} concepts`,
      "Build real-world projects from scratch",
      "Industry best practices and patterns",
      "Prepare for professional certification",
    ],
    curriculum: [
      { section: "Introduction", lessons: [
        { title: "Course Overview", duration: "10min" },
        { title: "Setting Up Your Environment", duration: "20min" },
      ]},
      { section: "Core Concepts", lessons: [
        { title: "Fundamentals Deep Dive", duration: "45min" },
        { title: "Hands-on Lab 1", duration: "35min" },
        { title: "Advanced Techniques", duration: "50min" },
      ]},
    ],
    reviews: [
      { name: "Student", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80", rating: 5, date: "2 weeks ago", comment: "Great course with clear explanations and practical projects." },
    ],
  };
}