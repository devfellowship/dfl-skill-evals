interface Example {
  input: string
  output: string
  explanation: string
}
interface ProblemExampleProps {
  example: Example
  index: number
}
export function ProblemExample({ example, index }: ProblemExampleProps) {
  return (
    <div className="rounded-lg border bg-muted/50 p-3">
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Input:</span>
          <code className="ml-2 font-mono text-xs bg-background px-1 py-0.5 rounded">
            {example.input}
          </code>
        </div>
        <div>
          <span className="font-medium">Output:</span>
          <code className="ml-2 font-mono text-xs bg-background px-1 py-0.5 rounded">
            {example.output}
          </code>
        </div>
        <div className="text-muted-foreground">
          <span className="font-medium">Explanation:</span> {example.explanation}
        </div>
      </div>
    </div>
  )
}