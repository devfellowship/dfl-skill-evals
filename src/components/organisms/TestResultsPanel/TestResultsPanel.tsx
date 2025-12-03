"use client"
import { useEffect, useState } from "react"
import { Progress } from "@/components/atoms/Progress/Progress"
import { TestResultCard } from "@/components/molecules/TestResultCard/TestResultCard"
interface TestResultsPanelProps {
  results: any
  passedTests: number
  totalTests: number
}
export function TestResultsPanel({ results, passedTests, totalTests }: TestResultsPanelProps) {
  const [displayResults, setDisplayResults] = useState(results)

  useEffect(() => {
    setDisplayResults(results)
  }, [results])

  return (
    <div className="w-[20%] border-l border-border/40 overflow-auto bg-background">
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Test Results</h3>
            <div className="text-xs text-muted-foreground">
              {passedTests}/{totalTests} passed
            </div>
          </div>
          <Progress value={totalTests > 0 ? (passedTests / totalTests) * 100 : 0} className="h-2" />
        </div>
        <div className="space-y-2">
          {displayResults?.details && displayResults.details.length > 0 ? (
            <>
              {displayResults.details.map((result: any, index: number) => (
                <TestResultCard
                  key={`${result.testCaseId}-${result.status}`}
                  result={result}
                  index={index}
                  isHidden={index >= 3}
                />
              ))}
            </>
          ) : (
            <div className="text-center text-muted-foreground text-sm py-8">
              Run your code to see test results
            </div>
          )}
        </div>
      </div>
    </div>
  )
}