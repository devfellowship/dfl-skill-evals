import { useState, useCallback } from 'react'

export function useDashboardModals() {
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false)
  const [challengeToCompare, setChallengeToCompare] = useState<string | null>(null)

  const handleOpenComparison = useCallback((challengeId: string) => {
    setChallengeToCompare(challengeId)
    setComparisonModalOpen(true)
  }, [])

  const handleCloseComparison = useCallback(() => {
    setComparisonModalOpen(false)
    setChallengeToCompare(null)
  }, [])

  return {
    comparisonModalOpen,
    challengeToCompare,
    handleOpenComparison,
    handleCloseComparison
  }
}

