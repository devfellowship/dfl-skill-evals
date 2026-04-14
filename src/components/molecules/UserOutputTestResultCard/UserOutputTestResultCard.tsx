import { Card, CardContent } from '@devfellowship/components';
import { CheckCircle, Target, User, Shuffle } from "lucide-react"

import { Badge } from "@/components/atoms/Badge/Badge"
interface UserOutputTestResult {
  status: 'passed' | 'failed' | 'error'
  input: string
  expectedOutput: string
  actualOutput?: string
  executionTime: number
  errorMessage?: string
  isUserOutput?: boolean 
}
interface UserOutputTestResultCardProps {
  result: UserOutputTestResult
  index: number
  isHidden?: boolean
}
export function UserOutputTestResultCard({ result, index, isHidden = false }: UserOutputTestResultCardProps) {
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
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">
              {isHidden ? `Hidden Test ${index + 1}` : `Test ${index + 1}`}
            </span>
            {result.isUserOutput !== undefined && (
              <Badge 
                variant="outline" 
                className={`text-xs px-1 py-0 ${
                  result.isUserOutput 
                    ? 'border-blue-200 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
              >
                {result.isUserOutput ? (
                  <>
                    <User className="w-3 h-3 mr-1" />
                    Real
                  </>
                ) : (
                  <>
                    <Shuffle className="w-3 h-3 mr-1" />
                    Seed
                  </>
                )}
              </Badge>
            )}
          </div>
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
              <span className="font-medium">Got:</span> 
              <span className={`ml-1 ${
                result.isUserOutput ? 'text-blue-700 font-medium' : 'text-gray-600'
              }`}>
                {result.actualOutput ? result.actualOutput : 'No output'}
              </span>
              {result.isUserOutput && (
                <span className="ml-1 text-blue-600 text-xs">(seu código)</span>
              )}
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