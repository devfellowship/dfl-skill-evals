import { ENV } from '@/config/env'

interface ExecuteCodeParams {
  code: string
  testCases: Array<{
    input: any
    expectedOutput: any
    description: string
    hidden: boolean
  }>
  languageId: number
  timeoutMs: number
  functionName: string
}

interface ExecuteCodeResult {
  testResults: Array<{
    input: any
    expectedOutput: any
    actualOutput: any
    status: 'passed' | 'failed'
    executionTime: number
    error?: string
  }>
  totalExecutionTime: number
  compilationError?: string
  error?: string
}

export async function executeCode(params: ExecuteCodeParams): Promise<ExecuteCodeResult> {
  const { code, testCases, languageId, functionName } = params

  try {
    const judge0Url = ENV.JUDGE0_API_URL.replace(/\/$/, '')
    const testResults = []
    let totalExecutionTime = 0

    for (const testCase of testCases) {
      const wrappedCode = `
${code}

const input = ${JSON.stringify(testCase.input)}
console.log(JSON.stringify(${functionName}(input)))
`

      const response = await fetch(`${judge0Url}/submissions?wait=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_code: wrappedCode,
          language_id: languageId,
          stdin: '',
        }),
      })

      if (!response.ok) {
        throw new Error(`Judge0 API error: ${response.status}`)
      }

      const result = await response.json()
      const executionTime = parseFloat(result.time || '0') * 1000
      totalExecutionTime += executionTime

      if (result.status?.id === 6) {
        return {
          testResults: [],
          totalExecutionTime,
          compilationError: result.compile_output || result.stderr || 'Compilation error',
        }
      }

      if (result.status?.id === 11 || result.status?.id === 12) {
        return {
          testResults: [],
          totalExecutionTime,
          error: result.stderr || 'Runtime error',
        }
      }

      let actualOutput
      try {
        const outputLine = result.stdout?.trim() || ''
        actualOutput = JSON.parse(outputLine)
      } catch {
        actualOutput = result.stdout?.trim()
      }

      const passed = JSON.stringify(actualOutput) === JSON.stringify(testCase.expectedOutput)

      testResults.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput,
        status: passed ? 'passed' : 'failed',
        executionTime,
        error: result.stderr || undefined,
      })
    }

    return {
      testResults,
      totalExecutionTime,
    }
  } catch (error) {
    return {
      testResults: [],
      totalExecutionTime: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
