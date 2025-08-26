import { useState, useCallback } from 'react'
import type { TestCase, TestSummary } from '@/types/test-cases'
import { TestCaseGeneratorFactory } from '@/lib/test-case-generator'
import { TestRunnerFactory } from '@/lib/parallel-test-runner'

export function useTestRunner() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTest, setCurrentTest] = useState<string>('')
  const [results, setResults] = useState<TestSummary | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runTests = useCallback(async (
    code: string,
    challengeId: string,
    language: string,
    seed: number = Date.now(),
    testCount: number = 10
  ) => {
    try {
      setIsRunning(true)
      setError(null)
      setResults(null)
      setProgress(0)




      const generator = TestCaseGeneratorFactory.createGenerator(challengeId)
      const testCases = generator.generateTestCases(seed, testCount)




      const runner = TestRunnerFactory.createRunner(challengeId, language)
      

      const testSummary = await runner.runTests(
        code,
        testCases,
        getFunctionName(challengeId)
      )

      setResults(testSummary)
      setProgress(100)
      


    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)

    } finally {
      setIsRunning(false)
      setCurrentTest('')
    }
  }, [])

  const cancelTests = useCallback(() => {
    setIsRunning(false)
    setProgress(0)
    setCurrentTest('')

  }, [])

  const generateTestCases = useCallback((
    challengeId: string,
    seed: number = Date.now(),
    count: number = 10
  ): TestCase[] => {
    try {
      const generator = TestCaseGeneratorFactory.createGenerator(challengeId)
      return generator.generateTestCases(seed, count)
    } catch (err) {

      return []
    }
  }, [])

  const validateOutput = useCallback((
    challengeId: string,
    input: string,
    output: string
  ): boolean => {
    try {
      const generator = TestCaseGeneratorFactory.createGenerator(challengeId)
      return generator.validateOutput(input, output)
    } catch (err) {

      return false
    }
  }, [])

  return {
    isRunning,
    progress,
    currentTest,
    results,
    error,
    
    runTests,
    cancelTests,
    generateTestCases,
    validateOutput,
    
    reset: () => {
      setResults(null)
      setError(null)
      setProgress(0)
    }
  }
}

function getFunctionName(challengeId: string): string {
  switch (challengeId) {
    case 'two-sum':
      return 'twoSum'
    default:
      return 'solution'
  }
}
