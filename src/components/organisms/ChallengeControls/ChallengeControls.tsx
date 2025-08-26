import { useState } from "react"
import { Play, Square, RefreshCw } from "lucide-react"
import { Button } from "@/components/atoms/Button/Button"


interface ChallengeControlsProps {
  language: string
  setLanguage: (language: string) => void
  isRunning: boolean
  onRunTests: () => void
  onCancelTests: () => void
  onGenerateTestCases: () => void
  onRunSingleTest: () => void
}

export function ChallengeControls({
  language,
  setLanguage,
  isRunning,
  onRunTests,
  onCancelTests,
  onGenerateTestCases,
  onRunSingleTest
}: ChallengeControlsProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <label htmlFor="language-select" className="text-sm font-medium">
          Linguagem:
        </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-1 border rounded-md"
          disabled={isRunning}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={onRunSingleTest}
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Executar Teste Único
        </Button>
        
        <Button
          onClick={onRunTests}
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Executar Múltiplos Testes
        </Button>
        
        <Button
          onClick={onGenerateTestCases}
          disabled={isRunning}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Gerar Novos Casos
        </Button>
        
        {isRunning && (
          <Button
            onClick={onCancelTests}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Cancelar
          </Button>
        )}
      </div>
    </div>
  )
}
