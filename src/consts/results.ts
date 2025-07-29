export interface SkillBreakdown {
  skill: string
  score: number
  maxScore: number
  improvement: string
}

export interface ProblemResult {
  title: string
  status: "completed" | "incomplete"
  score: number
  timeSpent: string
  difficulty: string
  testsPassed: number
  totalTests: number
}

export interface ChallengeResults {
  overallScore: number
  percentile: number
  totalTime: string
  problemsCompleted: number
  totalProblems: number
  skillBreakdown: SkillBreakdown[]
  problemResults: ProblemResult[]
}

export const mockResults: ChallengeResults = {
  overallScore: 85,
  percentile: 78,
  totalTime: "67 min",
  problemsCompleted: 4,
  totalProblems: 5,
  skillBreakdown: [
    { skill: "Algorithms", score: 90, maxScore: 100, improvement: "+5" },
    { skill: "Data Structures", score: 85, maxScore: 100, improvement: "+8" },
    { skill: "Problem Solving", score: 80, maxScore: 100, improvement: "+3" },
    { skill: "Code Quality", score: 88, maxScore: 100, improvement: "+12" },
  ],
  problemResults: [
    {
      title: "Two Sum",
      status: "completed",
      score: 100,
      timeSpent: "8 min",
      difficulty: "Easy",
      testsPassed: 3,
      totalTests: 3,
    },
    {
      title: "Binary Tree Traversal",
      status: "completed",
      score: 85,
      timeSpent: "15 min",
      difficulty: "Medium",
      testsPassed: 4,
      totalTests: 5,
    },
    {
      title: "API Design",
      status: "completed",
      score: 90,
      timeSpent: "22 min",
      difficulty: "Medium",
      testsPassed: 5,
      totalTests: 5,
    },
    {
      title: "Database Query Optimization",
      status: "completed",
      score: 75,
      timeSpent: "18 min",
      difficulty: "Hard",
      testsPassed: 3,
      totalTests: 4,
    },
    {
      title: "System Design",
      status: "incomplete",
      score: 0,
      timeSpent: "4 min",
      difficulty: "Hard",
      testsPassed: 0,
      totalTests: 3,
    },
  ],
} 