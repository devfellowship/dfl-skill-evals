"use client"
import { useState } from "react"
import { useTestRunner } from "@/hooks/useTestRunner"
import { testJudge0Connection } from "@/lib/judge0-config"
import { supabase } from "@/lib/supabase"
interface UseChallengeExecutionProps {
  problemId: string
  functionName: string
  language?: string
}
interface TestCase {
  input: any
  expectedOutput: any
  description: string
  hidden: boolean
}
interface TestResult {
  passCount: number
  failCount: number
  totalCount: number
  details: Array<{
    testCaseId: string
    input: any
    expectedOutput: any
    actualOutput: any
    status: string
    executionTime: number
    errorMessage?: string
  }>
  totalExecutionTime: number
}
function getLanguageId(language: string = 'typescript'): number {
  const languageMap: Record<string, number> = {
    'javascript': 63,
    'typescript': 74,
    'python': 71,
  }
  return languageMap[language] || 74
}

export function useChallengeExecution({ problemId, functionName, language = 'typescript' }: UseChallengeExecutionProps) {
  const [compilationError, setCompilationError] = useState<string | null>(null)
  const [manualResults, setManualResults] = useState<TestResult | null>(null)
  const [manualLoading, setManualLoading] = useState(false)
  const {
    isRunning,
    progress,
    results: testResults,
    error: testError,
    runTests,
    cancelTests,
    generateTestCases,
    reset: resetTests
  } = useTestRunner()
  const finalResults = testResults || manualResults
  const finalLoading = isRunning || manualLoading
  const executeCode = async (code: string) => {
    setManualLoading(true)
    try {
      const isConnected = await testJudge0Connection()
      if (!isConnected) {
        setCompilationError('Judge0 não está disponível. Verifique se o Docker Desktop está rodando e os containers do Judge0 estão ativos.')
        return
      }
      setCompilationError(null)
      resetTests()
      setManualResults(null)
      let traditionalTestCases: TestCase[] = []
      try {
        const searchTitle = problemId.replace('-', ' ')
        const { data: challenge } = await supabase
          .schema('skill_evals')
          .from('challenges')
          .select(`
            id,
            challenge_test_cases (
              id,
              input,
              expected_output,
              is_hidden,
              order_index
            )
          `)
          .ilike('title', `%${searchTitle}%`)
          .single()
        if (challenge?.challenge_test_cases && Array.isArray(challenge.challenge_test_cases)) {
          traditionalTestCases = challenge.challenge_test_cases.map((tc: any) => ({
            input: tc.input,
            expectedOutput: tc.expected_output,
            description: '',
            hidden: tc.is_hidden || false
          }))
        }
      } catch (dbError) {
        traditionalTestCases = []
      }
      if (!traditionalTestCases.length) {
        const seed = Date.now()
        const generatedTestCases = generateTestCases(problemId, seed, 10)
        traditionalTestCases = generatedTestCases.map((tc: any) => ({
          input: tc.input,
          expectedOutput: tc.expected_output,
          description: tc.description || '',
          hidden: tc.is_hidden
        }))
      }
      const request = {
        code,
        testCases: traditionalTestCases,
        languageId: getLanguageId(language),
        timeoutMs: 5000,
        functionName
      }
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`
      }
      const response = await fetch('/api/execute-code', {
        method: 'POST',
        headers,
        body: JSON.stringify(request)
      })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const result = await response.json()
      if (result.compilationError) {
        setCompilationError(`Erro de Compilação: ${result.compilationError}`)
        return
      }
      if (result.error) {
        setCompilationError(`Erro: ${result.error}`)
        return
      }
      if (result.testResults && result.testResults.length > 0) {
        const testSummary: TestResult = {
          passCount: result.testResults.filter((r: any) => r.status === 'passed').length,
          failCount: result.testResults.filter((r: any) => r.status === 'failed').length,
          totalCount: result.testResults.length,
          details: result.testResults.map((r: any, index: number) => ({
            testCaseId: `test_${index}`,
            input: r.input,
            expectedOutput: r.expectedOutput,
            actualOutput: r.actualOutput,
            status: r.status,
            executionTime: r.executionTime,
            errorMessage: r.error
          })),
          totalExecutionTime: result.totalExecutionTime
        }
        setManualResults({ ...testSummary })
      } else {
        setCompilationError('Erro durante execução. Verifique seu código e tente novamente.')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      setCompilationError(`Erro ao executar testes: ${message}`)
    } finally {
      setManualLoading(false)
    }
  }
  const clearResults = () => {
    resetTests()
    setManualResults(null)
    setCompilationError(null)
  }
  return {
    compilationError,
    finalResults,
    finalLoading,
    progress,
    executeCode,
    cancelTests,
    clearResults
  }
}