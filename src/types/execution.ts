export interface TestCase {
  input: string
  expectedOutput: any
  description?: string
}

export interface ExecutionRequest {
  code: string
  testCases: TestCase[]
  functionName: string
  timeoutMs?: number
}

export interface TestResult {
  input: string
  expectedOutput: any
  actualOutput: any
  status: 'passed' | 'failed' | 'error'
  error?: string
  executionTime: number
}

export interface ExecutionResponse {
  success: boolean
  testResults: TestResult[]
  compilationError?: string
  totalExecutionTime: number
} 