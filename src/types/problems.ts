export interface TestCase {
  input: string
  expectedOutput: any
  description: string
  hidden: boolean
}

export interface Example {
  input: string
  output: string
  explanation: string
}

export interface Problem {
  id: number
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  description: string
  examples: Example[]
  constraints: string[]
  hints: string[]
  functionName: string
  testCases: TestCase[]
}

export type ProblemDifficulty = "Easy" | "Medium" | "Hard" 