import { useEffect, useState, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/lib/supabase'
import type { Challenge } from '@/types/challenges/challenge'
import { mapDifficultyToString } from '@/lib/utils/difficulty-mapper'



let challengesCache: Challenge[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000
export const invalidateChallengesCache = () => {
  challengesCache = null
  cacheTimestamp = 0
}

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchChallenges = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)

      const now = Date.now()
      if (!forceRefresh && challengesCache && (now - cacheTimestamp) < CACHE_DURATION) {
        setChallenges(challengesCache)
        setLoading(false)
        return
      }

      const { data, error: fetchError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .select('*, image_url')
        .eq('status', 'approved')
        .eq('is_public', true)
        .order('trending', { ascending: false })
        .order('trending_priority', { ascending: true })
        .order('difficulty', { ascending: true })

      if (fetchError) {
        setError(`Erro ao conectar com o banco: ${fetchError.message}`)
        setChallenges([])
        return
      }
      
      if (!data || data.length === 0) {
        setChallenges([])
        return
      }

      const adaptedChallenges = data.map((challenge, index) => ({
        id: index + 1,
        supabaseId: challenge.id,
        title: challenge.title,
        description: challenge.description,
        skills: challenge.skills || [],
        difficulty: mapDifficultyToString(challenge.difficulty),
        category: challenge.category || 'Algoritmos',
        problems: 1,
        participants: 500 + index * 50,
        rating: parseFloat((4.2 + (index * 0.1)).toFixed(1)),
        trending: challenge.trending || false,
        trending_priority: challenge.trending_priority || null,
        image: '/images/challenges/defaults/Default.jpg' 
      }))

      challengesCache = adaptedChallenges
      cacheTimestamp = Date.now()
      setChallenges(adaptedChallenges)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
      setChallenges([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchChallengeById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        throw fetchError
      }

      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar desafio')
      return null
    } finally {
      setLoading(false)
    }
  }

  const createChallenge = async (challengeData: Omit<Tables<'challenges'>, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: createError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .insert([challengeData])
        .select()
        .single()

      if (createError) {
        throw createError
      }
      setChallenges(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar desafio'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  const updateChallenge = async (id: string, updates: Partial<Tables<'challenges'>>) => {
    try {
      const { data, error: updateError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }
      const adaptedData = {
        id: challenges.find(c => c.supabaseId === id)?.id || 1,
        supabaseId: data.id,
        title: data.title,
        description: data.description,
        skills: data.skills,
        difficulty: data.difficulty,
        category: data.category,
        problems: 1,
        participants: Math.floor(Math.random() * 1000) + 100,
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
        trending: Math.random() > 0.8,
        image: '/images/challenges/defaults/Default.jpg'
      }
      setChallenges(prev => prev.map(challenge => 
        challenge.supabaseId === id ? adaptedData : challenge
      ))
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar desafio'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  const deleteChallenge = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }
      setChallenges(prev => prev.filter(challenge => challenge.supabaseId !== id))
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar desafio'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }
  const invalidateCache = useCallback(() => {
    challengesCache = null
    cacheTimestamp = 0
  }, [])

  useEffect(() => {
    fetchChallenges()
    const channel = supabase
      .channel('skill_evals:challenges')
      .on('postgres_changes',
          { event: 'UPDATE', schema: 'skill_evals', table: 'challenges' },
          payload => {
            challengesCache = null
            cacheTimestamp = 0
            fetchChallenges(true)
          }
      )
      .on('postgres_changes',
          { event: 'INSERT', schema: 'skill_evals', table: 'challenges' },
          payload => {
            challengesCache = null
            cacheTimestamp = 0
            fetchChallenges(true)
          }
      )
      .on('postgres_changes',
          { event: 'DELETE', schema: 'skill_evals', table: 'challenges' },
          payload => {
            challengesCache = null
            cacheTimestamp = 0

            fetchChallenges(true)
          }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const forceRefresh = useCallback(() => {
    challengesCache = null
    cacheTimestamp = 0
    fetchChallenges(true)
  }, [])
  const clearCacheAndRefresh = useCallback(() => {
    challengesCache = null
    cacheTimestamp = 0
    setChallenges([])
    fetchChallenges(true)
  }, [fetchChallenges])



  return {
    challenges,
    loading,
    error,
    fetchChallenges,
    fetchChallengeById,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    invalidateCache,
    forceRefresh,
    clearCacheAndRefresh,
  }
}
