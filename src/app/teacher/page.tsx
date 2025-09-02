"use client"

import { useState, useEffect } from "react"
import { useChallengeManagement } from "@/hooks/useChallengeManagement"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, CheckCircle, Clock } from "lucide-react"
import { AdminRouteWrapper } from "@/components/atoms/AdminRouteWrapper/AdminRouteWrapper"
import { AdminNavigation } from "@/components/atoms/AdminNavigation/AdminNavigation"
import { DashboardHeaderButtons } from "@/components/atoms/DashboardHeaderButtons/DashboardHeaderButtons"
import { TeacherStatsCards } from "@/components/molecules/TeacherStatsCards/TeacherStatsCards"
import { TeacherChallengeList } from "@/components/molecules/TeacherChallengeList/TeacherChallengeList"
import { SearchButton } from "@/components/atoms/SearchButton/SearchButton"

export default function TeacherDashboard() {
  const { 
    getUserChallenges, 
    submitForApproval,
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
  const pendingChallenges = myChallenges.filter(c => c.status === 'to_approve' || c.status === 'draft')

  useEffect(() => {
    loadChallenges()
  }, [])

  const loadChallenges = async () => {
    try {
      const challenges = await getUserChallenges()
      console.log('📚 Challenges carregadas no teacher dashboard:', challenges.length)
      console.log('📊 Status das challenges:', challenges.map(c => ({ id: c.id, status: c.status, title: c.title })))
      
      setMyChallenges(challenges)
      
      const stats = {
        totalChallenges: challenges.length,
        approvedChallenges: challenges.filter(c => c.status === 'approved').length,
        toApproveChallenges: challenges.filter(c => c.status === 'to_approve').length,
        totalSubmissions: challenges.reduce((sum, c) => sum + (c.submissions_count || 0), 0),
        averageScore: challenges.length > 0 ? challenges.reduce((sum, c) => sum + (c.average_score || 0), 0) / challenges.length : 0
      }
      
      console.log('📈 Estatísticas calculadas:', stats)
      setTeacherStats(stats)
    } catch (error) {
      console.error('Erro ao carregar challenges:', error)
    }
  }

  const handleDeleteChallenge = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este challenge?')) {
      try {
        console.log('Delete challenge:', id)
        setMyChallenges(prev => prev.filter(c => c.id !== id))
        loadChallenges()
      } catch (error) {
        console.error('Erro ao excluir challenge:', error)
      }
    }
  }

  const handleTitleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <AdminRouteWrapper>
      <div className="min-h-screen bg-background">
        <AdminNavigation
          items={[
            { label: "Dashboard Teacher", href: "/teacher" }
          ]}
          quickActions={[
            {
              label: "Dashboard Admin",
              href: "/admin",
              icon: <Code className="h-4 w-4" />,
              variant: "outline"
            }
          ]}
          showBackButton={false}
          userName="Professor"
          userRole="Teacher"
        />

        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-primary">Dashboard Professor</h1>
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="published" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Publicados ({publishedChallenges.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pendentes ({pendingChallenges.length})
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
                      searchQuery={searchQuery}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminRouteWrapper>
  )
}