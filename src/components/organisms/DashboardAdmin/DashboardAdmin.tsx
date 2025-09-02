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
import { Plus, Edit, Trash2, Eye, Code, TestTube, BarChart3, CheckCircle, Clock, Archive, XCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { useChallengeManagement } from "@/hooks/useChallengeManagement"
import { Challenge, ChallengeFormData, DIFFICULTY_OPTIONS, CATEGORY_OPTIONS, STATUS_OPTIONS } from "./types"
import { validateSupabaseConfig } from "@/lib/config"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export function DashboardAdmin() {
  const { 
    getAllChallenges, 
    createChallenge, 
    updateChallenge, 
    deleteChallenge,
    approveChallenge,
    rejectChallenge,
    archiveChallenge,
    sendBackForReview,
    getPendingChallenges,
    getArchivedChallenges,
    loading, 
    error 
  } = useChallengeManagement()

  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState<string>("challenges")
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  // Função para salvar dados do formulário no localStorage
  const saveFormDataToStorage = (data: ChallengeFormData) => {
    try {
      localStorage.setItem('challengeFormData', JSON.stringify(data))
    } catch (error) {
      console.warn('Erro ao salvar dados do formulário:', error)
    }
  }

  // Função para carregar dados do formulário do localStorage
  const loadFormDataFromStorage = (): ChallengeFormData | null => {
    try {
      const saved = localStorage.getItem('challengeFormData')
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.warn('Erro ao carregar dados do formulário:', error)
    }
    return null
  }

  // Função para limpar dados do formulário do localStorage
  const clearFormDataFromStorage = () => {
    try {
      localStorage.removeItem('challengeFormData')
    } catch (error) {
      console.warn('Erro ao limpar dados do formulário:', error)
    }
  }

  const [formData, setFormData] = useState<ChallengeFormData>(() => {
    // Tentar carregar dados salvos do localStorage
    const savedData = loadFormDataFromStorage()
    return savedData || {
      title: "",
      description: "",
      difficulty: "easy",
      category: "",
      functionName: "",
      status: "draft",
      initialCode: "",
      testCases: []
    }
  })

  // Salvar dados do formulário no localStorage sempre que mudarem
  useEffect(() => {
    // Só salvar se não estivermos editando um challenge específico
    if (!editingChallenge) {
      saveFormDataToStorage(formData)
    }
  }, [formData, editingChallenge])

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
    
    // Carregar dados silenciosamente na primeira vez
    loadChallenges(true).then(() => {
      setIsInitialLoad(false)
    })
    
    // Realtime como fonte única de verdade
    const channel = supabase
      .channel('public:challenges')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'challenges' }, 
          payload => {
            console.log('🔄 Realtime Event:', payload.eventType, payload.new || payload.old)
            
            setChallenges(prev => {
              switch (payload.eventType) {
                case 'INSERT':
                  return [adaptChallenge(payload.new), ...prev];
                case 'UPDATE':
                  return prev.map(ch =>
                    ch.id === payload.new.id ? adaptChallenge(payload.new) : ch
                  );
                case 'DELETE':
                  return prev.filter(ch => ch.id !== payload.old.id);
                default:
                  return prev;
              }
            });
          }
      )
      .subscribe((status) => {
        console.log('📡 Realtime Status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime conectado como fonte única de verdade!')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Erro no canal Realtime - usando fallback')
          // Fallback: recarregar dados se Realtime falhar
          loadChallenges()
        }
      })

    return () => {
      console.log('🧹 Limpando subscription do Realtime')
      supabase.removeChannel(channel)
    }
  }, [])

  // Função para adaptar challenge do banco para o frontend
  const adaptChallenge = (challenge: any): Challenge => {
    let frontendStatus: any = challenge.status
    if (challenge.status === 'to_approve') {
      frontendStatus = 'draft'
    } else if (challenge.status === 'rejected') {
      frontendStatus = 'draft'
    }
    
    return {
      ...challenge,
      status: frontendStatus
    }
  }

  // Atualização granular: atualiza apenas um item específico
  const updateChallengeInList = (challengeId: string, updates: Partial<Challenge>) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, ...updates, updated_at: new Date().toISOString() }
        : challenge
    ))
    setLastUpdate(new Date())
  }

  // Adicionar novo challenge à lista
  const addChallengeToList = (newChallenge: any) => {
    const adaptedChallenge = adaptChallenge(newChallenge)
    setChallenges(prev => [adaptedChallenge, ...prev])
    setLastUpdate(new Date())
  }

  // Remover challenge da lista
  const removeChallengeFromList = (challengeId: string) => {
    setChallenges(prev => prev.filter(challenge => challenge.id !== challengeId))
    setLastUpdate(new Date())
  }



  const loadChallenges = async (silent = false) => {
    try {
      if (!silent) {
        console.log('🔄 Carregando challenges...')
      }
      const dbChallenges = await getAllChallenges()
      setLastUpdate(new Date())
      if (!silent) {
        console.log('📊 Challenges recebidos:', dbChallenges)
      }
      
      if (dbChallenges && dbChallenges.length > 0) {
        // Adaptar dados do banco para o formato esperado pelo componente
        const adaptedChallenges: Challenge[] = dbChallenges.map(challenge => {
          // Mapear status do banco para o formato do frontend
          let frontendStatus: "draft" | "published" | "archived"
          if (challenge.status === 'to_approve') {
            frontendStatus = 'draft'
          } else if (challenge.status === 'approved') {
            frontendStatus = 'published'
          } else if (challenge.status === 'archived') {
            frontendStatus = 'archived'
          } else if (challenge.status === 'rejected') {
            frontendStatus = 'draft' // Rejeitados voltam para draft
          } else {
            frontendStatus = 'draft' // fallback
          }

          return {
            id: challenge.id,
            title: challenge.title,
            slug: challenge.slug,
            description: challenge.description,
            difficulty: challenge.difficulty,
            category: challenge.category || "Algoritmos",
            functionName: challenge.function_name,
            status: frontendStatus,
            createdAt: new Date(challenge.created_at).toLocaleDateString('pt-BR'),
            updatedAt: new Date(challenge.updated_at).toLocaleDateString('pt-BR')
          }
        })
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
        const updateData = {
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty,
          category: formData.category,
          function_name: formData.functionName,
          initial_code: formData.initialCode || "// Seu código aqui",
          test_cases: formData.testCases || [],
          status: formData.status // Incluir o status na atualização
        }
        
        console.log('🔍 DashboardAdmin - ID do challenge:', editingChallenge.id)
        console.log('🔍 DashboardAdmin - Dados para atualização:', updateData)
        
        const result = await updateChallenge(editingChallenge.id, updateData)
        
        if (result) {
          toast.success("Challenge atualizado com sucesso!")
          setEditingChallenge(null)
          clearFormDataFromStorage()
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
          clearFormDataFromStorage()
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
    const editFormData = {
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      category: challenge.category,
      functionName: challenge.functionName,
      status: challenge.status,
      initialCode: challenge.initialCode || "",
      testCases: challenge.testCases || []
    }
    setFormData(editFormData)
    // Limpar dados salvos quando editando um challenge específico
    clearFormDataFromStorage()
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

  const handleSendBackForReview = async (id: string) => {
    if (confirm("Tem certeza que deseja enviar este challenge de volta para análise?")) {
      try {
        // Optimistic Update: Atualizar estado local imediatamente
        updateChallengeInList(id, { status: 'draft' as any })
        
        // Executar ação no servidor
        const result = await sendBackForReview(id)
        if (result) {
          toast.success("Challenge enviado de volta para análise!")
          // O Realtime irá atualizar automaticamente
        } else {
          toast.error("Erro ao enviar challenge de volta")
          // Reverter optimistic update em caso de erro
          loadChallenges(true) // Carregar silenciosamente
        }
      } catch (err) {
        toast.error("Erro ao enviar challenge de volta")
        console.error(err)
        // Reverter optimistic update em caso de erro
        loadChallenges(true) // Carregar silenciosamente
      }
    }
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingChallenge(null)
    const emptyFormData: ChallengeFormData = {
      title: "",
      description: "",
      difficulty: "easy",
      category: "",
      functionName: "",
      status: "draft",
      initialCode: "",
      testCases: []
    }
    setFormData(emptyFormData)
    clearFormDataFromStorage()
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
          <p className="text-xs text-gray-400 mt-1">
            Última atualização: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => {
              console.log('🔄 Refresh manual acionado')
              loadChallenges(true) // Carregar silenciosamente
            }} 
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          <Button 
            onClick={() => {
              clearFormDataFromStorage()
              setIsCreating(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 font-medium text-lg"
            disabled={loading}
          >
            <Plus className="w-5 h-5 mr-2" />
            {loading ? "Carregando..." : "Novo Challenge"}
          </Button>
        </div>
      </div>

      {/* Exibir erro se houver */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Erro: {error}</p>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="challenges" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
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
                          <TabsTrigger value="archived" className="flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  Arquivados
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
              <CardTitle>Challenges Aprovados ({challenges.length})</CardTitle>
              <CardDescription>
                Gerencie challenges aprovados e publicados na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && !isInitialLoad ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando challenges...</p>
                </div>
              ) : isInitialLoad ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500 text-sm">Carregando...</p>
                </div>
              ) : challenges.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Nenhum challenge encontrado</p>
                  <Button onClick={() => {
                    clearFormDataFromStorage()
                    setIsCreating(true)
                  }} variant="outline">
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
                        {challenge.createdAt !== challenge.updatedAt && (
                          <span>🔄 Atualizado: {challenge.updatedAt}</span>
                        )}
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
                         onClick={() => window.open(`/challenges/${challenge.slug}`, '_blank')}
                         className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                       >
                         <Eye className="w-4 h-4" />
                       </Button>

                       {/* Botão "Voltar para Análise" apenas para challenges aprovadas */}
                       {challenge.status === 'published' && (
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => handleSendBackForReview(challenge.id)}
                           className="text-orange-600 hover:text-orange-700 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                           title="Enviar de volta para análise"
                         >
                           <RefreshCw className="w-4 h-4" />
                         </Button>
                       )}

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
                Aprove, rejeite, arquive ou exclua challenges criados pelos professores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PendingApprovalsTab />
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

        {/* Tab: Arquivados */}
        <TabsContent value="archived" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Challenges Arquivados</CardTitle>
              <CardDescription>
                Challenges que foram arquivados e não estão mais ativos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ArchivedChallengesTab />
              
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Manutenção do Banco</h4>
                <p className="text-gray-600 mb-3">
                  Ferramentas para limpeza e otimização do banco de dados (em desenvolvimento).
                </p>
                <Button variant="outline" disabled>
                  <Code className="w-4 h-4 mr-2" />
                  Em Breve
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Componente para a aba de challenges arquivados
function ArchivedChallengesTab() {
  const { 
    getArchivedChallenges,
    approveChallenge,
    sendBackForReview,
    loading 
  } = useChallengeManagement()

  const [archivedChallenges, setArchivedChallenges] = useState<any[]>([])

  useEffect(() => {
    loadArchivedChallenges()
    
    // Realtime para challenges arquivados
    const channel = supabase
      .channel('archived:challenges')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'challenges' }, 
          payload => {
            // Só processar se for relevante para arquivados
            if (payload.eventType === 'UPDATE' && payload.new.status === 'archived') {
              console.log('🔄 ArchivedChallengesTab: Challenge arquivada:', payload.new)
              setArchivedChallenges(prev => {
                const exists = prev.some(ch => ch.id === payload.new.id)
                if (exists) {
                  return prev.map(ch => ch.id === payload.new.id ? payload.new : ch)
                } else {
                  return [payload.new, ...prev]
                }
              })
            } else if (payload.eventType === 'UPDATE' && payload.old.status === 'archived' && payload.new.status !== 'archived') {
              // Challenge foi desarquivada
              console.log('🔄 ArchivedChallengesTab: Challenge desarquivada:', payload.new)
              setArchivedChallenges(prev => prev.filter(ch => ch.id !== payload.new.id))
            }
          }
      )
      .subscribe()

    return () => {
      console.log('🧹 Limpando subscription do ArchivedChallengesTab')
      supabase.removeChannel(channel)
    }
  }, [])

  const loadArchivedChallenges = async () => {
    try {
      const archived = await getArchivedChallenges()
      setArchivedChallenges(archived || [])
    } catch (err) {
      console.error('Erro ao carregar challenges arquivados:', err)
      toast.error("Erro ao carregar challenges arquivados")
    }
  }

  const handleApprove = async (challengeId: string) => {
    try {
      console.log('🚀 Aprovando challenge arquivado:', challengeId)
      
      // Optimistic Update: Remover da lista de arquivados imediatamente
      setArchivedChallenges(prev => prev.filter(ch => ch.id !== challengeId))
      
      const result = await approveChallenge(challengeId)
      console.log('✅ Resultado da aprovação:', result)
      
      if (result) {
        toast.success("Challenge aprovado e desarquivado com sucesso!")
        // Sincronização silenciosa após a ação
        setTimeout(() => loadArchivedChallenges(), 1000)
      } else {
        toast.error("Erro ao aprovar challenge")
        // Reverter optimistic update em caso de erro
        loadArchivedChallenges()
      }
    } catch (err) {
      console.error('❌ Erro ao aprovar challenge:', err)
      toast.error("Erro ao aprovar challenge")
      // Reverter optimistic update em caso de erro
      loadArchivedChallenges()
    }
  }

  const handleSendBackForReview = async (challengeId: string) => {
    try {
      console.log('🚀 Enviando challenge arquivado de volta para análise:', challengeId)
      
      // Optimistic Update: Remover da lista de arquivados imediatamente
      setArchivedChallenges(prev => prev.filter(ch => ch.id !== challengeId))
      
      const result = await sendBackForReview(challengeId)
      console.log('✅ Resultado do envio de volta:', result)
      
      if (result) {
        toast.success("Challenge enviado de volta para análise!")
        // O Realtime irá atualizar automaticamente
      } else {
        toast.error("Erro ao enviar challenge de volta")
        // Reverter optimistic update em caso de erro
        loadArchivedChallenges()
      }
    } catch (err) {
      console.error('❌ Erro ao enviar challenge de volta:', err)
      toast.error("Erro ao enviar challenge de volta")
      // Reverter optimistic update em caso de erro
      loadArchivedChallenges()
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando challenges arquivados...</p>
      </div>
    )
  }

  if (archivedChallenges.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Archive className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">Nenhum challenge arquivado</h3>
        <p>Todos os challenges estão ativos!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {archivedChallenges.map((challenge) => (
        <div
          key={challenge.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 hover:border-border/60 transition-all duration-200 group"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-200">{challenge.title}</h3>
              <Badge className="bg-gray-100 text-gray-800">Arquivado</Badge>
              <Badge className="bg-blue-100 text-blue-800">
                {challenge.difficulty === 1 ? 'Beginner' : 
                 challenge.difficulty === 2 ? 'Easy' : 
                 challenge.difficulty === 3 ? 'Medium' : 
                 challenge.difficulty === 4 ? 'Hard' : 
                 challenge.difficulty === 5 ? 'Expert' : challenge.difficulty}
              </Badge>
              <Badge className="bg-gray-100 text-gray-800">{challenge.category || "Algoritmos"}</Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-2 group-hover:text-foreground transition-colors duration-200">{challenge.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors duration-200">
              <span>📅 Arquivado: {new Date(challenge.updated_at).toLocaleDateString('pt-BR')}</span>
              <span>⚡ Função: {challenge.function_name}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/challenges/${challenge.slug}`, '_blank')}
              className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
              title="Visualizar Challenge"
            >
              <Eye className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleApprove(challenge.id)}
              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
              title="Aprovar e Desarquivar Challenge"
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSendBackForReview(challenge.id)}
              className="text-orange-600 hover:text-orange-700 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
              title="Enviar de volta para análise"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

// Componente para a aba de aprovações
function PendingApprovalsTab() {
  const { 
    getPendingChallenges, 
    approveChallenge, 
    rejectChallenge, 
    archiveChallenge, 
    sendBackForReview,
    deleteChallenge,
    loading 
  } = useChallengeManagement()

  const [pendingChallenges, setPendingChallenges] = useState<any[]>([])
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showChallengeDetailsModal, setShowChallengeDetailsModal] = useState(false)
  const [challengeDetails, setChallengeDetails] = useState<any>(null)

  useEffect(() => {
    loadPendingChallenges()
    
    // Realtime para challenges pendentes
    const channel = supabase
      .channel('pending:challenges')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'challenges' }, 
          payload => {
            // Só processar se for relevante para pendentes
            if (payload.eventType === 'UPDATE' && payload.new.status === 'to_approve') {
              console.log('🔄 PendingApprovalsTab: Challenge enviada para análise:', payload.new)
              setPendingChallenges(prev => {
                const exists = prev.some(ch => ch.id === payload.new.id)
                if (exists) {
                  return prev.map(ch => ch.id === payload.new.id ? payload.new : ch)
                } else {
                  return [payload.new, ...prev]
                }
              })
            } else if (payload.eventType === 'UPDATE' && payload.old.status === 'to_approve' && payload.new.status !== 'to_approve') {
              // Challenge foi aprovada/rejeitada/arquivada
              console.log('🔄 PendingApprovalsTab: Challenge processada:', payload.new)
              setPendingChallenges(prev => prev.filter(ch => ch.id !== payload.new.id))
            }
          }
      )
      .subscribe()

    return () => {
      console.log('🧹 Limpando subscription do PendingApprovalsTab')
      supabase.removeChannel(channel)
    }
  }, [])

  const loadPendingChallenges = async () => {
    try {
      const challenges = await getPendingChallenges()
      setPendingChallenges(challenges || [])
    } catch (err) {
      console.error('Erro ao carregar challenges pendentes:', err)
      toast.error("Erro ao carregar challenges pendentes")
    }
  }

  const handleApprove = async (challengeId: string) => {
    try {
      console.log('🚀 Aprovando challenge:', challengeId)
      
      // Optimistic Update: Remover da lista de pendentes imediatamente
      setPendingChallenges(prev => prev.filter(ch => ch.id !== challengeId))
      
      const result = await approveChallenge(challengeId)
      console.log('✅ Resultado da aprovação:', result)
      
      if (result) {
        toast.success("Challenge aprovado com sucesso!")
        // O Realtime irá atualizar automaticamente
      } else {
        toast.error("Erro ao aprovar challenge")
        // Reverter optimistic update em caso de erro
        loadPendingChallenges()
      }
    } catch (err) {
      console.error('❌ Erro ao aprovar challenge:', err)
      toast.error("Erro ao aprovar challenge")
      // Reverter optimistic update em caso de erro
      loadPendingChallenges()
    }
  }

  const handleReject = async (challengeId: string, reason: string) => {
    try {
      console.log('🚀 Rejeitando challenge:', challengeId, 'Motivo:', reason)
      
      // Optimistic Update: Remover da lista de pendentes imediatamente
      setPendingChallenges(prev => prev.filter(ch => ch.id !== challengeId))
      
      const result = await rejectChallenge(challengeId, reason)
      console.log('✅ Resultado da rejeição:', result)
      
      if (result) {
        toast.success("Challenge rejeitado e retornado ao professor")
        setShowRejectModal(false)
        setRejectionReason("")
        setSelectedChallenge(null)
        // O Realtime irá atualizar automaticamente
      } else {
        toast.error("Erro ao rejeitar challenge")
        // Reverter optimistic update em caso de erro
        loadPendingChallenges()
      }
    } catch (err) {
      console.error('❌ Erro ao rejeitar challenge:', err)
      toast.error("Erro ao rejeitar challenge")
      // Reverter optimistic update em caso de erro
      loadPendingChallenges()
    }
  }

  const handleArchive = async (challengeId: string) => {
    try {
      console.log('🚀 Arquivando challenge:', challengeId)
      
      // Optimistic Update: Remover da lista de pendentes imediatamente
      setPendingChallenges(prev => prev.filter(ch => ch.id !== challengeId))
      
      const result = await archiveChallenge(challengeId)
      console.log('✅ Resultado do arquivamento:', result)
      
      if (result) {
        toast.success("Challenge arquivado com sucesso!")
        // O Realtime irá atualizar automaticamente
      } else {
        toast.error("Erro ao arquivar challenge")
        // Reverter optimistic update em caso de erro
        loadPendingChallenges()
      }
    } catch (err) {
      console.error('❌ Erro ao arquivar challenge:', err)
      toast.error("Erro ao arquivar challenge")
      // Reverter optimistic update em caso de erro
      loadPendingChallenges()
    }
  }

  const handleDelete = async (challengeId: string) => {
    try {
      console.log('🚀 Deletando challenge:', challengeId)
      
      // Optimistic Update: Remover da lista de pendentes imediatamente
      setPendingChallenges(prev => prev.filter(ch => ch.id !== challengeId))
      
      const result = await deleteChallenge(challengeId)
      console.log('✅ Resultado da exclusão:', result)
      
      if (result) {
        toast.success("Challenge excluído com sucesso!")
        setShowDeleteModal(false)
        setSelectedChallenge(null)
        // O Realtime irá atualizar automaticamente
      } else {
        toast.error("Erro ao excluir challenge")
        // Reverter optimistic update em caso de erro
        loadPendingChallenges()
      }
    } catch (err) {
      console.error('❌ Erro ao excluir challenge:', err)
      toast.error("Erro ao excluir challenge")
      // Reverter optimistic update em caso de erro
      loadPendingChallenges()
    }
  }

  const handleSendBackForReview = async (challengeId: string) => {
    try {
      console.log('🚀 Enviando challenge de volta para análise:', challengeId)
      
      // Optimistic Update: Remover da lista de pendentes imediatamente
      setPendingChallenges(prev => prev.filter(ch => ch.id !== challengeId))
      
      const result = await sendBackForReview(challengeId)
      console.log('✅ Resultado do envio de volta:', result)
      
      if (result) {
        toast.success("Challenge enviado de volta para análise!")
        // O Realtime irá atualizar automaticamente
      } else {
        toast.error("Erro ao enviar challenge de volta")
        // Reverter optimistic update em caso de erro
        loadPendingChallenges()
      }
    } catch (err) {
      console.error('❌ Erro ao enviar challenge de volta:', err)
      toast.error("Erro ao enviar challenge de volta")
      // Reverter optimistic update em caso de erro
      loadPendingChallenges()
    }
  }

  const openRejectModal = (challenge: any) => {
    setSelectedChallenge(challenge)
    setShowRejectModal(true)
  }

  const openDeleteModal = (challenge: any) => {
    setSelectedChallenge(challenge)
    setShowDeleteModal(true)
  }

  const openChallengeDetailsModal = (challenge: any) => {
    setChallengeDetails(challenge)
    setShowChallengeDetailsModal(true)
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando challenges pendentes...</p>
      </div>
    )
  }

  if (pendingChallenges.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">Nenhum challenge pendente</h3>
        <p>Todos os challenges foram revisados!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Lista de challenges pendentes */}
      <div className="space-y-4">
        {pendingChallenges.map((challenge) => (
          <div
            key={challenge.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-all duration-200"
          >
            <div className="flex-1">
                             <div className="flex items-center gap-3 mb-2">
                 <h3 className="font-semibold text-lg">{challenge.title}</h3>
                 <Badge className="bg-yellow-100 text-yellow-800">A ser aprovado</Badge>
                 <Badge className="bg-blue-100 text-blue-800">
                   {challenge.difficulty === 1 ? 'Beginner' : 
                    challenge.difficulty === 2 ? 'Easy' : 
                    challenge.difficulty === 3 ? 'Medium' : 
                    challenge.difficulty === 4 ? 'Hard' : 
                    challenge.difficulty === 5 ? 'Expert' : challenge.difficulty}
                 </Badge>
                 <Badge className="bg-gray-100 text-gray-800">{challenge.category || "Algoritmos"}</Badge>
               </div>
              <p className="text-muted-foreground text-sm mb-2">{challenge.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
                <span>👤 Professor: {challenge.created_by_profile?.full_name || "Desconhecido"}</span>
                <span>📅 Criado: {new Date(challenge.created_at).toLocaleDateString('pt-BR')}</span>
                <span>⚡ Função: {challenge.function_name}</span>
              </div>
            </div>
            
                         {/* Ações do admin */}
             <div className="flex gap-2">
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => openChallengeDetailsModal(challenge)}
                 className="opacity-70 hover:opacity-100 transition-opacity duration-200"
                 title="Ver Detalhes da Challenge"
               >
                 <Eye className="w-4 h-4" />
               </Button>
               
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => handleApprove(challenge.id)}
                 className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 opacity-70 hover:opacity-100 transition-opacity duration-200"
                 title="Aprovado Challenge"
               >
                 <CheckCircle className="w-4 h-4" />
               </Button>
               
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => openRejectModal(challenge)}
                 className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 opacity-70 hover:opacity-100 transition-opacity duration-200"
                 title="Rejeitar Challenge"
               >
                 <XCircle className="w-4 h-4" />
               </Button>
               
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => handleArchive(challenge.id)}
                 className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 opacity-70 hover:opacity-100 transition-opacity duration-200"
                 title="Arquivar Challenge"
               >
                 <Archive className="w-4 h-4" />
               </Button>
               
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => openDeleteModal(challenge)}
                 className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 opacity-70 hover:opacity-100 transition-opacity duration-200"
                 title="Excluir Challenge"
               >
                 <Trash2 className="w-4 h-4" />
               </Button>
             </div>
          </div>
        ))}
      </div>

             {/* Modal de Detalhes da Challenge */}
       {showChallengeDetailsModal && challengeDetails && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
             <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                 <Code className="w-6 h-6 text-blue-600" />
                 <h2 className="text-2xl font-bold text-gray-900">{challengeDetails.title}</h2>
               </div>
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => setShowChallengeDetailsModal(false)}
                 className="text-gray-500 hover:text-gray-700"
               >
                 <XCircle className="w-5 h-5" />
               </Button>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Coluna Esquerda - Informações Básicas */}
               <div className="space-y-4">
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">📝 Descrição</h3>
                   <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{challengeDetails.description}</p>
                 </div>

                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">⚡ Função</h3>
                   <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm">
                     {challengeDetails.function_name}
                   </div>
                 </div>

                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">🏷️ Categoria</h3>
                   <Badge className="bg-blue-100 text-blue-800">{challengeDetails.category || "Algoritmos"}</Badge>
                 </div>

                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Dificuldade</h3>
                   <Badge className="bg-blue-100 text-blue-800">
                     {challengeDetails.difficulty === 1 ? 'Beginner' : 
                      challengeDetails.difficulty === 2 ? 'Easy' : 
                      challengeDetails.difficulty === 3 ? 'Medium' : 
                      challengeDetails.difficulty === 4 ? 'Hard' : 
                      challengeDetails.difficulty === 5 ? 'Expert' : challengeDetails.difficulty}
                   </Badge>
                 </div>
               </div>

               {/* Coluna Direita - Código e Testes */}
               <div className="space-y-4">
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">💻 Código Inicial</h3>
                   <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm overflow-x-auto">
                     <pre>{challengeDetails.initial_code || "// Nenhum código inicial fornecido"}</pre>
                   </div>
                 </div>

                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">🧪 Casos de Teste</h3>
                   <div className="bg-gray-50 p-3 rounded-lg">
                     {challengeDetails.test_cases && challengeDetails.test_cases.length > 0 ? (
                       <div className="space-y-2">
                         {challengeDetails.test_cases.map((testCase: any, index: number) => (
                           <div key={index} className="border-l-4 border-blue-500 pl-3">
                             <div className="text-sm font-medium text-gray-700">Teste {index + 1}</div>
                             <div className="text-xs text-gray-600">
                               <div>Input: {JSON.stringify(testCase.input || testCase)}</div>
                               <div>Output esperado: {JSON.stringify(testCase.output || "N/A")}</div>
                             </div>
                           </div>
                         ))}
                       </div>
                     ) : (
                       <p className="text-gray-500 text-sm">Nenhum caso de teste fornecido</p>
                     )}
                   </div>
                 </div>
               </div>
             </div>

             {/* Seção de Exemplos, Restrições e Dicas */}
             <div className="mt-6 space-y-4">
               {challengeDetails.examples && challengeDetails.examples.length > 0 && (
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">📚 Exemplos</h3>
                   <div className="bg-blue-50 p-4 rounded-lg">
                     {challengeDetails.examples.map((example: any, index: number) => (
                       <div key={index} className="mb-3 last:mb-0">
                         <div className="font-medium text-blue-900 mb-1">Exemplo {index + 1}:</div>
                         <div className="text-sm text-blue-800">
                           <div>Input: {JSON.stringify(example.input || example)}</div>
                           <div>Output: {JSON.stringify(example.output || "N/A")}</div>
                           {example.explanation && (
                             <div className="mt-1 italic">💡 {example.explanation}</div>
                           )}
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {challengeDetails.constraints && challengeDetails.constraints.length > 0 && (
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">⚠️ Restrições</h3>
                   <div className="bg-yellow-50 p-4 rounded-lg">
                     <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
                       {challengeDetails.constraints.map((constraint: string, index: number) => (
                         <li key={index}>{constraint}</li>
                       ))}
                     </ul>
                   </div>
                 </div>
               )}

               {challengeDetails.hints && challengeDetails.hints.length > 0 && (
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">💡 Dicas</h3>
                   <div className="bg-green-50 p-4 rounded-lg">
                     <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                       {challengeDetails.hints.map((hint: string, index: number) => (
                         <li key={index}>{hint}</li>
                       ))}
                     </ul>
                   </div>
                 </div>
               )}
             </div>

             {/* Botões de Ação */}
             <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
               <Button
                 onClick={() => handleApprove(challengeDetails.id)}
                 className="bg-green-600 hover:bg-green-700 flex-1"
               >
                 <CheckCircle className="w-4 h-4 mr-2" />
                 Aprovar Challenge
               </Button>
               
               <Button
                 onClick={() => {
                   setShowChallengeDetailsModal(false)
                   openRejectModal(challengeDetails)
                 }}
                 variant="outline"
                 className="border-red-200 text-red-700 hover:bg-red-50 flex-1"
               >
                 <XCircle className="w-4 h-4 mr-2" />
                 Rejeitar Challenge
               </Button>
               
               <Button
                 onClick={() => handleArchive(challengeDetails.id)}
                 variant="outline"
                 className="border-gray-200 text-gray-700 hover:bg-gray-50 flex-1"
               >
                 <Archive className="w-4 h-4 mr-2" />
                 Arquivar Challenge
               </Button>
             </div>
           </div>
         </div>
       )}

       {/* Modal de Rejeição */}
       {showRejectModal && selectedChallenge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold">Rejeitar Challenge</h3>
            </div>
            <p className="text-gray-600 mb-4">
              O challenge <strong>"{selectedChallenge.title}"</strong> será rejeitado e retornado ao professor.
            </p>
            <div className="space-y-3">
              <Label htmlFor="rejection-reason">Motivo da rejeição (opcional):</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Descreva o motivo da rejeição..."
                rows={3}
              />
            </div>
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionReason("")
                  setSelectedChallenge(null)
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleReject(selectedChallenge.id, rejectionReason)}
                className="bg-red-600 hover:bg-red-700"
              >
                Rejeitar Challenge
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exclusão */}
      {showDeleteModal && selectedChallenge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold">Excluir Challenge</h3>
            </div>
            <p className="text-gray-600 mb-4">
              <strong>ATENÇÃO:</strong> Esta ação é irreversível! O challenge <strong>"{selectedChallenge.title}"</strong> será excluído permanentemente.
            </p>
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedChallenge(null)
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleDelete(selectedChallenge.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir Permanentemente
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
