import { useState, useEffect } from "react"
import { Button } from "@/components/atoms/Button/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/atoms/Input/Input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Challenge, ChallengeFormData, DIFFICULTY_OPTIONS, CATEGORY_OPTIONS, STATUS_OPTIONS } from "./types"

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
  const [formData, setFormData] = useState<ChallengeFormData>({
    title: "",
    description: "",
    difficulty: "easy",
    category: "",
    functionName: "",
    status: "draft",
    initialCode: "",
    testCases: []
  })

  // Carregar dados do challenge sendo editado
  useEffect(() => {
    if (editingChallenge) {
      const editFormData = {
        title: editingChallenge.title,
        description: editingChallenge.description,
        difficulty: editingChallenge.difficulty,
        category: editingChallenge.category,
        functionName: editingChallenge.functionName,
        status: editingChallenge.status,
        initialCode: editingChallenge.initialCode || "",
        testCases: editingChallenge.testCases || []
      }
      setFormData(editFormData)
    } else {
      // Reset form for new challenge
      setFormData({
        title: "",
        description: "",
        difficulty: "easy",
        category: "",
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
