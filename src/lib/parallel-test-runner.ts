import type { TestCase, TestResult, TestSummary } from '@/types/test-cases'
import { executeCodeWithJudge0 } from './execution/judge0-executor'
import { JUDGE0_LANGUAGES } from '@/types/execution'

export interface ParallelTestRunnerOptions {
  maxConcurrentJobs: number
  timeoutMs: number
  languageId: number
}

export class ParallelTestRunner {
  private runningJobs = new Map<string, Promise<TestResult>>()
  private completedResults: TestResult[] = []
  private startTime: number = 0

  constructor(private options: ParallelTestRunnerOptions) {}

  async runTests(
    code: string,
    testCases: TestCase[],
    functionName: string
  ): Promise<TestSummary> {
    this.startTime = Date.now()
    this.completedResults = []
    this.runningJobs.clear()

    const testPromises = testCases.map(testCase => 
      this.executeSingleTest(code, testCase, functionName)
    )

    const results = await Promise.all(testPromises)
    
    const totalExecutionTime = Date.now() - this.startTime
    const passCount = results.filter(r => r.status === 'passed').length
    const failCount = results.filter(r => r.status === 'failed').length

    return {
      passCount,
      failCount,
      totalCount: testCases.length,
      details: results,
      totalExecutionTime
    }
  }

  private async executeSingleTest(
    code: string,
    testCase: TestCase,
    functionName: string
  ): Promise<TestResult> {
    const testStartTime = Date.now()
    
    try {
      const executionCode = this.prepareExecutionCode(code, testCase, functionName)
      
      const result = await executeCodeWithJudge0(
        executionCode,
        [{
          input: testCase.input,
          expectedOutput: testCase.expected_output,
          description: testCase.description || '',
          hidden: testCase.is_hidden
        }],
        this.options.languageId,
        this.options.timeoutMs,
        functionName
      )

      const executionTime = Date.now() - testStartTime
      
      if (result.length === 0) {
        return {
          testCaseId: testCase.id,
          input: testCase.input,
          expectedOutput: testCase.expected_output,
          actualOutput: null,
          status: 'error',
          executionTime,
          errorMessage: 'No test results returned'
        }
      }

      const testResult = result[0]
      
      return {
        testCaseId: testCase.id,
        input: testCase.input,
        expectedOutput: testCase.expected_output,
        actualOutput: testResult.actualOutput,
        status: testResult.status === 'passed' ? 'passed' : 'failed',
        executionTime,
        errorMessage: testResult.status === 'failed' ? 'Output mismatch' : undefined
      }

    } catch (error) {
      const executionTime = Date.now() - testStartTime
      
      console.error(`❌ Erro no teste ${testCase.id}:`, error)
      
      return {
        testCaseId: testCase.id,
        input: testCase.input,
        expectedOutput: testCase.expected_output,
        actualOutput: null,
        status: 'error',
        executionTime,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private prepareExecutionCode(
    userCode: string,
    testCase: TestCase,
    functionName: string
  ): string {
    if (this.options.languageId === JUDGE0_LANGUAGES.JAVASCRIPT || 
        this.options.languageId === JUDGE0_LANGUAGES.TYPESCRIPT) {
      
      return `${userCode}

// Teste automático
const input = ${testCase.input};
const result = ${functionName}(...input);
console.log(JSON.stringify(result));`
    }

    return userCode
  }

  cancelAll(): void {

    this.runningJobs.clear()
  }

  getProgress(): { completed: number; total: number; percentage: number } {
    const total = this.completedResults.length + this.runningJobs.size
    const completed = this.completedResults.length
    const percentage = total > 0 ? (completed / total) * 100 : 0
    
    return { completed, total, percentage }
  }
}

export class TestRunnerFactory {
  static createRunner(challengeId: string, language: string): ParallelTestRunner {
    const languageId = language === 'typescript' ? JUDGE0_LANGUAGES.TYPESCRIPT : JUDGE0_LANGUAGES.JAVASCRIPT
    
    const options: ParallelTestRunnerOptions = {
      maxConcurrentJobs: 5, 
      timeoutMs: 10000,    
      languageId
    }

    return new ParallelTestRunner(options)
  }
}
