"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useChallengeManagement } from "@/hooks/useChallengeManagement"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/atoms/Button/Button"
import { Badge } from "@/components/atoms/Badge/Badge"
import { LoadingState } from "@/components/molecules/LoadingState"
import { NotFoundState } from "@/components/molecules/NotFoundState"
import { CheckCircle, XCircle, Clock, Users, BookOpen, TrendingUp } from "lucide-react"
import Link from "next/link"

interface PendingChallenge {
  id: string
  title: string
  description: string
  difficulty: string
  created_at: string
  created_by_profile: {
    full_name: string
    email: string
  }
}

export default function AdminDashboard() {
  const { user, loading: authLoading, canApproveChallenges, isAdmin } = useAuth()
  const { 
    getPendingChallenges, 
    approveChallenge, 
    rejectChallenge, 
    loading: challengeLoading 
  } = useChallengeManagement()
  
  const [pendingChallenges, setPendingChallenges] = useState<PendingChallenge[]>([])
  const [stats, setStats] = useState({
    totalChallenges: 0,
    pendingChallenges: 0,
    totalUsers: 0,
    activeUsers: 0
  })

  useEffect(() => {
    if (user && canApproveChallenges()) {
      loadPendingChallenges()
      loadStats()
    }
  }, [user])

  const loadPendingChallenges = async () => {
    const challenges = await getPendingChallenges()
    setPendingChallenges(challenges as PendingChallenge[])
  }

  const loadStats = async () => {
    // Aqui você implementaria as queries para estatísticas
    // Por enquanto, dados mock
    setStats({
      totalChallenges: 25,
      pendingChallenges: pendingChallenges.length,
      totalUsers: 150,
      activeUsers: 89
    })
  }

  const handleApprove = async (challengeId: string) => {
    const result = await approveChallenge(challengeId)
    if (result) {
      await loadPendingChallenges()
      await loadStats()
    }
  }

  const handleReject = async (challengeId: string) => {
    const reason = prompt("Motivo da rejeição:")
    if (reason) {
      const result = await rejectChallenge(challengeId, reason)
      if (result) {
        await loadPendingChallenges()
        await loadStats()
      }
    }
  }

  if (authLoading) {
    return <LoadingState message="Verificando permissões..." />
  }

  if (!user || !canApproveChallenges()) {
    return (
      <NotFoundState 
        title="Acesso Negado" 
        message="Você não tem permissão para acessar o painel de administração." 
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-primary">Painel de Administração</h1>
              <p className="text-muted-foreground">Gerencie challenges e usuários da plataforma</p>
            </div>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/teacher">Dashboard Professor</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Voltar ao Site</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Challenges</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalChallenges}</div>
              <p className="text-xs text-muted-foreground">+2 desde ontem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingChallenges}</div>
              <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">+12 esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">59% do total</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Challenges */}
        <Card>
          <CardHeader>
            <CardTitle>Challenges Pendentes de Aprovação</CardTitle>
          </CardHeader>
          <CardContent>
            {challengeLoading ? (
              <div className="text-center py-8">Carregando challenges...</div>
            ) : pendingChallenges.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum challenge pendente de aprovação.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {challenge.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="secondary">{challenge.difficulty}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Por: {challenge.created_by_profile?.full_name || 'N/A'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(challenge.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(challenge.id)}
                        disabled={challengeLoading}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(challenge.id)}
                        disabled={challengeLoading}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
