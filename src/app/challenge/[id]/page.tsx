"use client"

import { useState, use } from "react"
import { CheckCircle, Target, AlertTriangle } from "lucide-react"
import { Button } from "@/components/atoms/Button/Button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/atoms/Progress/Progress"
import { CodeEditor } from "@/components/organisms/CodeEditor/CodeEditor"
import Link from "next/link"
import type { ExecutionRequest, ExecutionResponse, TestResult } from "@/types/execution"
import { problems, DEFAULT_CODE_TEMPLATE } from "@/consts/problems"
import { EXECUTION_LIMITS, CODE_EXECUTION } from "@/consts/ui"
import { JUDGE0_LANGUAGES } from '@/types/execution'
import { testJudge0Connection } from '@/lib/judge0-config'

export default function Assessment({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  const [code, setCode] = useState(DEFAULT_CODE_TEMPLATE)
  const [language, setLanguage] = useState("typescript")
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [compilationError, setCompilationError] = useState<string | null>(null)

  // FUNÇÃO ESSENCIAL - NÃO ALTERAR
  const runCode = async () => {
    setIsRunning(true)
    setCompilationError(null)
    
    try {
      const problem = problems[0] // Simplificado: sempre primeiro problema
      
      // Teste de conectividade primeiro
      console.log('🔍 Testando conectividade com Judge0...')
      const isConnected = await testJudge0Connection()
      
      if (!isConnected) {
        console.error('❌ Judge0 não está disponível')
        setCompilationError('Judge0 não está disponível. Verifique se o Docker Desktop está rodando e os containers do Judge0 estão ativos.')
        return
      }
      
      console.log('✅ Judge0 está conectado, executando código...')
      
      const request: ExecutionRequest = {
        code,
        testCases: problem.testCases,
        languageId: language === "typescript" ? JUDGE0_LANGUAGES.TYPESCRIPT : JUDGE0_LANGUAGES.JAVASCRIPT,
        timeoutMs: EXECUTION_LIMITS.TIMEOUT_MS,
        functionName: problem.functionName
      }

      const response = await fetch('/api/execute-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })

      const result: ExecutionResponse = await response.json()

      // Sempre definir os resultados dos testes, independente do sucesso
      setTestResults(result.testResults)
      
      // Se não foi bem-sucedido, mostrar erro de compilação se houver
      if (!result.success) {
        if (result.compilationError) {
          setCompilationError(result.compilationError)
        } else if (result.error) {
          setCompilationError(result.error)
        }
      } else {
        // Limpar erros se tudo passou
        setCompilationError(null)
      }
      
    } catch (error) {
      console.error('❌ DEBUG FRONTEND - Error executing code:', error)
      setCompilationError(CODE_EXECUTION.RETRY_MESSAGE)
    } finally {
      setIsRunning(false)
    }
  }

  const problem = problems[0] // Simplificado: sempre primeiro problema
  const passedTests = testResults.filter((test) => test.status === "passed").length
  const totalTests = problem.testCases.length

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="shrink-0 border-b border-border/40 bg-background/95 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Voltar ao Dashboard
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <h1 className="text-lg font-semibold">Code Challenge</h1>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Painel esquerdo - Descrição do problema */}
        <div className="w-[30%] border-r border-border/40 overflow-auto bg-background">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">{problem.title}</h2>
              <Badge variant="secondary" className="mb-4">
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
          </div>
        </div>

        {/* Painel central - Editor de código */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-border/40 p-4">
            <h3 className="font-medium">Solution</h3>
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
            <CodeEditor 
              value={code} 
              onChange={setCode} 
              language={language}
              onLanguageChange={setLanguage}
              onRun={runCode}
              isRunning={isRunning}
              showRunButton={true}
            />
          </div>
        </div>

        {/* Painel direito - Resultados dos testes */}
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
                  const normalizedResultInput = result.input.replace(/\s/g, '')
                  const testCase = problem.testCases.find(tc => 
                    tc.input.replace(/\s/g, '') === normalizedResultInput
                  )
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
                })
              ) : (
                <div className="text-center text-muted-foreground text-sm py-8">
                  Run your code to see test results
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
