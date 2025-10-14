interface HintsProps {
  hints: string[]
  hintsUsed: number
  showHints: boolean
}
export function Hints({ hints, hintsUsed, showHints }: HintsProps) {
  if (!showHints || hintsUsed === 0) return null
  return (
    <div>
      <h3 className="font-medium mb-3">💡 Hints</h3>
      <div className="space-y-2">
        {hints.slice(0, hintsUsed).map((hint, index) => (
          <div key={index} className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <div className="text-sm text-yellow-800">
              <span className="font-medium">Hint {index + 1}:</span> {hint}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}