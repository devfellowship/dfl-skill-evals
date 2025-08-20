import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/lib/supabase'
import { mockChallenges } from '@/consts/challenges'

export function useChallenges() {
  const [challenges, setChallenges] = useState<Tables<'challenges'>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchChallenges = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // TEMPORÁRIO: Usar apenas dados mock para resolver rapidamente
      console.log('🔧 USANDO DADOS MOCK DIRETAMENTE')
      console.log('📊 Mock challenges:', mockChallenges.length, mockChallenges)
      setChallenges(mockChallenges as any)
      
    } catch (err) {
      console.warn('❌ Erro geral, usando dados mock:', err)
      setChallenges(mockChallenges as any)
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchChallengeById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
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
      console.error('Erro ao buscar desafio:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const createChallenge = async (challengeData: Omit<Tables<'challenges'>, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: createError } = await supabase
        .from('challenges')
        .insert([challengeData])
        .select()
        .single()

      if (createError) {
        throw createError
      }

      // Atualizar a lista local
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
        .from('challenges')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      // Atualizar a lista local
      setChallenges(prev => prev.map(challenge => 
        challenge.id === id ? data : challenge
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
        .from('challenges')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      // Atualizar a lista local
      setChallenges(prev => prev.filter(challenge => challenge.id !== id))
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar desafio'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  useEffect(() => {
    fetchChallenges()
  }, [])

  return {
    challenges,
    loading,
    error,
    fetchChallenges,
    fetchChallengeById,
    createChallenge,
    updateChallenge,
    deleteChallenge,
  }
}
