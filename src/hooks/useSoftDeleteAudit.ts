import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useUserValidation } from './useUserValidation'
import { useBroadcastOperations } from './useBroadcastOperations'

// =====================================================
// INTERFACES E TIPOS
// =====================================================

export interface DeletedChallenge {
  id: string
  title: string
  deleted_at: string
  deletion_reason: string
  deleted_by: string
  profiles?: {
    full_name: string
    email: string
  }
}

export interface DeleteChallengeData {
  id: string
  reason: string
}

export interface DeletionStats {
  deleted_by_name: string
  total_deletions: number
  first_deletion: string
  last_deletion: string
}

export interface DeletionReasonStats {
  deletion_reason: string
  frequency: number
}

// =====================================================
// HOOK PRINCIPAL
// =====================================================

export const useSoftDeleteAudit = () => {
  const { user } = useAuth()
  const { validateUser } = useUserValidation()
  const { executeWithBroadcastAndToast } = useBroadcastOperations()
  
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isRestoring, setIsRestoring] = useState<string | null>(null)
  const [deletedChallenges, setDeletedChallenges] = useState<DeletedChallenge[]>([])

  // =====================================================
  // SOFT DELETE COM MOTIVO
  // =====================================================

  const deleteChallenge = useCallback(async (id: string, reason?: string) => {
    const { user: validatedUser, isAdmin } = validateUser()

    // Se não tiver motivo, pedir para o usuário
    if (!reason) {
      const userReason = prompt('Digite o motivo da exclusão:')
      if (!userReason || userReason.trim() === '') {
        alert('Motivo é obrigatório para exclusão')
        return null
      }
      reason = userReason.trim()
    }

    if (!confirm(`Tem certeza que deseja excluir este challenge?\n\nMotivo: ${reason}`)) {
      return null
    }

    setIsDeleting(id)
    try {
      return executeWithBroadcastAndToast(
        async () => {
          const { error } = await supabase
            .schema('skill_evals')
            .from('challenges')
            .update({
              deleted_at: new Date().toISOString(),
              deleted_by: validatedUser.id,
              deletion_reason: reason
            })
            .eq('id', id)

          if (error) {
            throw new Error(error.message || 'Erro ao excluir challenge')
          }

          return { id, reason }
        },
        'delete',
        'Challenge excluído com sucesso!',
        'Erro ao excluir challenge'
      )
    } finally {
      setIsDeleting(null)
    }
  }, [validateUser, executeWithBroadcastAndToast])

  // =====================================================
  // RESTAURAR CHALLENGE
  // =====================================================

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
          const { error } = await supabase
            .schema('skill_evals')
            .from('challenges')
            .update({
              deleted_at: null,
              deleted_by: null,
              deletion_reason: null
            })
            .eq('id', id)

          if (error) {
            throw new Error(error.message || 'Erro ao restaurar challenge')
          }

          return { id }
        },
        'update',
        'Challenge restaurado com sucesso!',
        'Erro ao restaurar challenge'
      )
    } finally {
      setIsRestoring(null)
    }
  }, [validateUser, executeWithBroadcastAndToast])

  // =====================================================
  // BUSCAR CHALLENGES DELETADAS
  // =====================================================

  const fetchDeletedChallenges = useCallback(async () => {
    const { isAdmin } = validateUser()

    if (!isAdmin) {
      console.warn('Apenas administradores podem ver challenges deletadas')
      return []
    }

    try {
      const { data, error } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .select(`
          id,
          title,
          deleted_at,
          deletion_reason,
          deleted_by,
          profiles!deleted_by(full_name, email)
        `)
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false })

      if (error) {
        throw new Error(error.message || 'Erro ao buscar challenges deletadas')
      }

      setDeletedChallenges(data || [])
      return data || []
    } catch (error) {
      console.error('Erro ao buscar challenges deletadas:', error)
      return []
    }
  }, [validateUser])

  // =====================================================
  // ESTATÍSTICAS DE AUDITORIA
  // =====================================================

  const getDeletionStats = useCallback(async (): Promise<DeletionStats[]> => {
    const { isAdmin } = validateUser()

    if (!isAdmin) {
      console.warn('Apenas administradores podem ver estatísticas de exclusão')
      return []
    }

    try {
      const { data, error } = await supabase
        .rpc('get_deletion_stats')

      if (error) {
        // Se a função não existir, fazer query manual
        const { data: manualData, error: manualError } = await supabase
          .schema('skill_evals')
          .from('challenges')
          .select(`
            deleted_at,
            profiles!deleted_by(full_name)
          `)
          .not('deleted_at', 'is', null)

        if (manualError) {
          throw new Error(manualError.message || 'Erro ao buscar estatísticas')
        }

        // Processar dados manualmente
        const stats = new Map<string, DeletionStats>()
        
        manualData?.forEach(challenge => {
          const name = challenge.profiles?.full_name || 'Usuário desconhecido'
          const date = challenge.deleted_at

          if (stats.has(name)) {
            const existing = stats.get(name)!
            existing.total_deletions++
            if (date < existing.first_deletion) existing.first_deletion = date
            if (date > existing.last_deletion) existing.last_deletion = date
          } else {
            stats.set(name, {
              deleted_by_name: name,
              total_deletions: 1,
              first_deletion: date,
              last_deletion: date
            })
          }
        })

        return Array.from(stats.values()).sort((a, b) => b.total_deletions - a.total_deletions)
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar estatísticas de exclusão:', error)
      return []
    }
  }, [validateUser])

  const getDeletionReasonStats = useCallback(async (): Promise<DeletionReasonStats[]> => {
    const { isAdmin } = validateUser()

    if (!isAdmin) {
      console.warn('Apenas administradores podem ver estatísticas de motivos')
      return []
    }

    try {
      const { data, error } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .select('deletion_reason')
        .not('deleted_at', 'is', null)
        .not('deletion_reason', 'is', null)

      if (error) {
        throw new Error(error.message || 'Erro ao buscar estatísticas de motivos')
      }

      // Processar dados manualmente
      const reasonStats = new Map<string, number>()
      
      data?.forEach(challenge => {
        const reason = challenge.deletion_reason
        reasonStats.set(reason, (reasonStats.get(reason) || 0) + 1)
      })

      return Array.from(reasonStats.entries())
        .map(([deletion_reason, frequency]) => ({ deletion_reason, frequency }))
        .sort((a, b) => b.frequency - a.frequency)
    } catch (error) {
      console.error('Erro ao buscar estatísticas de motivos:', error)
      return []
    }
  }, [validateUser])

  // =====================================================
  // DELETAR PERMANENTEMENTE (APENAS SUPERADMIN)
  // =====================================================

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
      console.error('Erro ao deletar permanentemente:', error)
      throw error
    }
  }, [validateUser, executeWithBroadcastAndToast])

  return {
    // Estados
    isDeleting,
    isRestoring,
    deletedChallenges,
    
    // Funções principais
    deleteChallenge,
    restoreChallenge,
    fetchDeletedChallenges,
    
    // Estatísticas
    getDeletionStats,
    getDeletionReasonStats,
    
    // Deletar permanentemente
    permanentDeleteChallenge
  }
}
