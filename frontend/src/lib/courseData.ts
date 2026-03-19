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
  stripeProductId?: string;
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
  youtubeVideoId?: string; // single embeddable video per course
}

export const courses: CourseData[] = [
  {
    id: 1, title: "Complete AI & Machine Learning Bootcamp 2025", instructor: "Dr. Sarah Chen",
    rating: 4.9, students: "142K", duration: "52h", price: "$12.99", originalPrice: "$89.99",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
    category: "Artificial Intelligence", bestseller: true, level: "Beginner",
    isFree: false, stripeProductId: "price_AI_BOOTCAMP_2025",
  },
  {
    id: 2, title: "MERN Stack: Full-Stack Web Development Masterclass", instructor: "Hitesh Choudhary",
    rating: 4.8, students: "98K", duration: "48h", price: "$0", originalPrice: "$79.99",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&q=80",
    category: "Web Development", bestseller: true, level: "Intermediate",
    isFree: true,
  },
  {
    id: 3, title: "AWS Solutions Architect – Professional Certification", instructor: "Priya Patel",
    rating: 4.7, students: "67K", duration: "38h", price: "$14.99", originalPrice: "$99.99",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    category: "Cloud Computing", bestseller: false, level: "Advanced",
    isFree: false, stripeProductId: "price_AWS_ARCHITECT",
  },
  {
    id: 4, title: "Deep Learning with PyTorch & Transformers", instructor: "Alex Kim",
    rating: 4.9, students: "53K", duration: "42h", price: "$13.99", originalPrice: "$94.99",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&q=80",
    category: "Artificial Intelligence", bestseller: true, level: "Advanced",
    isFree: false, stripeProductId: "price_DEEP_LEARNING_PT",
  },
  {
    id: 5, title: "Next.js & React – The Complete Guide (2025)", instructor: "Hitesh Choudhary",
    rating: 4.8, students: "115K", duration: "44h", price: "$10.99", originalPrice: "$84.99",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80",
    category: "Web Development", bestseller: false, level: "Beginner",
    isFree: false, stripeProductId: "price_NEXTJS_COMPLETE",
  },
  {
    id: 6, title: "Kubernetes & Docker: DevOps Deployment Mastery", instructor: "Hitesh Choudhary",
    rating: 4.7, students: "45K", duration: "34h", price: "$12.99", originalPrice: "$74.99",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&q=80",
    category: "Cloud Computing", bestseller: false, level: "Intermediate",
    isFree: false, stripeProductId: "price_K8S_DOCKER",
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
    // freeCodeCamp - Machine Learning with Python full course
    youtubeVideoId: "i_LwzRVP7bg",
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
    description: "Become a full-stack developer with the MERN stack. Build and deploy production-grade applications using MongoDB, Express.js, React, and Node.js. Includes authentication, payments, real-time features, and deployment to AWS.",
    instructorBio: "Hitesh Choudhary is a full-stack developer, educator, and founder of Chai aur Code. With millions of YouTube subscribers and a passion for teaching, he breaks down complex web development concepts into practical, beginner-friendly lessons.",
    instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    instructorCourses: 5,
    instructorStudents: "210K",
    lastUpdated: "February 2025",
    language: "Hindi / English",
    subtitles: ["English", "Hindi"],
    // Chai aur Code - confirmed embeddable video
    youtubeVideoId: "O6P86uwfdR0",
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
      { name: "Emily W.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80", rating: 5, date: "3 weeks ago", comment: "Hitesh is an incredible instructor. I built my first full-stack app and landed a junior dev role within 3 months!" },
      { name: "Raj M.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80", rating: 5, date: "1 month ago", comment: "Very practical and project-driven. The deployment section alone was worth the price." },
    ],
  },
  3: {
    ...courses[2],
    description: "Prepare for the AWS Solutions Architect Professional exam with hands-on labs, real-world architecture scenarios, and deep dives into all major AWS services. Covers VPC, IAM, EC2, S3, RDS, Lambda, and more.",
    instructorBio: "Priya Patel is a certified AWS Solutions Architect with 8+ years of cloud infrastructure experience. She has helped hundreds of engineers pass AWS certifications and architect production-grade cloud systems.",
    instructorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    instructorCourses: 4,
    instructorStudents: "130K",
    lastUpdated: "January 2025",
    language: "English",
    subtitles: ["English", "Hindi"],
    // freeCodeCamp - AWS Certified Cloud Practitioner full course
    youtubeVideoId: "ulprqHHWlng",
    whatYouLearn: [
      "Design highly available, fault-tolerant AWS architectures",
      "Master VPC, subnets, security groups, and IAM",
      "Deploy scalable applications with EC2, ECS, and Lambda",
      "Set up CI/CD pipelines with CodePipeline and GitHub Actions",
      "Configure RDS, DynamoDB, and ElastiCache",
      "Pass the AWS Solutions Architect Professional exam",
    ],
    curriculum: [
      { section: "AWS Fundamentals", lessons: [
        { title: "AWS Global Infrastructure", duration: "20min" },
        { title: "IAM: Users, Roles & Policies", duration: "45min" },
        { title: "VPC Deep Dive", duration: "55min" },
      ]},
      { section: "Compute & Storage", lessons: [
        { title: "EC2 Instance Types & AMIs", duration: "40min" },
        { title: "S3, Glacier & Storage Gateway", duration: "38min" },
        { title: "Lambda & Serverless Architecture", duration: "50min" },
      ]},
      { section: "Databases & Networking", lessons: [
        { title: "RDS Multi-AZ & Read Replicas", duration: "42min" },
        { title: "DynamoDB Design Patterns", duration: "48min" },
        { title: "CloudFront & Route 53", duration: "35min" },
      ]},
    ],
    reviews: [
      { name: "Vikram S.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80", rating: 5, date: "1 week ago", comment: "Passed my AWS exam on the first attempt! The VPC and IAM explanations are the clearest I've found anywhere." },
      { name: "Neha R.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80", rating: 4, date: "3 weeks ago", comment: "Excellent course. The hands-on labs really solidified the concepts for me." },
    ],
  },
  4: {
    ...courses[3],
    description: "Go deep into neural networks, PyTorch, and transformer architectures. Build models from scratch, fine-tune LLMs, and deploy deep learning solutions. Includes projects on image classification, NLP, and generative AI.",
    instructorBio: "Alex Kim is a research engineer with experience at DeepMind and OpenAI. He specializes in transformer architectures and has contributed to several open-source deep learning libraries.",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    instructorCourses: 6,
    instructorStudents: "98K",
    lastUpdated: "February 2025",
    language: "English",
    subtitles: ["English", "Korean", "Japanese"],
    // freeCodeCamp - PyTorch for Deep Learning full course
    youtubeVideoId: "V_xro1bcAuA",
    whatYouLearn: [
      "Master PyTorch from tensors to production models",
      "Build transformer models from scratch",
      "Fine-tune BERT, GPT-2, and LLaMA",
      "Computer vision with ResNet and ViT",
      "Deploy models with FastAPI and Docker",
      "Understand attention mechanisms deeply",
    ],
    curriculum: [
      { section: "PyTorch Foundations", lessons: [
        { title: "Tensors & Autograd", duration: "40min" },
        { title: "Building Neural Nets with nn.Module", duration: "50min" },
        { title: "Training Loop & Optimizers", duration: "45min" },
      ]},
      { section: "Computer Vision", lessons: [
        { title: "CNNs & Transfer Learning", duration: "55min" },
        { title: "Object Detection with YOLO", duration: "60min" },
        { title: "Vision Transformers (ViT)", duration: "48min" },
      ]},
      { section: "NLP & Transformers", lessons: [
        { title: "Attention Mechanism from Scratch", duration: "65min" },
        { title: "Fine-tuning BERT for Classification", duration: "55min" },
        { title: "Building a Mini GPT", duration: "70min" },
      ]},
    ],
    reviews: [
      { name: "James L.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80", rating: 5, date: "5 days ago", comment: "Finally understand attention mechanisms! The from-scratch implementations are incredible for building real intuition." },
      { name: "Priya M.", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80", rating: 5, date: "2 weeks ago", comment: "Best deep learning course I've taken. The transformer section alone is worth the price." },
    ],
  },
  5: {
    ...courses[4],
    description: "Master Next.js 14 and React with hands-on projects. Learn server components, app router, server actions, authentication, and deployment. Build production-ready full-stack apps with modern React patterns.",
    instructorBio: "Hitesh Choudhary is a full-stack developer, educator, and founder of Chai aur Code. With millions of YouTube subscribers and a passion for teaching, he breaks down complex web development concepts into practical, beginner-friendly lessons.",
    instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    instructorCourses: 5,
    instructorStudents: "210K",
    lastUpdated: "March 2025",
    language: "Hindi / English",
    subtitles: ["English", "Hindi"],
    // Traversy Media - Next.js crash course (embeds fine)
    youtubeVideoId: "mTz0GXj8NN0",
    whatYouLearn: [
      "Build full-stack apps with Next.js 14 App Router",
      "Master React Server Components and Server Actions",
      "Implement authentication with NextAuth.js",
      "Style with Tailwind CSS and shadcn/ui",
      "Deploy to Vercel with CI/CD",
      "Optimize performance with caching and ISR",
    ],
    curriculum: [
      { section: "React Foundations", lessons: [
        { title: "JSX, Components & Props", duration: "35min" },
        { title: "Hooks: useState, useEffect, useRef", duration: "50min" },
        { title: "Context API & State Management", duration: "42min" },
      ]},
      { section: "Next.js App Router", lessons: [
        { title: "File-based Routing & Layouts", duration: "38min" },
        { title: "Server vs Client Components", duration: "45min" },
        { title: "Data Fetching & Caching", duration: "52min" },
        { title: "Server Actions & Forms", duration: "40min" },
      ]},
      { section: "Full-Stack Features", lessons: [
        { title: "Authentication with NextAuth", duration: "55min" },
        { title: "Database with Prisma & PostgreSQL", duration: "60min" },
        { title: "Deployment & Performance", duration: "35min" },
      ]},
    ],
    reviews: [
      { name: "Ananya S.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", rating: 5, date: "1 week ago", comment: "Built and deployed my portfolio in a week after starting this course!" },
      { name: "Rohit K.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", rating: 5, date: "2 weeks ago", comment: "The server components section finally made everything click for me. Highly recommended." },
    ],
  },
  6: {
    ...courses[5],
    description: "Learn Docker and Kubernetes from the ground up. Containerize applications, orchestrate microservices, set up CI/CD pipelines, and deploy to production Kubernetes clusters on AWS EKS and Google GKE.",
    instructorBio: "Hitesh Choudhary is a full-stack developer, educator, and founder of Chai aur Code. With millions of YouTube subscribers and a passion for teaching, he breaks down complex web development concepts into practical, beginner-friendly lessons.",
    instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    instructorCourses: 5,
    instructorStudents: "210K",
    lastUpdated: "January 2025",
    language: "Hindi / English",
    subtitles: ["English", "Hindi"],
    // TechWorld with Nana - Docker full course (embeds fine)
    youtubeVideoId: "3c-iBn73dDE",
    whatYouLearn: [
      "Containerize any application with Docker",
      "Write production-grade Dockerfiles and Compose files",
      "Deploy and scale with Kubernetes",
      "Set up Helm charts and GitOps workflows",
      "Monitor with Prometheus and Grafana",
      "Configure CI/CD with GitHub Actions",
    ],
    curriculum: [
      { section: "Docker Fundamentals", lessons: [
        { title: "Containers vs VMs", duration: "25min" },
        { title: "Writing Dockerfiles", duration: "40min" },
        { title: "Docker Compose for Multi-service Apps", duration: "45min" },
        { title: "Docker Networking & Volumes", duration: "38min" },
      ]},
      { section: "Kubernetes Core", lessons: [
        { title: "Pods, Deployments & Services", duration: "50min" },
        { title: "ConfigMaps, Secrets & Ingress", duration: "42min" },
        { title: "Persistent Volumes & StatefulSets", duration: "48min" },
      ]},
      { section: "Production & CI/CD", lessons: [
        { title: "Helm Charts & Package Management", duration: "40min" },
        { title: "GitHub Actions Pipeline", duration: "45min" },
        { title: "Deploying to AWS EKS", duration: "55min" },
      ]},
    ],
    reviews: [
      { name: "Suresh P.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80", rating: 5, date: "3 days ago", comment: "Went from zero Kubernetes knowledge to deploying microservices on EKS. Excellent hands-on approach." },
      { name: "Meera J.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80", rating: 4, date: "1 month ago", comment: "Great course. The Docker Compose section saved me hours at work the very next day." },
    ],
  },
};

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