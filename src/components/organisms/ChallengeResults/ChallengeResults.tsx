import { TestResultsPanel } from "@/components/organisms/TestResultsPanel/TestResultsPanel"
import type { ChallengeResultsProps } from "@/types/challenges/challenge-page"

export function ChallengeResults({
  results,
  passedTests,
  totalTests
}: ChallengeResultsProps) {
  return (
    <TestResultsPanel
      results={results}
      passedTests={passedTests}
      totalTests={totalTests}
    />
  )
}
