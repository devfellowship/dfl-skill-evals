import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { AdminChallenge as Challenge } from '@/types/admin-dashboard'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useChallengesGlobal() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const channelRef = useRef<RealtimeChannel | null>(null)

  const adaptChallenge = useCallback((raw: any): Challenge => {
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
      createdAt: new Date(raw.created_at).toLocaleDateString('pt-BR'),
      updatedAt: new Date(raw.updated_at).toLocaleDateString('pt-BR'),
      initialCode: raw.initial_code ?? '',
      testCases: raw.test_cases ?? []
    }
  }, [])

  const loadAllChallenges = useCallback(async () => {
    try {
      const { data: dbChallenges, error: fetchError } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('❌ Erro ao buscar challenges:', fetchError)
        throw fetchError
      }
      
      if (dbChallenges && dbChallenges.length > 0) {
        const adaptedChallenges = dbChallenges.map(adaptChallenge)
        setChallenges(adaptedChallenges)
      } else {
        setChallenges([])
      }
    } catch (err) {
      console.error('❌ Erro ao carregar challenges:', err)
      setChallenges([])
    } finally {
      setIsInitialLoading(false)
    }
  }, [adaptChallenge])

  useEffect(() => {
    loadAllChallenges()

    const channel = supabase.channel('challenges-broadcast')
    channelRef.current = channel

    channel
      .on('broadcast', { event: 'challenge-created' }, ({ payload }) => {
        const adaptedChallenge = adaptChallenge(payload.challenge)
        setChallenges(prev => [adaptedChallenge, ...prev])
        setLastUpdate(new Date())
      })
      .on('broadcast', { event: 'challenge-updated' }, ({ payload }) => {
        const adaptedChallenge = adaptChallenge(payload.challenge)
        setChallenges(prev => prev.map(ch => 
          ch.id === adaptedChallenge.id ? adaptedChallenge : ch
        ))
        setLastUpdate(new Date())
      })
      .on('broadcast', { event: 'challenge-deleted' }, ({ payload }) => {
        setChallenges(prev => prev.filter(ch => ch.id !== payload.challengeId))
        setLastUpdate(new Date())
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {

          loadAllChallenges()
        }
      })

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [loadAllChallenges, adaptChallenge])

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

  const broadcastChallengeCreated = useCallback((challenge: any) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'challenge-created',
        payload: { challenge }
      })
    }
  }, [])

  const broadcastChallengeUpdated = useCallback((challenge: any) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'challenge-updated',
        payload: { challenge }
      })
    }
  }, [])

  const broadcastChallengeDeleted = useCallback((challengeId: string) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'challenge-deleted',
        payload: { challengeId }
      })
    }
  }, [])

  return {
    challenges,
    isInitialLoading,
    lastUpdate,
    published,
    pending,
    archived,
    updateChallengeInList,
    addChallengeToList,
    removeChallengeFromList,
    adaptChallenge,
    loadAllChallenges,
    broadcastChallengeCreated,
    broadcastChallengeUpdated,
    broadcastChallengeDeleted
  }
}
