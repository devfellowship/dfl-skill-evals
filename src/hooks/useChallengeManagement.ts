import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tables, Inserts, Updates, ChallengeStatus } from '@/lib/supabase'
import type { DifficultyLevel } from '@/types'
import { generateUniqueSlug } from '@/lib/utils/slug-generator'

export interface CreateChallengeData {
  title: string
  description: string
  difficulty: DifficultyLevel | "easy" | "medium" | "hard" // Aceita tipos do frontend e do banco
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

  // Mapa para converter strings de dificuldade para números (banco usa integer)
  const difficultyMap: Record<string, number> = {
    beginner: 1,
    easy: 2,
    medium: 3,
    hard: 4,
    expert: 5,
  }

  const createChallenge = useCallback(async (data: CreateChallengeData) => {
    try {
      setLoading(true)
      setError(null)

      console.log('🚀 Iniciando criação de challenge...')
      console.log('📝 Dados recebidos:', data)

      // Validar configuração do Supabase
      if (!supabase) {
        throw new Error('Cliente Supabase não inicializado')
      }

      console.log('🔧 Cliente Supabase:', supabase)

      // Buscar slugs existentes para gerar um único
      console.log('🔍 Buscando slugs existentes...')
      const { data: existingChallenges, error: slugError } = await supabase
        .from('challenges')
        .select('slug')
      
      if (slugError) {
        console.error('❌ Erro ao buscar slugs:', slugError)
        throw slugError
      }
      
      const existingSlugs = existingChallenges?.map(c => c.slug) || []
      const uniqueSlug = generateUniqueSlug(data.title, existingSlugs)
      console.log('🏷️ Slug gerado:', uniqueSlug)

      const challengeData: Inserts<'challenges'> = {
        title: data.title,
        slug: uniqueSlug,
        description: data.description,
        difficulty: difficultyMap[data.difficulty] || 2 as any, 
        category: data.category || 'Algoritmos',
        function_name: data.function_name,
        initial_code: data.initial_code,
        test_cases: data.test_cases || [],
        examples: data.examples || [],
        skills: data.skills || [],
        constraints: data.constraints || [],
        hints: data.hints || [],
        tags: data.tags || [],
        estimated_time_minutes: data.estimated_time_minutes || 30,
        max_score: 100,
        is_public: false,
        order_index: 0,
        status: 'to_approve',
      }

      console.log('💾 Dados da challenge preparados:', challengeData)

      console.log('📤 Enviando para o Supabase...')
      const { data: challenge, error: createError } = await supabase
        .from('challenges')
        .insert([challengeData])
        .select()
        .single()

      if (createError) {
        console.error('❌ Erro do Supabase:', createError)
        throw createError
      }

      console.log('✅ Challenge criada com sucesso:', challenge)

      return challenge
    } catch (err) {
      console.error('Erro detalhado ao criar challenge:', err)
      
      // Melhor tratamento de erro
      let errorMessage = 'Erro ao criar challenge'
      
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'object' && err !== null) {
        // Se for um objeto de erro do Supabase
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

      console.log('🚀 Atualizando challenge:', id)
      console.log('📝 Dados recebidos:', updates)

      // Mapear campos do frontend para o banco
      const mappedUpdates: any = {}
      
      // Campos diretos
      if (updates.title !== undefined) mappedUpdates.title = updates.title
      if (updates.description !== undefined) mappedUpdates.description = updates.description
      if (updates.category !== undefined) mappedUpdates.category = updates.category
      if (updates.skills !== undefined) mappedUpdates.skills = updates.skills
      if (updates.constraints !== undefined) mappedUpdates.constraints = updates.constraints
      if (updates.hints !== undefined) mappedUpdates.hints = updates.hints
      if (updates.tags !== undefined) mappedUpdates.tags = updates.tags
      if (updates.estimated_time_minutes !== undefined) mappedUpdates.estimated_time_minutes = updates.estimated_time_minutes
      if (updates.course_id !== undefined) mappedUpdates.course_id = updates.course_id
      if (updates.module_id !== undefined) mappedUpdates.module_id = updates.module_id
      if (updates.examples !== undefined) mappedUpdates.examples = updates.examples
      
      // Mapear campos com nomes diferentes
      if (updates.function_name !== undefined) {
        mappedUpdates.function_name = updates.function_name
        console.log('🔍 Mapeando function_name:', updates.function_name)
      }
      if (updates.functionName !== undefined) {
        mappedUpdates.function_name = updates.functionName
        console.log('🔍 Mapeando functionName -> function_name:', updates.functionName)
      }
      
      if (updates.initial_code !== undefined) {
        mappedUpdates.initial_code = updates.initial_code
        console.log('🔍 Mapeando initial_code:', updates.initial_code)
      }
      if (updates.initialCode !== undefined) {
        mappedUpdates.initial_code = updates.initialCode
        console.log('🔍 Mapeando initialCode -> initial_code:', updates.initialCode)
      }
      
      if (updates.test_cases !== undefined) {
        mappedUpdates.test_cases = updates.test_cases
        console.log('🔍 Mapeando test_cases:', updates.test_cases)
      }
      if (updates.testCases !== undefined) {
        mappedUpdates.test_cases = updates.testCases
        console.log('🔍 Mapeando testCases -> test_cases:', updates.testCases)
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
          mappedUpdates.difficulty = 2
        } else if (updates.difficulty === 'medium') {
          mappedUpdates.difficulty = 3
        } else if (updates.difficulty === 'hard') {
          mappedUpdates.difficulty = 4
        } else if (updates.difficulty === 'expert') {
          mappedUpdates.difficulty = 5
        } else {
          // Se for um número, usar diretamente
          mappedUpdates.difficulty = updates.difficulty
        }
        console.log('🔍 Mapeando difficulty:', updates.difficulty, '->', mappedUpdates.difficulty)
      }

      console.log('💾 Dados mapeados para atualização:', mappedUpdates)
      console.log('🔍 ID do challenge:', id)
      console.log('🔍 Tipo do ID:', typeof id)
      console.log('🔍 Chaves dos dados mapeados:', Object.keys(mappedUpdates))
      console.log('🔍 Valores dos dados mapeados:', Object.values(mappedUpdates))

      // Sempre atualizar a data de modificação
      mappedUpdates.updated_at = new Date().toISOString()
      console.log('🔍 Adicionando updated_at:', mappedUpdates.updated_at)

      // Verificar se o objeto mappedUpdates não está vazio
      if (Object.keys(mappedUpdates).length === 0) {
        console.warn('⚠️ Nenhum campo para atualizar encontrado!')
        return null
      }

      // Verificar se o ID é válido
      if (!id || typeof id !== 'string' || id.trim() === '') {
        console.error('❌ ID inválido:', id)
        throw new Error('ID do challenge é inválido')
      }

      const { data: challenge, error: updateError } = await supabase
        .from('challenges')
        .update(mappedUpdates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        console.error('❌ Erro do Supabase:', updateError)
        console.error('❌ Detalhes do erro:', {
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint,
          code: updateError.code
        })
        console.error('❌ Dados enviados:', mappedUpdates)
        console.error('❌ ID usado:', id)
        throw updateError
      }

      console.log('✅ Challenge atualizado com sucesso:', challenge)
      
      // Supabase Realtime irá notificar automaticamente as mudanças
      
      return challenge
    } catch (err) {
      console.error('❌ Erro em updateChallenge:', err)
      console.error('❌ Tipo do erro:', typeof err)
      console.error('❌ Erro como string:', String(err))
      console.error('❌ Erro como JSON:', JSON.stringify(err, null, 2))
      
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

      console.log('🚀 Aprovando challenge:', challengeId)

      // Simplificando para apenas os campos que existem na tabela
      const { data: challenge, error: approveError } = await supabase
        .from('challenges')
        .update({ 
          status: 'approved',
          is_public: true
        })
        .eq('id', challengeId)
        .select()
        .single()

      if (approveError) {
        console.error('❌ Erro ao aprovar challenge:', approveError)
        throw approveError
      }

      console.log('✅ Challenge aprovado:', challenge)
      
      // Supabase Realtime irá notificar automaticamente as mudanças
      
      return challenge
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao aprovar challenge'
      console.error('❌ Erro em approveChallenge:', err)
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

      console.log('🚀 Rejeitando challenge:', challengeId, 'Motivo:', reason)

      // Simplificando para apenas os campos que existem na tabela
      const { data: challenge, error: rejectError } = await supabase
        .from('challenges')
        .update({ 
          status: 'rejected'
          // Removendo rejection_reason se não existir na tabela
        })
        .eq('id', challengeId)
        .select()
        .single()

      if (rejectError) {
        console.error('❌ Erro ao rejeitar challenge:', rejectError)
        throw rejectError
      }

      console.log('✅ Challenge rejeitado:', challenge)
      
      // Supabase Realtime irá notificar automaticamente as mudanças
      
      return challenge
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao rejeitar challenge'
      console.error('❌ Erro em rejectChallenge:', err)
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

      console.log('🚀 Arquivando challenge:', challengeId)

      // Simplificando para apenas os campos que existem na tabela
      const { data: challenge, error: archiveError } = await supabase
        .from('challenges')
        .update({ 
          status: 'archived',
          is_public: false
        })
        .eq('id', challengeId)
        .select()
        .single()

      if (archiveError) {
        console.error('❌ Erro ao arquivar challenge:', archiveError)
        throw archiveError
      }

      console.log('✅ Challenge arquivado:', challenge)
      
      // Supabase Realtime irá notificar automaticamente as mudanças
      
      return challenge
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao arquivar challenge'
      console.error('❌ Erro em archiveChallenge:', err)
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

      console.log('🚀 Enviando challenge de volta para análise:', challengeId)

      const { data: challenge, error: sendBackError } = await supabase
        .from('challenges')
        .update({ 
          status: 'to_approve',
          is_public: false
        })
        .eq('id', challengeId)
        .select()
        .single()

      if (sendBackError) {
        console.error('❌ Erro ao enviar challenge de volta:', sendBackError)
        throw sendBackError
      }

      console.log('✅ Challenge enviado de volta para análise:', challenge)
      
      // Supabase Realtime irá notificar automaticamente as mudanças
      
      return challenge
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar challenge de volta'
      console.error('❌ Erro em sendBackForReview:', err)
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

      // Supabase Realtime irá notificar automaticamente as mudanças

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar challenge'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Função para buscar challenges aprovados (exclui "Em análise" e "Arquivados")
  const getAllChallenges = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔍 Buscando challenges aprovados (excluindo "Em análise" e "Arquivados")...')

      const { data: challenges, error: fetchError } = await supabase
        .from('challenges')
        .select('*')
        .eq('status', 'approved') // Buscar apenas challenges aprovados
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('❌ Erro ao buscar challenges:', fetchError)
        throw fetchError
      }

      console.log('✅ Challenges aprovados encontrados:', challenges)
      return challenges || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar challenges'
      console.error('❌ Erro em getAllChallenges:', err)
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

      console.log('🔍 Buscando challenges pendentes de aprovação...')
      
      // Primeiro, vamos buscar apenas os campos básicos para debug
      const { data: challenges, error: fetchError } = await supabase
        .from('challenges')
        .select('*')
        .eq('status', 'to_approve')
        .order('created_at', { ascending: true })

      if (fetchError) {
        console.error('❌ Erro ao buscar challenges pendentes:', fetchError)
        throw fetchError
      }

      console.log('✅ Challenges pendentes encontrados:', challenges)
      return challenges || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar challenges pendentes'
      console.error('❌ Erro em getPendingChallenges:', err)
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

      console.log('🔍 Buscando challenges arquivados...')
      
      const { data: challenges, error: fetchError } = await supabase
        .from('challenges')
        .select('*')
        .eq('status', 'archived')
        .order('updated_at', { ascending: false })

      if (fetchError) {
        console.error('❌ Erro ao buscar challenges arquivados:', fetchError)
        throw fetchError
      }

      console.log('✅ Challenges arquivados encontrados:', challenges)
      return challenges || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar challenges arquivados'
      console.error('❌ Erro em getArchivedChallenges:', err)
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
