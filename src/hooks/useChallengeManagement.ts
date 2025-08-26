import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tables, Inserts, Updates, ChallengeStatus, DifficultyLevel } from '@/lib/supabase'
import { useAuth } from './useAuth'

export interface CreateChallengeData {
  title: string
  description: string
  difficulty: DifficultyLevel
  category?: string
  skills?: string[]
  function_name: string
  initial_code: string
  test_cases: any[]
  examples?: any[]
  constraints?: string[]
  hints?: string[]
  course_id?: string
  module_id?: string
  tags?: string[]
  estimated_time_minutes?: number
}

export function useChallengeManagement() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createChallenge = useCallback(async (data: CreateChallengeData) => {
    if (!user?.id) {
      setError('Usuário não autenticado')
      return null
    }

    try {
      setLoading(true)
      setError(null)

      const challengeData: Inserts<'challenges'> = {
        ...data,
        created_by: user.id,
        status: 'draft', // Sempre começa como rascunho
        skills: data.skills || [],
        constraints: data.constraints || [],
        hints: data.hints || [],
        tags: data.tags || [],
        estimated_time_minutes: data.estimated_time_minutes || 30,
        max_score: 100,
        is_public: false,
        order_index: 0,
      }

      const { data: challenge, error: createError } = await supabase
        .from('challenges')
        .insert([challengeData])
        .select()
        .single()

      if (createError) throw createError

      return challenge
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar challenge'
      setError(errorMessage)
      console.error('Erro ao criar challenge:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  const updateChallenge = useCallback(async (id: string, updates: Partial<CreateChallengeData>) => {
    try {
      setLoading(true)
      setError(null)

      const { data: challenge, error: updateError } = await supabase
        .from('challenges')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      return challenge
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar challenge'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const submitForApproval = useCallback(async (challengeId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data: challenge, error: submitError } = await supabase
        .from('challenges')
        .update({ status: 'pending' })
        .eq('id', challengeId)
        .select()
        .single()

      if (submitError) throw submitError

      return challenge
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao submeter challenge'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const approveChallenge = useCallback(async (challengeId: string) => {
    if (!user?.id) {
      setError('Usuário não autenticado')
      return null
    }

    try {
      setLoading(true)
      setError(null)

      const { data: challenge, error: approveError } = await supabase
        .from('challenges')
        .update({ 
          status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
          published_at: new Date().toISOString(),
          is_public: true
        })
        .eq('id', challengeId)
        .select()
        .single()

      if (approveError) throw approveError

      return challenge
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao aprovar challenge'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  const rejectChallenge = useCallback(async (challengeId: string, reason: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data: challenge, error: rejectError } = await supabase
        .from('challenges')
        .update({ 
          status: 'rejected',
          rejection_reason: reason
        })
        .eq('id', challengeId)
        .select()
        .single()

      if (rejectError) throw rejectError

      return challenge
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao rejeitar challenge'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteChallenge = useCallback(async (challengeId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error: deleteError } = await supabase
        .from('challenges')
        .delete()
        .eq('id', challengeId)

      if (deleteError) throw deleteError

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar challenge'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getUserChallenges = useCallback(async (status?: ChallengeStatus) => {
    if (!user?.id) return []

    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('challenges')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data: challenges, error: fetchError } = await query

      if (fetchError) throw fetchError

      return challenges || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar challenges'
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  const getPendingChallenges = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: challenges, error: fetchError } = await supabase
        .from('challenges')
        .select(`
          *,
          created_by_profile:profiles!challenges_created_by_fkey(full_name, email)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError

      return challenges || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar challenges pendentes'
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    createChallenge,
    updateChallenge,
    submitForApproval,
    approveChallenge,
    rejectChallenge,
    deleteChallenge,
    getUserChallenges,
    getPendingChallenges,
  }
}
