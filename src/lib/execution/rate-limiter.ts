const executionCounts = new Map<string, { count: number; resetTime: number }>()
const MAX_EXECUTIONS_PER_HOUR = 100
const HOUR_IN_MS = 60 * 60 * 1000

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const entry = executionCounts.get(identifier)
  
  if (!entry || now > entry.resetTime) {
    executionCounts.set(identifier, {
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
