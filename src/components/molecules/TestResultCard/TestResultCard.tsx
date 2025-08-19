import { CheckCircle, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface TestResult {
  input: string
  expectedOutput: any
  actualOutput: any
  status: "passed" | "failed" | "error" | "timeout"
  executionTime: number
}

interface TestCase {
  input: string
  expectedOutput: any
  hidden?: boolean
}

interface TestResultCardProps {
  result: TestResult
  index: number
  testCases: TestCase[]
}

export function TestResultCard({ result, index, testCases }: TestResultCardProps) {
  // Normalizar inputs para comparação (remove espaços extras)
  const normalizedResultInput = result.input.replace(/\s/g, '')
  const testCase = testCases.find(tc => 
    tc.input.replace(/\s/g, '') === normalizedResultInput
  )
  const isHidden = testCase?.hidden || false

  return (
    <Card className={`${result.status === "passed" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium">
            {isHidden ? `Hidden Test ${index + 1}` : `Test ${index + 1}`}
          </span>
          {result.status === "passed" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <Target className="h-4 w-4 text-red-600" />
          )}
        </div>
        
        {!isHidden && (
          <>
            <div className="text-xs text-muted-foreground mb-1">
              <span className="font-medium">Input:</span> {result.input}
            </div>
            <div className="text-xs text-muted-foreground mb-1">
              <span className="font-medium">Expected:</span> {JSON.stringify(result.expectedOutput)}
            </div>
            <div className="text-xs text-muted-foreground mb-1">
              <span className="font-medium">Got:</span> {result.actualOutput ? JSON.stringify(result.actualOutput) : 'No output'}
            </div>
          </>
        )}
        
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Time:</span> {result.executionTime}ms
        </div>
      </CardContent>
    </Card>
  )
}
