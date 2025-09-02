import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { useChallengeManagement } from './useChallengeManagement'
import { Challenge } from '@/components/organisms/DashboardAdmin/types'

export function useChallengesGlobal() {
  const { getAllChallenges } = useChallengeManagement()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Função para adaptar challenge do banco para o frontend
  const adaptChallenge = useCallback((raw: any): Challenge => {
    // Converte status do Supabase para 'draft' | 'published' | 'archived'
    const mapStatus = raw.status === 'approved'
      ? 'published'
      : raw.status === 'to_approve' || raw.status === 'rejected'
      ? 'draft'
      : raw.status === 'archived'
      ? 'archived'
      : 'draft'

    return {
      id: raw.id,
      slug: raw.slug,
      title: raw.title,
      description: raw.description,
      difficulty: raw.difficulty === 1 ? 'easy' : raw.difficulty === 2 ? 'medium' : 'hard',
      category: raw.category || 'Algoritmos',
      functionName: raw.function_name,
      status: mapStatus,
      createdAt: new Date(raw.created_at).toLocaleDateString('pt-BR'),
      updatedAt: new Date(raw.updated_at).toLocaleDateString('pt-BR'),
      initialCode: raw.initial_code ?? '',
      testCases: raw.test_cases ?? []
    }
  }, [])

  // Carregar todas as challenges na montagem
  const loadAllChallenges = useCallback(async () => {
    try {
      console.log('🔄 Carregando todas as challenges...')
      const dbChallenges = await getAllChallenges()
      
      if (dbChallenges && dbChallenges.length > 0) {
        const adaptedChallenges = dbChallenges.map(adaptChallenge)
        console.log('✅ Todas as challenges carregadas:', adaptedChallenges)
        setChallenges(adaptedChallenges)
      } else {
        console.log('⚠️ Nenhuma challenge encontrada')
        setChallenges([])
      }
    } catch (err) {
      console.error('❌ Erro ao carregar challenges:', err)
      setChallenges([])
    } finally {
      setIsInitialLoading(false)
    }
  }, [getAllChallenges, adaptChallenge])

  // Setup Realtime como fonte única de verdade
  useEffect(() => {
    // Carregar dados iniciais
    loadAllChallenges()

    // Configurar Realtime uma única vez
    const channel = supabase
      .channel('public:challenges')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'challenges' }, 
          payload => {
            console.log('🔄 Realtime Event:', payload.eventType, payload.new || payload.old)
            
            setChallenges(prev => {
              switch (payload.eventType) {
                case 'INSERT':
                  return [adaptChallenge(payload.new), ...prev]
                case 'UPDATE':
                  return prev.map(ch => 
                    ch.id === payload.new.id ? adaptChallenge(payload.new) : ch
                  )
                case 'DELETE':
                  return prev.filter(ch => ch.id !== payload.old.id)
                default:
                  return prev
              }
            })
            setLastUpdate(new Date())
          }
      )
      .subscribe((status) => {
        console.log('📡 Realtime Status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime conectado como fonte única de verdade!')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Erro no canal Realtime - usando fallback')
          // Fallback silencioso: recarregar apenas se necessário
          loadAllChallenges()
        }
      })

    return () => {
      console.log('🧹 Limpando subscription do Realtime')
      supabase.removeChannel(channel)
    }
  }, [loadAllChallenges, adaptChallenge])

  // Filtrar challenges por status usando useMemo para performance
  const published = useMemo(() => 
    challenges.filter(c => c.status === 'published'), 
    [challenges]
  )
  
  const pending = useMemo(() => 
    challenges.filter(c => c.status === 'draft'), 
    [challenges]
  )
  
  const archived = useMemo(() => 
    challenges.filter(c => c.status === 'archived'), 
    [challenges]
  )

  // Funções de atualização granular para optimistic updates
  const updateChallengeInList = useCallback((challengeId: string, updates: Partial<Challenge>) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, ...updates, updatedAt: new Date().toLocaleDateString('pt-BR') }
        : challenge
    ))
    setLastUpdate(new Date())
  }, [])

  const addChallengeToList = useCallback((newChallenge: any) => {
    const adaptedChallenge = adaptChallenge(newChallenge)
    setChallenges(prev => [adaptedChallenge, ...prev])
    setLastUpdate(new Date())
  }, [adaptChallenge])

  const removeChallengeFromList = useCallback((challengeId: string) => {
    setChallenges(prev => prev.filter(challenge => challenge.id !== challengeId))
    setLastUpdate(new Date())
  }, [])

  return {
    // Lista completa
    challenges,
    isInitialLoading,
    lastUpdate,
    
    // Listas filtradas
    published,
    pending,
    archived,
    
    // Funções de atualização
    updateChallengeInList,
    addChallengeToList,
    removeChallengeFromList,
    adaptChallenge,
    loadAllChallenges
  }
}
