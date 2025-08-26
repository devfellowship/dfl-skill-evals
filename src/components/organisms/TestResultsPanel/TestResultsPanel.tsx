"use client"

import { Progress } from "@/components/atoms/Progress/Progress"
import { TestResultCard } from "@/components/molecules/TestResultCard"

interface TestResultsPanelProps {
  results: any
  passedTests: number
  totalTests: number
}

export function TestResultsPanel({ results, passedTests, totalTests }: TestResultsPanelProps) {
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
          <Progress value={(passedTests / totalTests) * 100} className="h-2" />
        </div>

        <div className="space-y-2">
          {results?.details && results.details.length > 0 ? (
            <>

              
              {results.details.map((result: any, index: number) => (
                <TestResultCard
                  key={index}
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
