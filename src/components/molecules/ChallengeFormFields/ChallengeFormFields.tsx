"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/atoms/Input/Input"
import { Textarea } from "@/components/atoms/Textarea/Textarea"
import { Label } from "@/components/atoms/Label/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/atoms/Button/Button"
import { Plus, Trash2 } from "lucide-react"
import { DIFFICULTY_OPTIONS } from "@/types/admin/admin-dashboard"
import { CATEGORY_OPTIONS } from "@/consts/challenge-form"
import { ChallengeOperationData } from "@/hooks/useChallengeOperations"
import { TestCase, Example } from "@/hooks/challenge/useChallengeForm"
import { useState } from "react"

interface ChallengeFormFieldsProps {
  formData: ChallengeOperationData
  testCases: TestCase[]
  examples: Example[]
  skills: string[]
  constraints: string[]
  hints: string[]
  onInputChange: (field: keyof ChallengeOperationData, value: any) => void
  onCategoryChange: (category: string, checked: boolean) => void
  onAddTestCase: (testCase: TestCase) => boolean
  onRemoveTestCase: (index: number) => void
  onAddExample: (example: Example) => boolean
  onRemoveExample: (index: number) => void
  onAddSkill: (skill: string) => boolean
  onRemoveSkill: (index: number) => void
  onAddConstraint: (constraint: string) => boolean
  onRemoveConstraint: (index: number) => void
  onAddHint: (hint: string) => boolean
  onRemoveHint: (index: number) => void
  disabled?: boolean
  showAdminFields?: boolean
  showExtraFields?: boolean
}

