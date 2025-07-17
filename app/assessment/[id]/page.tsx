"use client"

import { useState, useEffect, use } from "react"
import { CheckCircle, Clock, HelpCircle, AlertTriangle, Target, ChevronLeft, ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { CodeEditor } from "@/components/code-editor"
import Link from "next/link"

const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists.",
    ],
    hints: [
      "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
      "Again, the best way to approach this problem is to use a HashMap.",
      "For each element, we try to find its complement by looking up the HashMap.",
    ],
    testCases: [
      { input: "[2,7,11,15], 9", output: "[0,1]", status: "passed", hidden: false },
      { input: "[3,2,4], 6", output: "[1,2]", status: "passed", hidden: false },
      { input: "[3,3], 6", output: "[0,1]", status: "failed", hidden: false },
      { input: "[1,2,3,4,5], 8", output: "[2,4]", status: "pending", hidden: true },
      { input: "[-1,-2,-3,-4,-5], -8", output: "[2,4]", status: "pending", hidden: true },
    ],
  },
]

export default function Assessment({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [currentProblem, setCurrentProblem] = useState(0)
  const [code, setCode] = useState(`function twoSum(nums, target) {
    // Your solution here
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`)
  const [timeLeft, setTimeLeft] = useState(90 * 60) // 90 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState(problems[0].testCases)
  const [showHints, setShowHints] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const runCode = () => {
    setIsRunning(true)
    // Simulate code execution with more realistic timing
    setTimeout(
      () => {
        setIsRunning(false)
        // Simulate test results with some randomness
        setTestResults((prev) =>
          prev.map((test, index) => {
            if (test.hidden && test.status === "pending") return test
            const shouldPass = Math.random() > (index === 2 ? 0.7 : 0.2) // Make test 3 more likely to fail
            return {
              ...test,
              status: shouldPass ? "passed" : "failed",
            }
          }),
        )
      },
      1500 + Math.random() * 1000,
    ) // Random execution time
  }

  const handleHint = () => {
    setShowHints(true)
    setHintsUsed((prev) => prev + 1)
  }

  const problem = problems[currentProblem]
  const passedTests = testResults.filter((test) => test.status === "passed").length
  const totalVisibleTests = testResults.filter((test) => !test.hidden).length
  const totalTests = testResults.length
  const hiddenTests = testResults.filter((test) => test.hidden).length

  const getTimeColor = () => {
    if (timeLeft < 300) return "text-red-500" // Less than 5 minutes
    if (timeLeft < 900) return "text-yellow-500" // Less than 15 minutes
    return "text-foreground"
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="shrink-0 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-6">
          <div className="flex flex-1 items-center justify-between">
            <div>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/">
                        <Home className="h-4 w-4" />
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Full-Stack JavaScript Challenge</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Alex Chen</p>
                <p className="text-xs text-muted-foreground">Software Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Problem Description - 30% */}
        <div className="w-[30%] border-r border-border/40 overflow-auto bg-background">
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xl font-bold">{problem.title}</h2>
                <Badge variant={problem.difficulty === "Easy" ? "secondary" : "destructive"}>
                  {problem.difficulty}
                </Badge>
              </div>
              <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Examples</h3>
              {problem.examples.map((example, index) => (
                <Card key={index} className="mb-3 border-border/40">
                  <CardContent className="p-4">
                    <div className="space-y-2 font-mono text-sm">
                      <div>
                        <span className="text-muted-foreground">Input: </span>
                        <span className="text-blue-400">{example.input}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Output: </span>
                        <span className="text-green-400">{example.output}</span>
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="text-muted-foreground">Explanation: </span>
                          <span className="font-sans text-muted-foreground">{example.explanation}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-3">Constraints</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {problem.constraints.map((constraint, index) => (
                  <li key={index} className="font-mono flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{constraint}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hints Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Hints</h3>
                {!showHints && (
                  <Button variant="outline" size="sm" onClick={handleHint}>
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Show Hint ({hintsUsed}/3)
                  </Button>
                )}
              </div>
              {showHints && (
                <div className="space-y-2">
                  {problem.hints.slice(0, hintsUsed).map((hint, index) => (
                    <Card key={index} className="border-yellow-500/20 bg-yellow-500/5">
                      <CardContent className="p-3">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-yellow-600">Hint {index + 1}:</span> {hint}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                  {hintsUsed < problem.hints.length && (
                    <Button variant="outline" size="sm" onClick={handleHint} className="w-full bg-transparent">
                      Show Next Hint ({hintsUsed + 1}/{problem.hints.length})
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Code Editor - 50% */}
        <div className="flex-1 flex flex-col bg-background">
          <CodeEditor
            initialCode={code}
            language="javascript"
            onCodeChange={setCode}
            onRun={runCode}
            isRunning={isRunning}
            timeLeft={timeLeft}
            formatTime={formatTime}
            getTimeColor={getTimeColor}
          />
        </div>

        {/* Test Results - 20% */}
        <div className="w-[20%] border-l border-border/40 overflow-auto bg-background">
          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Test Results</h3>
              <div className="flex items-center gap-2 mb-3">
                <Progress value={(passedTests / totalVisibleTests) * 100} className="flex-1" />
                <span className="text-sm font-medium">
                  {passedTests}/{totalVisibleTests}
                </span>
              </div>
              {hiddenTests > 0 && (
                <p className="text-xs text-muted-foreground mb-3">+ {hiddenTests} hidden test cases</p>
              )}
            </div>

            <div className="space-y-2">
              {testResults
                .filter((test) => !test.hidden)
                .map((test, index) => (
                  <Card
                    key={index}
                    className={`border-border/40 ${
                      test.status === "passed"
                        ? "border-green-500/50 bg-green-500/5"
                        : test.status === "failed"
                          ? "border-red-500/50 bg-red-500/5"
                          : "border-border/40"
                    }`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            test.status === "passed"
                              ? "bg-green-500"
                              : test.status === "failed"
                                ? "bg-red-500"
                                : "bg-muted"
                          }`}
                        />
                        <span className="text-sm font-medium">Test {index + 1}</span>
                        {test.status === "passed" && <CheckCircle className="h-3 w-3 text-green-500" />}
                      </div>
                      <div className="text-xs font-mono space-y-1">
                        <div>
                          <span className="text-muted-foreground">Input: </span>
                          <span className="text-blue-400">{test.input}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expected: </span>
                          <span className="text-green-400">{test.output}</span>
                        </div>
                        {test.status === "failed" && (
                          <div>
                            <span className="text-muted-foreground">Got: </span>
                            <span className="text-red-400">[1,0]</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>Complexity Analysis</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Time: O(n)</div>
                <div>Space: O(n)</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={handleHint}>
                <HelpCircle className="mr-2 h-4 w-4" />
                Get Hint ({hintsUsed}/3)
              </Button>
              <Button asChild className="w-full">
                <Link href={`/results/${id}`}>Submit Solution</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
