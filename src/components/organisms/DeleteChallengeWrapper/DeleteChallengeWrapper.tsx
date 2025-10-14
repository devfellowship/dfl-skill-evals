import React, { createContext, useContext } from 'react'
import { DeleteChallengeModal } from '@/components/molecules/DeleteChallengeModal/DeleteChallengeModal'
import { useDeleteChallengeModal } from '@/hooks/useDeleteChallengeModal'

interface DeleteChallengeContextType {
  openDeleteModal: (id: string, title: string) => void
}

const DeleteChallengeContext = createContext<DeleteChallengeContextType | null>(null)

interface DeleteChallengeWrapperProps {
  children: React.ReactNode
}

export const DeleteChallengeWrapper: React.FC<DeleteChallengeWrapperProps> = ({ children }) => {
  const {
    isModalOpen,
    challengeToDelete,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete
  } = useDeleteChallengeModal()

  return (
    <DeleteChallengeContext.Provider value={{ openDeleteModal }}>
      {children}
      <DeleteChallengeModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        challengeTitle={challengeToDelete?.title || ''}
        isDeleting={isDeleting}
      />
    </DeleteChallengeContext.Provider>
  )
}

// Hook para usar o modal em qualquer componente
export const useDeleteChallenge = () => {
  const context = useContext(DeleteChallengeContext)
  if (!context) {
    throw new Error('useDeleteChallenge deve ser usado dentro de DeleteChallengeWrapper')
  }
  return context
}
