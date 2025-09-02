import { useState } from 'react'
import { useChallengeManagement } from './useChallengeManagement'
import { toast } from 'sonner'

export function useChallengeOperations() {
  const {
    createChallenge,
    updateChallenge,
    deleteChallenge,
    approveChallenge,
    rejectChallenge,
    archiveChallenge,
    sendBackForReview
  } = useChallengeManagement()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isApproving, setIsApproving] = useState<string | null>(null)
  const [isArchiving, setIsArchiving] = useState<string | null>(null)

  const handleCreate = async (challengeData: any) => {
    setIsSubmitting(true)
    try {
      const result = await createChallenge(challengeData)
      if (result) {
        toast.success("Challenge criado com sucesso!")
        return result
      } else {
        toast.error("Erro ao criar challenge")
        return null
      }
    } catch (err) {
      toast.error("Erro ao criar challenge")
      console.error(err)
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (id: string, updateData: any) => {
    setIsSubmitting(true)
    try {
      const result = await updateChallenge(id, updateData)
      if (result) {
        toast.success("Challenge atualizado com sucesso!")
        return result
      } else {
        toast.error("Erro ao atualizar challenge")
        return null
      }
    } catch (err) {
      toast.error("Erro ao atualizar challenge")
      console.error(err)
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
      const result = await deleteChallenge(id)
      if (result) {
        toast.success("Challenge excluído com sucesso!")
        return result
      } else {
        toast.error("Erro ao excluir challenge")
        return null
      }
    } catch (err) {
      toast.error("Erro ao excluir challenge")
      console.error(err)
      return null
    } finally {
      setIsDeleting(null)
    }
  }

  const handleApprove = async (id: string) => {
    setIsApproving(id)
    try {
      const result = await approveChallenge(id)
      if (result) {
        toast.success("Challenge aprovado com sucesso!")
        return result
      } else {
        toast.error("Erro ao aprovar challenge")
        return null
      }
    } catch (err) {
      toast.error("Erro ao aprovar challenge")
      console.error(err)
      return null
    } finally {
      setIsApproving(null)
    }
  }

  const handleReject = async (id: string, reason: string) => {
    setIsSubmitting(true)
    try {
      const result = await rejectChallenge(id, reason)
      if (result) {
        toast.success("Challenge rejeitado e retornado ao professor")
        return result
      } else {
        toast.error("Erro ao rejeitar challenge")
        return null
      }
    } catch (err) {
      toast.error("Erro ao rejeitar challenge")
      console.error(err)
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleArchive = async (id: string) => {
    setIsArchiving(id)
    try {
      const result = await archiveChallenge(id)
      if (result) {
        toast.success("Challenge arquivado com sucesso!")
        return result
      } else {
        toast.error("Erro ao arquivar challenge")
        return null
      }
    } catch (err) {
      toast.error("Erro ao arquivar challenge")
      console.error(err)
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
      const result = await sendBackForReview(id)
      if (result) {
        toast.success("Challenge enviado de volta para análise!")
        return result
      } else {
        toast.error("Erro ao enviar challenge de volta")
        return null
      }
    } catch (err) {
      toast.error("Erro ao enviar challenge de volta")
      console.error(err)
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    // Estados de loading específicos
    isSubmitting,
    isDeleting,
    isApproving,
    isArchiving,
    
    // Handlers
    handleCreate,
    handleUpdate,
    handleDelete,
    handleApprove,
    handleReject,
    handleArchive,
    handleSendBackForReview
  }
}
