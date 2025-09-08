"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/atoms/Button/Button"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, CheckCircle, XCircle, Clock, Code, TestTube, BookOpen, FileText } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { AdminChallenge } from "@/types/admin/admin-dashboard"
import { DifficultyIndicator } from "@/components/molecules/DifficultyIndicator/DifficultyIndicator"
import { AdminRouteWrapper } from "@/components/atoms/AdminRouteWrapper/AdminRouteWrapper"
import type { RealtimeChannel } from '@supabase/supabase-js'

export default function AdminChallengeView() {
  const params = useParams()
  const router = useRouter()
  const [challenge, setChallenge] = useState<AdminChallenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (params.id) {
      loadChallenge(params.id as string)
      setupRealtimeSubscription(params.id as string)
    }

    return () => {
      if (channelRef.current) {
        console.log('📡 Removendo canal realtime da página individual')
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [params.id])

  const adaptChallenge = (raw: any): AdminChallenge => {
    const mapStatus = raw.status === 'approved'
      ? 'published'
      : raw.status === 'to_approve' || raw.status === 'rejected'
      ? 'draft'
      : raw.status === 'archived'
      ? 'archived'
      : 'draft'

    const mapDifficulty = (difficulty: number) => {
      switch (difficulty) {
        case 1: return 'easy'
        case 2: return 'medium'
        case 3: return 'hard'
        case 4: return 'expert'
        default: return 'easy'
      }
    }

    return {
      id: raw.id,
      slug: raw.slug,
      title: raw.title,
      description: raw.description,
      difficulty: mapDifficulty(raw.difficulty),
      category: Array.isArray(raw.category) ? raw.category : (raw.category ? [raw.category] : ['Algoritmos']),
      functionName: raw.function_name,
      status: mapStatus,
      createdAt: raw.created_at ? new Date(raw.created_at).toLocaleDateString('pt-BR') : 'Data não disponível',
      updatedAt: raw.updated_at ? new Date(raw.updated_at).toLocaleDateString('pt-BR') : 'Data não disponível',
      initialCode: raw.initial_code ?? '',
      testCases: raw.test_cases ?? [],
      orderIndex: raw.order_index ?? null,
      imageUrl: raw.image_url ?? null
    }
  }

  const loadChallenge = async (id: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Erro ao carregar challenge:', error)
        setError('Erro ao carregar challenge')
        return
      }

      if (data) {
        const adaptedChallenge = adaptChallenge(data)
        setChallenge(adaptedChallenge)
      }
    } catch (err) {
      console.error('Erro ao carregar challenge:', err)
      setError('Erro ao carregar challenge')
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeSubscription = (challengeId: string) => {

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }


    const channel = supabase.channel(`challenge-${challengeId}`, {
      config: {
        broadcast: { self: true }
      }
    })
    
    channelRef.current = channel
    console.log('📡 Configurando realtime para challenge individual:', challengeId)

    channel
      .on('broadcast', { event: 'challenge-updated' }, ({ payload }) => {
        console.log('📡 Broadcast recebido na página individual - challenge-updated:', payload)
        if (payload.challenge && payload.challenge.id === challengeId) {
          const adaptedChallenge = adaptChallenge(payload.challenge)
          setChallenge(adaptedChallenge)
          console.log('✅ Challenge atualizado na página individual')
        }
      })
      .on('broadcast', { event: 'challenge-deleted' }, ({ payload }) => {
        console.log('📡 Broadcast recebido na página individual - challenge-deleted:', payload)
        if (payload.challengeId === challengeId) {
          console.log('⚠️ Challenge foi deletado, redirecionando...')
          router.push('/admin')
        }
      })
      .subscribe((status) => {
        console.log('📡 Status do canal realtime da página individual:', status)
        if (status === 'CHANNEL_ERROR') {
          console.warn('⚠️ Erro no canal da página individual')
        } else if (status === 'SUBSCRIBED') {
          console.log('✅ Canal realtime da página individual conectado com sucesso')
        }
      })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'archived': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado'
      case 'draft': return 'Rascunho'
      case 'archived': return 'Arquivado'
      default: return status
    }
  }

  const getDifficultyNumber = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 1
      case 'medium': return 2
      case 'hard': return 3
      case 'expert': return 4
      default: return 1
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-destructive mb-2">Erro</h2>
            <p className="text-muted-foreground">{error || 'Challenge não encontrado'}</p>
            <Button onClick={() => router.back()} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AdminRouteWrapper allowedRoles={['admin']}>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{challenge.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(challenge.status)}>
                  {getStatusLabel(challenge.status)}
                </Badge>
                <DifficultyIndicator 
                  difficulty={getDifficultyNumber(challenge.difficulty)} 
                  maxLevel={4}
                />
              </div>
            </div>
          </div>
          <Button onClick={() => router.push(`/admin/edit/${challenge.id}`)}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Descrição
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Código
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Testes
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Informações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Descrição do Challenge</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {challenge.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Categoria</label>
                    <p className="text-sm">
                      {Array.isArray(challenge.category) ? challenge.category.join(', ') : challenge.category}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Função</label>
                    <p className="text-sm font-mono">{challenge.functionName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Código Inicial</CardTitle>
                <CardDescription>
                  Código que será fornecido como base para o usuário
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">{challenge.initialCode || 'Nenhum código inicial fornecido'}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Casos de Teste</CardTitle>
                <CardDescription>
                  {challenge.testCases?.length || 0} caso(s) de teste definido(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {challenge.testCases && challenge.testCases.length > 0 ? (
                  <div className="space-y-4">
                    {challenge.testCases.map((testCase: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">Teste {index + 1}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <label className="font-medium text-muted-foreground">Entrada:</label>
                            <pre className="bg-muted p-2 rounded mt-1 overflow-x-auto">
                              <code>{JSON.stringify(testCase.input, null, 2)}</code>
                            </pre>
                          </div>
                          <div>
                            <label className="font-medium text-muted-foreground">Saída Esperada:</label>
                            <pre className="bg-muted p-2 rounded mt-1 overflow-x-auto">
                              <code>{JSON.stringify(testCase.expectedOutput, null, 2)}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum caso de teste definido</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Challenge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">ID</label>
                    <p className="text-sm font-mono">{challenge.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Slug</label>
                    <p className="text-sm font-mono">{challenge.slug}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Criado em</label>
                    <p className="text-sm">{challenge.createdAt}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Atualizado em</label>
                    <p className="text-sm">{challenge.updatedAt}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Ordem</label>
                    <p className="text-sm">{challenge.orderIndex ?? 'Não definida'}</p>
                  </div>
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

