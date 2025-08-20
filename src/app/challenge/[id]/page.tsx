"use client"

import { useState, use } from "react"
import { CheckCircle, Target, AlertTriangle, Play, Square, RefreshCw } from "lucide-react"
import { Button } from "@/components/atoms/Button/Button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/atoms/Progress/Progress"
import { CodeEditor } from "@/components/organisms/CodeEditor/CodeEditor"
import Link from "next/link"
import { useTestRunner } from "@/hooks/useTestRunner"
import type { TestResult } from "@/types/test-cases"
import { problems, DEFAULT_CODE_TEMPLATE } from "@/consts/problems"
import { EXECUTION_LIMITS, CODE_EXECUTION } from "@/consts/ui"
import { JUDGE0_LANGUAGES } from '@/types/execution'
import { testJudge0Connection } from '@/lib/judge0-config'

export default function Assessment({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  // Buscar o problema específico
  const currentProblem = problems[id]
  
  // Se não encontrar o problema, mostrar erro
  if (!currentProblem) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Problema não encontrado</h1>
          <p className="text-gray-600">ID: {id}</p>
          <p className="text-gray-600">Problemas disponíveis: {Object.keys(problems).join(', ')}</p>
        </div>
      </div>
    )
  }
  
  const [code, setCode] = useState(DEFAULT_CODE_TEMPLATE)
  const [language, setLanguage] = useState("typescript")
  const [compilationError, setCompilationError] = useState<string | null>(null)
  
  // Novo sistema de testes determinísticos
  const {
    isRunning,
    progress,
    results: testResults,
    error: testError,
    runTests,
    cancelTests,
    generateTestCases,
    reset: resetTests
  } = useTestRunner()
  
  // Estado manual para compatibilidade com sistema híbrido
  const [manualResults, setManualResults] = useState(null)
  const [manualLoading, setManualLoading] = useState(false)
  const finalResults = testResults || manualResults
  const finalLoading = isRunning || manualLoading
  
  const setResults = (results) => {
    setManualResults(results)
  }

  // Função de execução híbrida: geração determinística + execução tradicional
  const runCode = async () => {
    console.log('🚀 Executando código...')
    
    // Iniciar loading
    setManualLoading(true)
    
    try {
      // Teste de conectividade primeiro
      console.log('🔍 Testando conectividade com Judge0...')
      const isConnected = await testJudge0Connection()
      
      if (!isConnected) {
        console.error('❌ Judge0 não está disponível')
        setCompilationError('Judge0 não está disponível. Verifique se o Docker Desktop está rodando e os containers do Judge0 estão ativos.')
        return
      }
      
      // Limpar erros anteriores
      setCompilationError(null)
      resetTests()
      setManualResults(null)
      
      // Gerar casos de teste determinísticos
      const seed = Date.now()
      const generatedTestCases = generateTestCases(id, seed, 10)
      
      // Converter para formato tradicional
      const traditionalTestCases = generatedTestCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.expected_output,
        description: tc.description || '',
        hidden: tc.is_hidden
      }))
      
      // Usar o sistema tradicional de execução
      const request = {
        code,
        testCases: traditionalTestCases,
        languageId: 63, // Forçar JavaScript para validação mais rigorosa
        timeoutMs: 5000,
        functionName: currentProblem.functionName
      }

      const response = await fetch('/api/execute-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })

      const result = await response.json()
      
      // Converter resultados de volta para o formato do useTestRunner
      if (result.success && result.testResults) {
        const testSummary = {
          passCount: result.testResults.filter(r => r.status === 'passed').length,
          failCount: result.testResults.filter(r => r.status === 'failed').length,
          totalCount: result.testResults.length,
          details: result.testResults.map(r => ({
            testCaseId: `test_${seed}_${result.testResults.indexOf(r)}`,
            input: r.input,
            expectedOutput: r.expectedOutput,
            actualOutput: r.actualOutput,
            status: r.status,
            executionTime: r.executionTime,
            errorMessage: r.error
          })),
          totalExecutionTime: result.totalExecutionTime
        }
        
        // Usar o setter do useTestRunner
        setResults(testSummary)
      } else {
        // Se há erro de compilação, mostrar no topo
        if (result.compilationError) {
          setCompilationError(`Erro de Compilação: ${result.compilationError}`)
        } else if (result.error) {
          setCompilationError(`Erro: ${result.error}`)
        } else if (result.testResults && result.testResults.length > 0) {
          // Se há resultados mas success=false, ainda mostrar os resultados
          const testSummary = {
            passCount: result.testResults.filter(r => r.status === 'passed').length,
            failCount: result.testResults.filter(r => r.status === 'failed').length,
            totalCount: result.testResults.length,
            details: result.testResults.map(r => ({
              testCaseId: `test_${seed}_${result.testResults.indexOf(r)}`,
              input: r.input,
              expectedOutput: r.expectedOutput,
              actualOutput: r.actualOutput,
              status: r.status,
              executionTime: r.executionTime,
              errorMessage: r.error
            })),
            totalExecutionTime: result.totalExecutionTime || 0
          }
          setResults(testSummary)
        } else {
          setCompilationError('Erro durante execução. Verifique seu código e tente novamente.')
        }
      }
      
    } catch (error) {
      console.error('❌ Erro ao executar testes:', error)
      setCompilationError('Erro ao executar testes. Tente novamente.')
    } finally {
      // Parar loading
      setManualLoading(false)
    }
  }

  const problem = problems[0] // Simplificado: sempre primeiro problema
  const passedTests = finalResults?.details?.filter((test) => test.status === "passed").length || 0
  const totalTests = finalResults?.totalCount || 0

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="shrink-0 border-b border-border/40 bg-background/95 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Voltar ao Dashboard
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <h1 className="text-lg font-semibold">{currentProblem.title}</h1>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Painel esquerdo - Descrição do problema */}
        <div className="w-[30%] border-r border-border/40 overflow-auto bg-background">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">{currentProblem.title}</h2>
              <Badge variant="secondary" className="mb-4">
                {currentProblem.difficulty}
              </Badge>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentProblem.description}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Examples</h3>
              <div className="space-y-3">
                {currentProblem.examples.map((example, index) => (
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
              isRunning={finalLoading}
              showRunButton={true}
            />
            
            {/* Controles de teste adicionais */}
            {finalLoading && (
              <div className="border-t border-border/40 p-4 bg-muted/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">Executando testes determinísticos...</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={cancelTests}
                    className="h-8"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            {/* Resumo dos resultados */}
            {finalResults && !finalLoading && (
              <div className="border-t border-border/40 p-4 bg-muted/20">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Resultado dos Testes Determinísticos</h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => { resetTests(); setManualResults(null) }}
                    className="h-8"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Limpar
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{finalResults.passCount}</div>
                    <div className="text-muted-foreground">Passaram</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{finalResults.failCount}</div>
                    <div className="text-muted-foreground">Falharam</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{finalResults.totalExecutionTime}ms</div>
                    <div className="text-muted-foreground">Tempo Total</div>
                  </div>
                </div>
              </div>
            )}
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
              {finalResults?.details && finalResults.details.length > 0 ? (
                finalResults.details.map((result, index) => {
                  const isHidden = index >= 3 // Primeiros 3 casos são visíveis
                  
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
                              <span className="font-medium">Expected:</span> {result.expectedOutput}
                            </div>
                            <div className="text-xs text-muted-foreground mb-1">
                              <span className="font-medium">Got:</span> {result.actualOutput ? result.actualOutput : 'No output'}
                            </div>
                            {result.status === 'failed' && result.errorMessage && (
                              <div className="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded">
                                <span className="font-medium">Error:</span> {result.errorMessage}
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
