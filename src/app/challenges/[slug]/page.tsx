"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useChallengeManagement } from '@/hooks/useChallengeManagement'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/atoms/Button/Button'
import { Badge } from '@/components/atoms/Badge/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  Play, 
  Code, 
  TestTube, 
  BookOpen, 
  Clock,
  CheckCircle,
  XCircle,
  Archive
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface ChallengeData {
  id: string
  title: string
  slug: string
  description: string
  difficulty: string
  category?: string
  skills: string[]
  function_name: string
  initial_code: string
  test_cases: any[]
  examples?: any[]
  constraints: string[]
  hints: string[]
  status: string
  created_at: string
  updated_at: string
}

export default function ChallengePage() {
  const params = useParams()
  const slug = params.slug as string
  
  const { getChallengeBySlug, loading, error } = useChallengeManagement()
  const [challenge, setChallenge] = useState<ChallengeData | null>(null)
  const [activeTab, setActiveTab] = useState('description')

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
      console.error('Erro ao carregar challenge:', err)
      toast.error("Erro ao carregar challenge")
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      hard: "bg-red-100 text-red-800",
      beginner: "bg-blue-100 text-blue-800",
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
      {/* Header */}
      <header className="bg-background/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-primary">{challenge.title}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                  <Badge className={getStatusColor(challenge.status)}>
                    {getStatusLabel(challenge.status)}
                  </Badge>
                  {challenge.category && (
                    <Badge variant="outline">
                      {challenge.category}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Documentação
              </Button>
              <Button size="sm">
                <Play className="w-4 h-4 mr-2" />
                Resolver Challenge
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Descrição
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Exemplos
            </TabsTrigger>
            <TabsTrigger value="constraints" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Restrições
            </TabsTrigger>
            <TabsTrigger value="hints" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Dicas
            </TabsTrigger>
          </TabsList>

          {/* Tab: Descrição */}
          <TabsContent value="description" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Descrição do Problema</CardTitle>
                <CardDescription>
                  Leia atentamente a descrição antes de começar a resolver
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {challenge.description}
                  </p>
                </div>
                
                {challenge.skills && challenge.skills.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Habilidades necessárias:</h4>
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
          </TabsContent>

          {/* Tab: Exemplos */}
          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exemplos de Entrada e Saída</CardTitle>
                <CardDescription>
                  Use estes exemplos para entender melhor o problema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {challenge.examples && challenge.examples.length > 0 ? (
                  <div className="space-y-4">
                    {challenge.examples.map((example, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="font-semibold text-gray-900 mb-2">Exemplo {index + 1}:</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-gray-700">Entrada:</span>
                            <pre className="mt-1 text-sm bg-white p-2 rounded border">
                              {JSON.stringify(example.input, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Saída:</span>
                            <pre className="mt-1 text-sm bg-white p-2 rounded border">
                              {JSON.stringify(example.output, null, 2)}
                            </pre>
                          </div>
                        </div>
                        {example.explanation && (
                          <div className="mt-3">
                            <span className="font-medium text-gray-700">Explicação:</span>
                            <p className="mt-1 text-sm text-gray-600">{example.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <TestTube className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum exemplo disponível para esta challenge</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Restrições */}
          <TabsContent value="constraints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Restrições e Limitações</CardTitle>
                <CardDescription>
                  Considere estas restrições ao implementar sua solução
                </CardDescription>
              </CardHeader>
              <CardContent>
                {challenge.constraints && challenge.constraints.length > 0 ? (
                  <div className="space-y-3">
                    {challenge.constraints.map((constraint, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{constraint}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Code className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Nenhuma restrição específica para esta challenge</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Dicas */}
          <TabsContent value="hints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dicas para Resolução</CardTitle>
                <CardDescription>
                  Use estas dicas se estiver com dificuldades
                </CardDescription>
              </CardHeader>
              <CardContent>
                {challenge.hints && challenge.hints.length > 0 ? (
                  <div className="space-y-4">
                    {challenge.hints.map((hint, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                        <h4 className="font-semibold text-gray-900 mb-1">Dica {index + 1}:</h4>
                        <p className="text-gray-700">{hint}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Nenhuma dica disponível para esta challenge</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Informações da Challenge */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Informações da Challenge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Função:</span>
                <p className="text-gray-900 font-mono">{challenge.function_name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Criada em:</span>
                <p className="text-gray-900">{new Date(challenge.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Atualizada em:</span>
                <p className="text-gray-900">{new Date(challenge.updated_at).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <Badge className={`mt-1 ${getStatusColor(challenge.status)}`}>
                  {getStatusLabel(challenge.status)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

