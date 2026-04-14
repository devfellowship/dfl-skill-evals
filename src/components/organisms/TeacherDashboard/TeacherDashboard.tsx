"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from '@devfellowship/components';
import { useState, useEffect, useMemo } from "react"
import { useChallengesGlobal } from "@/hooks/useChallengesGlobal"
import { useChallengeOperations } from "@/hooks/useChallengeOperations"
import { useAuth } from "@/hooks/useAuth"
import { Code, CheckCircle, Clock, Archive, XCircle } from "lucide-react"
import { AdminNavigation } from "@/components/atoms/AdminNavigation/AdminNavigation"
import { DashboardHeaderButtons } from "@/components/atoms/DashboardHeaderButtons/DashboardHeaderButtons"
import { TeacherStatsCards } from "@/components/molecules/TeacherStatsCards/TeacherStatsCards"
import { TeacherChallengeList } from "@/components/molecules/TeacherChallengeList/TeacherChallengeList"
import { SearchButton } from "@/components/atoms/SearchButton/SearchButton"
export function TeacherDashboard() {
  const { user } = useAuth()
  const { 
    published, 
    pending,
    archived, 
    isInitialLoading, 
    loadAllChallenges
  } = useChallengesGlobal()
  const {
    isDeleting,
    isArchiving,
    deleteChallenge,
    archiveChallenge,
    sendBackForReview
  } = useChallengeOperations()
  const myPublished = useMemo(
    () => (user?.id ? published.filter(c => c.created_by === user.id) : []),
    [published, user?.id]
  )
  const myPending = useMemo(
    () => (user?.id ? pending.filter(c => c.created_by === user.id) : []),
    [pending, user?.id]
  )
  const myRejected = useMemo(
    () => (user?.id ? pending.filter((c: any) => c.created_by === user.id && c.status === 'rejected') : []),
    [pending, user?.id]
  )
  const myArchived = useMemo(
    () => (user?.id ? archived.filter(c => c.created_by === user.id) : []),
    [archived, user?.id]
  )
  const [searchQuery, setSearchQuery] = useState("")
  const teacherStats = useMemo(() => {
    const allMine = [...myPublished, ...myPending, ...myRejected, ...myArchived]
    return {
      totalChallenges: allMine.length,
      approvedChallenges: myPublished.length,
      toApproveChallenges: myPending.length,
      rejectedChallenges: myRejected.length,
      totalSubmissions: allMine.reduce((sum, c) => sum + ((c as any).submissions_count || 0), 0),
      averageScore:
        allMine.length > 0
          ? allMine.reduce((sum, c) => sum + ((c as any).average_score || 0), 0) / allMine.length
          : 0
    }
  }, [myPublished, myPending, myRejected, myArchived])
  useEffect(() => {
    loadAllChallenges()
  }, [loadAllChallenges])
  const handleDeleteChallenge = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este challenge?")) {
      try {
        const result = await deleteChallenge(id, "Excluído pelo teacher")
        if (result) {
          alert("Challenge excluído com sucesso!")
        } else {
          alert("Não foi possível excluir o challenge. Verifique se ele está em um status válido para exclusão.")
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro ao excluir challenge. Tente novamente."
        alert(errorMessage)
      }
    }
  }
  const onSendBackForReviewClick = async (id: string) => {
    if (confirm("Tem certeza que deseja enviar este challenge de volta para análise? Isso permitirá que ele seja excluído posteriormente.")) {
      try {
        const result = await sendBackForReview(id)
        if (result) {
          alert("Challenge enviado de volta para análise com sucesso!")
        }
      } catch {
        alert("Erro ao enviar challenge de volta. Tente novamente.")
      }
    }
  }
  const handleTitleSearch = (query: string) => {
    setSearchQuery(query)
  }
  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation
        items={[{ label: "Dashboard Teacher", href: "/teacher" }]}
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="published" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Publicados ({myPublished.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pendentes ({myPending.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Rejeitados ({myRejected.length})
            </TabsTrigger>
            <TabsTrigger value="archived" className="flex items-center gap-2">
              <Archive className="w-4 h-4" />
              Arquivados ({myArchived.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="published" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Challenges Publicados ({myPublished.length})</CardTitle>
                <CardDescription>Challenges aprovados e disponíveis para os alunos</CardDescription>
              </CardHeader>
              <CardContent>
                {isInitialLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando challenges publicados...</p>
                  </div>
                ) : (
                  <TeacherChallengeList 
                    challenges={myPublished} 
                    onDelete={handleDeleteChallenge}
                    onSendBackForReview={onSendBackForReviewClick}
                    searchQuery={searchQuery}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Challenges Pendentes ({myPending.length})</CardTitle>
                <CardDescription>Challenges aguardando aprovação ou em rascunho</CardDescription>
              </CardHeader>
              <CardContent>
                {isInitialLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando challenges pendentes...</p>
                  </div>
                ) : (
                  <TeacherChallengeList 
                    challenges={myPending} 
                    onDelete={handleDeleteChallenge}
                    onSendBackForReview={onSendBackForReviewClick}
                    searchQuery={searchQuery}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="rejected" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Challenges Rejeitados ({myRejected.length})</CardTitle>
                <CardDescription>Challenges rejeitados que precisam ser corrigidos e reenviados</CardDescription>
              </CardHeader>
              <CardContent>
                {isInitialLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando challenges rejeitados...</p>
                  </div>
                ) : (
                  <TeacherChallengeList 
                    challenges={myRejected} 
                    onDelete={handleDeleteChallenge}
                    onSendBackForReview={onSendBackForReviewClick}
                    searchQuery={searchQuery}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="archived" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Challenges Arquivados ({myArchived.length})</CardTitle>
                <CardDescription>Challenges arquivados que podem ser excluídos permanentemente</CardDescription>
              </CardHeader>
              <CardContent>
                {isInitialLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando challenges arquivados...</p>
                  </div>
                ) : (
                  <TeacherChallengeList 
                    challenges={myArchived} 
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
