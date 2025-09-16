import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { useChallengesGlobal } from './useChallengesGlobal'

export function useChallengeOperations() {
  const { 
    broadcastChallengeCreated, 
    broadcastChallengeUpdated, 
    broadcastChallengeDeleted,
    loadAllChallenges 
  } = useChallengesGlobal()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isApproving, setIsApproving] = useState<string | null>(null)
  const [isArchiving, setIsArchiving] = useState<string | null>(null)

  const difficultyMap: Record<string, number> = {
    beginner: 1,
    easy: 1,
    medium: 2,
    hard: 3,
    expert: 4,
  }

  const handleCreate = async (challengeData: any) => {
    setIsSubmitting(true)
    try {
      const { data: challenge, error: createError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .insert({
          title: challengeData.title,
          description: challengeData.description,
          difficulty: difficultyMap[challengeData.difficulty] || 2,
          category: challengeData.category,
          function_name: challengeData.function_name,
          initial_code: challengeData.initial_code || "",
          status: 'to_approve',
          is_public: false,
          slug: challengeData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        })
        .select()
        .single()

      if (createError) {
        throw new Error(createError.message || 'Erro ao criar challenge')
      }

      toast.success("Challenge criado com sucesso!")
      
      try {
        broadcastChallengeCreated(challenge)
      } catch (broadcastError) {
        loadAllChallenges()
      }
      
      return challenge
    } catch (err) {
      toast.error("Erro ao criar challenge")
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (id: string, updateData: any) => {
    setIsSubmitting(true)
    try {
      const { data: currentChallenge, error: fetchError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .select('status')
        .eq('id', id)
        .single()

      if (fetchError) {
        throw new Error('Erro ao buscar challenge atual')
      }

      let newStatus = updateData.status
      if (currentChallenge.status === 'approved' && updateData.status === 'approved') {
        newStatus = 'to_approve'
      }

      const { data: challenge, error: updateError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .update({
          title: updateData.title,
          description: updateData.description,
          difficulty: difficultyMap[updateData.difficulty] || 2,
          category: updateData.category,
          function_name: updateData.function_name,
          initial_code: updateData.initial_code,
          status: newStatus,
          image_url: updateData.imageUrl,
          slug: updateData.slug
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw new Error(updateError.message || 'Erro ao atualizar challenge')
      }

      toast.success("Challenge atualizado com sucesso!")
      
      try {
        broadcastChallengeUpdated(challenge)
      } catch (broadcastError) {
        loadAllChallenges()
      }
      
      return challenge
    } catch (err) {
      toast.error("Erro ao atualizar challenge")
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este challenge?")) {
      return null
    }

    setIsDeleting(id)
    try {
      const { error: deleteError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw new Error(deleteError.message || 'Erro ao deletar challenge')
      }

      toast.success("Challenge excluído com sucesso!")
      
      try {
        broadcastChallengeDeleted(id)
      } catch (broadcastError) {
        loadAllChallenges()
      }
      
      return true
    } catch (err) {
      toast.error("Erro ao excluir challenge")
      return null
    } finally {
      setIsDeleting(null)
    }
  }

  const handleApprove = async (id: string) => {
    setIsApproving(id)
    try {
      const { data: challenge, error: approveError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .update({ 
          status: 'approved',
          is_public: true
        })
        .eq('id', id)
        .select()
        .single()

      if (approveError) {
        throw new Error(approveError.message || 'Erro ao aprovar challenge')
      }

      toast.success("Challenge aprovado com sucesso!")
      
      try {
        broadcastChallengeUpdated(challenge)
      } catch (broadcastError) {
        loadAllChallenges()
      }
      
      return challenge
    } catch (err) {
      toast.error("Erro ao aprovar challenge")
      return null
    } finally {
      setIsApproving(null)
    }
  }

  const handleReject = async (id: string, reason: string) => {
    setIsSubmitting(true)
    try {
      const { data: challenge, error: rejectError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .update({ 
          status: 'rejected',
          rejection_reason: reason,
          is_public: false
        })
        .eq('id', id)
        .select()
        .single()

      if (rejectError) {
        throw new Error(rejectError.message || 'Erro ao rejeitar challenge')
      }

      toast.success("Challenge rejeitado e retornado ao mentor")
      
      try {
        broadcastChallengeUpdated(challenge)
      } catch (broadcastError) {
        loadAllChallenges()
      }
      
      return challenge
    } catch (err) {
      toast.error("Erro ao rejeitar challenge")
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleArchive = async (id: string) => {
    setIsArchiving(id)
    try {
      const { data: challenge, error: archiveError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .update({ 
          status: 'archived',
          is_public: false
        })
        .eq('id', id)
        .select()
        .single()

      if (archiveError) {
        throw new Error(archiveError.message || 'Erro ao arquivar challenge')
      }

      toast.success("Challenge arquivado com sucesso!")
      
      try {
        broadcastChallengeUpdated(challenge)
      } catch (broadcastError) {
        loadAllChallenges()
      }
      
      return challenge
    } catch (err) {
      toast.error("Erro ao arquivar challenge")
      return null
    } finally {
      setIsArchiving(null)
    }
  }

  const handleSendBackForReview = async (id: string) => {
    if (!confirm("Tem certeza que deseja enviar este challenge de volta para análise?")) {
      return null
    }

    setIsSubmitting(true)
    try {
      const { data: challenge, error: sendBackError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .update({ 
          status: 'to_approve',
          is_public: false
        })
        .eq('id', id)
        .select()
        .single()

      if (sendBackError) {
        throw new Error(sendBackError.message || 'Erro ao enviar challenge de volta')
      }

      toast.success("Challenge enviado de volta para análise!")
      
      try {
        broadcastChallengeUpdated(challenge)
      } catch (broadcastError) {
        loadAllChallenges()
      }
      
      return challenge
    } catch (err) {
      toast.error("Erro ao enviar challenge de volta")
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    isDeleting,
    isApproving,
    isArchiving,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleApprove,
    handleReject,
    handleArchive,
    handleSendBackForReview
  }
}
