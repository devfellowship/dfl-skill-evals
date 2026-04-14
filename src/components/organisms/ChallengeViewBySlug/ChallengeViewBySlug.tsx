"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@devfellowship/components';
import { useState, useEffect } from 'react'
import { useChallengeManagement } from '@/hooks/useChallengeManagement'

import { Button } from '@/components/atoms/Button/Button'
import { Badge } from '@/components/atoms/Badge/Badge'
import { ArrowLeft, XCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { ChallengeData, ChallengeViewBySlugProps } from '@/interface'
export function ChallengeViewBySlug({ slug }: ChallengeViewBySlugProps) {
  const { getChallengeBySlug, loading, error } = useChallengeManagement()
  const [challenge, setChallenge] = useState<ChallengeData | null>(null)
  useEffect(() => {
    if (slug) {
      loadChallenge()
    }
  }, [slug])
  const loadChallenge = async () => {
    try {
      const challengeData = await getChallengeBySlug(slug)
      if (challengeData) {
        setChallenge(challengeData)
      } else {
        toast.error("Challenge não encontrada")
      }
    } catch (err) {
      toast.error("Erro ao carregar challenge")
    }
  }
  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      hard: "bg-red-100 text-red-800",
      expert: "bg-purple-100 text-purple-800"
    }
    return colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800"
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
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando challenge...</p>
        </div>
      </div>
    )
  }
  if (error || !challenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Challenge não encontrada</h1>
          <p className="text-gray-600 mb-6">A challenge que você está procurando não existe ou foi removida.</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Link>
          </Button>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/95 backdrop-blur border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-6">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">{challenge.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
                {challenge.category && (
                  <Badge variant="outline">
                    {challenge.category}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Descrição</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {challenge.description}
              </p>
            </div>
            {challenge.skills && challenge.skills.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Habilidades:</h4>
                <div className="flex flex-wrap gap-2">
                  {challenge.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="font-medium text-gray-700">Função:</span>
            <p className="text-gray-900 font-mono mt-1">{challenge.function_name}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="font-medium text-gray-700">Status:</span>
            <Badge className={`mt-1 ${getStatusColor(challenge.status)}`}>
              {getStatusLabel(challenge.status)}
            </Badge>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="font-medium text-gray-700">Criada em:</span>
            <p className="text-gray-900 mt-1">
              {challenge.created_at ? new Date(challenge.created_at).toLocaleDateString('pt-BR') : 'Data não disponível'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}