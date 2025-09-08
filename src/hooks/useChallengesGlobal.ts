import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { AdminChallenge as Challenge } from '@/types/admin/admin-dashboard'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useChallengesGlobal() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [broadcastWorking, setBroadcastWorking] = useState(true)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

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
      createdAt: raw.created_at ? new Date(raw.created_at).toLocaleDateString('pt-BR') : 'Data não disponível',
      updatedAt: raw.updated_at ? new Date(raw.updated_at).toLocaleDateString('pt-BR') : 'Data não disponível',
      initialCode: raw.initial_code ?? '',
      testCases: raw.test_cases ?? [],
      orderIndex: raw.order_index ?? null,
      imageUrl: raw.image_url ?? null
    }
  }, [])

  const loadAllChallenges = useCallback(async () => {
    try {
      const { data: dbChallenges, error: fetchError } = await supabase
        .from('challenges')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }
      
      if (dbChallenges && dbChallenges.length > 0) {
        const adaptedChallenges = dbChallenges.map(adaptChallenge)
        setChallenges(adaptedChallenges)
      } else {
        setChallenges([])
      }
    } catch (err) {
      setChallenges([])
    } finally {
      setIsInitialLoading(false)
    }
  }, [adaptChallenge])

  const startPolling = useCallback(() => {
    if (pollingRef.current) return
    
    pollingRef.current = setInterval(() => {
      loadAllChallenges()
    }, 5000) // Polling a cada 5 segundos
  }, [loadAllChallenges])

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
  }, [])

  useEffect(() => {
    loadAllChallenges()

    const channel = supabase.channel('challenges-broadcast', {
      config: {
        broadcast: { self: true }
      }
    })
    channelRef.current = channel
    channel
      .on('broadcast', { event: 'challenge-created' }, ({ payload }) => {

        const adaptedChallenge = adaptChallenge(payload.challenge)
        setChallenges(prev => [adaptedChallenge, ...prev])
        setLastUpdate(new Date())
        setBroadcastWorking(true)
      })
      .on('broadcast', { event: 'challenge-updated' }, ({ payload }) => {
        const adaptedChallenge = adaptChallenge(payload.challenge)
        setChallenges(prev => prev.map(ch => 
          ch.id === adaptedChallenge.id ? adaptedChallenge : ch
        ))
        setLastUpdate(new Date())
        setBroadcastWorking(true)
      })
      .on('broadcast', { event: 'challenge-deleted' }, ({ payload }) => {

        setChallenges(prev => prev.filter(ch => ch.id !== payload.challengeId))
        setLastUpdate(new Date())
        setBroadcastWorking(true)
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          setBroadcastWorking(false)
          startPolling()
        } else if (status === 'SUBSCRIBED') {
          setBroadcastWorking(true)
          stopPolling()
        }
      })

    const broadcastTimeout = setTimeout(() => {
      if (!broadcastWorking) {
        startPolling()
      }
    }, 5000) // 5 segundos de timeout

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
      stopPolling()
      clearTimeout(broadcastTimeout)
    }
  }, [loadAllChallenges, adaptChallenge, broadcastWorking, startPolling, stopPolling])

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
    } else {
      }
  }, [])

  const broadcastChallengeUpdated = useCallback((challenge: any) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'challenge-updated',
        payload: { challenge }
      })
    } else {
      }
  }, [])

  const broadcastChallengeDeleted = useCallback((challengeId: string) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'challenge-deleted',
        payload: { challengeId }
      })
    } else {
      }
  }, [])

  return {
    challenges,
    isInitialLoading,
    lastUpdate,
    broadcastWorking,
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
