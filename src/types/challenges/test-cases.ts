export interface TestCase {
  id: string
  challenge_id: string
  seed: number
  input: string
  expected_output: string
  description?: string
  is_hidden: boolean
  created_at: string
}

export interface TestCaseExecution {
  id: string
  submission_id: string
  test_case_id: string
  input: string
  expected_output: string
  actual_output: string | null
  status: 'pending' | 'running' | 'completed' | 'failed'
  execution_time: number | null
  error_message?: string
  judge0_job_id?: string
  created_at: string
  updated_at: string
}

export interface TestResult {
  testCaseId: string
  input: string
  expectedOutput: string
  actualOutput: string | null
  status: 'passed' | 'failed' | 'error'
  executionTime: number | null
  errorMessage?: string
}

export interface TestSummary {
  passCount: number
  failCount: number
  totalCount: number
  details: TestResult[]
  totalExecutionTime: number
}

export interface TestCaseGenerator {
  generateTestCases(seed: number, count: number): TestCase[]
  validateOutput(input: string, output: string): boolean
}
