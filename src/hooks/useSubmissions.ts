import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tables, Inserts } from '@/lib/supabase'

export function useSubmissions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createSubmission = async (submissionData: Omit<Inserts<'submissions'>, 'id' | 'created_at'>) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: createError } = await supabase
        .from('submissions')
        .insert([submissionData])
        .select()
        .single()

      if (createError) {
        throw createError
      }

      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar submissão'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const updateSubmission = async (id: string, updates: Partial<Tables<'submissions'>>) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: updateError } = await supabase
        .from('submissions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar submissão'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const getUserSubmissions = async (userId: string, challengeId?: string) => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('submissions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (challengeId) {
        query = query.eq('challenge_id', challengeId)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        throw fetchError
      }

      return { data: data || [], error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar submissões'
      setError(errorMessage)
      return { data: [], error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const getSubmissionById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        throw fetchError
      }

      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar submissão'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const getChallengeSubmissions = async (challengeId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('submissions')
        .select('*')
        .eq('challenge_id', challengeId)
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      return { data: data || [], error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar submissões do desafio'
      setError(errorMessage)
      return { data: [], error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    createSubmission,
    updateSubmission,
    getUserSubmissions,
    getSubmissionById,
    getChallengeSubmissions,
  }
}
