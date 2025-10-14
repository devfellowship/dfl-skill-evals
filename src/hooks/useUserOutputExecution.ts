import { useState, useCallback, useEffect } from 'react'
import { 
  generateUserOutputTestCases, 
  combineUserAndSeedOutputs,
  UserOutputTestCase,
  UserOutputResult 
} from '@/lib/execution/user-output-processor'
import { useChallengeExecution } from './useChallengeExecution'
import { useBaseStates } from './useBaseStates'

interface UseUserOutputExecutionProps {
  problemId: string
  functionName: string
  showUserOutputs?: boolean
  userOutputRatio?: number
}

export function useUserOutputExecution({
  problemId,
  functionName,
  showUserOutputs = true,
  userOutputRatio = 0.5
}: UseUserOutputExecutionProps) {
  const [userOutputResults, setUserOutputResults] = useState<UserOutputResult[]>([])
  const [combinedResults, setCombinedResults] = useState<any[]>([])
  const [code, setCode] = useState<string>('')
  
  const { loading, error, executeWithLoading } = useBaseStates()
  const {
    compilationError,
    finalResults,
    finalLoading,
    progress,
    executeCode: originalExecuteCode,
    cancelTests,
    clearResults
  } = useChallengeExecution({
    problemId,
    functionName
  })

  const executeCode = useCallback(async (userCode: string) => {
    setCode(userCode)
    
    return executeWithLoading(async () => {
      await originalExecuteCode(userCode)
    })
  }, [originalExecuteCode, executeWithLoading])

  const generateUserOutputs = useCallback(async (userCode: string, results: any) => {
    try {
      const testCases: UserOutputTestCase[] = results?.details?.map((test: any, index: number) => ({
        id: `test_${index}`,
        input: test.input,
        expectedOutput: test.expectedOutput,
        description: `Test case ${index + 1}`
      })) || []

      if (testCases.length === 0) {
        return
      }

      const userResults = await generateUserOutputTestCases(
        userCode,
        functionName,
        testCases,
        74
      )

      const combined = combineUserAndSeedOutputs(
        userResults,
        results?.details || [],
        userOutputRatio
      )

      setUserOutputResults(userResults)
      setCombinedResults(combined)
    } catch (err) {
      console.error('Erro ao gerar outputs do usuário:', err)
      setError('Erro ao gerar outputs reais do usuário')
    }
  }, [functionName, userOutputRatio])

  useEffect(() => {
    if (showUserOutputs && finalResults?.details && code && code.trim().length > 0) {
      generateUserOutputs(code, finalResults)
    }
  }, [finalResults, showUserOutputs, generateUserOutputs, code])

  const clearUserResults = useCallback(() => {
    setUserOutputResults([])
    setCombinedResults([])
    setError(null)
    clearResults()
  }, [clearResults])

  return {
    compilationError,
    finalResults: showUserOutputs && combinedResults.length > 0 
      ? { ...finalResults, details: combinedResults }
      : finalResults,
    finalLoading: finalLoading || loading,
    progress,
    executeCode,
    cancelTests,
    clearResults: clearUserResults,
    userOutputResults,
    combinedResults,
    userOutputError: error,
    userOutputCount: combinedResults.filter(r => r.isUserOutput).length,
    seedOutputCount: combinedResults.filter(r => !r.isUserOutput).length,
    showUserOutputs,
    userOutputRatio
  }
}

