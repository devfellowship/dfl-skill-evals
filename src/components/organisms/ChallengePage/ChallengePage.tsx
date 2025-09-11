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
    functionName: challenge?.function_name || 'solution'
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

  const mapDifficulty = (difficulty: string): "Easy" | "Medium" | "Hard" => {
    switch (difficulty) {
      case 'beginner':
      case 'easy':
        return 'Easy'
      case 'medium':
        return 'Medium'
      case 'hard':
      case 'expert':
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
    examples: challenge.examples || [],
    constraints: challenge.constraints || [],
    hints: challenge.hints || [],
    functionName: challenge.function_name,
    testCases: challenge.test_cases || []
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
