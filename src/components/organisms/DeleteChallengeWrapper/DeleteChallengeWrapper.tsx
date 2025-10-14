import React from 'react'
import { DeleteChallengeModal } from '@/components/molecules/DeleteChallengeModal/DeleteChallengeModal'
import { useDeleteChallengeModal } from '@/hooks/useDeleteChallengeModal'

interface DeleteChallengeWrapperProps {
  children: React.ReactNode
}

export const DeleteChallengeWrapper: React.FC<DeleteChallengeWrapperProps> = ({ children }) => {
  const {
    isModalOpen,
    challengeToDelete,
    isDeleting,
    closeDeleteModal,
    confirmDelete
  } = useDeleteChallengeModal()

  return (
    <>
      {children}
      <DeleteChallengeModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        challengeTitle={challengeToDelete?.title || ''}
        isDeleting={isDeleting}
      />
    </>
  )
}

// Hook para usar o modal em qualquer componente
export const useDeleteChallenge = () => {
  const { openDeleteModal } = useDeleteChallengeModal()
  return { openDeleteModal }
}
