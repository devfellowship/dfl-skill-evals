"use client"

import { CodeEditor } from "@/components/organisms/CodeEditor/CodeEditor"
import { CompilationErrorDisplay } from "@/components/molecules/CompilationErrorDisplay"
import { ExecutionControls } from "@/components/molecules/ExecutionControls"
import { ExecutionSummary } from "@/components/molecules/ExecutionSummary"

interface CodeExecutionPanelProps {
  code: string
  language: string
  compilationError: string | null
  isLoading: boolean
  progress: number
  results: any
  onCodeChange: (code: string) => void
  onLanguageChange: (language: string) => void
  onRun: () => void
  onCancel: () => void
  onReset: () => void
}

export function CodeExecutionPanel({
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
}: CodeExecutionPanelProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-border/40 p-4">
        <h3 className="font-medium">Solution</h3>
      </div>

      {compilationError && (
        <CompilationErrorDisplay error={compilationError} />
      )}

      <div className="flex-1 overflow-hidden">
        <CodeEditor 
          value={code} 
          onChange={onCodeChange} 
          language={language}
          onLanguageChange={onLanguageChange}
          onRun={onRun}
          isRunning={isLoading}
          showRunButton={true}
        />
        
        {isLoading && (
          <ExecutionControls
            isLoading={isLoading}
            progress={progress}
            onCancel={onCancel}
          />
        )}
        
        {results && !isLoading && (
          <ExecutionSummary
            results={results}
            onReset={onReset}
          />
        )}
      </div>
    </div>
  )
}
