"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useChallengeOperations } from '@/hooks/useChallengeOperations'
import { ChallengeOperationData } from '@/hooks/useChallengeOperations'
import { useBaseStates } from '@/hooks/useBaseStates'
import { useUserRole } from '@/hooks/useUserRole'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/atoms/Button/Button"
import { Input } from "@/components/atoms/Input/Input"
import { Textarea } from "@/components/atoms/Textarea/Textarea"
import { Label } from "@/components/atoms/Label/Label"
import { LoadingState } from "@/components/molecules/LoadingState/LoadingState"
import { NotFoundState } from "@/components/molecules/NotFoundState/NotFoundState"
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { AdminRouteWrapper } from "@/components/atoms/AdminRouteWrapper/AdminRouteWrapper"
import { AdminNavigation } from "@/components/atoms/AdminNavigation/AdminNavigation"
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

interface EditChallengeProps {
  challengeId: string
}

export function EditChallenge({ challengeId }: EditChallengeProps) {
  const router = useRouter()
  const { updateChallenge } = useChallengeOperations()
  const { loading: updateLoading } = useBaseStates()
  const { role, label } = useUserRole()
  
  const [formData, setFormData] = useState<ChallengeOperationData>({
    title: '',
    description: '',
    difficulty: 'easy',
    category: '',
    skills: [],
    function_name: 'solution',
    initial_code: `function solution() {

    return null;
}`,
    test_cases: [],
    examples: [],
    constraints: [],
    hints: [],
    mentor: '',
    trending: false,
    trending_priority: null,
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
  const [isLoading, setIsLoading] = useState(true)
  const [challenge, setChallenge] = useState<any>(null)

  useEffect(() => {
    if (challengeId) {
      loadChallenge()
    }
  }, [challengeId])

  const loadChallenge = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/challenges/${challengeId}`)
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao carregar challenge')
      }

      if (result.data) {
        const challengeData = result.data
        setChallenge(challengeData)
        // Mapear dificuldade de número para string
        const getDifficultyString = (difficulty: number) => {
          switch (difficulty) {
            case 1: return 'easy'
            case 2: return 'medium'
            case 3: return 'hard'
            case 4: return 'expert'
            default: return 'easy'
          }
        }

        setFormData({
          title: challengeData.title || '',
          description: challengeData.description || '',
          difficulty: typeof challengeData.difficulty === 'number' ? getDifficultyString(challengeData.difficulty) : (challengeData.difficulty || 'easy'),
          category: challengeData.category || '',
          skills: challengeData.skills || [],
          function_name: challengeData.function_name || 'solution',
          initial_code: challengeData.initial_code || '',
          test_cases: challengeData.test_cases || [],
          examples: challengeData.examples || [],
          constraints: challengeData.constraints || [],
          hints: challengeData.hints || [],
          mentor: challengeData.mentor || '', // Incluir o campo mentor
          trending: challengeData.trending || false,
          trending_priority: challengeData.trending_priority || null,
        })

        if (challengeData.test_cases) {
          setTestCases(challengeData.test_cases.map((tc: any) => ({
            input: tc.input || '',
            expectedOutput: tc.expected_output || tc.expectedOutput || '',
            description: tc.description || '',
            hidden: tc.hidden || false
          })))
        }

        if (challengeData.examples) {
          setExamples(challengeData.examples.map((ex: any) => ({
            input: ex.input || '',
            output: ex.output || '',
            explanation: ex.explanation || ''
          })))
        }
      }
    } catch (error) {
      toast.error('Erro ao carregar challenge')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
    
    if (!formData.initial_code || !formData.initial_code.trim()) {
      toast.error('Código inicial é obrigatório')
      return
    }
    
    const { test_cases, examples, constraints, hints, ...challengeData } = formData
    
    const updateData: ChallengeOperationData = {
      ...challengeData,
      mentor: formData.mentor || challenge?.mentor || 'default_mentor',
    }

    try {
      const result = await updateChallenge(challengeId, updateData)
      if (result) {
        toast.success('Challenge atualizada com sucesso!')
        router.push(role === 'admin' ? '/admin' : '/teacher')
      } else {
        toast.error('Erro ao atualizar challenge')
      }
    } catch (error) {
      toast.error('Erro ao atualizar challenge')
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
        skills: formData.skills?.filter((s: string) => s !== skill) || []
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
        constraints: formData.constraints?.filter((_: any, i: number) => i !== index) || []
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
        hints: formData.hints?.filter((_: any, i: number) => i !== index) || []
      })
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (!challenge) {
    return <NotFoundState title="Challenge não encontrado" message="O challenge solicitado não foi encontrado." />
  }

  return (
    <AdminRouteWrapper allowedRoles={['superadmin', 'admin', 'mentor']}>
      <div className="min-h-screen bg-background">
        <AdminNavigation 
          items={[
            { label: role === 'admin' ? "Admin" : "Teacher", href: role === 'admin' ? "/admin" : "/teacher" },
            { label: "Editar Challenge", href: "#" }
          ]}
          showBackButton={true}
          backHref={role === 'admin' ? "/admin" : "/teacher"}
          backLabel="Voltar ao Dashboard"
          userName={label}
          userRole={label}
        />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href={role === 'admin' ? "/admin" : "/teacher"}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-primary">Editar Challenge</h1>
                <p className="text-gray-600 mt-2">
                  Modifique os dados da challenge "{challenge.title}"
                </p>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Ex: Two Sum"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="functionName">Nome da Função *</Label>
                    <Input
                      id="functionName"
                      value={formData.function_name}
                      onChange={(e) => handleInputChange("function_name", e.target.value)}
                      placeholder="Ex: twoSum"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Dificuldade</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => handleInputChange("difficulty", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Fácil</SelectItem>
                        <SelectItem value="medium">Médio</SelectItem>
                        <SelectItem value="hard">Difícil</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      placeholder="Ex: Algoritmos"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trending">Status Trending</Label>
                    <Select
                      value={formData.trending ? 'true' : 'false'}
                      onValueChange={(value) => handleInputChange("trending", value === 'true')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">Não Trending</SelectItem>
                        <SelectItem value="true">🔥 Trending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.trending && (
                    <div className="space-y-2">
                      <Label htmlFor="trending_priority">Prioridade Trending</Label>
                      <Input
                        id="trending_priority"
                        type="number"
                        min="1"
                        value={formData.trending_priority || 1}
                        onChange={(e) => handleInputChange("trending_priority", (parseInt(e.target.value) || 1).toString())}
                        placeholder="1 = maior prioridade"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Descreva o problema que a challenge resolve..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initialCode">Código Inicial *</Label>
                  <Textarea
                    id="initialCode"
                    value={formData.initial_code}
                    onChange={(e) => handleInputChange("initial_code", e.target.value)}
                    placeholder="Código inicial que será mostrado aos alunos..."
                    rows={8}
                    className="font-mono text-sm"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Habilidades */}
            <Card>
              <CardHeader>
                <CardTitle>Habilidades Necessárias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Adicionar habilidade..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills?.map((skill: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Restrições */}
            <Card>
              <CardHeader>
                <CardTitle>Restrições</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={constraintInput}
                    onChange={(e) => setConstraintInput(e.target.value)}
                    placeholder="Adicionar restrição..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addConstraint())}
                  />
                  <Button type="button" onClick={addConstraint} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.constraints?.map((constraint: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex-1">{constraint}</span>
                      <button
                        type="button"
                        onClick={() => removeConstraint(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dicas */}
            <Card>
              <CardHeader>
                <CardTitle>Dicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={hintInput}
                    onChange={(e) => setHintInput(e.target.value)}
                    placeholder="Adicionar dica..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHint())}
                  />
                  <Button type="button" onClick={addHint} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.hints?.map((hint: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex-1">{hint}</span>
                      <button
                        type="button"
                        onClick={() => removeHint(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Casos de Teste</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {testCases.map((testCase, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Caso de Teste {index + 1}</h4>
                      <Button
                        type="button"
                        onClick={() => removeTestCase(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Input</Label>
                        <Input
                          value={testCase.input}
                          onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                          placeholder="Input do teste..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Output Esperado</Label>
                        <Input
                          value={testCase.expectedOutput}
                          onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                          placeholder="Output esperado..."
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Input
                        value={testCase.description}
                        onChange={(e) => updateTestCase(index, 'description', e.target.value)}
                        placeholder="Descrição do teste..."
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addTestCase} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Caso de Teste
                </Button>
              </CardContent>
            </Card>

            {/* Exemplos */}
            <Card>
              <CardHeader>
                <CardTitle>Exemplos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {examples.map((example, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Exemplo {index + 1}</h4>
                      <Button
                        type="button"
                        onClick={() => removeExample(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Input</Label>
                        <Input
                          value={example.input}
                          onChange={(e) => updateExample(index, 'input', e.target.value)}
                          placeholder="Input do exemplo..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Output</Label>
                        <Input
                          value={example.output}
                          onChange={(e) => updateExample(index, 'output', e.target.value)}
                          placeholder="Output do exemplo..."
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Explicação</Label>
                      <Input
                        value={example.explanation}
                        onChange={(e) => updateExample(index, 'explanation', e.target.value)}
                        placeholder="Explicação do exemplo..."
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addExample} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Exemplo
                </Button>
              </CardContent>
            </Card>
          </form>
          
          <div className="flex gap-3 pt-6 border-t mt-6">
            <Button 
              onClick={handleSubmit} 
              disabled={updateLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <Button 
              variant="outline" 
              asChild
            >
              <Link href={role === 'admin' ? "/admin" : "/teacher"}>
                Cancelar
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AdminRouteWrapper>
  )
}
