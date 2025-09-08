import { CodeEditor } from "@/components/organisms/CodeEditor/CodeEditor"
import { ChallengeControls } from "@/components/organisms/ChallengeControls/ChallengeControls"
import type { ChallengeEditorProps } from "@/types/challenges/challenge-page"

export function ChallengeEditor({
  code,
  language,
  compilationError,
  isLoading,
  progress,
  onCodeChange,
  onLanguageChange,
  onRun,
  onCancel,
  onReset
}: ChallengeEditorProps) {
  return (
    <div className="flex flex-col h-full">
      <CodeEditor
        value={code}
        onChange={onCodeChange}
        language={language}
        onLanguageChange={onLanguageChange}
        onRun={onRun}
        isRunning={isLoading}
        showRunButton={true}
      />
      <ChallengeControls
        language={language}
        setLanguage={onLanguageChange}
        isRunning={isLoading}
        onRunTests={onRun}
        onCancelTests={onCancel}
        onGenerateTestCases={() => {}}
        onRunSingleTest={() => {}}
      />
    </div>
  )
}
