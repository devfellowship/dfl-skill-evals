"use client"

import { useState, useEffect } from "react"
import { useChallengeDetails } from "@/hooks/useChallengeDetails"
import { useUserOutputExecution } from "@/hooks/useUserOutputExecution"
import { ChallengeHeader } from "@/components/organisms/ChallengeHeader/ChallengeHeader"
import { ProblemPanel } from "@/components/organisms/ProblemPanel/ProblemPanel"
import { CodeExecutionPanel } from "@/components/organisms/CodeExecutionPanel/CodeExecutionPanel"
import { UserOutputTestResultsPanel } from "@/components/organisms/UserOutputTestResultsPanel/UserOutputTestResultsPanel"
import { NotFoundState } from "@/components/molecules/NotFoundState/NotFoundState"
import { LoadingState } from "@/components/molecules/LoadingState/LoadingState"
import type { ChallengePageProps, ChallengeProblem } from "@/types/challenges/challenge-page"

interface UserOutputChallengePageProps extends ChallengePageProps {
  showUserOutputs?: boolean
  userOutputRatio?: number
}

export function UserOutputChallengePage({ 
  challengeId, 
  showUserOutputs = true, 
  userOutputRatio = 0.5 
}: UserOutputChallengePageProps) {
  const { challenge, loading: challengeLoading, error: challengeError } = useChallengeDetails(challengeId)
  
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState("typescript")

  useEffect(() => {
    if (challenge?.initial_code && !code) {
      setCode(challenge.initial_code)
    }
  }, [challenge?.initial_code])

  const {
    compilationError,
    finalResults,
    finalLoading,
    progress,
    executeCode,
    cancelTests,
    clearResults,
    userOutputResults,
    combinedResults,
    userOutputError,
    userOutputCount,
    seedOutputCount,
    showUserOutputs: isUserOutputEnabled
  } = useUserOutputExecution({
    problemId: challengeId,
    functionName: challenge?.function_name || 'solution',
    showUserOutputs,
    userOutputRatio
  })

  if (challengeLoading) {
    return <LoadingState message="Carregando challenge..." />
  }

  if (challengeError || !challenge) {
    return (
      <NotFoundState 
        title="Challenge não encontrado" 
        message={challengeError || `O challenge "${challengeId}" não foi encontrado ou não está disponível.`} 
      />
    )
  }

  const mapDifficulty = (difficulty: number): "Easy" | "Medium" | "Hard" => {
    switch (difficulty) {
      case 1:
        return 'Easy'
      case 2:
        return 'Medium'
      case 3:
      case 4:
        return 'Hard'
      default:
        return 'Easy'
    }
  }

  const adaptedProblem = {
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    difficulty: mapDifficulty(challenge.difficulty),
    examples: challenge.challenge_examples?.map((example: any) => ({
      input: example.input,
      output: example.output,
      explanation: example.explanation || ''
    })) || [],
    constraints: challenge.constraints || [],
    hints: [],
    functionName: challenge.function_name || '',
    testCases: challenge.challenge_test_cases?.map((testCase: any, index: number) => ({
      input: testCase.input,
      expectedOutput: testCase.expected_output,
      hidden: testCase.is_hidden,
      description: `Test case ${index + 1}`
    })) || []
  }

  const passedTests = finalResults?.details?.filter((test) => test.status === "passed").length || 0
  const totalTests = finalResults?.details?.length || 0

  const handleRunCode = () => executeCode(code)

  return (
    <div className="flex h-screen flex-col bg-background">
      <ChallengeHeader title={challenge.title} />
      <div className="flex flex-1 overflow-hidden">
        <ProblemPanel problem={adaptedProblem} />
        <CodeExecutionPanel
          code={code}
          language={language}
          compilationError={compilationError}
          isLoading={finalLoading}
          progress={progress}
          results={finalResults}
          onCodeChange={setCode}
          onLanguageChange={setLanguage}
          onRun={handleRunCode}
          onCancel={cancelTests}
          onReset={clearResults}
        />
        <UserOutputTestResultsPanel
          results={finalResults}
          passedTests={passedTests}
          totalTests={totalTests}
          userCode={code}
          functionName={challenge.function_name || ''}
          testCases={adaptedProblem.testCases.map((tc, index) => ({
            id: `test_${index}`,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            description: `Test case ${index + 1}`
          }))}
          languageId={74}
          showUserOutputs={isUserOutputEnabled}
          userOutputRatio={userOutputRatio}
        />
      </div>
      
      {/* Indicador de status dos outputs do usuário */}
      {isUserOutputEnabled && userOutputError && (
        <div className="absolute bottom-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-sm">
          <div className="text-sm text-yellow-700">
            <div className="font-medium mb-1">⚠️ Aviso</div>
            <div className="text-yellow-600">
              {userOutputError}
            </div>
          </div>
        </div>
      )}
      
      {/* Estatísticas dos outputs */}
      {isUserOutputEnabled && (userOutputCount > 0 || seedOutputCount > 0) && (
        <div className="absolute bottom-4 left-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-sm text-blue-700">
            <div className="font-medium mb-1">📊 Outputs</div>
            <div className="text-blue-600">
              {userOutputCount} reais • {seedOutputCount} seeds
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
