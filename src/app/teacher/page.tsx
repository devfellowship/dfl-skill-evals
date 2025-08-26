"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useChallengeManagement } from "@/hooks/useChallengeManagement"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/atoms/Button/Button"
import { Badge } from "@/components/atoms/Badge/Badge"
import { LoadingState } from "@/components/molecules/LoadingState"
import { NotFoundState } from "@/components/molecules/NotFoundState"
import { Plus, Edit, Trash2, Send, Eye } from "lucide-react"
import Link from "next/link"

interface TeacherChallenge {
  id: string
  title: string
  description: string
  difficulty: string
  status: string
  created_at: string
  estimated_time_minutes: number
}

export default function TeacherDashboard() {
  const { user, loading: authLoading, canCreateChallenges } = useAuth()
  const { 
    getUserChallenges, 
    submitForApproval, 
    deleteChallenge, 
    loading: challengeLoading 
  } = useChallengeManagement()
  
  const [challenges, setChallenges] = useState<TeacherChallenge[]>([])
  const [filter, setFilter] = useState<'all' | 'draft' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    if (user && canCreateChallenges()) {
      loadChallenges()
    }
  }, [user, filter])

  const loadChallenges = async () => {
    const userChallenges = await getUserChallenges(filter === 'all' ? undefined : filter)
    setChallenges(userChallenges as TeacherChallenge[])
  }

  const handleSubmitForApproval = async (challengeId: string) => {
    const result = await submitForApproval(challengeId)
    if (result) {
      await loadChallenges()
    }
  }

  const handleDelete = async (challengeId: string) => {
    if (confirm("Tem certeza que deseja deletar este challenge?")) {
      const result = await deleteChallenge(challengeId)
      if (result) {
        await loadChallenges()
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado'
      case 'pending': return 'Pendente'
      case 'rejected': return 'Rejeitado'
      case 'draft': return 'Rascunho'
      default: return status
    }
  }

  if (authLoading) {
    return <LoadingState message="Verificando permissões..." />
  }

  if (!user || !canCreateChallenges()) {
    return (
      <NotFoundState 
        title="Acesso Negado" 
        message="Você não tem permissão para criar challenges." 
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
              <h1 className="text-3xl font-bold text-primary">Dashboard do Professor</h1>
              <p className="text-muted-foreground">Crie e gerencie seus challenges</p>
            </div>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/teacher/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Challenge
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
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['all', 'draft', 'pending', 'approved', 'rejected'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status as any)}
            >
              {status === 'all' ? 'Todos' : getStatusLabel(status)}
            </Button>
          ))}
        </div>

        {/* Challenges Grid */}
        <div className="grid gap-6">
          {challengeLoading ? (
            <LoadingState message="Carregando seus challenges..." />
          ) : challenges.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">Nenhum challenge encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  {filter === 'all' 
                    ? 'Você ainda não criou nenhum challenge.'
                    : `Você não tem challenges com status "${getStatusLabel(filter)}".`
                  }
                </p>
                <Button asChild>
                  <Link href="/teacher/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Challenge
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            challenges.map((challenge) => (
              <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{challenge.title}</CardTitle>
                      <p className="text-muted-foreground mt-1 line-clamp-2">
                        {challenge.description}
                      </p>
                    </div>
                    <Badge className={getStatusColor(challenge.status)}>
                      {getStatusLabel(challenge.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Dificuldade: {challenge.difficulty}</span>
                      <span>Tempo: {challenge.estimated_time_minutes}min</span>
                      <span>Criado: {new Date(challenge.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/teacher/challenge-page/${challenge.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Link>
                      </Button>
                      
                      {challenge.status === 'draft' && (
                        <>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/teacher/edit/${challenge.id}`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSubmitForApproval(challenge.id)}
                            disabled={challengeLoading}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Enviar
                          </Button>
                        </>
                      )}
                      
                      {(challenge.status === 'draft' || challenge.status === 'rejected') && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(challenge.id)}
                          disabled={challengeLoading}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Deletar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
