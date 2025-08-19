import { AlertTriangle } from "lucide-react"
import { CODE_EXECUTION } from "@/consts/ui"

interface CompilationErrorProps {
  error: string
}

export function CompilationError({ error }: CompilationErrorProps) {
  return (
    <div className="border-b border-border/40 bg-red-50 p-4">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-red-800">{CODE_EXECUTION.COMPILATION_ERROR_TITLE}</p>
          <pre className="text-xs text-red-700 mt-1 whitespace-pre-wrap font-mono">
            {error}
          </pre>
        </div>
      </div>
    </div>
  )
}
