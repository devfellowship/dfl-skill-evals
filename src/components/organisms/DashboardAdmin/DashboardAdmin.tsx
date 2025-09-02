"use client"

import { useState } from "react"
import { Button } from "@/components/atoms/Button/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Code, TestTube, BarChart3, CheckCircle, Archive, RefreshCw } from "lucide-react"
import { useChallengesRealtime } from "@/hooks/useChallengesRealtime"
import { useChallengeOperations } from "@/hooks/useChallengeOperations"
import { Challenge, ChallengeFormData } from "./types"
import { ChallengeForm } from "./ChallengeForm"
import { ChallengeList } from "./ChallengeList"
// import { ArchivedChallengesTab } from "./ArchivedChallengesTab"
// import { PendingApprovalsTab } from "./PendingApprovalsTab"

export function DashboardAdmin() {
  // Hook centralizado para Realtime
  const {
    challenges,
    isInitialLoading,
    lastUpdate,
    updateChallengeInList
  } = useChallengesRealtime()

  // Hook para operações com estados separados
  const {
    isSubmitting,
    isDeleting,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSendBackForReview
  } = useChallengeOperations()

  // Estados locais do componente
  const [isCreating, setIsCreating] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)
  const [activeTab, setActiveTab] = useState<string>("challenges")

    // Handlers simplificados
  const handleSubmit = async (formData: ChallengeFormData) => {
    if (editingChallenge) {
      const updateData = {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        category: formData.category,
        function_name: formData.functionName,
        initial_code: formData.initialCode || "// Seu código aqui",
        test_cases: formData.testCases || [],
        status: formData.status
      }
      await handleUpdate(editingChallenge.id, updateData)
    } else {
      const createData = {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        category: formData.category,
        function_name: formData.functionName,
        initial_code: formData.initialCode || "// Seu código aqui",
        test_cases: formData.testCases || []
      }
      await handleCreate(createData)
    }
    
    // Limpar formulário após sucesso
    setIsCreating(false)
    setEditingChallenge(null)
  }

  const handleEdit = (challenge: Challenge) => {
    setEditingChallenge(challenge)
    setIsCreating(true)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingChallenge(null)
  }

  const handleDeleteWithOptimistic = async (id: string) => {
    // Optimistic update: remover da lista imediatamente
    updateChallengeInList(id, { status: 'deleted' as any })
    
    // Executar ação no servidor
    const result = await handleDelete(id)
    
    // Se falhou, o Realtime irá restaurar o item
    if (!result) {
      // O Realtime irá restaurar automaticamente via evento
    }
  }

  const handleSendBackWithOptimistic = async (id: string) => {
    // Optimistic update: atualizar status imediatamente
    updateChallengeInList(id, { status: 'draft' as any })
    
    // Executar ação no servidor
    const result = await handleSendBackForReview(id)
    
    // Se falhou, o Realtime irá restaurar o status
    if (!result) {
      // O Realtime irá restaurar automaticamente via evento
    }
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
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 font-medium text-lg"
            disabled={isSubmitting}
          >
            <Plus className="w-5 h-5 mr-2" />
            {isSubmitting ? "Salvando..." : "Novo Challenge"}
          </Button>
        </div>
      </div>

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
          <ChallengeForm
            isCreating={isCreating}
            editingChallenge={editingChallenge}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />

          {/* Lista de Challenges */}
          <Card>
            <CardHeader>
              <CardTitle>Challenges Aprovados ({challenges.length})</CardTitle>
              <CardDescription>
                Gerencie challenges aprovados e publicados na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChallengeList
                challenges={challenges}
                isInitialLoading={isInitialLoading}
                onEdit={handleEdit}
                onDelete={handleDeleteWithOptimistic}
                onSendBackForReview={handleSendBackWithOptimistic}
                isDeleting={isDeleting}
                onCreateNew={() => setIsCreating(true)}
              />
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
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Em Desenvolvimento</h3>
                <p>Esta funcionalidade estará disponível em breve!</p>
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
              <div className="text-center py-12 text-gray-500">
                <Archive className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Em Desenvolvimento</h3>
                <p>Esta funcionalidade estará disponível em breve!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
