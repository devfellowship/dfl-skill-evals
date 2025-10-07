import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { DifficultyLevel } from '@/lib/supabase'
import { generateUniqueSlug } from '@/lib/utils/slug-generator'
import { useAuth } from '@/hooks/useAuth'
import { useUserRole } from '@/hooks/useUserRole'

export interface CreateChallengeData {
  title: string
  description: string
  difficulty: DifficultyLevel | 'easy' | 'medium' | 'hard'
  category?: string | string[]
  skills?: string[]
  function_name: string
  initial_code: string
  examples?: { input: string; output: string }[]
  constraints?: string[]
  hints?: string[]
  tags?: string[]
  status?: string
  // mentor removido - será derivado automaticamente do usuário logado
  testCases?: { input: string; expectedOutput: string }[]
}

export function useChallengeManagement() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const { isAdmin } = useUserRole()

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

      if (!user?.id) {
        throw new Error('Usuário não autenticado')
      }

      // Buscar nome do mentor a partir do usuário logado
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      const mentorName = 
        profile?.full_name ?? 
        (user.user_metadata?.full_name as string | undefined) ?? 
        user.email?.split('@')[0] ?? 
        'Usuário'

      console.log('🔍 useChallengeManagement: Nome do mentor derivado:', mentorName)

      const { data: existingChallenges } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .select('slug')

      const existingSlugs = existingChallenges?.map(c => c.slug) || []
      const uniqueSlug = generateUniqueSlug(data.title, existingSlugs)

      const challengeData = {
        title: data.title,
        slug: uniqueSlug,
        description: data.description,
        difficulty: difficultyMap[data.difficulty] || 2,
        category: Array.isArray(data.category) ? data.category[0] : data.category || 'Algoritmos',
        function_name: data.function_name,
        initial_code: data.initial_code,
        skills: data.skills || [],
        // constraints: data.constraints || [], // Removido temporariamente para testar
        // hints: data.hints || [], // Removido - coluna não existe na tabela
        // tags: data.tags || [], // Removido temporariamente para testar
        mentor: mentorName, // Nome derivado do usuário logado
        created_by: user.id, // Campo obrigatório para RLS
        max_score: 100,
        is_public: false,
        order_index: 0,
        status: 'to_approve',
      }

      // Debug: Log dos dados que serão enviados
      console.log('🔍 useChallengeManagement: Dados originais para criação:', data)
      console.log('🔍 useChallengeManagement: Dados mapeados para criação:', challengeData)
      console.log('🔍 useChallengeManagement: User ID:', user?.id)
      console.log('🔍 useChallengeManagement: Created by:', challengeData.created_by)

      const { data: challenge, error: createError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .insert([challengeData])
        .select()
        .single()

      if (createError) {
        console.error('❌ useChallengeManagement: Erro na criação:', createError)
        console.error('❌ useChallengeManagement: Dados enviados:', challengeData)
        throw createError
      }

      // Se houver exemplos, insere na tabela challenge_examples
      if (data.examples && data.examples.length > 0) {
        const examplesPayload = data.examples.map(ex => ({
          challenge_id: challenge.id,
          input: ex.input,
          output: ex.output,
        }))
        const { error: exErr } = await supabase
          .schema('skill_evals')
          .from('challenge_examples')
          .insert(examplesPayload)
        if (exErr) throw exErr
      }

      // Se houver casos de teste, insere na tabela challenge_test_cases (se existir)
      if (data.testCases && data.testCases.length > 0) {
        console.log('🔍 useChallengeManagement: Processando casos de teste:', data.testCases)
        // Nota: A tabela challenge_test_cases pode não existir ainda
        // Por enquanto, apenas logamos os casos de teste
      }

      return challenge
    } catch (err: any) {
      setError(err.message ?? 'Erro ao criar challenge')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateChallenge = useCallback(async (id: string, updates: any) => {
    try {
      setLoading(true)
      setError(null)

      if (!id) throw new Error('ID inválido')

      // Buscar o created_by da challenge para derivar o mentor
      const { data: challengeData } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .select('created_by')
        .eq('id', id)
        .single()

      if (!challengeData) {
        throw new Error('Challenge não encontrada')
      }

      // Buscar nome do mentor a partir do created_by
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', challengeData.created_by)
        .maybeSingle()

      const mentorName = 
        profile?.full_name ?? 
        'Usuário'

      console.log('🔍 useChallengeManagement: Nome do mentor derivado para update:', mentorName)

      // separar exemplos (pois são salvos em outra tabela)
      const { examples, ...updatesWithoutExamples } = updates

      const mapped: any = {}
      if (updatesWithoutExamples.title) mapped.title = updatesWithoutExamples.title
      if (updatesWithoutExamples.description) mapped.description = updatesWithoutExamples.description
      if (updatesWithoutExamples.category)
        mapped.category = Array.isArray(updatesWithoutExamples.category)
          ? updatesWithoutExamples.category[0]
          : updatesWithoutExamples.category
      if (updatesWithoutExamples.skills) mapped.skills = updatesWithoutExamples.skills
      if (updatesWithoutExamples.function_name) mapped.function_name = updatesWithoutExamples.function_name
      if (updatesWithoutExamples.initial_code) mapped.initial_code = updatesWithoutExamples.initial_code
      if (updatesWithoutExamples.difficulty) {
        const diff = updatesWithoutExamples.difficulty
        mapped.difficulty = diff === 'easy' ? 1 : diff === 'medium' ? 2 : diff === 'hard' ? 3 : 2
      }
      // Definir status baseado no tipo de usuário
      if (updatesWithoutExamples.status) {
        mapped.status = updatesWithoutExamples.status
      } else {
        // Se não especificado, definir baseado no tipo de usuário
        if (isAdmin) {
          mapped.status = 'approved' // Admin pode manter aprovado
        } else {
          mapped.status = 'to_approve' // Mentor sempre vai para pendente
        }
      }
      
      // Definir is_public baseado no status
      if (mapped.status === 'approved') {
        mapped.is_public = true
      } else {
        mapped.is_public = false
      }
      
      console.log('🔍 useChallengeManagement: Status definido:', mapped.status, 'isAdmin:', isAdmin)
      console.log('🔍 useChallengeManagement: is_public definido:', mapped.is_public)
      
      // Sempre derivar o mentor do created_by, ignorando entrada externa
      mapped.mentor = mentorName
      if (updatesWithoutExamples.slug) mapped.slug = updatesWithoutExamples.slug
      // Removidos campos que não existem na tabela: constraints, hints, tags
      if (updatesWithoutExamples.max_score) mapped.max_score = updatesWithoutExamples.max_score
      if (updatesWithoutExamples.is_public !== undefined) mapped.is_public = updatesWithoutExamples.is_public
      if (updatesWithoutExamples.order_index !== undefined) mapped.order_index = updatesWithoutExamples.order_index
      
      mapped.updated_at = new Date().toISOString()

      // Debug: Log dos dados que serão enviados
      console.log('🔍 useChallengeManagement: Dados originais:', updates)
      console.log('🔍 useChallengeManagement: Dados mapeados:', mapped)

      const { data: challenge, error: updateError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .update(mapped)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        console.error('❌ useChallengeManagement: Erro na atualização:', updateError)
        console.error('❌ useChallengeManagement: Dados enviados:', mapped)
        throw updateError
      }

      // Atualizar exemplos, se houver
      if (Array.isArray(examples)) {
        // remover antigos
        await supabase.schema('skill_evals').from('challenge_examples').delete().eq('challenge_id', id)

        if (examples.length > 0) {
          const formatted = examples.map(ex => ({
            challenge_id: id,
            input: ex.input,
            output: ex.output,
          }))
          const { error: insertError } = await supabase
            .schema('skill_evals')
            .from('challenge_examples')
            .insert(formatted)
          if (insertError) throw insertError
        }
      }

      return challenge
    } catch (err: any) {
      setError(err.message ?? 'Erro ao atualizar challenge')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getUserChallenges = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      if (!user?.id) {
        console.log('❌ useChallengeManagement: Usuário não logado')
        return []
      }

      console.log('🔍 useChallengeManagement: Buscando challenges do usuário:', user.id)

      const { data, error: fetchError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('❌ useChallengeManagement: Erro ao buscar challenges:', fetchError)
        setError(fetchError.message)
        return []
      }

      console.log('✅ useChallengeManagement: Challenges encontradas:', data?.length || 0)
      return data || []
    } catch (err: any) {
      console.error('❌ useChallengeManagement: Erro inesperado:', err)
      setError(err.message ?? 'Erro ao buscar challenges')
      return []
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  const submitForApproval = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error: updateError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .update({ status: 'to_approve' })
        .eq('id', id)

      if (updateError) {
        setError(updateError.message)
        return false
      }

      return true
    } catch (err: any) {
      setError(err.message ?? 'Erro ao enviar para aprovação')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteChallenge = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error: deleteError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .delete()
        .eq('id', id)

      if (deleteError) {
        setError(deleteError.message)
        return false
      }

      return true
    } catch (err: any) {
      setError(err.message ?? 'Erro ao excluir challenge')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const sendBackForReview = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error: updateError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .update({ 
          status: 'to_approve',
          is_public: false
        })
        .eq('id', id)

      if (updateError) {
        setError(updateError.message)
        return false
      }

      return true
    } catch (err: any) {
      setError(err.message ?? 'Erro ao enviar de volta para análise')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    createChallenge,
    updateChallenge,
    getUserChallenges,
    submitForApproval,
    deleteChallenge,
    sendBackForReview,
  }
}
