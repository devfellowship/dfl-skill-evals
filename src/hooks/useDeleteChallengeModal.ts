import { useState, useCallback } from 'react'
import { useChallengeOperations } from './useChallengeOperations'

interface UseDeleteChallengeModalReturn {
  isModalOpen: boolean
  challengeToDelete: { id: string; title: string } | null
  isDeleting: boolean
  openDeleteModal: (id: string, title: string) => void
  closeDeleteModal: () => void
  confirmDelete: (reason: string) => Promise<void>
}

export const useDeleteChallengeModal = (): UseDeleteChallengeModalReturn => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [challengeToDelete, setChallengeToDelete] = useState<{ id: string; title: string } | null>(null)
  const { deleteChallenge, isDeleting } = useChallengeOperations()

  const openDeleteModal = useCallback((id: string, title: string) => {
    console.log('🔍 openDeleteModal chamado com:', { id, title })
    setChallengeToDelete({ id, title })
    setIsModalOpen(true)
    console.log('🔍 Modal deve estar aberto agora')
  }, [])

  const closeDeleteModal = useCallback(() => {
    setIsModalOpen(false)
    setChallengeToDelete(null)
  }, [])

  const confirmDelete = useCallback(async (reason: string) => {
    if (!challengeToDelete) return

    try {
      await deleteChallenge(challengeToDelete.id, reason)
      closeDeleteModal()
    } catch (error) {
      console.error('Erro ao excluir challenge:', error)
      // O erro será tratado pelo toast do executeWithBroadcastAndToast
    }
  }, [challengeToDelete, deleteChallenge, closeDeleteModal])

  return {
    isModalOpen,
    challengeToDelete,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete
  }
}
