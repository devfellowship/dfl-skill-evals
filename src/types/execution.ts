// Importar tipos do Judge0
import type { Judge0Language, Judge0Submission, Judge0Result } from '../lib/judge0-config'

// Judge0 Language IDs
export const JUDGE0_LANGUAGES = {
  JAVASCRIPT: 63, // JavaScript (Node.js 12.14.0) - ID correto
  TYPESCRIPT: 74, // TypeScript (3.7.4) - ID correto
} as const

export type LanguageId = typeof JUDGE0_LANGUAGES[keyof typeof JUDGE0_LANGUAGES]

// Re-exportar tipos do Judge0 para uso em outros arquivos
export type { Judge0Language, Judge0Submission, Judge0Result }

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
  error?: string
  totalExecutionTime: number
} 

