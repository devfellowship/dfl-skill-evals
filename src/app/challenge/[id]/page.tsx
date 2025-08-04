"use client"

import { useState, useEffect, use } from "react"
import { CheckCircle, Clock, HelpCircle, AlertTriangle, Target, ChevronLeft, ChevronRight, Home, LogOut, User } from "lucide-react"
import { Button } from "@/components/atoms/Button/Button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/atoms/Progress/Progress"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar/Avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CodeEditor } from "@/components/organisms/CodeEditor/CodeEditor"
import Link from "next/link"
import type { ExecutionRequest, ExecutionResponse, TestResult } from "@/types/execution"
import { mockChallenges } from "@/consts"
import { problems, DEFAULT_CODE_TEMPLATE } from "@/consts/problems"
import { CHALLENGE_TIMER, EXECUTION_LIMITS, BREADCRUMB_LABELS, UI_MESSAGES, CODE_EXECUTION } from "@/consts/ui"
import { JUDGE0_LANGUAGES } from '@/types/execution'
import { testJudge0Connection } from '@/lib/test-judge0-connection'

export default function Assessment({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const assessment = mockChallenges.find(a => a.id === parseInt(id)) || mockChallenges[0]
  
  const [currentProblem, setCurrentProblem] = useState(0)
  const [code, setCode] = useState(DEFAULT_CODE_TEMPLATE)
  const [timeLeft, setTimeLeft] = useState(CHALLENGE_TIMER.DURATION_MINUTES * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [showHints, setShowHints] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [compilationError, setCompilationError] = useState<string | null>(null)

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

  const runCode = async () => {
    setIsRunning(true)
    setCompilationError(null)
    
    try {
      const problem = problems[currentProblem]
      
      // Teste de conectividade primeiro usando o código real do usuário
      console.log('🔍 Testando conectividade com Judge0...')
      const isConnected = await testJudge0Connection(code, problem.functionName, problem.testCases[0]?.input)
      
      if (!isConnected) {
        console.error('❌ Judge0 não está disponível')
        setCompilationError('Judge0 não está disponível. Verifique se o Docker Desktop está rodando e os containers do Judge0 estão ativos.')
        return
      }
      
      console.log('✅ Judge0 está conectado, executando código...')
      
      console.log('🔍 DEBUG FRONTEND - Problem:', {
        currentProblem,
        problemTitle: problem?.title,
        functionName: problem?.functionName,
        testCasesCount: problem?.testCases?.length
      })
      
      const request: ExecutionRequest = {
        code,
        testCases: problem.testCases,
        languageId: JUDGE0_LANGUAGES.TYPESCRIPT, // TypeScript
        timeoutMs: EXECUTION_LIMITS.TIMEOUT_MS,
        functionName: problem.functionName
      }
      
      console.log('📤 DEBUG FRONTEND - Request sendo enviado:', {
        codeLength: code.length,
        testCasesCount: request.testCases.length,
        languageId: request.languageId,
        timeoutMs: request.timeoutMs,
        functionName: request.functionName,
        fullRequest: request
      })

      const response = await fetch('/api/execute-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })

      const result: ExecutionResponse = await response.json()
      
      console.log('📥 DEBUG FRONTEND - Response recebida:', {
        success: result.success,
        testResultsCount: result.testResults?.length,
        totalExecutionTime: result.totalExecutionTime,
        fullResponse: result
      })

      if (!result.success) {
        if (result.compilationError) {
          setCompilationError(result.compilationError)
        } else if (result.error) {
          setCompilationError(result.error)
        }
        return
      }

      setTestResults(result.testResults)
      
    } catch (error) {
      console.error('❌ DEBUG FRONTEND - Error executing code:', error)
      setCompilationError(CODE_EXECUTION.RETRY_MESSAGE)
    } finally {
      setIsRunning(false)
    }
  }

  const handleHint = () => {
    setShowHints(true)
    setHintsUsed((prev) => prev + 1)
  }

  const problem = problems[currentProblem]
  const passedTests = testResults.filter((test) => test.status === "passed").length
  const totalVisibleTests = testResults.filter((test) => !problem.testCases.find(tc => tc.input === test.input)?.hidden).length
  const totalTests = problem.testCases.length
  const hiddenTests = problem.testCases.filter((test) => test.hidden).length

  const getTimeColor = () => {
    if (timeLeft < CHALLENGE_TIMER.CRITICAL_THRESHOLD) return "text-red-500"
    if (timeLeft < CHALLENGE_TIMER.WARNING_THRESHOLD) return "text-yellow-500"
    return "text-foreground"
  }

  return (
    <div className="flex h-screen flex-col bg-background">
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
                     <BreadcrumbLink asChild>
                       <Link href={`/pre-challenge/${id}`}>Pre-Assessment</Link>
                     </BreadcrumbLink>
                   </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Assessment</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className={`h-4 w-4 ${getTimeColor()}`} />
                <span className={`font-mono text-sm ${getTimeColor()}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Problem {currentProblem + 1} of {problems.length}
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="text-sm text-muted-foreground">
                Hints used: {hintsUsed}/{EXECUTION_LIMITS.MAX_HINTS}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>AC</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[30%] border-r border-border/40 overflow-auto bg-background">
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">{problem.title}</h2>
                <Badge
                  variant={problem.difficulty === "Easy" ? "secondary" : problem.difficulty === "Medium" ? "default" : "destructive"}
                  className="mb-4"
                >
                  {problem.difficulty}
                </Badge>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3">Examples</h3>
                <div className="space-y-3">
                  {problem.examples.map((example, index) => (
                    <div key={index} className="rounded-lg border bg-muted/50 p-3">
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
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3">Constraints</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-muted-foreground mt-1.5 h-1 w-1 rounded-full bg-current flex-shrink-0" />
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>

              {showHints && (
                <div>
                  <Separator />
                  <div className="mt-6">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Hints
                    </h3>
                    <div className="space-y-2">
                      {problem.hints.slice(0, hintsUsed).map((hint, index) => (
                        <div key={index} className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                          <span className="font-medium">Hint {index + 1}:</span> {hint}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="border-b border-border/40 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Solution</h3>
                <div className="flex items-center gap-2">
                  {hintsUsed < EXECUTION_LIMITS.MAX_HINTS && (
                    <Button variant="outline" size="sm" onClick={handleHint}>
                      <HelpCircle className="h-4 w-4 mr-1" />
                      Get Hint ({hintsUsed}/{EXECUTION_LIMITS.MAX_HINTS})
                    </Button>
                  )}
                  <Button onClick={runCode} disabled={isRunning} size="sm">
                    {isRunning ? "Running..." : "Run Code"}
                  </Button>
                </div>
              </div>
            </div>

            {compilationError && (
              <div className="border-b border-border/40 bg-red-50 p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">{CODE_EXECUTION.COMPILATION_ERROR_TITLE}</p>
                    <pre className="text-xs text-red-700 mt-1 whitespace-pre-wrap font-mono">
                      {compilationError}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-hidden">
              <CodeEditor value={code} onChange={setCode} language="typescript" />
            </div>
          </div>

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
                  testResults.map((result, index) => {
                    const testCase = problem.testCases.find(tc => tc.input === result.input)
                    const isHidden = testCase?.hidden || false
                    
                    return (
                      <Card key={index} className={`${result.status === "passed" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
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
                                <span className="font-medium">Got:</span> {JSON.stringify(result.actualOutput)}
                              </div>
                            </>
                          )}
                          
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Time:</span> {result.executionTime}ms
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
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
        </div>
      </div>
    </div>
  )
}
