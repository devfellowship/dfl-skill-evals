"use client"
import { useState } from "react"
import { useTestRunner } from "@/hooks/useTestRunner"
import { testJudge0Connection } from "@/lib/judge0-config"
import { supabase } from "@/lib/supabase"
interface UseChallengeExecutionProps {
  problemId: string
  functionName: string
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
export function useChallengeExecution({ problemId, functionName }: UseChallengeExecutionProps) {
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
  const executeCode = async (_code: string) => {
    // Static export: Judge0 code execution is disabled (the /api/execute-code
    // Next API route was removed as part of the Vercel -> Dokploy migration,
    // and Judge0 itself has been decommissioned).
    setManualLoading(true)
    try {
      setCompilationError('Execução de código temporariamente desabilitada durante a migração Vercel → Dokploy.')
      setManualResults(null)
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