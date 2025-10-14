import React from 'react'
import { Button } from '@/components/atoms/Button/Button'
import { DeleteChallengeWrapper, useDeleteChallenge } from '@/components/organisms/DeleteChallengeWrapper/DeleteChallengeWrapper'

// Exemplo de como usar o sistema de exclusão com modal
const DeleteChallengeExample: React.FC = () => {
  const { openDeleteModal } = useDeleteChallenge()

  const handleDeleteClick = (challengeId: string, challengeTitle: string) => {
    // Abre o modal de exclusão
    openDeleteModal(challengeId, challengeTitle)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Exemplo de Exclusão de Challenge</h2>
      
      <Button
        variant="destructive"
        onClick={() => handleDeleteClick('123', 'Two Sum')}
      >
        Excluir Challenge "Two Sum"
      </Button>
    </div>
  )
}

// Componente principal com wrapper
export const DeleteChallengeExampleWithWrapper: React.FC = () => {
  return (
    <DeleteChallengeWrapper>
      <DeleteChallengeExample />
    </DeleteChallengeWrapper>
  )
}
