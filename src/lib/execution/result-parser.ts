import type { TestCase, TestResult } from '@/types/execution'
import type { Judge0Result } from '../judge0-config'
export function parseJudge0Result(
  result: Judge0Result, 
  testCase: TestCase
): Omit<TestResult, 'executionTime'> {
  if (result.compile_output && result.compile_output.trim()) {
    return {
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: null,
      status: 'error',
      error: `Compilation Error: ${result.compile_output.trim()}`,
      memory: result.memory || 0,
    }
  }
  if (result.stderr && result.stderr.trim()) {
    return {
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: null,
      status: 'error', 
      error: `Runtime Error: ${result.stderr.trim()}`,
      memory: result.memory || 0,
    }
  }
  if (result.status?.id === 6) {
    return {
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: null,
      status: 'error',
      error: 'Compilation Error',
      memory: result.memory || 0,
    }
  }
  if (result.status?.id === 5) {
    return {
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: null,
      status: 'error',
      error: 'Time Limit Exceeded',
      memory: result.memory || 0,
    }
  }
  if (result.status?.id === 4) {
    return {
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: null,
      status: 'error',
      error: 'Wrong Answer',
      memory: result.memory || 0,
    }
  }
  if (!result.stdout || result.stdout.trim() === '') {
    return {
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: null,
      status: 'error',
      error: 'No output generated',
      memory: result.memory || 0,
    }
  }
  let actualOutput = result.stdout.trim()
  if (actualOutput.startsWith('ERROR:')) {
    return {
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: null,
      status: 'error',
      error: actualOutput.replace('ERROR:', '').trim(),
      memory: result.memory || 0,
    }
  }
  const expectedStr = Array.isArray(testCase.expectedOutput) 
    ? JSON.stringify(testCase.expectedOutput) 
    : String(testCase.expectedOutput)
  const normalizedActual = actualOutput.replace(/\s+/g, '')
  const normalizedExpected = expectedStr.replace(/\s+/g, '')
  const passed = normalizedActual === normalizedExpected
  return {
    input: testCase.input,
    expectedOutput: testCase.expectedOutput,
    actualOutput: actualOutput,
    status: passed ? 'passed' : 'failed',
    memory: result.memory || 0,
  }
}