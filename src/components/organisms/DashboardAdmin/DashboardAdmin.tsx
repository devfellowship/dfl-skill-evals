"use client"

import { useState } from "react"
import { Button } from "@/components/atoms/Button/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, TestTube, CheckCircle, Archive, RefreshCw } from "lucide-react"
import { useChallengesGlobal } from "@/hooks/useChallengesGlobal"
import { useChallengeOperations } from "@/hooks/useChallengeOperations"
import { AdminChallenge as Challenge, ChallengeFormData } from "@/types/admin"
import { ChallengeForm } from "./ChallengeForm"
import { ChallengeList } from "./ChallengeList"
import { PendingApprovalsList } from "./PendingApprovalsList"
import { ArchivedChallengesList } from "./ArchivedChallengesList"
import { DashboardHeaderButtons } from "@/components/atoms/DashboardHeaderButtons/DashboardHeaderButtons"
import { AdminStatsCards } from "@/components/molecules/AdminStatsCards/AdminStatsCards"
import { ConnectionStatus } from "@/components/atoms/ConnectionStatus/ConnectionStatus"
import { ChallengeComparisonModal } from "@/components/molecules/ChallengeComparisonModal/ChallengeComparisonModal"
import { SearchButton } from "@/components/atoms/SearchButton/SearchButton"

