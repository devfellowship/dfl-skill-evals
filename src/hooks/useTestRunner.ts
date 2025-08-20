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

      console.log(`🧪 Iniciando testes para ${challengeId} com seed ${seed}`)

      // 1. Gerar casos de teste determinísticos
      const generator = TestCaseGeneratorFactory.createGenerator(challengeId)
      const testCases = generator.generateTestCases(seed, testCount)

      console.log(`📋 Gerados ${testCases.length} casos de teste`)

      // 2. Criar runner e executar testes
      const runner = TestRunnerFactory.createRunner(challengeId, language)
      
      // 3. Executar todos os testes
      const testSummary = await runner.runTests(
        code,
        testCases,
        getFunctionName(challengeId)
      )

      setResults(testSummary)
      setProgress(100)
      
      console.log(`✅ Testes concluídos: ${testSummary.passCount}/${testSummary.totalCount} passaram`)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      console.error('❌ Erro ao executar testes:', err)
    } finally {
      setIsRunning(false)
      setCurrentTest('')
    }
  }, [])

  const cancelTests = useCallback(() => {
    setIsRunning(false)
    setProgress(0)
    setCurrentTest('')
    console.log('🛑 Testes cancelados pelo usuário')
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
      console.error('Erro ao gerar casos de teste:', err)
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
      console.error('Erro ao validar output:', err)
      return false
    }
  }, [])

  return {
    // Estado
    isRunning,
    progress,
    currentTest,
    results,
    error,
    
    // Ações
    runTests,
    cancelTests,
    generateTestCases,
    validateOutput,
    
    // Utilitários
    reset: () => {
      setResults(null)
      setError(null)
      setProgress(0)
    }
  }
}

// Função auxiliar para obter o nome da função baseado no desafio
function getFunctionName(challengeId: string): string {
  switch (challengeId) {
    case 'two-sum':
      return 'twoSum'
    // Adicionar outros desafios aqui
    default:
      return 'solution'
  }
}
