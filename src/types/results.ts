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