export function ChallengeFormFields({
  formData,
  testCases,
  examples,
  skills,
  constraints,
  hints,
  onInputChange,
  onCategoryChange,
  onAddTestCase,
  onRemoveTestCase,
  onAddExample,
  onRemoveExample,
  onAddSkill,
  onRemoveSkill,
  onAddConstraint,
  onRemoveConstraint,
  onAddHint,
  onRemoveHint,
  disabled = false,
  showAdminFields = false,
  showExtraFields = true
}: ChallengeFormFieldsProps) {
  const [testCaseInput, setTestCaseInput] = useState({ input: '', expectedOutput: '', description: '', hidden: false })
  const [exampleInput, setExampleInput] = useState({ input: '', output: '', explanation: '' })
  const [skillInput, setSkillInput] = useState('')
  const [constraintInput, setConstraintInput] = useState('')
  const [hintInput, setHintInput] = useState('')

  const handleAddTestCase = () => {
    const success = onAddTestCase(testCaseInput)
    if (success) {
      setTestCaseInput({ input: '', expectedOutput: '', description: '', hidden: false })
    }
  }

  const handleAddExample = () => {
    const success = onAddExample(exampleInput)
    if (success) {
      setExampleInput({ input: '', output: '', explanation: '' })
    }
  }

  const handleAddSkill = () => {
    const success = onAddSkill(skillInput)
    if (success) {
      setSkillInput('')
    }
  }

  const handleAddConstraint = () => {
    const success = onAddConstraint(constraintInput)
    if (success) {
      setConstraintInput('')
    }
  }

  const handleAddHint = () => {
    const success = onAddHint(hintInput)
    if (success) {
      setHintInput('')
    }
  }

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
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
              onChange={(e) => onInputChange("title", e.target.value)}
              placeholder="Ex: Two Sum"
              disabled={disabled}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onInputChange("description", e.target.value)}
              placeholder="Descreva o problema..."
              rows={4}
              disabled={disabled}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Dificuldade *</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => onInputChange("difficulty", value)}
                disabled={disabled}
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
                onChange={(e) => onInputChange("function_name", e.target.value)}
                placeholder="Ex: twoSum"
                disabled={disabled}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categorias *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-md">
              {CATEGORY_OPTIONS.map(category => {
                const currentCategories = Array.isArray(formData.category) ? formData.category : []
                return (
                  <div key={category} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`category-${category}`}
                      checked={currentCategories.includes(category)}
                      onChange={(e) => onCategoryChange(category, e.target.checked)}
                      disabled={disabled}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                      {category}
                    </Label>
                  </div>
                )
              })}
            </div>
            {Array.isArray(formData.category) && formData.category.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Selecionadas: {formData.category.join(", ")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Código Inicial */}
      <Card>
        <CardHeader>
          <CardTitle>Código Inicial *</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="initial_code">Código que o aluno verá inicialmente</Label>
            <Textarea
              id="initial_code"
              value={formData.initial_code}
              onChange={(e) => onInputChange("initial_code", e.target.value)}
              placeholder="function twoSum(nums, target) {&#10;    // Seu código aqui&#10;}"
              rows={10}
              className="font-mono text-sm"
              disabled={disabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Exemplos */}
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
                value={exampleInput.input}
                onChange={(e) => setExampleInput(prev => ({ ...prev, input: e.target.value }))}
                placeholder='Ex: nums = [2,7,11,15], target = 9'
                rows={3}
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exampleOutput">Output do Exemplo</Label>
              <Textarea
                id="exampleOutput"
                value={exampleInput.output}
                onChange={(e) => setExampleInput(prev => ({ ...prev, output: e.target.value }))}
                placeholder='Ex: [0,1]'
                rows={3}
                disabled={disabled}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="exampleExplanation">Explicação (Opcional)</Label>
            <Textarea
              id="exampleExplanation"
              value={exampleInput.explanation}
              onChange={(e) => setExampleInput(prev => ({ ...prev, explanation: e.target.value }))}
              placeholder='Ex: Porque nums[0] + nums[1] == 9, retornamos [0, 1].'
              rows={2}
              disabled={disabled}
            />
          </div>
          <Button type="button" onClick={handleAddExample} variant="outline" disabled={disabled}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Exemplo
          </Button>

          {examples.length > 0 && (
            <div className="space-y-2">
              <Label>Exemplos Adicionados ({examples.length})</Label>
              <div className="space-y-2">
                {examples.map((example, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 border rounded">
                    <div className="flex-1">
                      <div className="text-sm font-medium">Exemplo {index + 1}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        <div><strong>Input:</strong> {example.input}</div>
                        <div><strong>Output:</strong> {example.output}</div>
                        {example.explanation && (
                          <div><strong>Explicação:</strong> {example.explanation}</div>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveExample(index)}
                      disabled={disabled}
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

      {/* Casos de Teste */}
      <Card>
        <CardHeader>
          <CardTitle>Casos de Teste</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testInput">Input *</Label>
              <Textarea
                id="testInput"
                value={testCaseInput.input}
                onChange={(e) => setTestCaseInput(prev => ({ ...prev, input: e.target.value }))}
                placeholder='Ex: [2,7,11,15], 9'
                rows={3}
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testOutput">Output Esperado *</Label>
              <Textarea
                id="testOutput"
                value={testCaseInput.expectedOutput}
                onChange={(e) => setTestCaseInput(prev => ({ ...prev, expectedOutput: e.target.value }))}
                placeholder='Ex: [0,1]'
                rows={3}
                disabled={disabled}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="testDescription">Descrição (Opcional)</Label>
            <Input
              id="testDescription"
              value={testCaseInput.description}
              onChange={(e) => setTestCaseInput(prev => ({ ...prev, description: e.target.value }))}
              placeholder='Ex: Caso básico com dois números'
              disabled={disabled}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="testHidden"
              checked={testCaseInput.hidden}
              onChange={(e) => setTestCaseInput(prev => ({ ...prev, hidden: e.target.checked }))}
              disabled={disabled}
              className="rounded border-gray-300"
            />
            <Label htmlFor="testHidden" className="text-sm cursor-pointer">
              Caso de teste oculto (não visível para o aluno)
            </Label>
          </div>
          <Button type="button" onClick={handleAddTestCase} variant="outline" disabled={disabled}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Caso de Teste
          </Button>

          {testCases.length > 0 && (
            <div className="space-y-2">
              <Label>Casos de Teste Adicionados ({testCases.length})</Label>
              <div className="space-y-2">
                {testCases.map((testCase, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 border rounded">
                    <div className="flex-1">
                      <div className="text-sm font-medium flex items-center gap-2">
                        Caso {index + 1}
                        {testCase.hidden && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            Oculto
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        <div><strong>Input:</strong> {testCase.input}</div>
                        <div><strong>Output:</strong> {testCase.expectedOutput}</div>
                        {testCase.description && (
                          <div><strong>Descrição:</strong> {testCase.description}</div>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveTestCase(index)}
                      disabled={disabled}
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

      {/* Skills - Apenas se showExtraFields for true */}
      {showExtraFields && (
        <Card>
          <CardHeader>
            <CardTitle>Skills (Opcional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Ex: Arrays, Hash Tables"
              disabled={disabled}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddSkill()
                }
              }}
            />
            <Button type="button" onClick={handleAddSkill} variant="outline" disabled={disabled}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {skill}
                  <button
                    type="button"
                    onClick={() => onRemoveSkill(index)}
                    disabled={disabled}
                    className="ml-1 hover:text-blue-900"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        </Card>
      )}

      {/* Constraints - Apenas se showExtraFields for true */}
      {showExtraFields && (
        <Card>
        <CardHeader>
          <CardTitle>Restrições (Opcional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={constraintInput}
              onChange={(e) => setConstraintInput(e.target.value)}
              placeholder="Ex: 1 <= nums.length <= 10^4"
              disabled={disabled}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddConstraint()
                }
              }}
            />
            <Button type="button" onClick={handleAddConstraint} variant="outline" disabled={disabled}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {constraints.length > 0 && (
            <ul className="list-disc list-inside space-y-1 text-sm">
              {constraints.map((constraint, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="flex-1">{constraint}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveConstraint(index)}
                    disabled={disabled}
                    className="h-6 px-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        </Card>
      )}

      {/* Hints - Apenas se showExtraFields for true */}
      {showExtraFields && (
        <Card>
        <CardHeader>
          <CardTitle>Dicas (Opcional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Textarea
              value={hintInput}
              onChange={(e) => setHintInput(e.target.value)}
              placeholder="Ex: Tente usar um Hash Map para armazenar os valores já vistos"
              rows={2}
              disabled={disabled}
            />
            <Button type="button" onClick={handleAddHint} variant="outline" disabled={disabled}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {hints.length > 0 && (
            <div className="space-y-2">
              {hints.map((hint, index) => (
                <div key={index} className="flex items-start gap-2 p-3 border rounded bg-yellow-50">
                  <span className="flex-1 text-sm">{hint}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveHint(index)}
                    disabled={disabled}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        </Card>
      )}

      {/* Campos Admin (Trending, etc) */}
      {showAdminFields && (
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="trending"
                checked={formData.trending || false}
                onChange={(e) => onInputChange("trending", e.target.checked)}
                disabled={disabled}
                className="rounded border-gray-300"
              />
              <Label htmlFor="trending" className="text-sm cursor-pointer">
                Marcar como Trending (aparecerá em destaque)
              </Label>
            </div>

            {formData.trending && (
              <div className="space-y-2">
                <Label htmlFor="trending_priority">Prioridade do Trending</Label>
                <Input
                  id="trending_priority"
                  type="number"
                  value={formData.trending_priority || ''}
                  onChange={(e) => onInputChange("trending_priority", parseInt(e.target.value) || null)}
                  placeholder="1 = maior prioridade"
                  disabled={disabled}
                />
                <p className="text-xs text-muted-foreground">
                  Quanto menor o número, maior a prioridade (1 aparece primeiro)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

