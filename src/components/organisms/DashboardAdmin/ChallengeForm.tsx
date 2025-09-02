import { useState, useEffect } from "react"
import { Button } from "@/components/atoms/Button/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/atoms/Input/Input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DifficultyIndicator } from "@/components/molecules/DifficultyIndicator/DifficultyIndicator"
import { AdminChallenge as Challenge, ChallengeFormData, DIFFICULTY_OPTIONS, CATEGORY_OPTIONS, STATUS_OPTIONS } from "@/types/admin-dashboard"

interface ChallengeFormProps {
  isCreating: boolean
  editingChallenge: Challenge | null
  onSubmit: (formData: ChallengeFormData) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

export function ChallengeForm({
  isCreating,
  editingChallenge,
  onSubmit,
  onCancel,
  isSubmitting
}: ChallengeFormProps) {
  const getDifficultyNumber = (difficulty: string): number => {
    const difficultyMap: Record<string, number> = {
      'easy': 1,
      'medium': 2,
      'hard': 3,
      'expert': 4,
    }
    return difficultyMap[difficulty] || 1
  }
  const [formData, setFormData] = useState<ChallengeFormData>({
    title: "",
    description: "",
    difficulty: "easy",
    category: [],
    functionName: "",
    status: "draft",
    initialCode: "",
    testCases: []
  })


  useEffect(() => {
    if (editingChallenge) {
      console.log('🔄 Carregando dados da challenge para edição:', editingChallenge)
      const editFormData = {
        title: editingChallenge.title || "",
        description: editingChallenge.description || "",
        difficulty: editingChallenge.difficulty || "easy",
        category: Array.isArray(editingChallenge.category) ? editingChallenge.category : (editingChallenge.category ? [editingChallenge.category] : []),
        functionName: editingChallenge.functionName || "",
        status: editingChallenge.status || "draft",
        initialCode: editingChallenge.initialCode || "",
        testCases: editingChallenge.testCases || []
      }
      console.log('📝 Dados do formulário carregados:', editFormData)
      setFormData(editFormData)
    } else {
      setFormData({
        title: "",
        description: "",
        difficulty: "easy",
        category: [],
        functionName: "",
        status: "draft",
        initialCode: "",
        testCases: []
      })
    }
  }, [editingChallenge])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      category: checked 
        ? [...prev.category, category]
        : prev.category.filter(c => c !== category)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  if (!isCreating) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingChallenge ? "Editar Challenge" : "Criar Novo Challenge"}
        </CardTitle>
        <CardDescription>
          {editingChallenge 
            ? "Modifique os dados do challenge selecionado"
            : "Preencha os dados para criar um novo challenge"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("title", e.target.value)}
                placeholder="Ex: Two Sum"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="functionName">Nome da Função *</Label>
              <Input
                id="functionName"
                value={formData.functionName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("functionName", e.target.value)}
                placeholder="Ex: twoSum"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Dificuldade</Label>
              <div className="space-y-2">
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => handleInputChange("difficulty", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Nível:</span>
                  <DifficultyIndicator difficulty={getDifficultyNumber(formData.difficulty)} />
                </div>
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
                      checked={formData.category.includes(category)}
                      onChange={(e) => handleCategoryChange(category, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.category.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Selecionadas: {formData.category.join(", ")}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("description", e.target.value)}
              placeholder="Descreva o problema do challenge..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : editingChallenge ? "Atualizar" : "Criar"} Challenge
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
