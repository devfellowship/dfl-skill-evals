export interface CodeExecutionPanelProps {
  code: string
  language: string
}

export interface UseChallengeExecutionProps {
  problemId: string
  functionName: string
  testCases: any[]
}

export interface TestResult {
  passCount: number
  failCount: number
  results: TestCaseResult[]
}

export interface TestCaseResult {
  status: 'passed' | 'failed' | 'error'
  input: string
  expectedOutput: string
  actualOutput: string
  error?: string
}

export interface TestResultCardProps {
  result: TestResult
  index: number
}

export interface ExecutionSummaryProps {
  results: {
    passCount: number
    failCount: number
    totalTests: number
  }
}

export interface ExecutionControlsProps {
  isLoading: boolean
  progress: number
}

export interface CompilationErrorDisplayProps {
  error: string
}

export interface CompilationErrorProps {
  error: string
}
