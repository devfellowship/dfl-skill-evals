import type { Challenge, DifficultyLevel } from "@/types"

export const mockChallenges: Challenge[] = [
  {
    id: 1,
    title: "Full-Stack JavaScript Challenge",
    description:
      "Test your React, Node.js, and database skills with real-world scenarios including authentication, API design, and data modeling",
    skills: ["React", "Node.js", "MongoDB", "REST APIs"],
    difficulty: 4,
    duration: "90 min",
    problems: 5,
    participants: 1247,
    rating: 4.8,
    category: "Full-Stack",
    trending: true,
    image: "https://techdicas.net.br/wp-content/uploads/2024/12/full-stack.webp",
  },
  {
    id: 2,
    title: "Python Data Structures & Algorithms",
    description:
      "Core CS fundamentals with Python implementation, covering arrays, linked lists, trees, graphs, and dynamic programming",
    skills: ["Python", "Algorithms", "Data Structures"],
    difficulty: 3,
    duration: "60 min",
    problems: 4,
    participants: 2156,
    rating: 4.9,
    category: "Algorithms",
    trending: false,
  },
  {
    id: 3,
    title: "System Design Fundamentals",
    description:
      "Design scalable systems and architecture patterns including load balancing, caching, and microservices",
    skills: ["System Design", "Architecture", "Scalability"],
    difficulty: 5,
    duration: "120 min",
    problems: 3,
    participants: 892,
    rating: 4.7,
    category: "System Design",
    trending: true,
  },
  {
    id: 4,
    title: "Frontend React Mastery",
    description: "Advanced React patterns, hooks, performance optimization, and modern development practices",
    skills: ["React", "TypeScript", "Performance", "Testing"],
    difficulty: 4,
    duration: "75 min",
    problems: 4,
    participants: 1543,
    rating: 4.8,
    category: "Frontend",
    trending: false,
  },
  {
    id: 5,
    title: "Backend API Development",
    description:
      "Build robust APIs with authentication, database integration, error handling, and security best practices",
    skills: ["Node.js", "Express", "JWT", "PostgreSQL"],
    difficulty: 3,
    duration: "80 min",
    problems: 5,
    participants: 967,
    rating: 4.6,
    category: "Backend",
    trending: false,
  },
  {
    id: 6,
    title: "DevOps & Cloud Basics",
    description: "Docker containerization, CI/CD pipelines, AWS deployment, and infrastructure as code",
    skills: ["Docker", "AWS", "CI/CD", "Linux"],
    difficulty: 3,
    duration: "70 min",
    problems: 4,
    participants: 734,
    rating: 4.5,
    category: "DevOps",
    trending: false,
  },
]

export const difficultyColors: Record<DifficultyLevel, string> = {
  1: "bg-green-500",
  2: "bg-green-400", 
  3: "bg-yellow-500",
  4: "bg-orange-500",
  5: "bg-red-500",
}

export const difficultyLabels: Record<DifficultyLevel, string> = {
  1: "Beginner",
  2: "Easy",
  3: "Medium", 
  4: "Hard",
  5: "Expert",
}

export const availableSkills = [
  "React",
  "Node.js", 
  "Python",
  "JavaScript",
  "TypeScript",
  "MongoDB",
  "REST APIs",
  "Algorithms",
  "Data Structures",
  "System Design",
  "Architecture",
  "Scalability",
  "Performance",
  "Testing",
  "Express",
  "JWT",
  "PostgreSQL",
  "Docker",
  "AWS",
  "CI/CD",
  "Linux",
]

export const categories = [
  "Full-Stack",
  "Algorithms", 
  "System Design",
  "Frontend",
  "Backend",
  "DevOps",
  "Database",
  "Security",
  "Mobile",
  "Machine Learning",
]

export const durations = [
  "30 min",
  "45 min", 
  "60 min",
  "75 min",
  "80 min",
  "90 min",
  "120 min",
]

export const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "rating", label: "Highest Rated" },
  { value: "popularity", label: "Most Popular" },
  { value: "recent", label: "Recently Added" },
] 