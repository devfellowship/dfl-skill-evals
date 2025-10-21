import { useState, useEffect, useCallback } from 'react'
import { AdminChallenge as Challenge } from '@/types/admin/admin-dashboard'
import {
  getPendingChallenges,
  savePendingChallenge,
  removePendingChallenge,
  convertToAdminChallenge,
  convertFromAdminChallenge
} from '@/lib/utils/pending-challenges-storage'
import { useChallengeOperations } from '@/hooks/useChallengeOperations'
import { useChallengesGlobal } from '@/hooks/useChallengesGlobal'

export function usePendingChallengesSync() {
  const [pendingChallenges, setPendingChallenges] = useState<Challenge[]>([])
  const { pending, updateChallengeInList, loadAllChallenges } = useChallengesGlobal()
  const { updateChallenge, createChallenge } = useChallengeOperations()

  useEffect(() => {
    const loadPendingChallenges = () => {
      const stored = getPendingChallenges()
      const converted = stored.map(convertToAdminChallenge)
      setPendingChallenges(converted)
    }

    loadPendingChallenges()

    const handleStorageChange = () => {
      loadPendingChallenges()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleUpdatePendingChallenge = useCallback(async (updatedChallenge: Challenge) => {
    const existsInBackend = pending.some(c => c.id === updatedChallenge.id)
    const nowIso = new Date().toISOString()

    if (existsInBackend) {
      try {
        const updateData = {
          title: updatedChallenge.title,
          description: updatedChallenge.description,
          difficulty: updatedChallenge.difficulty,
          category: updatedChallenge.category,
          function_name: updatedChallenge.functionName,
          initial_code: updatedChallenge.initialCode || "// Seu código aqui",
          test_cases: updatedChallenge.testCases || [],
          status: updatedChallenge.status
        }

        updateChallengeInList(updatedChallenge.id, {
          title: updatedChallenge.title,
          description: updatedChallenge.description,
          difficulty: updatedChallenge.difficulty,
          category: updatedChallenge.category,
          status: updatedChallenge.status,
          updatedAt: new Date().toLocaleDateString('pt-BR')
        })

        await updateChallenge(updatedChallenge.id, updateData)
      } catch (e) {
        loadAllChallenges()
      }
      return
    }

    const pendingData = convertFromAdminChallenge(updatedChallenge)
    pendingData.updatedAt = nowIso
    savePendingChallenge(pendingData)

    const newChallenge = { ...updatedChallenge, updatedAt: nowIso }
    setPendingChallenges(prev => prev.map(c => c.id === newChallenge.id ? newChallenge : c))
  }, [pending, updateChallenge, updateChallengeInList, loadAllChallenges])

  const handleApprovePendingChallenge = useCallback(async (challengeId: string) => {
    const challenge = pendingChallenges.find(c => c.id === challengeId)
    if (!challenge) return

    try {
      const createData = {
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty,
        category: challenge.category,
        function_name: challenge.functionName,
        initial_code: challenge.initialCode,
        test_cases: challenge.testCases || [],
        skills: challenge.skills || [],
        is_public: false,
        status: 'approved' as any
      }

      await createChallenge(createData)

      removePendingChallenge(challengeId)
      setPendingChallenges(prev => prev.filter(c => c.id !== challengeId))
    } catch (error) {
      throw error
    }
  }, [pendingChallenges, createChallenge])

  const handleRejectPendingChallenge = useCallback((challengeId: string) => {
    removePendingChallenge(challengeId)
    setPendingChallenges(prev => prev.filter(c => c.id !== challengeId))
  }, [])

  return {
    pendingChallenges,
    handleUpdatePendingChallenge,
    handleApprovePendingChallenge,
    handleRejectPendingChallenge
  }
}

