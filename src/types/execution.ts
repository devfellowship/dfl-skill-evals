// Judge0 Language IDs - principais linguagens
export const JUDGE0_LANGUAGES = {
  JAVASCRIPT: 63,
  TYPESCRIPT: 74,
  PYTHON: 71,
  JAVA: 62,
  CPP: 54,
  C: 50,
  CSHARP: 51,
  GO: 60,
  RUST: 73,
} as const

export type LanguageId = typeof JUDGE0_LANGUAGES[keyof typeof JUDGE0_LANGUAGES]

export interface TestCase {
  input: string
  expectedOutput: string
  description?: string
  hidden?: boolean
}

export interface ExecutionRequest {
  code: string
  testCases: TestCase[]
  languageId: LanguageId
  timeoutMs?: number
  functionName: string 
}

export interface TestResult {
  input: string
  expectedOutput: string
  actualOutput: string | null
  status: 'passed' | 'failed' | 'error' | 'timeout'
  error?: string
  executionTime: number
  memory?: number
}

export interface ExecutionResponse {
  success: boolean
  testResults: TestResult[]
  compilationError?: string
  totalExecutionTime: number
} 

