import type { TestCase, TestResult, LanguageId } from '@/types/execution'
import { executeCode } from '../judge0-config'
import { checkRateLimit } from './rate-limiter'
import { getCachedLanguages, isLanguageSupported, getLanguageName } from './language-manager'
import { transpileTsToJs, createExecutableCode } from './code-processor'
import { parseJudge0Result } from './result-parser'
export { checkRateLimit, isLanguageSupported, getLanguageName }
export async function executeCodeWithJudge0(
  code: string,
  testCases: TestCase[],
  languageId: LanguageId,
  timeoutMs: number = 5000,
  functionName: string
): Promise<TestResult[]> {
  const results: TestResult[] = []
  let processedCode = code
  let targetLanguage = { id: languageId }

  if (languageId === 74) {
    try {
      processedCode = await transpileTsToJs(code)
      targetLanguage = { id: 63 }
    } catch (error) {
      return testCases.map(testCase => ({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: null,
        status: 'error' as const,
        error: `TypeScript Transpilation Error: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        executionTime: 0
      }))
    }
  }

  for (const testCase of testCases) {
    const startTime = Date.now()
    try {
      const result = await executeTestCase(processedCode, testCase, targetLanguage.id, timeoutMs, functionName)
      results.push({
        ...result,
        executionTime: Date.now() - startTime
      })
    } catch (error) {
      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: null,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime,
      })
    }
  }

  return results
}
async function executeTestCase(
  code: string,
  testCase: TestCase,
  languageId: number,
  timeoutMs: number,
  functionName: string
): Promise<Omit<TestResult, 'executionTime'>> {
  const executableCode = createExecutableCode(code, functionName, testCase.input, languageId)
  const payload = {
    source_code: executableCode,
    language_id: languageId,
    cpu_time_limit: 5,
    wall_time_limit: 5,
    memory_limit: 128000,
    stack_limit: 128000,
    max_file_size: 4096,
    enable_per_process_and_thread_time_limit: false,
    enable_per_process_and_thread_memory_limit: false,
    number_of_runs: 1
  }
  const result = await executeCode(payload)
  return parseJudge0Result(result, testCase)
}
