import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useChallengeManagement } from './useChallengeManagement'
import { Challenge } from '@/components/organisms/DashboardAdmin/types'

type ChallengeStatus = 'approved' | 'to_approve' | 'archived'

export function useChallengesByStatus(status: ChallengeStatus) {
  const { getPendingChallenges, getArchivedChallenges } = useChallengeManagement()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Função para adaptar challenge do banco para o frontend
  const adaptChallenge = useCallback((challenge: any): Challenge => {
    let frontendStatus: "draft" | "published" | "archived"
    
    if (challenge.status === 'approved') {
      frontendStatus = 'published'
    } else if (challenge.status === 'to_approve' || challenge.status === 'rejected') {
      frontendStatus = 'draft'
    } else if (challenge.status === 'archived') {
      frontendStatus = 'archived'
    } else {
      frontendStatus = 'draft'
    }
    
    return {
      ...challenge,
      status: frontendStatus
    }
  }, [])

  // Carregar challenges iniciais baseado no status
  const loadInitialChallenges = useCallback(async () => {
    try {
      console.log(`🔄 Carregando challenges com status: ${status}...`)
      
      let dbChallenges: any[] = []
      
      if (status === 'approved') {
        // Para aprovados, buscar diretamente do Supabase
        const { data, error } = await supabase
          .from('challenges')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        dbChallenges = data || []
      } else if (status === 'to_approve') {
        dbChallenges = await getPendingChallenges()
      } else if (status === 'archived') {
        dbChallenges = await getArchivedChallenges()
      }
      
      if (dbChallenges && dbChallenges.length > 0) {
        const adaptedChallenges: Challenge[] = dbChallenges.map(challenge => {
          const adapted = adaptChallenge(challenge)
          return {
            id: adapted.id,
            title: adapted.title,
            slug: adapted.slug,
            description: adapted.description,
            difficulty: adapted.difficulty,
            category: adapted.category || "Algoritmos",
            functionName: (adapted as any).function_name,
            status: adapted.status,
            createdAt: new Date((adapted as any).created_at).toLocaleDateString('pt-BR'),
            updatedAt: new Date((adapted as any).updated_at).toLocaleDateString('pt-BR')
          }
        })
        console.log(`✅ Challenges ${status} carregados:`, adaptedChallenges)
        setChallenges(adaptedChallenges)
      } else {
        console.log(`⚠️ Nenhum challenge ${status} encontrado`)
        setChallenges([])
      }
    } catch (err) {
      console.error(`❌ Erro ao carregar challenges ${status}:`, err)
      setChallenges([])
    } finally {
      setIsInitialLoading(false)
    }
  }, [status, getPendingChallenges, getArchivedChallenges, adaptChallenge])

  // Atualização granular via Realtime
  const updateChallengesFromRealtime = useCallback((payload: any) => {
    console.log(`🔄 Realtime Event para ${status}:`, payload.eventType, payload.new || payload.old)
    
    // Filtrar eventos relevantes para este status
    const isRelevantEvent = 
      (status === 'approved' && payload.new?.status === 'approved') ||
      (status === 'to_approve' && payload.new?.status === 'to_approve') ||
      (status === 'archived' && payload.new?.status === 'archived') ||
      (payload.eventType === 'DELETE' && payload.old?.status === status)
    
    if (!isRelevantEvent) return
    
    setChallenges(prev => {
      switch (payload.eventType) {
        case 'INSERT':
          const newChallenge = adaptChallenge(payload.new)
          return [newChallenge, ...prev]
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
  }, [status, adaptChallenge])

  // Setup Realtime subscription
  useEffect(() => {
    // Carregar dados iniciais
    loadInitialChallenges()

    // Configurar Realtime como fonte única de verdade
    const channel = supabase
      .channel(`challenges-${status}`)
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'challenges' }, 
          updateChallengesFromRealtime
      )
      .subscribe((status) => {
        console.log(`📡 Realtime Status para ${status}:`, status)
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Realtime conectado para challenges ${status}!`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`❌ Erro no canal Realtime para ${status} - usando fallback`)
          // Fallback silencioso: recarregar apenas se necessário
          loadInitialChallenges()
        }
      })

    return () => {
      console.log(`🧹 Limpando subscription do Realtime para ${status}`)
      supabase.removeChannel(channel)
    }
  }, [loadInitialChallenges, updateChallengesFromRealtime, status])

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
    challenges,
    isInitialLoading,
    lastUpdate,
    updateChallengeInList,
    addChallengeToList,
    removeChallengeFromList,
    adaptChallenge,
    loadInitialChallenges
  }
}
