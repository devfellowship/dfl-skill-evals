"use client"

import { useState, useEffect } from "react"
import type { ExecutionRequest, ExecutionResponse, TestResult } from "@/types/execution"
import { mockChallenges } from "@/consts"
import { problems, DEFAULT_CODE_TEMPLATE } from "@/consts/problems"
import { CHALLENGE_TIMER, EXECUTION_LIMITS, CODE_EXECUTION } from "@/consts/ui"
import { JUDGE0_LANGUAGES } from '@/types/execution'
import { testJudge0Connection } from '@/lib/test-judge0-connection'
import { LogService } from '@/services/LogService'

export function useChallengeDetailsPage(challengeId: string) {
  // Find assessment data
  const assessment = mockChallenges.find(a => a.id === parseInt(challengeId)) || mockChallenges[0]
  
  // State management
  const [currentProblem, setCurrentProblem] = useState(0)
  const [code, setCode] = useState(DEFAULT_CODE_TEMPLATE)
  const [timeLeft, setTimeLeft] = useState(CHALLENGE_TIMER.DURATION_MINUTES * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [showHints, setShowHints] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [compilationError, setCompilationError] = useState<string | null>(null)

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Utility functions
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getTimeColor = () => {
    if (timeLeft < CHALLENGE_TIMER.CRITICAL_THRESHOLD) return "text-red-500"
    if (timeLeft < CHALLENGE_TIMER.WARNING_THRESHOLD) return "text-yellow-500"
    return "text-foreground"
  }

  // Code execution logic
  const runCode = async () => {
    setIsRunning(true)
    setCompilationError(null)
    
    try {
      const problem = problems[currentProblem]
      
      // Teste de conectividade primeiro usando o código real do usuário
      LogService.logJudge0ConnectionTest()
      const isConnected = await testJudge0Connection(code, problem.functionName, problem.testCases[0]?.input)
      
      if (!isConnected) {
        LogService.logJudge0ConnectionError()
        setCompilationError('Judge0 não está disponível. Verifique se o Docker Desktop está rodando e os containers do Judge0 estão ativos.')
        return
      }
      
      LogService.logJudge0ConnectionSuccess()
      
      LogService.logProblemDebug({
        currentProblem,
        problemTitle: problem?.title,
        functionName: problem?.functionName,
        testCasesCount: problem?.testCases?.length
      })
      
      const request: ExecutionRequest = {
        code,
        testCases: problem.testCases,
        languageId: JUDGE0_LANGUAGES.JAVASCRIPT, // Sempre JavaScript (TS é transpilado no backend)
        timeoutMs: EXECUTION_LIMITS.TIMEOUT_MS,
        functionName: problem.functionName
      }
      
      LogService.logExecutionRequest(request, code.length)

      const response = await fetch('/api/execute-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })

      const result: ExecutionResponse = await response.json()
      
      LogService.logExecutionResponse(result)

      // Sempre definir os resultados dos testes, independente do sucesso
      setTestResults(result.testResults)
      
      // Se não foi bem-sucedido, mostrar erro de compilação se houver
      if (!result.success) {
        if (result.compilationError) {
          setCompilationError(result.compilationError)
        } else if (result.error) {
          setCompilationError(result.error)
        }
      } else {
        // Limpar erros se tudo passou
        setCompilationError(null)
      }
      
    } catch (error) {
      LogService.logExecutionError(error)
      setCompilationError(CODE_EXECUTION.RETRY_MESSAGE)
    } finally {
      setIsRunning(false)
    }
  }

  // Hint handling
  const handleHint = () => {
    setShowHints(true)
    setHintsUsed((prev) => prev + 1)
  }

  // Computed values
  const problem = problems[currentProblem]
  const passedTests = testResults.filter((test) => test.status === "passed").length
  const totalVisibleTests = testResults.filter((test) => {
    // Normalizar inputs para comparação (remove espaços extras)
    const normalizedTestInput = test.input.replace(/\s/g, '')
    return !problem.testCases.find(tc => 
      tc.input.replace(/\s/g, '') === normalizedTestInput
    )?.hidden
  }).length
  const totalTests = problem.testCases.length
  const hiddenTests = problem.testCases.filter((test) => test.hidden).length

  return {
    // Data
    assessment,
    problem,
    
    // State
    currentProblem,
    code,
    timeLeft,
    isRunning,
    testResults,
    showHints,
    hintsUsed,
    compilationError,
    
    // Computed values
    passedTests,
    totalVisibleTests,
    totalTests,
    hiddenTests,
    
    // Actions
    setCurrentProblem,
    setCode,
    runCode,
    handleHint,
    
    // Utilities
    formatTime,
    getTimeColor
  }
}