export function DashboardAdmin() {

  const { 
    published, 
    pending, 
    archived, 
    isInitialLoading, 
    lastUpdate,
    broadcastWorking,
    updateChallengeInList,
    removeChallengeFromList,
    loadAllChallenges
  } = useChallengesGlobal()


  const {
    isSubmitting,
    isDeleting,
    isApproving,
    isArchiving,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleApprove,
    handleReject,
    handleArchive,
    handleSendBackForReview
  } = useChallengeOperations()

  const [comparisonModalOpen, setComparisonModalOpen] = useState(false)
  const [challengeToCompare, setChallengeToCompare] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [isCreating, setIsCreating] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)
  const [activeTab, setActiveTab] = useState<string>("challenges")


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
        status: formData.status,
        slug: formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }
      
      console.log('🔄 Atualizando challenge:', editingChallenge.id, updateData)
      
      updateChallengeInList(editingChallenge.id, {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        category: formData.category,
        status: formData.status
      })
      
      const result = await handleUpdate(editingChallenge.id, updateData)
      console.log('✅ Resultado da atualização:', result)
      
      if (!result) {
        loadAllChallenges()
      }
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

    removeChallengeFromList(id)
    

    const result = await handleDelete(id)
    

    if (!result) {

    }
  }

  const handleApproveWithOptimistic = async (id: string) => {

    updateChallengeInList(id, { status: 'published' as any })
    

    const result = await handleApprove(id)
    

    if (!result) {

    }
  }

  const handleRejectWithOptimistic = async (id: string) => {

    updateChallengeInList(id, { status: 'draft' as any })
    

    const reason = prompt("Motivo da rejeição (opcional):")
    const result = await handleReject(id, reason || "")
    

    if (!result) {

    }
  }

  const handleArchiveWithOptimistic = async (id: string) => {

    updateChallengeInList(id, { status: 'archived' as any })
    

    const result = await handleArchive(id)
    

    if (!result) {

    }
  }

  const handleSendBackWithOptimistic = async (id: string) => {

    updateChallengeInList(id, { status: 'draft' as any })
    

    const result = await handleSendBackForReview(id)
    

    if (!result) {

    }
  }

  const handleOpenComparison = (challengeId: string) => {
    setChallengeToCompare(challengeId)
    setComparisonModalOpen(true)
  }

  const handleCloseComparison = () => {
    setComparisonModalOpen(false)
    setChallengeToCompare(null)
  }

  const handleApproveFromComparison = async () => {
    if (challengeToCompare) {
      try {
        await handleApprove(challengeToCompare)
        handleCloseComparison()
        console.log("✅ Challenge aprovada após análise")
      } catch (error) {
        console.error("❌ Erro ao aprovar challenge:", error)
      }
    }
  }

  const handleRejectFromComparison = async () => {
    if (challengeToCompare) {
      try {
        await handleReject(challengeToCompare, "Rejeitado após análise de alterações")
        handleCloseComparison()
        console.log("✅ Challenge rejeitada após análise")
      } catch (error) {
        console.error("❌ Erro ao rejeitar challenge:", error)
      }
    }
  }

  const handleTitleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard Admin</h1>
          <p className="text-gray-600">Gerencie challenges e aprovações</p>
          <ConnectionStatus isConnected={broadcastWorking} lastUpdate={lastUpdate} />
        </div>
                 <div className="flex items-center gap-3">
           <SearchButton 
             onSearch={handleTitleSearch}
             placeholder="Pesquisar challenges por título..."
             currentQuery={searchQuery}
           />
           <DashboardHeaderButtons
             onCreateClick={() => setIsCreating(true)}
             createButtonText="Novo Challenge"
             isSubmitting={isSubmitting}
             showHomeButton={true}
             homeButtonText="Inicio"
           />
         </div>
      </div>


      <Tabs defaultValue="challenges" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="approvals" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Aprovações
          </TabsTrigger>

          <TabsTrigger value="archived" className="flex items-center gap-2">
            <Archive className="w-4 h-4" />
            Arquivados
          </TabsTrigger>
        </TabsList>


        <TabsContent value="challenges" className="space-y-6">

          <ChallengeForm
            isCreating={isCreating}
            editingChallenge={editingChallenge}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />


          <Card>
            <CardHeader>
              <CardTitle>Challenges Aprovados ({published.length})</CardTitle>
              <CardDescription>
                Gerencie challenges aprovados e publicados na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
                             <ChallengeList
                 challenges={published}
                 isInitialLoading={isInitialLoading}
                 onEdit={handleEdit}
                 onDelete={handleDeleteWithOptimistic}
                 onSendBackForReview={handleSendBackWithOptimistic}
                 onArchive={handleArchiveWithOptimistic}
                 isDeleting={isDeleting}
                 isArchiving={isArchiving}
                 onCreateNew={() => setIsCreating(true)}
                 searchQuery={searchQuery}
               />
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="approvals" className="space-y-6">
          <ChallengeForm
            isCreating={isCreating}
            editingChallenge={editingChallenge}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />

          <Card>
            <CardHeader>
              <CardTitle>Challenges Pendentes de Aprovação ({pending.length})</CardTitle>
              <CardDescription>
                Aprove, rejeite, arquive ou exclua challenges criados pelos professores
              </CardDescription>
            </CardHeader>
            <CardContent>
                             <PendingApprovalsList
                 challenges={pending}
                 isInitialLoading={isInitialLoading}
                 onEdit={handleEdit}
                 onDelete={handleDeleteWithOptimistic}
                 onApprove={handleApproveWithOptimistic}
                 onReject={handleRejectWithOptimistic}
                 onArchive={handleArchiveWithOptimistic}
                 onCompare={handleOpenComparison}
                 isDeleting={isDeleting}
                 isApproving={isApproving}
                 isArchiving={isArchiving}
                 searchQuery={searchQuery}
               />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archived" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Challenges Arquivados ({archived.length})</CardTitle>
              <CardDescription>
                Challenges que foram arquivados e não estão mais ativos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ArchivedChallengesList
                challenges={archived}
                isInitialLoading={isInitialLoading}
                onEdit={handleEdit}
                onDelete={handleDeleteWithOptimistic}
                onApprove={handleApproveWithOptimistic}
                onSendBackForReview={handleSendBackWithOptimistic}
                isDeleting={isDeleting}
                isApproving={isApproving}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Comparação */}
      {challengeToCompare && (
        <ChallengeComparisonModal
          isOpen={comparisonModalOpen}
          onClose={handleCloseComparison}
          challengeId={challengeToCompare}
          onApprove={handleApproveFromComparison}
          onReject={handleRejectFromComparison}
        />
      )}
    </div>
  )
}