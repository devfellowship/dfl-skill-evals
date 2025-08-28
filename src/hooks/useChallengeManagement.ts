import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tables, Inserts, Updates, ChallengeStatus, DifficultyLevel } from '@/lib/supabase'
import { generateUniqueSlug } from '@/lib/utils/slug-generator'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createChallenge = useCallback(async (data: CreateChallengeData) => {
    try {
      setLoading(true)
      setError(null)

      // Buscar slugs existentes para gerar um único
      const { data: existingChallenges } = await supabase
        .from('challenges')
        .select('slug')
      
      const existingSlugs = existingChallenges?.map(c => c.slug) || []
      const uniqueSlug = generateUniqueSlug(data.title, existingSlugs)

      const challengeData: Inserts<'challenges'> = {
        ...data,
        slug: uniqueSlug,
        created_by: 'dev-user-id', // ID mockado para desenvolvimento
        status: 'to_approve', // Sempre começa como "a ser aprovado"
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
      console.error('Erro detalhado ao criar challenge:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar challenge'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

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
        .update({ status: 'to_approve' })
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
    try {
      setLoading(true)
      setError(null)

      const { data: challenge, error: approveError } = await supabase
        .from('challenges')
        .update({ 
          status: 'approved',
          approved_by: 'dev-admin-id', // ID mockado para desenvolvimento
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
  }, [])

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

  const archiveChallenge = useCallback(async (challengeId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data: challenge, error: archiveError } = await supabase
        .from('challenges')
        .update({ 
          status: 'archived',
          archived_at: new Date().toISOString(),
          is_public: false
        })
        .eq('id', challengeId)
        .select()
        .single()

      if (archiveError) throw archiveError

      return challenge
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao arquivar challenge'
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

  // Função para buscar TODOS os challenges (sem filtro de usuário)
  const getAllChallenges = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: challenges, error: fetchError } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      return challenges || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar challenges'
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Função para buscar challenges de um usuário específico (mantida para compatibilidade)
  const getUserChallenges = useCallback(async (status?: ChallengeStatus) => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('challenges')
        .select('*')
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
  }, [])

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
        .eq('status', 'to_approve')
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

  // Função para buscar challenge por slug
  const getChallengeBySlug = useCallback(async (slug: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data: challenge, error: fetchError } = await supabase
        .from('challenges')
        .select('*')
        .eq('slug', slug)
        .single()

      if (fetchError) throw fetchError

      return challenge
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar challenge por slug'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Função para atualizar challenges existentes com slugs
  const updateExistingChallengesWithSlugs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Buscar todas as challenges que não têm slug
      const { data: challengesWithoutSlug, error: fetchError } = await supabase
        .from('challenges')
        .select('id, title')
        .is('slug', null)

      if (fetchError) throw fetchError

      if (!challengesWithoutSlug || challengesWithoutSlug.length === 0) {
        return { updated: 0, message: 'Todas as challenges já têm slugs' }
      }

      // Buscar todos os slugs existentes
      const { data: existingChallenges } = await supabase
        .from('challenges')
        .select('slug')
        .not('slug', 'is', null)

      const existingSlugs = existingChallenges?.map(c => c.slug) || []
      let updatedCount = 0

      // Atualizar cada challenge sem slug
      for (const challenge of challengesWithoutSlug) {
        const uniqueSlug = generateUniqueSlug(challenge.title, existingSlugs)
        
        const { error: updateError } = await supabase
          .from('challenges')
          .update({ slug: uniqueSlug })
          .eq('id', challenge.id)

        if (!updateError) {
          updatedCount++
          existingSlugs.push(uniqueSlug) // Adicionar ao array para evitar duplicatas
        }
      }

      return { updated: updatedCount, message: `${updatedCount} challenges atualizadas com slugs` }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar challenges com slugs'
      setError(errorMessage)
      return { updated: 0, message: errorMessage }
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
    archiveChallenge,
    deleteChallenge,
    getAllChallenges, // Nova função para buscar todos os challenges
    getUserChallenges,
    getPendingChallenges,
    getChallengeBySlug,
    updateExistingChallengesWithSlugs,
  }
}
