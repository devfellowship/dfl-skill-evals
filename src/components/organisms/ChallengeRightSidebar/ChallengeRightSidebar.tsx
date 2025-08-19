import { Progress } from "@/components/atoms/Progress/Progress"
import { TestResultCard } from "@/components/molecules/TestResultCard"

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

interface ChallengeRightSidebarProps {
  testResults: TestResult[]
  passedTests: number
  totalTests: number
  hiddenTests: number
  testCases: TestCase[]
}

export function ChallengeRightSidebar({
  testResults,
  passedTests,
  totalTests,
  hiddenTests,
  testCases
}: ChallengeRightSidebarProps) {
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
          {testResults.length > 0 ? (
            testResults.map((result, index) => (
              <TestResultCard 
                key={index} 
                result={result} 
                index={index} 
                testCases={testCases} 
              />
            ))
          ) : (
            <div className="text-center text-muted-foreground text-sm py-8">
              Run your code to see test results
            </div>
          )}
        </div>

        {hiddenTests > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-muted/50 border">
            <div className="text-xs text-muted-foreground text-center">
              + {hiddenTests} hidden test case{hiddenTests > 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
