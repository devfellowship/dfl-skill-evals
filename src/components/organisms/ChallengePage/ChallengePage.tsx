"use client"
import { useState, useEffect } from "react"
import { useChallengeDetails } from "@/hooks/useChallengeDetails"
import { useChallengeExecution } from "@/hooks/useChallengeExecution"
import { ChallengeHeader } from "@/components/organisms/ChallengeHeader/ChallengeHeader"
import { ProblemPanel } from "@/components/organisms/ProblemPanel/ProblemPanel"
import { CodeExecutionPanel } from "@/components/organisms/CodeExecutionPanel/CodeExecutionPanel"
import { TestResultsPanel } from "@/components/organisms/TestResultsPanel/TestResultsPanel"
import { NotFoundState } from "@/components/molecules/NotFoundState/NotFoundState"
import { LoadingState } from "@/components/molecules/LoadingState/LoadingState"
import type { ChallengePageProps, ChallengeProblem } from "@/types/challenges/challenge-page"
export function ChallengePage({ challengeId }: ChallengePageProps) {
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
    clearResults
  } = useChallengeExecution({
    problemId: challengeId,
    functionName: challenge?.function_name || 'solution',
    language
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
      id: `test_${index}`,
      input: testCase.input,
      expectedOutput: testCase.expected_output,
      hidden: testCase.is_hidden,
      description: `Test case ${index + 1}`
    })) || []
  }
  const passedTests = finalResults?.details?.filter((test) => test.status === "passed").length || 0
  const totalTests = finalResults?.totalCount || 0
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
        <TestResultsPanel
          results={finalResults}
          passedTests={passedTests}
          totalTests={totalTests}
        />
      </div>
    </div>
  )
}