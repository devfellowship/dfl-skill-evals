import { ChallengeHeader } from "@/components/organisms/ChallengeHeader/ChallengeHeader"
import { ProblemPanel } from "@/components/organisms/ProblemPanel/ProblemPanel"
import { CodeExecutionPanel } from "@/components/organisms/CodeExecutionPanel/CodeExecutionPanel"
import { TestResultsPanel } from "@/components/organisms/TestResultsPanel/TestResultsPanel"
import type { ChallengeLayoutProps} from "@/types/challenges/challenge-page"
export function ChallengeLayout({
  title,
  problem,
  code,
  language,
  compilationError,
  isLoading,
  progress,
  results,
  onCodeChange,
  onLanguageChange,
  onRun,
  onCancel,
  onReset
}: ChallengeLayoutProps) {
  const passedTests = results?.details?.filter((test: any) => test.status === "passed").length || 0
  const totalTests = results?.totalCount || 0
  return (
    <div className="flex h-screen flex-col bg-background">
      <ChallengeHeader title={title} />
      <div className="flex flex-1 overflow-hidden">
        <ProblemPanel problem={problem} />
        <CodeExecutionPanel
          code={code}
          language={language}
          compilationError={compilationError}
          isLoading={isLoading}
          progress={progress}
          results={results}
          onCodeChange={onCodeChange}
          onLanguageChange={onLanguageChange}
          onRun={onRun}
          onCancel={onCancel}
          onReset={onReset}
        />
        <TestResultsPanel
          results={results}
          passedTests={passedTests}
          totalTests={totalTests}
        />
      </div>
    </div>
  )
}