import { CodeEditor } from "@/components/organisms/CodeEditor/CodeEditor"
import { ChallengeControls } from "@/components/organisms/ChallengeControls/ChallengeControls"
import type { ChallengeEditorProps } from "@/types/challenge-page"

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
        code={code}
        language={language}
        onCodeChange={onCodeChange}
        onLanguageChange={onLanguageChange}
      />
      <ChallengeControls
        isLoading={isLoading}
        progress={progress}
        compilationError={compilationError}
        onRun={onRun}
        onCancel={onCancel}
        onReset={onReset}
      />
    </div>
  )
}
