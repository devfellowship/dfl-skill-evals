import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { mapDifficultyToNumber } from '@/lib/utils/difficulty-mapper'
import { generateUniqueSlug } from '@/lib/utils/slug-generator'
import { getBrazilianDateTime } from '@/lib/utils/timezone'
import { useCrudOperations } from './useCrudOperations'
import { useUserValidation } from './useUserValidation'
import { useBroadcastOperations } from './useBroadcastOperations'
export interface ChallengeOperationData {
  title: string
  description: string
  difficulty: string
  category: string | string[]
  function_name: string
  initial_code?: string
  status?: string
  is_public?: boolean
  trending?: boolean
  trending_priority?: number | null
  [key: string]: any
}
export function useChallengeOperations() {
  const { user, validateUser } = useUserValidation()
  const { executeWithBroadcastAndToast } = useBroadcastOperations()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isApproving, setIsApproving] = useState<string | null>(null)
  const [isArchiving, setIsArchiving] = useState<string | null>(null)
  const [isRestoring, setIsRestoring] = useState<string | null>(null)
  const createChallenge = useCallback(async (challengeData: ChallengeOperationData) => {
    const { user } = validateUser()
    const [profileResult, userRolesResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle(),
      supabase
        .from('users_with_roles')
        .select('name')
        .eq('id', user.id)
        .maybeSingle()
    ])
    const mentorName = profileResult.data?.full_name || 
                      userRolesResult.data?.name || 
                      user.user_metadata?.full_name || 
                      user.email?.split('@')[0] || 
                      'Usuário'
    const challengePayload = {
      title: challengeData.title,
      slug: generateUniqueSlug(challengeData.title),
      description: challengeData.description,
      difficulty: mapDifficultyToNumber(challengeData.difficulty),
      category: Array.isArray(challengeData.category) ? challengeData.category[0] : challengeData.category,
      skills: challengeData.skills || [],
      function_name: challengeData.function_name,
      initial_code: challengeData.initial_code || '',
      status: challengeData.status ? 
        (challengeData.status === 'pending' ? 'to_approve' : challengeData.status) : 
        'to_approve',
      is_public: challengeData.is_public || false,
      created_by: user.id,
      mentor: mentorName,
      max_score: 100,
      order_index: 0
    }
    return executeWithBroadcastAndToast(
      async () => {
        const { data: challenge, error } = await supabase
          .schema('skill_evals')
          .from('challenges')
          .insert([challengePayload])
          .select()
          .single()
        if (error) {
          throw new Error(error.message || 'Erro ao criar challenge')
        }
        return challenge
      },
      'create',
      'Challenge criado com sucesso!',
      'Erro ao criar challenge'
    )
  }, [validateUser, executeWithBroadcastAndToast])
  const updateChallenge = useCallback(async (id: string, updateData: Partial<ChallengeOperationData>) => {
    const { user, isAdmin } = validateUser()
    const mappedUpdates: any = {
      updated_at: getBrazilianDateTime()
    }
    if (updateData.title) mappedUpdates.title = updateData.title
    if (updateData.description) mappedUpdates.description = updateData.description
    if (updateData.difficulty) mappedUpdates.difficulty = mapDifficultyToNumber(updateData.difficulty)
    if (updateData.category) {
      mappedUpdates.category = Array.isArray(updateData.category) ? updateData.category[0] : updateData.category
    }
    if (updateData.function_name) mappedUpdates.function_name = updateData.function_name
    if (updateData.initial_code) mappedUpdates.initial_code = updateData.initial_code
    if (updateData.skills) mappedUpdates.skills = updateData.skills
    if (updateData.mentor) mappedUpdates.mentor = updateData.mentor
    if (isAdmin) {
      if (updateData.status) {
        const statusMapping: Record<string, string> = {
          'draft': 'draft',
          'pending': 'to_approve',
          'published': 'approved',
          'archived': 'archived',
          'deleted': 'deleted'
        }
        mappedUpdates.status = statusMapping[updateData.status] || updateData.status
      }
      if (updateData.is_public !== undefined) mappedUpdates.is_public = updateData.is_public
      if (updateData.trending !== undefined) mappedUpdates.trending = updateData.trending
      if (updateData.trending_priority !== undefined) mappedUpdates.trending_priority = updateData.trending_priority
    }
    Object.keys(mappedUpdates).forEach(key => {
      if ((mappedUpdates as any)[key] === undefined) {
        delete (mappedUpdates as any)[key]
      }
    })
    return executeWithBroadcastAndToast(
      async () => {
        const { data: challenge, error } = await supabase
          .schema('skill_evals')
          .from('challenges')
          .update(mappedUpdates)
          .eq('id', id)
          .select()
        if (error) {
          throw new Error(error.message || 'Erro ao atualizar challenge')
        }
        if (!challenge || challenge.length === 0) {
          throw new Error('Nenhuma linha foi atualizada. Verifique se você tem permissão para atualizar este challenge.')
        }
        return challenge[0]
      },
      'update',
      'Challenge atualizado com sucesso!',
      'Erro ao atualizar challenge'
    )
  }, [validateUser, executeWithBroadcastAndToast])
  const deleteChallenge = useCallback(async (id: string, reason: string) => {
    const { user: validatedUser, isAdmin } = validateUser()
    if (!reason || reason.trim().length < 10) {
      throw new Error('Motivo deve ter pelo menos 10 caracteres')
    }
    setIsDeleting(id)
    try {
      return executeWithBroadcastAndToast(
        async () => {
          const { data: challenge, error } = await supabase
            .schema('skill_evals')
            .from('challenges')
            .update({
              deleted_at: getBrazilianDateTime(),
              deleted_by: validatedUser.id,
              deletion_reason: reason,
              status: 'deleted',
              is_active: false,
              is_public: false,
              updated_at: getBrazilianDateTime()
            })
            .eq('id', id)
            .select()
          if (error) {
            throw new Error(error.message || 'Erro ao excluir challenge')
          }
          return challenge?.[0] || { id, reason }
        },
        'update',
        'Challenge excluído com sucesso!',
        'Erro ao excluir challenge'
      )
    } finally {
      setIsDeleting(null)
    }
  }, [validateUser, executeWithBroadcastAndToast])
  const restoreChallenge = useCallback(async (id: string) => {
    const { isAdmin } = validateUser()
    if (!isAdmin) {
      alert('Apenas administradores podem restaurar challenges')
      return null
    }
    if (!confirm('Tem certeza que deseja restaurar este challenge?')) {
      return null
    }
    setIsRestoring(id)
    try {
      return executeWithBroadcastAndToast(
        async () => {
          const { data: challenge, error } = await supabase
            .schema('skill_evals')
            .from('challenges')
            .update({
              deleted_at: null,
              deleted_by: null,
              deletion_reason: null,
              status: 'approved',
              is_active: true,
              is_public: true,
              updated_at: getBrazilianDateTime()
            })
            .eq('id', id)
            .select()
          if (error) {
            throw new Error(error.message || 'Erro ao restaurar challenge')
          }
          return challenge?.[0] || { id }
        },
        'update',
        'Challenge restaurado com sucesso!',
        'Erro ao restaurar challenge'
      )
    } finally {
      setIsRestoring(null)
    }
  }, [validateUser, executeWithBroadcastAndToast])
  const permanentDeleteChallenge = useCallback(async (id: string) => {
    const { isAdmin } = validateUser()
    if (!isAdmin) {
      alert('Apenas administradores podem deletar permanentemente')
      return null
    }
    if (!confirm('ATENÇÃO: Esta ação é irreversível!\n\nTem certeza que deseja deletar permanentemente este challenge?')) {
      return null
    }
    try {
      return executeWithBroadcastAndToast(
        async () => {
          const { error } = await supabase
            .schema('skill_evals')
            .from('challenges')
            .delete()
            .eq('id', id)
          if (error) {
            throw new Error(error.message || 'Erro ao deletar permanentemente')
          }
          return { id }
        },
        'delete',
        'Challenge deletado permanentemente!',
        'Erro ao deletar permanentemente'
      )
    } catch (error) {
      throw error
    }
  }, [validateUser, executeWithBroadcastAndToast])
  const approveChallenge = useCallback(async (id: string) => {
    setIsApproving(id)
    try {
      return executeWithBroadcastAndToast(
        async () => {
          const { data: challenge, error } = await supabase
            .schema('skill_evals')
            .from('challenges')
            .update({ 
              status: 'approved',
              is_public: true,
              updated_at: getBrazilianDateTime()
            })
            .eq('id', id)
            .select()
            .single()
          if (error) {
            throw new Error(error.message || 'Erro ao aprovar challenge')
          }
          return challenge
        },
        'approve',
        'Challenge aprovado com sucesso!',
        'Erro ao aprovar challenge'
      )
    } finally {
      setIsApproving(null)
    }
  }, [executeWithBroadcastAndToast])
  const rejectChallenge = useCallback(async (id: string) => {
    return executeWithBroadcastAndToast(
      async () => {
        const { data: challenge, error } = await supabase
          .schema('skill_evals')
          .from('challenges')
          .update({ 
            status: 'rejected',
            is_public: false,
            updated_at: getBrazilianDateTime()
          })
          .eq('id', id)
          .select()
          .single()
        if (error) {
          throw new Error(error.message || 'Erro ao rejeitar challenge')
        }
        return challenge
      },
      'reject',
      'Challenge rejeitado!',
      'Erro ao rejeitar challenge'
    )
  }, [executeWithBroadcastAndToast])
  const archiveChallenge = useCallback(async (id: string) => {
    setIsArchiving(id)
    try {
      return executeWithBroadcastAndToast(
        async () => {
          const { data: challenge, error } = await supabase
            .schema('skill_evals')
            .from('challenges')
            .update({ 
              status: 'archived',
              is_public: false,
              updated_at: getBrazilianDateTime()
            })
            .eq('id', id)
            .select()
            .single()
          if (error) {
            throw new Error(error.message || 'Erro ao arquivar challenge')
          }
          return challenge
        },
        'archive',
        'Challenge arquivado com sucesso!',
        'Erro ao arquivar challenge'
      )
    } finally {
      setIsArchiving(null)
    }
  }, [executeWithBroadcastAndToast])
  const sendBackForReview = useCallback(async (id: string) => {
    if (!confirm('Tem certeza que deseja enviar este challenge de volta para análise?')) {
      return null
    }
    return executeWithBroadcastAndToast(
      async () => {
        const { data: challenge, error } = await supabase
          .schema('skill_evals')
          .from('challenges')
          .update({ 
            status: 'to_approve',
            is_public: false,
            updated_at: getBrazilianDateTime()
          })
          .eq('id', id)
          .select()
          .single()
        if (error) {
          throw new Error(error.message || 'Erro ao enviar challenge de volta')
        }
        return challenge
      },
      'update',
      'Challenge enviado de volta para análise!',
      'Erro ao enviar challenge de volta'
    )
  }, [executeWithBroadcastAndToast])
  return {
    isDeleting,
    isApproving,
    isArchiving,
    isRestoring,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    restoreChallenge,
    permanentDeleteChallenge,
    approveChallenge,
    rejectChallenge,
    archiveChallenge,
    sendBackForReview
  }
}