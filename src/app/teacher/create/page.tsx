"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useChallengeManagement, CreateChallengeData } from "@/hooks/useChallengeManagement"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/atoms/Button/Button"
import { Input } from "@/components/atoms/Input/Input"
import { Textarea } from "@/components/atoms/Textarea/Textarea"
import { Label } from "@/components/atoms/Label/Label"
import { LoadingState } from "@/components/molecules/LoadingState/LoadingState"
import { NotFoundState } from "@/components/molecules/NotFoundState/NotFoundState"
import { Save, ArrowLeft, Plus, Trash2, BarChart3, Users, BookOpen } from "lucide-react"
import Link from "next/link"
import { AdminRouteWrapper } from "@/components/atoms/AdminRouteWrapper/AdminRouteWrapper"
import { AdminNavigation } from "@/components/atoms/AdminNavigation/AdminNavigation"
import { toast } from 'sonner'

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
    
    // Validação dos campos obrigatórios
    if (!formData.title.trim()) {
      toast.error('Título é obrigatório')
      return
    }
    
    if (!formData.description.trim()) {
      toast.error('Descrição é obrigatória')
      return
    }
    
    if (!formData.function_name.trim()) {
      toast.error('Nome da função é obrigatório')
      return
    }
    
    if (!formData.initial_code.trim()) {
      toast.error('Código inicial é obrigatório')
      return
    }
    
    const challengeData: CreateChallengeData = {
      ...formData,
      test_cases: testCases.filter(tc => tc.input && tc.expectedOutput),
      examples: examples.filter(ex => ex.input && ex.output),
    }



    try {
      const result = await createChallenge(challengeData)
      if (result) {
        toast.success('Challenge criada com sucesso!')
        router.push('/teacher')
      } else {
        toast.error('Erro ao criar challenge')
      }
    } catch (error) {
      console.error('Erro no handleSubmit:', error)
      toast.error('Erro ao criar challenge')
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
