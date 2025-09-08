import type { Judge0Language, Judge0Submission, Judge0Result } from '../lib/judge0-config'

export const JUDGE0_LANGUAGES = {
  JAVASCRIPT: 63, 
  TYPESCRIPT: 74, 
} as const

export type LanguageId = typeof JUDGE0_LANGUAGES[keyof typeof JUDGE0_LANGUAGES]

export type { Judge0Language, Judge0Submission, Judge0Result }

export interface ExecutionTestCase {
  input: string
  expectedOutput: string
  description?: string
  hidden?: boolean
}

export interface ExecutionRequest {
  code: string
  testCases: ExecutionTestCase[]
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
  error?: string
  totalExecutionTime: number
} 

