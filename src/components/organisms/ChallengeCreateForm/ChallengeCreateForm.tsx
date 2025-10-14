"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useChallengeOperations, ChallengeOperationData } from "@/hooks/useChallengeOperations"
import { useUserRole } from "@/hooks/useUserRole"
import { useBaseStates } from "@/hooks/useBaseStates"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/atoms/Button/Button"
import { Input } from "@/components/atoms/Input/Input"
import { Textarea } from "@/components/atoms/Textarea/Textarea"
import { Label } from "@/components/atoms/Label/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { DIFFICULTY_OPTIONS } from "@/types/admin/admin-dashboard"
import { CATEGORY_OPTIONS } from "@/consts/challenge-form"

interface TestCase {
  input: string
  expectedOutput: string
}

interface Example {
  input: string
  output: string
  explanation: string
}

export function ChallengeCreateForm() {
  const router = useRouter()
  const { createChallenge } = useChallengeOperations()
  const { loading } = useBaseStates()
  const { isAdmin } = useUserRole()
  
  const [formData, setFormData] = useState<ChallengeOperationData>({
    title: "",
    description: "",
    difficulty: "easy",
    category: [],
    function_name: "",
    initial_code: `function solution() {
    // Seu código aqui
    return null;
}`,
    testCases: [],
    examples: [],
    status: isAdmin ? "draft" : "to_approve"
    // mentor removido - será derivado automaticamente do usuário logado
  })

  const [testCase, setTestCase] = useState<TestCase>({
    input: "",
    expectedOutput: ""
  })

  const [example, setExample] = useState<Example>({
    input: "",
    output: "",
    explanation: ""
  })

  const handleInputChange = (field: keyof ChallengeOperationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      category: checked 
        ? [...(Array.isArray(prev.category) ? prev.category : []), category]
        : (Array.isArray(prev.category) ? prev.category : []).filter((c: string) => c !== category)
    }))
  }

  const addTestCase = () => {
    if (testCase.input.trim() && testCase.expectedOutput.trim()) {
      const newTestCase = {
        input: testCase.input.trim(),
        expectedOutput: testCase.expectedOutput.trim()
      }
      setFormData(prev => ({
        ...prev,
        testCases: [...(prev.testCases || []), newTestCase]
      }))
      setTestCase({ input: "", expectedOutput: "" })
    }
  }

  const removeTestCase = (index: number) => {
    setFormData(prev => ({
      ...prev,
      testCases: (prev.testCases || []).filter((_: any, i: number) => i !== index)
    }))
  }

  const addExample = () => {
    if (example.input.trim() && example.output.trim()) {
      const newExample = {
        input: example.input.trim(),
        output: example.output.trim(),
        explanation: example.explanation.trim()
      }
      setFormData(prev => ({
        ...prev,
        examples: [...(prev.examples || []), newExample]
      }))
      setExample({ input: "", output: "", explanation: "" })
    }
  }

  const removeExample = (index: number) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples?.filter((_: any, i: number) => i !== index) || []
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.function_name.trim() || !formData.initial_code?.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios")
      return
    }



    try {
      const result = await createChallenge(formData)
      if (result) {
        toast.success("Challenge criado com sucesso!")
        router.push(isAdmin ? "/admin" : "/teacher")
      } else {
        toast.error("Erro ao criar challenge")
      }
    } catch (error) {
      console.error('❌ ChallengeCreateForm: Erro ao criar challenge:', error)
      toast.error("Erro ao criar challenge")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" onKeyDown={(e) => {
      if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      }
    }}>
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descreva o problema..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Dificuldade</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => handleInputChange("difficulty", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a dificuldade" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="function_name">Nome da Função *</Label>
              <Input
                id="function_name"
                value={formData.function_name}
                onChange={(e) => handleInputChange("function_name", e.target.value)}
                placeholder="Ex: twoSum"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categorias</Label>
            <div className="grid grid-cols-2 gap-2 p-3 border rounded-md">
              {CATEGORY_OPTIONS.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`category-${category}`}
                    checked={(formData.category || []).includes(category)}
                    onChange={(e) => handleCategoryChange(category, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
            {(formData.category || []).length > 0 && (
              <div className="text-sm text-muted-foreground">
                Selecionadas: {Array.isArray(formData.category) ? formData.category.join(", ") : formData.category || ""}
              </div>
            )}
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Código Inicial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="initial_code">Código Inicial</Label>
            <Textarea
              id="initial_code"
              value={formData.initial_code}
              onChange={(e) => handleInputChange("initial_code", e.target.value)}
              placeholder="function twoSum(nums, target) {&#10;    // Seu código aqui&#10;}"
              rows={8}
              className="font-mono"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exemplos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exampleInput">Input do Exemplo</Label>
              <Textarea
                id="exampleInput"
                value={example.input}
                onChange={(e) => setExample(prev => ({ ...prev, input: e.target.value }))}
                placeholder='Ex: nums = [2,7,11,15], target = 9'
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exampleOutput">Output do Exemplo</Label>
              <Textarea
                id="exampleOutput"
                value={example.output}
                onChange={(e) => setExample(prev => ({ ...prev, output: e.target.value }))}
                placeholder='Ex: [0,1]'
                rows={3}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="exampleExplanation">Explicação (Opcional)</Label>
            <Textarea
              id="exampleExplanation"
              value={example.explanation}
              onChange={(e) => setExample(prev => ({ ...prev, explanation: e.target.value }))}
              placeholder='Ex: Porque nums[0] + nums[1] == 9, retornamos [0, 1].'
              rows={2}
            />
          </div>
          
          <Button type="button" onClick={addExample} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Exemplo
          </Button>

          {formData.examples && formData.examples.length > 0 && (
            <div className="space-y-2">
              <Label>Exemplos Adicionados ({formData.examples.length})</Label>
              <div className="space-y-2">
                {formData.examples.map((example: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <div className="flex-1">
                      <div className="text-sm font-medium">Exemplo {index + 1}</div>
                      <div className="text-xs text-muted-foreground">
                        Input: {example.input}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Output: {example.output}
                      </div>
                      {(example as any).explanation && (
                        <div className="text-xs text-muted-foreground">
                          Explicação: {(example as any).explanation}
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeExample(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Casos de Teste</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testInput">Input</Label>
              <Textarea
                id="testInput"
                value={testCase.input}
                onChange={(e) => setTestCase(prev => ({ ...prev, input: e.target.value }))}
                placeholder='Ex: [2,7,11,15], 9'
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testOutput">Output Esperado</Label>
              <Textarea
                id="testOutput"
                value={testCase.expectedOutput}
                onChange={(e) => setTestCase(prev => ({ ...prev, expectedOutput: e.target.value }))}
                placeholder='Ex: [0,1]'
                rows={3}
              />
            </div>
          </div>
          
          <Button type="button" onClick={addTestCase} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Caso de Teste
          </Button>

          {(formData.testCases || []).length > 0 && (
            <div className="space-y-2">
              <Label>Casos de Teste Adicionados ({(formData.testCases || []).length})</Label>
              <div className="space-y-2">
                {(formData.testCases || []).map((testCase: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <div className="flex-1">
                      <div className="text-sm font-medium">Caso {index + 1}</div>
                      <div className="text-xs text-muted-foreground">
                        Input: {testCase.input} | Output: {testCase.expectedOutput}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTestCase(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/teacher">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/">Inicio</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Salvando..." : "Salvar Challenge"}
          </Button>
        </div>
      </div>
    </form>
  )
}
