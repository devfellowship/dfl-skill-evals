"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/atoms/Button/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/atoms/Input/Input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Plus, Edit, Trash2, Eye, Code, TestTube, BarChart3, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { useChallengeManagement } from "@/hooks/useChallengeManagement"
import { Challenge, ChallengeFormData, DIFFICULTY_OPTIONS, CATEGORY_OPTIONS, STATUS_OPTIONS } from "./types"
import { validateSupabaseConfig } from "@/lib/config"

export function DashboardAdmin() {
  const { 
    getAllChallenges, 
    createChallenge, 
    updateChallenge, 
    deleteChallenge, 
    loading, 
    error 
  } = useChallengeManagement()

  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)
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

  // Carregar challenges do banco ao montar o componente
  useEffect(() => {
    console.log('🚀 DashboardAdmin montado')
    
    // Validar configuração do Supabase
    const isConfigValid = validateSupabaseConfig()
    if (!isConfigValid) {
      console.error('❌ Configuração do Supabase inválida')
      toast.error("Configuração do Supabase inválida. Verifique as variáveis de ambiente.")
      return
    }
    
    loadChallenges()
  }, [])

  const loadChallenges = async () => {
    try {
      console.log('🔄 Carregando challenges...')
      const dbChallenges = await getAllChallenges()
      console.log('📊 Challenges recebidos:', dbChallenges)
      
      if (dbChallenges && dbChallenges.length > 0) {
        // Adaptar dados do banco para o formato esperado pelo componente
        const adaptedChallenges: Challenge[] = dbChallenges.map(challenge => ({
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          difficulty: challenge.difficulty,
          category: challenge.category || "Algoritmos",
          functionName: challenge.function_name,
          status: challenge.status,
          createdAt: new Date(challenge.created_at).toLocaleDateString('pt-BR'),
          updatedAt: new Date(challenge.updated_at).toLocaleDateString('pt-BR')
        }))
        console.log('✅ Challenges adaptados:', adaptedChallenges)
        setChallenges(adaptedChallenges)
      } else {
        console.log('⚠️ Nenhum challenge encontrado no banco')
        setChallenges([])
      }
    } catch (err) {
      console.error('❌ Erro ao carregar challenges:', err)
      toast.error("Erro ao carregar challenges do banco de dados")
      setChallenges([])
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.category || !formData.functionName) {
      toast.error("Por favor, preencha todos os campos obrigatórios")
      return
    }

    try {
      if (editingChallenge) {
        // Atualizar challenge existente
        const result = await updateChallenge(editingChallenge.id, {
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty,
          category: formData.category,
          function_name: formData.functionName,
          initial_code: formData.initialCode || "// Seu código aqui",
          test_cases: formData.testCases || []
        })
        
        if (result) {
          toast.success("Challenge atualizado com sucesso!")
          setEditingChallenge(null)
          await loadChallenges() // Recarregar lista
        } else {
          toast.error("Erro ao atualizar challenge")
        }
      } else {
        // Criar novo challenge
        const result = await createChallenge({
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty,
          category: formData.category,
          function_name: formData.functionName,
          initial_code: formData.initialCode || "// Seu código aqui",
          test_cases: formData.testCases || []
        })
        
        if (result) {
          toast.success("Challenge criado com sucesso!")
          await loadChallenges() // Recarregar lista
        } else {
          toast.error("Erro ao criar challenge")
        }
      }

      // Limpar formulário
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
      setIsCreating(false)
    } catch (err) {
      toast.error("Erro ao salvar challenge")
      console.error(err)
    }
  }

  const handleEdit = (challenge: Challenge) => {
    setEditingChallenge(challenge)
    setFormData({
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      category: challenge.category,
      functionName: challenge.functionName,
      status: challenge.status,
      initialCode: challenge.initialCode || "",
      testCases: challenge.testCases || []
    })
    setIsCreating(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este challenge?")) {
      try {
        const result = await deleteChallenge(id)
        if (result) {
          toast.success("Challenge excluído com sucesso!")
          await loadChallenges() // Recarregar lista
        } else {
          toast.error("Erro ao excluir challenge")
        }
      } catch (err) {
        toast.error("Erro ao excluir challenge")
        console.error(err)
      }
    }
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingChallenge(null)
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

  const getDifficultyColor = (difficulty: string) => {
    return DIFFICULTY_OPTIONS.find(opt => opt.value === difficulty)?.color || ""
  }

  const getStatusColor = (status: string) => {
    return STATUS_OPTIONS.find(opt => opt.value === status)?.color || ""
  }

  const getStatusLabel = (status: string) => {
    return STATUS_OPTIONS.find(opt => opt.value === status)?.label || status
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header simplificado */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600">Gerencie challenges e visualize analytics</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 font-medium text-lg"
          disabled={loading}
        >
          <Plus className="w-5 h-5 mr-2" />
          {loading ? "Carregando..." : "Novo Challenge"}
        </Button>
        <Button 
          onClick={loadChallenges}
          variant="outline"
          className="px-4 py-2"
        >
          🔄 Recarregar
        </Button>
      </div>

      {/* Exibir erro se houver */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Erro: {error}</p>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="challenges" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="approvals" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Aprovações
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        {/* Tab: Challenges */}
        <TabsContent value="challenges" className="space-y-6">
          {/* Formulário de Criação/Edição */}
          {isCreating && (
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
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      {editingChallenge ? "Atualizar" : "Criar"} Challenge
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancel}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Lista de Challenges */}
          <Card>
            <CardHeader>
              <CardTitle>Challenges ({challenges.length})</CardTitle>
              <CardDescription>
                Gerencie todos os challenges da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando challenges...</p>
                </div>
              ) : challenges.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Nenhum challenge encontrado</p>
                  <Button onClick={() => setIsCreating(true)} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Challenge
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {challenges.map(challenge => (
                  <div
                    key={challenge.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 hover:border-border/60 transition-all duration-200 group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-200">{challenge.title}</h3>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {DIFFICULTY_OPTIONS.find(opt => opt.value === challenge.difficulty)?.label}
                        </Badge>
                        <Badge className={getStatusColor(challenge.status)}>
                          {getStatusLabel(challenge.status)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2 group-hover:text-foreground transition-colors duration-200">{challenge.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors duration-200">
                        <span>📁 {challenge.category}</span>
                        <span>⚡ {challenge.functionName}</span>
                        <span>📅 Criado: {challenge.createdAt}</span>
                        <span>🔄 Atualizado: {challenge.updatedAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(challenge)}
                        className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/challenge-page/${challenge.id}`, '_blank')}
                        className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(challenge.id)}
                        className="text-red-600 hover:text-red-700 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Aprovações */}
        <TabsContent value="approvals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Challenges Pendentes de Aprovação</CardTitle>
              <CardDescription>
                Aprove ou rejeite challenges criados pelos professores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Sistema de Aprovação em Desenvolvimento</h3>
                <p>Esta funcionalidade permitirá aos admins aprovar ou rejeitar challenges pendentes</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Métricas e insights da plataforma (em desenvolvimento)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Analytics em Desenvolvimento</h3>
                <p>Esta funcionalidade estará disponível em breve!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Configurações */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>
                Configurações gerais da plataforma (em desenvolvimento)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <TestTube className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Configurações em Desenvolvimento</h3>
                <p>Esta funcionalidade estará disponível em breve!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
