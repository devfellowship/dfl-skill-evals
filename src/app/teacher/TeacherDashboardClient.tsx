"use client"

import { useState, useEffect } from "react"
import { useChallengeManagement } from "@/hooks/useChallengeManagement"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, CheckCircle, Clock, Archive } from "lucide-react"
import { AdminNavigation } from "@/components/atoms/AdminNavigation/AdminNavigation"
import { DashboardHeaderButtons } from "@/components/atoms/DashboardHeaderButtons/DashboardHeaderButtons"
import { TeacherStatsCards } from "@/components/molecules/TeacherStatsCards/TeacherStatsCards"
import { TeacherChallengeList } from "@/components/molecules/TeacherChallengeList/TeacherChallengeList"
import { SearchButton } from "@/components/atoms/SearchButton/SearchButton"

export function TeacherDashboardClient() {
  const { 
    getUserChallenges, 
    submitForApproval,
    deleteChallenge,
    sendBackForReview,
    loading: challengeLoading 
  } = useChallengeManagement()

  const [myChallenges, setMyChallenges] = useState<any[]>([])
  const [teacherStats, setTeacherStats] = useState({
    totalChallenges: 0,
    approvedChallenges: 0,
    toApproveChallenges: 0,
    totalSubmissions: 0,
    averageScore: 0
  })
  const [activeTab, setActiveTab] = useState("published")
  const [searchQuery, setSearchQuery] = useState("")
  const publishedChallenges = myChallenges.filter(c => c.status === 'approved')
  const pendingChallenges = myChallenges.filter(c => (c.status === 'to_approve' || c.status === 'draft') && c.status !== 'archived')
  const archivedChallenges = myChallenges.filter(c => c.status === 'archived')

  useEffect(() => {
    loadChallenges()
  }, [])

  const loadChallenges = async () => {
    try {
      const challenges = await getUserChallenges()
      
      setMyChallenges(challenges)
      
      const stats = {
        totalChallenges: challenges.length,
        approvedChallenges: challenges.filter(c => c.status === 'approved').length,
        toApproveChallenges: challenges.filter(c => c.status === 'to_approve').length,
        totalSubmissions: challenges.reduce((sum, c) => sum + (c.submissions_count || 0), 0),
        averageScore: challenges.length > 0 ? challenges.reduce((sum, c) => sum + (c.average_score || 0), 0) / challenges.length : 0
      }
      
      setTeacherStats(stats)
    } catch (error) {
      console.error('Erro ao carregar challenges:', error)
    }
  }

  const updateStatsAfterDeletion = (deletedChallenge: any) => {
    setTeacherStats(prev => ({
      ...prev,
      totalChallenges: prev.totalChallenges - 1,
      approvedChallenges: prev.approvedChallenges - (deletedChallenge.status === 'approved' ? 1 : 0),
      toApproveChallenges: prev.toApproveChallenges - (deletedChallenge.status === 'to_approve' ? 1 : 0)
    }))
  }

  const handleDeleteChallenge = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este challenge?')) {
      try {
        // Busca o challenge antes de excluir para atualizar as estatísticas
        const challengeToDelete = myChallenges.find(c => c.id === id)
        
        const success = await deleteChallenge(id)
        if (success) {
          // Remove da lista local imediatamente
          setMyChallenges(prev => prev.filter(c => c.id !== id))
          
          // Atualiza as estatísticas localmente
          if (challengeToDelete) {
            updateStatsAfterDeletion(challengeToDelete)
          }
          
          alert('Challenge excluído com sucesso!')
        } else {
          alert('Não foi possível excluir o challenge. Verifique se ele está em um status válido para exclusão.')
        }
      } catch (error) {
        console.error('Erro ao excluir challenge:', error)
        const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir challenge. Tente novamente.'
        alert(errorMessage)
      }
    }
  }

  const handleSendBackForReview = async (id: string) => {
    if (confirm('Tem certeza que deseja enviar este challenge de volta para análise? Isso permitirá que ele seja excluído posteriormente.')) {
      try {
        const success = await sendBackForReview(id)
        if (success) {
          // Recarrega os challenges para atualizar o status
          loadChallenges()
          alert('Challenge enviado de volta para análise com sucesso!')
        }
      } catch (error) {
        console.error('Erro ao enviar challenge de volta:', error)
        alert('Erro ao enviar challenge de volta. Tente novamente.')
      }
    }
  }

  const handleTitleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation
        items={[
          { label: "Dashboard Teacher", href: "/teacher" }
        ]}
        quickActions={[]}
        showBackButton={false}
      />

      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-primary">Dashboard Mentor</h1>
              <p className="text-muted-foreground">Gerencie seus challenges e acompanhe o progresso dos alunos</p>
            </div>
            <div className="flex items-center gap-3">
              <SearchButton 
                onSearch={handleTitleSearch}
                placeholder="Pesquisar challenges por título..."
                currentQuery={searchQuery}
              />
              <DashboardHeaderButtons
                createButtonHref="/teacher/create"
                createButtonText="Criar Challenge"
                showHomeButton={true}
                homeButtonText="Inicio"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TeacherStatsCards stats={teacherStats} />

        <Tabs defaultValue="published" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="published" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Publicados ({publishedChallenges.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pendentes ({pendingChallenges.length})
            </TabsTrigger>
            <TabsTrigger value="archived" className="flex items-center gap-2">
              <Archive className="w-4 h-4" />
              Arquivados ({archivedChallenges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="published" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Challenges Publicados ({publishedChallenges.length})</CardTitle>
                <CardDescription>
                  Challenges aprovados e disponíveis para os alunos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {challengeLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando challenges publicados...</p>
                  </div>
                ) : (
                  <TeacherChallengeList 
                    challenges={publishedChallenges} 
                    onDelete={handleDeleteChallenge}
                    onSendBackForReview={handleSendBackForReview}
                    searchQuery={searchQuery}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Challenges Pendentes ({pendingChallenges.length})</CardTitle>
                <CardDescription>
                  Challenges aguardando aprovação ou em rascunho
                </CardDescription>
              </CardHeader>
              <CardContent>
                {challengeLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando challenges pendentes...</p>
                  </div>
                ) : (
                  <TeacherChallengeList 
                    challenges={pendingChallenges} 
                    onDelete={handleDeleteChallenge}
                    onSendBackForReview={handleSendBackForReview}
                    searchQuery={searchQuery}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="archived" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Challenges Arquivados ({archivedChallenges.length})</CardTitle>
                <CardDescription>
                  Challenges arquivados que podem ser excluídos permanentemente
                </CardDescription>
              </CardHeader>
              <CardContent>
                {challengeLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando challenges arquivados...</p>
                  </div>
                ) : (
                  <TeacherChallengeList 
                    challenges={archivedChallenges} 
                    onDelete={handleDeleteChallenge}
                    searchQuery={searchQuery}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

