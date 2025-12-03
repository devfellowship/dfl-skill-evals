const executionCounts = new Map<string, { count: number; resetTime: number }>()

const MAX_EXECUTIONS_PER_HOUR = 100
const HOUR_IN_MS = 60 * 60 * 1000

export function checkRateLimit(userId: string): boolean {
  if (!userId) return false

  const now = Date.now()
  const key = `user:${userId}`
  const entry = executionCounts.get(key)

  if (!entry || now > entry.resetTime) {
    executionCounts.set(key, {
      count: 1,
      resetTime: now + HOUR_IN_MS
    })
    return true
  }

  if (entry.count >= MAX_EXECUTIONS_PER_HOUR) {
    return false
  }

  entry.count++
  return true
}

export function resetRateLimit(userId: string): void {
  if (userId) {
    executionCounts.delete(`user:${userId}`)
  }
}