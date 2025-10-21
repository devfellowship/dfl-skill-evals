import { AdminChallenge } from '@/types/admin/admin-dashboard'

const PENDING_CHALLENGES_KEY = 'pending_challenges'

export interface PendingChallengeData {
  id: string
  title: string
  description: string
  difficulty: string
  category: string
  function_name: string
  initial_code: string
  test_cases: any[]
  examples: any[]
  status: string
  mentor: string
  createdAt: string
  updatedAt: string
}

export function getPendingChallenges(): PendingChallengeData[] {
  try {
    const stored = localStorage.getItem(PENDING_CHALLENGES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    return []
  }
}

export function savePendingChallenge(challenge: PendingChallengeData): void {
  try {
    const existing = getPendingChallenges()
    const updated = existing.map(c => c.id === challenge.id ? challenge : c)

    if (!existing.find(c => c.id === challenge.id)) {
      updated.push(challenge)
    }
    
    localStorage.setItem(PENDING_CHALLENGES_KEY, JSON.stringify(updated))
  } catch (error) {
  }
}

export function removePendingChallenge(challengeId: string): void {
  try {
    const existing = getPendingChallenges()
    const updated = existing.filter(c => c.id !== challengeId)
    localStorage.setItem(PENDING_CHALLENGES_KEY, JSON.stringify(updated))
  } catch (error) {
  }
}

export function clearPendingChallenges(): void {
  try {
    localStorage.removeItem(PENDING_CHALLENGES_KEY)
  } catch (error) {
  }
}

export function convertToAdminChallenge(pending: PendingChallengeData): AdminChallenge {
  return {
    id: pending.id,
    title: pending.title,
    description: pending.description,
    difficulty: pending.difficulty as "easy" | "medium" | "hard" | "expert",
    category: Array.isArray(pending.category) ? pending.category : [pending.category],
    functionName: pending.function_name,
    initialCode: pending.initial_code,
    testCases: pending.test_cases || [],
    slug: pending.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '',
    status: pending.status as "draft" | "pending" | "published" | "rejected" | "archived" | "deleted",
    mentor: pending.mentor || 'Usuário',
    createdAt: pending.createdAt,
    updatedAt: pending.updatedAt
  }
}

export function convertFromAdminChallenge(admin: AdminChallenge): PendingChallengeData {
  return {
    id: admin.id,
    title: admin.title,
    description: admin.description,
    difficulty: admin.difficulty,
    category: Array.isArray(admin.category) ? admin.category[0] : admin.category,
    function_name: admin.functionName || '',
    initial_code: admin.initialCode || '',
    test_cases: admin.testCases || [],
    examples: [],
    status: admin.status,
    mentor: admin.mentor || 'Usuário',
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt
  }
}
