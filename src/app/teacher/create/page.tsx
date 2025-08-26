"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useChallengeManagement, CreateChallengeData } from "@/hooks/useChallengeManagement"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/atoms/Button/Button"
import { Input } from "@/components/atoms/Input/Input"
import { Textarea } from "@/components/atoms/Textarea/Textarea"
import { Label } from "@/components/atoms/Label/Label"
import { LoadingState } from "@/components/molecules/LoadingState"
import { NotFoundState } from "@/components/molecules/NotFoundState"
import { Save, ArrowLeft, Plus, Trash2, BarChart3, Users, BookOpen } from "lucide-react"
import Link from "next/link"
import { AdminRouteWrapper } from "@/components/atoms/AdminRouteWrapper"
import { AdminNavigation } from "@/components/atoms/AdminNavigation"

interface TestCase {
  input: string
  expectedOutput: string
  description: string
  hidden: boolean
}

interface Example {
  input: string
  output: string
  explanation: string
}

export default function CreateChallenge() {
  const router = useRouter()
  const { createChallenge, loading: createLoading } = useChallengeManagement()
  
  const [formData, setFormData] = useState<CreateChallengeData>({
    title: '',
    description: '',
    difficulty: 'easy',
    category: '',
    skills: [],
    function_name: 'solution',
    initial_code: `function solution() {
    // Your code here
    return null;
}`,
    test_cases: [],
    examples: [],
    constraints: [],
    hints: [],
    estimated_time_minutes: 30
  })

  // Estado para o sistema de compilação
  const [compilationResult, setCompilationResult] = useState<{
    success: boolean
    output: any
    error: string | null
    executionTime: number
  } | null>(null)
  
  const [isCompiling, setIsCompiling] = useState(false)
  const [testInput, setTestInput] = useState('')
  const [expectedOutput, setExpectedOutput] = useState('')

  // Função para compilar e testar o código
  const compileAndTest = async () => {
    if (!testInput.trim() || !formData.initial_code.trim()) {
      alert('Por favor, preencha o input de teste e o código inicial')
      return
    }

    setIsCompiling(true)
    setCompilationResult(null)

    try {
      const startTime = performance.now()
      
      // Cria uma função segura para execução
      const safeEval = new Function('input', `
        try {
          ${formData.initial_code}
          
          // Chama a função com o input
          const result = ${formData.function_name}(${testInput});
          return { success: true, output: result };
        } catch (error) {
          return { success: false, error: error.message };
        }
      `)

      // Executa com timeout de segurança
      const result = await Promise.race([
        safeEval(testInput),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout: Código demorou muito para executar')), 5000)
        )
      ])

      const endTime = performance.now()
      const executionTime = endTime - startTime

      if (result.success) {
        setCompilationResult({
          success: true,
          output: result.output,
          error: null,
          executionTime: Math.round(executionTime)
        })
        
        // Atualiza automaticamente o output esperado
        setExpectedOutput(JSON.stringify(result.output))
      } else {
        setCompilationResult({
          success: false,
          output: null,
          error: result.error,
          executionTime: Math.round(executionTime)
        })
      }
    } catch (error) {
      setCompilationResult({
        success: false,
        output: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        executionTime: 0
      })
    } finally {
      setIsCompiling(false)
    }
  }

  // Função para salvar o teste com output validado
  const saveValidatedTest = () => {
    if (!compilationResult?.success || !testInput.trim()) {
      alert('Por favor, compile um teste válido primeiro')
      return
    }

    const newTestCase = {
      input: testInput,
      expectedOutput: JSON.stringify(compilationResult.output),
      description: `Teste validado - Output: ${JSON.stringify(compilationResult.output)}`,
      hidden: false
    }

    setTestCases([...testCases, newTestCase])
    
    // Limpa os campos
    setTestInput('')
    setExpectedOutput('')
    setCompilationResult(null)
    
    alert('Teste salvo com sucesso!')
  }

  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: '', expectedOutput: '', description: '', hidden: false }
  ])

  const [examples, setExamples] = useState<Example[]>([
    { input: '', output: '', explanation: '' }
  ])

  const [skillInput, setSkillInput] = useState('')
  const [constraintInput, setConstraintInput] = useState('')
  const [hintInput, setHintInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const challengeData: CreateChallengeData = {
      ...formData,
      test_cases: testCases.filter(tc => tc.input && tc.expectedOutput),
      examples: examples.filter(ex => ex.input && ex.output),
    }

    const result = await createChallenge(challengeData)
    if (result) {
      router.push('/teacher')
    }
  }

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '', description: '', hidden: false }])
  }

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index))
  }

  const updateTestCase = (index: number, field: keyof TestCase, value: string | boolean) => {
    const updated = [...testCases]
    updated[index] = { ...updated[index], [field]: value }
    setTestCases(updated)
  }

  const addExample = () => {
    setExamples([...examples, { input: '', output: '', explanation: '' }])
  }

  const removeExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index))
  }

  const updateExample = (index: number, field: keyof Example, value: string) => {
    const updated = [...examples]
    updated[index] = { ...updated[index], [field]: value }
    setExamples(updated)
  }

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills?.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), skillInput.trim()]
      })
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter(s => s !== skill) || []
    })
  }

  const addConstraint = () => {
    if (constraintInput.trim()) {
      setFormData({
        ...formData,
        constraints: [...(formData.constraints || []), constraintInput.trim()]
      })
      setConstraintInput('')
    }
  }

  const removeConstraint = (index: number) => {
    setFormData({
      ...formData,
      constraints: formData.constraints?.filter((_, i) => i !== index) || []
    })
  }

  const addHint = () => {
    if (hintInput.trim()) {
      setFormData({
        ...formData,
        hints: [...(formData.hints || []), hintInput.trim()]
      })
      setHintInput('')
    }
  }

  const removeHint = (index: number) => {
    setFormData({
      ...formData,
      hints: formData.hints?.filter((_, i) => i !== index) || []
    })
  }

  return (
    <AdminRouteWrapper>
      <AdminNavigation 
        items={[
          { label: "Dashboard Teacher", href: "/teacher" },
          { label: "Criar Challenge", href: "/teacher/create" }
        ]}
        quickActions={[
          {
            label: "Dashboard Admin",
            href: "/admin",
            icon: <BarChart3 className="h-4 w-4" />,
            variant: "outline"
          },
          {
            label: "Dashboard Teacher",
            href: "/teacher",
            icon: <Users className="h-4 w-4" />,
            variant: "outline"
          },
          {
            label: "Mentoria",
            href: "/mentoria",
            icon: <BookOpen className="h-4 w-4" />,
            variant: "outline"
          }
        ]}
        showUserInfo={true}
        userName="Professor"
        userRole="Teacher"
      />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-background/95 backdrop-blur border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-primary">Criar Novo Challenge</h1>
                <p className="text-muted-foreground">Defina todos os detalhes do seu challenge</p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" asChild>
                  <Link href="/admin">Dashboard Admin</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Dashboard Principal</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Two Sum"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o problema detalhadamente..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="difficulty">Dificuldade</Label>
                    <select
                      id="difficulty"
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    >
                      <option value="beginner">Iniciante</option>
                      <option value="easy">Fácil</option>
                      <option value="medium">Médio</option>
                      <option value="hard">Difícil</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Ex: Algoritmos"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="time">Tempo Estimado (min)</Label>
                  <Input
                    id="time"
                    type="number"
                    value={formData.estimated_time_minutes}
                    onChange={(e) => setFormData({ ...formData, estimated_time_minutes: parseInt(e.target.value) || 30 })}
                    min="5"
                    max="180"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Código Inicial */}
            <Card>
              <CardHeader>
                <CardTitle>Código Inicial</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="function_name">Nome da Função *</Label>
                  <Input
                    id="function_name"
                    value={formData.function_name}
                    onChange={(e) => setFormData({ ...formData, function_name: e.target.value })}
                    placeholder="Ex: twoSum"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="initial_code">Código Template *</Label>
                  <Textarea
                    id="initial_code"
                    value={formData.initial_code}
                    onChange={(e) => setFormData({ ...formData, initial_code: e.target.value })}
                    rows={8}
                    className="font-mono"
                    required
                  />
                </div>

                {/* Sistema de Teste Integrado */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    🧪 <span>Teste seu Código em Tempo Real</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="testInput" className="text-blue-700">Input de Teste *</Label>
                      <Input
                        id="testInput"
                        value={testInput}
                        onChange={(e) => setTestInput(e.target.value)}
                        placeholder="Ex: [2, 7, 11, 15], 9"
                        className="border-blue-300"
                      />
                      <p className="text-sm text-blue-600 mt-1">
                        Digite o input para testar seu código
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="expectedOutput" className="text-blue-700">Output Esperado</Label>
                      <Input
                        id="expectedOutput"
                        value={expectedOutput}
                        onChange={(e) => setExpectedOutput(e.target.value)}
                        placeholder="Será preenchido automaticamente"
                        className="border-blue-300"
                        readOnly
                      />
                      <p className="text-sm text-blue-600 mt-1">
                        Resultado da compilação
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mb-4">
                    <Button 
                      type="button" 
                      onClick={compileAndTest}
                      disabled={isCompiling || !testInput.trim() || !formData.initial_code.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isCompiling ? (
                        <>⏳ Compilando...</>
                      ) : (
                        <>🚀 Compilar e Testar</>
                      )}
                    </Button>
                    
                    {compilationResult?.success && (
                      <Button 
                        type="button" 
                        onClick={saveValidatedTest}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        ✅ Salvar Teste Validado
                      </Button>
                    )}
                  </div>
                  
                  {/* Resultado da Compilação */}
                  {compilationResult && (
                    <div className={`p-4 rounded-lg border ${
                      compilationResult.success 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {compilationResult.success ? (
                          <>✅ <span className="font-semibold text-green-800">Compilação Bem-sucedida!</span></>
                        ) : (
                          <>❌ <span className="font-semibold text-red-800">Erro na Compilação</span></>
                        )}
                      </div>
                      
                      {compilationResult.success ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-green-700 font-medium">Output:</span>
                            <code className="bg-green-100 px-2 py-1 rounded text-green-800">
                              {JSON.stringify(compilationResult.output)}
                            </code>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-700 font-medium">Tempo de Execução:</span>
                            <span className="text-green-800">{compilationResult.executionTime}ms</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-red-700">
                          <span className="font-medium">Erro:</span> {compilationResult.error}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="text-sm text-blue-600 bg-white p-3 rounded border">
                    <strong>💡 Como usar:</strong> 
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Escreva seu código acima</li>
                      <li>Digite um input de teste</li>
                      <li>Clique em "Compilar e Testar"</li>
                      <li>Se der certo, clique em "Salvar Teste Validado"</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Casos de Teste */}
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Casos de Teste</CardTitle>
                <Button type="button" onClick={addTestCase} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {testCases.map((testCase, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Caso de Teste {index + 1}</h4>
                      {testCases.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeTestCase(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Input</Label>
                        <Input
                          value={testCase.input}
                          onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                          placeholder="Ex: [2,7,11,15], 9"
                        />
                      </div>
                      <div>
                        <Label>Output Esperado</Label>
                        <Input
                          value={testCase.expectedOutput}
                          onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                          placeholder="Ex: [0,1]"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Descrição</Label>
                      <Input
                        value={testCase.description}
                        onChange={(e) => updateTestCase(index, 'description', e.target.value)}
                        placeholder="Descrição do caso de teste"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`hidden-${index}`}
                        checked={testCase.hidden}
                        onChange={(e) => updateTestCase(index, 'hidden', e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor={`hidden-${index}`}>Teste oculto</Label>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/teacher">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={createLoading}>
                {createLoading ? (
                  <>Criando...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Criar Challenge
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminRouteWrapper>
  )
}
