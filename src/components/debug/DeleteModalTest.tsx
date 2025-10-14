import React from 'react'
import { DeleteChallengeWrapper, useDeleteChallenge } from '@/components/organisms/DeleteChallengeWrapper/DeleteChallengeWrapper'

const DeleteModalTestContent = () => {
  const { openDeleteModal } = useDeleteChallenge()

  const handleTestClick = () => {
    console.log('🧪 Teste: Clicando no botão de teste')
    openDeleteModal('test-id', 'Challenge de Teste')
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Teste do Modal de Exclusão</h2>
      <button
        onClick={handleTestClick}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Testar Modal de Exclusão
      </button>
    </div>
  )
}

export const DeleteModalTest = () => {
  return (
    <DeleteChallengeWrapper>
      <DeleteModalTestContent />
    </DeleteChallengeWrapper>
  )
}
