import { useCallback } from 'react'
import { savePendingChallenge, convertFromAdminChallenge } from '@/lib/utils/pending-challenges-storage'
import { AdminChallenge } from '@/types/admin/admin-dashboard'

export function usePendingChallengeCreation() {
  const createPendingChallenge = useCallback((challengeData: any) => {
    const pendingChallenge: AdminChallenge = {
      id: `pending-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: challengeData.title,
      description: challengeData.description,
      difficulty: challengeData.difficulty,
      category: challengeData.category,
      skills: challengeData.skills || [],
      functionName: challengeData.function_name || challengeData.functionName,
      initialCode: challengeData.initial_code || challengeData.initialCode,
      testCases: challengeData.test_cases || challengeData.testCases || [],
      slug: challengeData.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '',
      status: 'pending' as any,
      mentor: challengeData.mentor || 'Usuário',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const pendingData = convertFromAdminChallenge(pendingChallenge)
    savePendingChallenge(pendingData)

    return pendingChallenge
  }, [])

  return { createPendingChallenge }
}
