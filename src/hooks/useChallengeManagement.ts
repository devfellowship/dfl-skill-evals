import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tables, Inserts, Updates, ChallengeStatus } from '@/lib/supabase'
import type { DifficultyLevel } from '@/lib/supabase'
import { generateUniqueSlug } from '@/lib/utils/slug-generator'

export interface CreateChallengeData {
  title: string
  description: string
  difficulty: DifficultyLevel | "easy" | "medium" | "hard"
  category?: string
  skills?: string[]
  function_name: string
  initial_code: string
  examples?: any[]
  constraints?: string[]
  hints?: string[]
  course_id?: string
  module_id?: string
  tags?: string[]
  imageUrl?: string

}

export function useChallengeManagement() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const difficultyMap: Record<string, number> = {
    beginner: 1,
    easy: 1,
    medium: 2,
    hard: 3,
    expert: 4,
  }

  const createChallenge = useCallback(async (data: CreateChallengeData) => {
    try {
      setLoading(true)
      setError(null)

      if (!supabase) {
        throw new Error('Cliente Supabase não inicializado')
      }

      const { data: existingChallenges, error: slugError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .select('slug')
      
      if (slugError) {
        throw slugError
      }
      
      const existingSlugs = existingChallenges?.map(c => c.slug) || []
      const uniqueSlug = generateUniqueSlug(data.title, existingSlugs)

      const challengeData: Inserts<'challenges'> = {
        title: data.title,
        slug: uniqueSlug,
        description: data.description,
        difficulty: difficultyMap[data.difficulty] || 2 as any, 
        category: data.category || 'Algoritmos',
        function_name: data.function_name,
        initial_code: data.initial_code,
        examples: data.examples || [],
        skills: data.skills || [],
        constraints: data.constraints || [],
        hints: data.hints || [],
        tags: data.tags || [],
        max_score: 100,
        is_public: false,
        order_index: 0,
        status: 'to_approve',
      }

      const { data: challenge, error: createError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .insert([challengeData])
        .select()
        .single()

      if (createError) {
        throw createError
      }

      return challenge
    } catch (err) {
      let errorMessage = 'Erro ao criar challenge'
      
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'object' && err !== null) {

        if ('message' in err) {
          errorMessage = String(err.message)
        } else if ('details' in err) {
          errorMessage = String(err.details)
        } else if ('hint' in err) {
          errorMessage = String(err.hint)
        } else {
          errorMessage = JSON.stringify(err)
        }
      }
      
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateChallenge = useCallback(async (id: string, updates: any) => {
    try {
      setLoading(true)
      setError(null)

      const mappedUpdates: any = {}

      if (updates.title !== undefined) mappedUpdates.title = updates.title
      if (updates.description !== undefined) mappedUpdates.description = updates.description
      if (updates.category !== undefined) mappedUpdates.category = updates.category
      if (updates.skills !== undefined) mappedUpdates.skills = updates.skills
      if (updates.constraints !== undefined) mappedUpdates.constraints = updates.constraints
      if (updates.hints !== undefined) mappedUpdates.hints = updates.hints
      if (updates.tags !== undefined) mappedUpdates.tags = updates.tags

      if (updates.course_id !== undefined) mappedUpdates.course_id = updates.course_id
      if (updates.module_id !== undefined) mappedUpdates.module_id = updates.module_id
      if (updates.examples !== undefined) mappedUpdates.examples = updates.examples

      if (updates.function_name !== undefined) {
        mappedUpdates.function_name = updates.function_name
      }
      if (updates.functionName !== undefined) {
        mappedUpdates.function_name = updates.functionName
      }
      
      if (updates.initial_code !== undefined) {
        mappedUpdates.initial_code = updates.initial_code
      }
      if (updates.initialCode !== undefined) {
        mappedUpdates.initial_code = updates.initialCode
      }
      
      
      if (updates.imageUrl !== undefined) {
        mappedUpdates.image_url = updates.imageUrl
      }
      
      // Mapear status do frontend para o formato do banco
      if (updates.status !== undefined) {
        if (updates.status === 'draft') {
          mappedUpdates.status = 'to_approve'
        } else if (updates.status === 'published') {
          mappedUpdates.status = 'approved'
        } else if (updates.status === 'archived') {
          mappedUpdates.status = 'archived'
        } else {
          mappedUpdates.status = updates.status
        }
      }
      
      // Mapear dificuldade do frontend para o formato do banco
      if (updates.difficulty !== undefined) {
        // Converter dificuldade para número (se o banco espera inteiro)
        if (updates.difficulty === 'beginner') {
          mappedUpdates.difficulty = 1
        } else if (updates.difficulty === 'easy') {
          mappedUpdates.difficulty = 1
        } else if (updates.difficulty === 'medium') {
          mappedUpdates.difficulty = 2
        } else if (updates.difficulty === 'hard') {
          mappedUpdates.difficulty = 3
        } else if (updates.difficulty === 'expert') {
          mappedUpdates.difficulty = 4
        } else {
          // Se for um número, usar diretamente
          mappedUpdates.difficulty = updates.difficulty
        }
      }

      // Sempre atualizar a data de modificação
      mappedUpdates.updated_at = new Date().toISOString()

      // Verificar se o objeto mappedUpdates não está vazio
      if (Object.keys(mappedUpdates).length === 0) {
        
        return null
      }

      // Verificar se o ID é válido
      if (!id || typeof id !== 'string' || id.trim() === '') {
        
        throw new Error('ID do challenge é inválido')
      }

      const { data: challenge, error: updateError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .update(mappedUpdates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        
        throw updateError
      }

      return challenge
    } catch (err) {
      let errorMessage = 'Erro ao atualizar challenge'
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'object' && err !== null) {
        if ('message' in err) {
          errorMessage = String(err.message)
        } else if ('error' in err) {
          errorMessage = String(err.error)
        } else {
          errorMessage = JSON.stringify(err)
        }
      } else {
        errorMessage = String(err)
      }
      
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
        .schema('skill_evals')
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

      // Simplificando para apenas os campos que existem na tabela
      const { data: challenge, error: approveError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .update({
          status: 'approved',
          is_public: true
        })
        .eq('id', challengeId)
        .select()
        .single()

      if (approveError) {
        
        throw approveError
      }

      // Supabase Realtime irá notificar automaticamente as mudanças
      
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

      // Simplificando para apenas os campos que existem na tabela
      const { data: challenge, error: rejectError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .update({
          status: 'rejected'
          // Removendo rejection_reason se não existir na tabela
        })
        .eq('id', challengeId)
        .select()
        .single()

      if (rejectError) {
        
        throw rejectError
      }

      // Supabase Realtime irá notificar automaticamente as mudanças
      
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

      // Simplificando para apenas os campos que existem na tabela
      const { data: challenge, error: archiveError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .update({
          status: 'archived',
          is_public: false
        })
        .eq('id', challengeId)
        .select()
        .single()

      if (archiveError) {
        
        throw archiveError
      }

      // Supabase Realtime irá notificar automaticamente as mudanças
      
      return challenge
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao arquivar challenge'
      
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Função para desafiar challenge aprovada de volta para análise
  const sendBackForReview = useCallback(async (challengeId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data: challenge, error: sendBackError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .update({
          status: 'to_approve',
          is_public: false
        })
        .eq('id', challengeId)
        .select()
        .single()

      if (sendBackError) {
        
        throw sendBackError
      }

      // Supabase Realtime irá notificar automaticamente as mudanças
      
      return challenge
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar challenge de volta'
      
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

      // Primeiro, buscar o challenge para verificar o status
      const { data: challenge, error: fetchError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .select('status, title')
        .eq('id', challengeId)
        .single()

      if (fetchError) {
        
        throw new Error('Erro ao buscar challenge')
      }

      // Verificar se o challenge pode ser excluído
      if (challenge.status === 'to_approve') {
        throw new Error('Não é possível excluir challenges pendentes de aprovação')
      }

      if (challenge.status === 'approved') {
        throw new Error('Challenges publicadas devem ser enviadas de volta para análise antes da exclusão')
      }

      // Apenas challenges em rascunho, rejeitadas ou arquivadas podem ser excluídas
      if (challenge.status !== 'draft' && challenge.status !== 'rejected' && challenge.status !== 'archived') {
        throw new Error('Apenas challenges em rascunho, rejeitadas ou arquivadas podem ser excluídas')
      }

      const { error: deleteError } = await supabase
        .schema('skill_evals')
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

  // Função para buscar TODAS as challenges (independente do status)
  const getAllChallenges = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: challenges, error: fetchError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        
        throw fetchError
      }

      return challenges || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar challenges'
      
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Função para buscar challenges de um usuário específico
  const getUserChallenges = useCallback(async (status?: ChallengeStatus) => {
    try {
      setLoading(true)
      setError(null)

      // Como estamos usando login mock, vamos buscar todas as challenges
      // Em produção, aqui seria filtrado por created_by = user.id
      let query = supabase
        .schema('skill_evals')
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

      // Primeiro, vamos buscar apenas os campos básicos para debug
      const { data: challenges, error: fetchError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .select('*')
        .eq('status', 'to_approve')
        .order('created_at', { ascending: true })

      if (fetchError) {
        
        throw fetchError
      }

      return challenges || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar challenges pendentes'
      
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Função para buscar challenges arquivados
  const getArchivedChallenges = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: challenges, error: fetchError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .select('*')
        .eq('status', 'archived')
        .order('updated_at', { ascending: false })

      if (fetchError) {
        
        throw fetchError
      }

      return challenges || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar challenges arquivados'
      
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
        .schema('skill_evals')
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
        .schema('skill_evals')
        .from('challenges')
        .select('id, title')
        .is('slug', null)

      if (fetchError) throw fetchError

      if (!challengesWithoutSlug || challengesWithoutSlug.length === 0) {
        return { updated: 0, message: 'Todas as challenges já têm slugs' }
      }

      // Buscar todos os slugs existentes
      const { data: existingChallenges } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .select('slug')
        .not('slug', 'is', null)

      const existingSlugs = existingChallenges?.map(c => c.slug) || []
      let updatedCount = 0

      // Atualizar cada challenge sem slug
      for (const challenge of challengesWithoutSlug) {
        const uniqueSlug = generateUniqueSlug(challenge.title, existingSlugs)
        
        const { error: updateError } = await supabase
          .schema('skill_evals')
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
    sendBackForReview, // Nova função para enviar challenge de volta para análise
    deleteChallenge,
    getAllChallenges, // Nova função para buscar todos os challenges
    getUserChallenges,
    getPendingChallenges,
    getArchivedChallenges, // Nova função para buscar challenges arquivados
    getChallengeBySlug,
    updateExistingChallengesWithSlugs,
  }
}
