import { Card, CardContent } from '@devfellowship/components';
import { CheckCircle, Target } from "lucide-react"

interface TestResult {
  status: 'passed' | 'failed' | 'error'
  input: string
  expectedOutput: string
  actualOutput?: string
  executionTime: number
  errorMessage?: string
}
interface TestResultCardProps {
  result: TestResult
  index: number
  isHidden?: boolean
}
export function TestResultCard({ result, index, isHidden = false }: TestResultCardProps) {
  const simplifyErrorMessage = (error: string): string => {
    if (!error || typeof error !== 'string') {
      return 'Erro desconhecido'
    }
    if (error.includes('SyntaxError')) {
      const match = error.match(/SyntaxError: (.+?)(?:\s+at\s+|$)/)
      return match ? match[1] : 'Syntax Error'
    }
    if (error.includes('Runtime Error')) {
      const lines = error.split('\n')
      let errorMessage = ''
      let lineInfo = ''
      for (const line of lines) {
        if (line.includes('ReferenceError:') || line.includes('TypeError:') || line.includes('Error:')) {
          const match = line.match(/(\w+Error): (.+)/)
          if (match) {
            errorMessage = `${match[1]}: ${match[2]}`
            break
          }
        }
      }
      for (const line of lines) {
        if (line.includes('at Object.<anonymous>') || line.includes('at Module._compile')) {
          const lineMatch = line.match(/\((.+):(\d+):(\d+)\)/)
          if (lineMatch) {
            const [, file, lineNum, charPos] = lineMatch
            lineInfo = ` (linha ${lineNum}, posição ${charPos})`
            break
          }
        }
      }
      if (errorMessage && lineInfo) {
        return `${errorMessage}${lineInfo}`
      } else if (errorMessage) {
        return errorMessage
      }
      const match = error.match(/Runtime Error: (.+?)(?:\s+at\s+|$)/)
      return match ? match[1] : 'Runtime Error'
    }
    return error.split('\n')[0]
  }
  return (
    <Card className={`${
      result.status === "passed" ? "border-green-200 bg-green-50" : 
      result.status === "error" ? "border-red-200 bg-red-50" : 
      "border-red-200 bg-red-50"
    }`}>
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
              <span className="font-medium">Expected:</span> {result.expectedOutput}
            </div>
            <div className="text-xs text-muted-foreground mb-1">
              <span className="font-medium">Got:</span> {result.actualOutput ? result.actualOutput : 'No output'}
            </div>
            {(result.status === 'failed' || result.status === 'error') && result.errorMessage && (
              <div className="text-xs text-orange-600 mt-2 p-2 bg-orange-50 rounded border border-orange-200">
                <div className="font-medium text-orange-700 mb-1">
                  {result.errorMessage.includes('SyntaxError') ? '🔧 Compilation Error:' : 
                   result.errorMessage.includes('Runtime Error') ? '⚠️ Runtime Error:' : 
                   '❌ Error:'}
                </div>
                <div className="font-mono text-orange-600 break-words">
                  {simplifyErrorMessage(result.errorMessage)}
                </div>
              </div>
            )}
          </>
        )}
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Time:</span> {result.executionTime || 0}ms
        </div>
      </CardContent>
    </Card>
  )
}