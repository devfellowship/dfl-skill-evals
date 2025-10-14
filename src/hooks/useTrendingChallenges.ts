import { useState, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { useBaseStates } from './useBaseStates'
import { useUserValidation } from './useUserValidation'
import { useBroadcastOperations } from './useBroadcastOperations'

export interface TrendingChallenge {
  id: string
  title: string
  description: string
  difficulty: string
  category: string[]
  functionName: string
  status: string
  createdAt: string
  updatedAt: string
  initialCode: string
  orderIndex: number | null
  created_by: string
  mentor: string
  trending: boolean
  trending_priority?: number
}

export function useTrendingChallenges() {
  const { loading, error, executeWithLoading } = useBaseStates()
  const { validateUser } = useUserValidation()
  const { executeWithBroadcastAndToast } = useBroadcastOperations()

  const setTrending = useCallback(async (challengeId: string, priority: number = 1) => {
    return executeWithBroadcastAndToast(
      async () => {
        const { user } = validateUser()
        const { data, error: updateError} = await supabase
          .schema('skill_evals')
          .from('challenges')
          .update({ 
            trending: true,
            trending_priority: priority,
            updated_at: new Date().toISOString()
          })
          .eq('id', String(challengeId))
          .select()
          .single()

        if (updateError) {
          throw new Error(updateError.message || 'Erro ao marcar challenge como trending')
        }

        return data
      },
      'update',
      'Challenge marcada como trending!',
      'Erro ao marcar challenge como trending'
    )
  }, [executeWithBroadcastAndToast, validateUser])

  const removeTrending = useCallback(async (challengeId: string) => {
    return executeWithBroadcastAndToast(
      async () => {
        const { user } = validateUser()

        const { data, error: updateError } = await supabase
          .schema('skill_evals')
          .from('challenges')
          .update({ 
            trending: false,
            trending_priority: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', String(challengeId))
          .select()
          .single()

        if (updateError) {
          throw new Error(updateError.message || 'Erro ao remover challenge do trending')
        }

        return data
      },
      'update',
      'Challenge removida do trending!',
      'Erro ao remover challenge do trending'
    )
  }, [executeWithBroadcastAndToast, validateUser])

  const updateTrendingPriority = useCallback(async (challengeId: string, priority: number) => {
    return executeWithBroadcastAndToast(
      async () => {
        const { user } = validateUser()

        const { data, error: updateError } = await supabase
          .schema('skill_evals')
          .from('challenges')
          .update({ 
            trending_priority: priority,
            updated_at: new Date().toISOString()
          })
          .eq('id', String(challengeId))
          .eq('trending', true)
          .select()
          .single()

        if (updateError) {
          throw new Error(updateError.message || 'Erro ao atualizar prioridade do trending')
        }

        return data
      },
      'update',
      'Prioridade do trending atualizada!',
      'Erro ao atualizar prioridade do trending'
    )
  }, [executeWithBroadcastAndToast, validateUser])

  const getTrendingChallenges = useCallback(async () => {
    return executeWithLoading(async () => {
      const { data, error: fetchError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .select('*')
        .eq('trending', true)
        .eq('status', 'approved')
        .eq('is_public', true)
        .order('trending_priority', { ascending: true })
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw new Error(fetchError.message || 'Erro ao buscar challenges trending')
      }

      return data || []
    })
  }, [executeWithLoading])

  const toggleTrending = useCallback(async (challengeId: string, isCurrentlyTrending: boolean, priority?: number) => {
    if (isCurrentlyTrending) {
      return removeTrending(challengeId)
    } else {
      return setTrending(challengeId, priority || 1)
    }
  }, [setTrending, removeTrending])

  return {
    loading,
    error,
    setTrending,
    removeTrending,
    updateTrendingPriority,
    getTrendingChallenges,
    toggleTrending
  }
}
