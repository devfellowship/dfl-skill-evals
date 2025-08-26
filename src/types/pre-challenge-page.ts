export interface PreChallengePageProps {
  challengeId: string
}

export interface SystemChecks {
  browser: boolean
  internet: boolean
}

export interface PreChallengeAssessment {
  id: string
  title: string
  description: string
  difficulty: string
  category?: string
  skills: string[]
  function_name: string
  initial_code: string
  test_cases: any
  examples: any
  constraints: string[]
  hints: string[]
  estimated_time_minutes: number
  max_score: number
  tags: string[]
  order_index: number
}
