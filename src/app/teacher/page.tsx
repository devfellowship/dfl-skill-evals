"use client"

import { useState, useEffect } from "react"
import { useChallengeManagement } from "@/hooks/useChallengeManagement"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/atoms/Button/Button"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  Plus, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Edit,
  Eye,
  Trash2,
  Code,
  TestTube,
  Settings,
  Send
} from "lucide-react"
import Link from "next/link"
import { AdminRouteWrapper } from "@/components/atoms/AdminRouteWrapper/AdminRouteWrapper"
import { AdminNavigation } from "@/components/atoms/AdminNavigation/AdminNavigation"

interface TeacherChallenge {
  id: string
  title: string
  slug: string
  description: string
  difficulty: string
  category: string
  status: string
  created_at: string
  updated_at: string
  submissions_count?: number
  average_score?: number
}

export default function TeacherDashboard() {
  const { 
    getUserChallenges, 
    submitForApproval,
    loading: challengeLoading 
  } = useChallengeManagement()
  
  const [myChallenges, setMyChallenges] = useState<TeacherChallenge[]>([])
  const [teacherStats, setTeacherStats] = useState({
    totalChallenges: 0,
    approvedChallenges: 0,
    toApproveChallenges: 0,
    rejectedChallenges: 0,
    totalSubmissions: 0,
    averageScore: 0
  })

  useEffect(() => {
    loadMyChallenges()
  }, [])

  const loadMyChallenges = async () => {
    try {
      const challenges = await getUserChallenges()
      if (challenges) {
        const adaptedChallenges: TeacherChallenge[] = challenges.map(challenge => ({
          id: challenge.id,
          title: challenge.title,
          slug: challenge.slug,
          description: challenge.description,
          difficulty: challenge.difficulty,
          category: challenge.category || "Algoritmos",
          status: challenge.status,
          created_at: challenge.created_at,
          updated_at: challenge.updated_at,
          submissions_count: 0, // TODO: Implementar contagem de submissões
          average_score: 0 // TODO: Implementar média de scores
        }))
        setMyChallenges(adaptedChallenges)
        

        const stats = {
          totalChallenges: adaptedChallenges.length,
          approvedChallenges: adaptedChallenges.filter(c => c.status === 'approved').length,
          toApproveChallenges: adaptedChallenges.filter(c => c.status === 'to_approve').length,
          rejectedChallenges: adaptedChallenges.filter(c => c.status === 'rejected').length,
          totalSubmissions: adaptedChallenges.reduce((sum, c) => sum + (c.submissions_count || 0), 0),
          averageScore: adaptedChallenges.length > 0 
            ? adaptedChallenges.reduce((sum, c) => sum + (c.average_score || 0), 0) / adaptedChallenges.length 
            : 0
        }
        setTeacherStats(stats)
      }
    } catch (err) {
      console.error('Erro ao carregar challenges:', err)
    }
  }

  const handleSubmitForApproval = async (challengeId: string) => {
    try {
      const result = await submitForApproval(challengeId);
      if (result) {
        alert('Challenge submetido para aprovação com sucesso!');
        loadMyChallenges(); // Recarrega as challenges para atualizar o status
      } else {
        alert('Erro ao submeter challenge para aprovação.');
      }
    } catch (err) {
      console.error('Erro ao submeter challenge para aprovação:', err);
      alert('Erro ao submeter challenge para aprovação.');
    }
  };

  const getDifficultyColor = (difficulty: string | number) => {

    const difficultyMap: { [key: string]: string } = {
      '1': 'beginner',
      '2': 'easy', 
      '3': 'medium',
      '4': 'hard',
      '5': 'expert',
      'beginner': 'beginner',
      'easy': 'easy',
      'medium': 'medium', 
      'hard': 'hard',
      'expert': 'expert'
    }
    
    const normalizedDifficulty = difficultyMap[difficulty.toString()] || difficulty.toString()
    
    const colors = {
      beginner: "bg-blue-100 text-blue-800",
      easy: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      hard: "bg-red-100 text-red-800",
      expert: "bg-purple-100 text-purple-800"
    }
    return colors[normalizedDifficulty as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getDifficultyLabel = (difficulty: string | number) => {
    const difficultyMap: { [key: string]: string } = {
      '1': 'Iniciante',
      '2': 'Fácil',
      '3': 'Médio', 
      '4': 'Difícil',
      '5': 'Expert',
      'beginner': 'Iniciante',
      'easy': 'Fácil',
      'medium': 'Médio',
      'hard': 'Difícil', 
      'expert': 'Expert'
    }
    return difficultyMap[difficulty.toString()] || difficulty.toString()
  }

  const getStatusColor = (status: string) => {
    const colors = {
      to_approve: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      archived: "bg-gray-100 text-gray-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      to_approve: "A ser aprovado",
      approved: "Aprovado",
      rejected: "Reprovado",
      archived: "Arquivado"
    }
    return labels[status as keyof typeof labels] || status
  }

  return (
    <AdminRouteWrapper>
      <AdminNavigation 
        items={[
          { label: "Dashboard Teacher", href: "/teacher" }
        ]}
        quickActions={[
          {
            label: "Dashboard Admin",
            href: "/admin",
            icon: <BarChart3 className="h-4 w-4" />,
            variant: "outline"
          },
          {
            label: "Criar Challenge",
            href: "/teacher/create",
            icon: <Plus className="h-4 w-4" />,
            variant: "default"
          }
        ]}
        showUserInfo={true}
        userName="Professor"
        userRole="Teacher"
      />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-background/95 backdrop-blur border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-primary">Dashboard Professor</h1>
                <p className="text-muted-foreground">Gerencie seus challenges e acompanhe o progresso dos alunos</p>
              </div>
              <div className="flex gap-4">
                <Button asChild>
                  <Link href="/teacher/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Challenge
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Voltar ao Site</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid - Estatísticas do Professor */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Meus Challenges</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teacherStats.totalChallenges}</div>
                                 <p className="text-xs text-muted-foreground">
                   {teacherStats.approvedChallenges} aprovados, {teacherStats.toApproveChallenges} a serem aprovados
                 </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aguardando Aprovação</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                                 <div className="text-2xl font-bold">{teacherStats.toApproveChallenges}</div>
                <p className="text-xs text-muted-foreground">Em revisão pelo admin</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Submissões</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teacherStats.totalSubmissions}</div>
                <p className="text-xs text-muted-foreground">
                  Média: {teacherStats.averageScore.toFixed(1)} pontos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="challenges" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="challenges" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Meus Challenges
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configurações
              </TabsTrigger>
            </TabsList>

            {/* Tab: Meus Challenges */}
            <TabsContent value="challenges" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Meus Challenges ({myChallenges.length})</CardTitle>
                  <CardDescription>
                    Gerencie todos os challenges que você criou
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {challengeLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Carregando seus challenges...</p>
                    </div>
                  ) : myChallenges.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">Você ainda não criou nenhum challenge</p>
                      <Button asChild>
                        <Link href="/teacher/create">
                          <Plus className="w-4 h-4 mr-2" />
                          Criar Primeiro Challenge
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myChallenges.map((challenge) => (
                        <div
                          key={challenge.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 hover:border-border/60 transition-all duration-200 group"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-200">
                                {challenge.title}
                              </h3>
                              <Badge className={getDifficultyColor(challenge.difficulty)}>
                                {getDifficultyLabel(challenge.difficulty)}
                              </Badge>
                              <Badge className={getStatusColor(challenge.status)}>
                                {getStatusLabel(challenge.status)}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-2 group-hover:text-foreground transition-colors duration-200">
                              {challenge.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors duration-200">
                              <span>📁 {challenge.category}</span>
                              <span>📅 Criado: {new Date(challenge.created_at).toLocaleDateString('pt-BR')}</span>
                              <span>🔄 Atualizado: {new Date(challenge.updated_at).toLocaleDateString('pt-BR')}</span>
                              {challenge.submissions_count !== undefined && (
                                <span>📊 {challenge.submissions_count} submissões</span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <Link href={`/teacher/edit/${challenge.id}`}>
                                <Edit className="w-4 h-4" />
                              </Link>
                            </Button>
                                                         <Button
                               variant="outline"
                               size="sm"
                               asChild
                               className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                             >
                               <Link href={`/challenges/${challenge.slug}`} target="_blank">
                                 <Eye className="w-4 h-4" />
                               </Link>
                             </Button>
                                                         {challenge.status === 'to_approve' && (
                               <Button
                                 variant="outline"
                                 size="sm"
                                 className="opacity-70 group-hover:opacity-100 transition-opacity duration-200 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                 title="Aguardando Aprovação"
                                 disabled
                               >
                                 <Clock className="w-4 h-4" />
                               </Button>
                             )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Performance */}
            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance dos Alunos</CardTitle>
                  <CardDescription>
                    Acompanhe como os alunos estão se saindo nos seus challenges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Performance em Desenvolvimento</h3>
                    <p>Esta funcionalidade permitirá visualizar estatísticas detalhadas dos alunos</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Configurações */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações do Professor</CardTitle>
                  <CardDescription>
                    Configure suas preferências e perfil de professor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <Settings className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Configurações em Desenvolvimento</h3>
                    <p>Personalize seu perfil e preferências de ensino</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminRouteWrapper>
  )
}
