export interface ChallengePageProps {
  challengeId: string
}

export interface ChallengeLayoutProps {
  title: string
  problem: ChallengeProblem
  code: string
  language: string
  compilationError: string | null
  isLoading: boolean
  progress: number
  results: ChallengeResults
  onCodeChange: (code: string) => void
  onLanguageChange: (language: string) => void
  onRun: () => void
  onCancel: () => void
  onReset: () => void
}

export interface ChallengeProblem {
  id: string
  title: string
  description: string
  difficulty: string
  examples: ChallengeExample[]
  constraints: string[]
  hints: string[]
  functionName: string
  testCases: ChallengeTestCase[]
}

export interface ChallengeExample {
  input: string
  output: string
  explanation?: string
}

export interface ChallengeTestCase {
  input: string
  expectedOutput: any
  description?: string
  hidden?: boolean
}

export interface ChallengeResults {
  passCount: number
  failCount: number
  totalCount: number
  details: TestResultDetail[]
  totalExecutionTime: number
}

export interface TestResultDetail {
  testCaseId: string
  input: string
  expectedOutput: string
  actualOutput?: string
  status: 'passed' | 'failed' | 'error'
  executionTime: number
  errorMessage?: string
}

export interface ChallengeEditorProps {
  code: string
  language: string
  compilationError: string | null
  isLoading: boolean
  progress: number
  onCodeChange: (code: string) => void
  onLanguageChange: (language: string) => void
  onRun: () => void
  onCancel: () => void
  onReset: () => void
}

export interface ChallengeResultsProps {
  results: ChallengeResults | null
  passedTests: number
  totalTests: number
}
