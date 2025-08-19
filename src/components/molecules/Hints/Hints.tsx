import { HelpCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface HintsProps {
  hints: string[]
  hintsUsed: number
  showHints: boolean
}

export function Hints({ hints, hintsUsed, showHints }: HintsProps) {
  if (!showHints) return null

  return (
    <div>
      <Separator />
      <div className="mt-6">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          Hints
        </h3>
        <div className="space-y-2">
          {hints.slice(0, hintsUsed).map((hint, index) => (
            <div key={index} className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
              <span className="font-medium">Hint {index + 1}:</span> {hint}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
