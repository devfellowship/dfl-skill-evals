import { CheckCircle, Target, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Progress } from "@/components/atoms/Progress/Progress"
import type { TestResult } from "@/types/test-cases"

interface TestResultsDisplayProps {
  isRunning: boolean
  progress: number
  testResults: any
  singleTestResult?: TestResult[]
  testError?: string | null
  compilationError?: string | null
}

export function TestResultsDisplay({
  isRunning,
  progress,
  testResults,
  singleTestResult,
  testError,
  compilationError
}: TestResultsDisplayProps) {
  if (compilationError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-red-700">Erro de Compilação</h3>
          </div>
          <pre className="text-sm text-red-600 whitespace-pre-wrap font-mono">
            {compilationError}
          </pre>
        </CardContent>
      </Card>
    )
  }

  if (testError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-red-700">Erro de Execução</h3>
          </div>
          <p className="text-sm text-red-600">{testError}</p>
        </CardContent>
      </Card>
    )
  }

  if (isRunning) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Executando Testes...</h3>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-600 mt-2">
            Progresso: {progress.toFixed(0)}%
          </p>
        </CardContent>
      </Card>
    )
  }

  const resultsToShow = testResults || singleTestResult
  if (!resultsToShow) return null

  const isSingleTest = Array.isArray(resultsToShow)
  const passedTests = isSingleTest 
    ? resultsToShow.filter(r => r.status === 'passed').length
    : resultsToShow.passCount
  const totalTests = isSingleTest 
    ? resultsToShow.length 
    : resultsToShow.totalCount

  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-green-700">Resultados dos Testes</h3>
          </div>
          <Badge 
            variant={passedTests === totalTests ? "default" : "destructive"}
            className="bg-green-100 text-green-800"
          >
            {passedTests}/{totalTests} passou
          </Badge>
        </div>
        
        {isSingleTest && (
          <div className="space-y-2">
            {resultsToShow.map((result: TestResult, index: number) => (
              <div 
                key={index}
                className={`p-2 rounded text-xs ${
                  result.status === 'passed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <div className="font-mono">
                  <strong>Input:</strong> {result.input}
                </div>
                <div className="font-mono">
                  <strong>Expected:</strong> {JSON.stringify(result.expectedOutput)}
                </div>
                <div className="font-mono">
                  <strong>Actual:</strong> {result.actualOutput || 'null'}
                </div>
                {result.error && (
                  <div className="font-mono text-red-600">
                    <strong>Error:</strong> {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {!isSingleTest && (
          <div className="text-sm text-green-600">
            <p>Tempo total: {resultsToShow.totalTime}ms</p>
            <p>Testes falharam: {resultsToShow.failCount}</p>
            {resultsToShow.errorCount > 0 && (
              <p>Erros de execução: {resultsToShow.errorCount}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
