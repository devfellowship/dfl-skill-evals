import { describe, it, expect, beforeEach } from 'vitest'

// The rate limiter uses module-level state. Re-import fresh each test to reset.
// Because vitest caches modules, we use a workaround: test with unique identifiers.

describe('checkRateLimit', () => {
  // Each test uses a unique identifier so the in-memory map doesn't carry over.
  let counter = 0
  const nextId = () => `test-user-${Date.now()}-${++counter}`

  it('allows the first request for a new identifier', async () => {
    const { checkRateLimit } = await import('../rate-limiter')
    expect(checkRateLimit(nextId())).toBe(true)
  })

  it('allows up to 100 requests for the same identifier', async () => {
    const { checkRateLimit } = await import('../rate-limiter')
    const id = nextId()
    for (let i = 0; i < 100; i++) {
      expect(checkRateLimit(id)).toBe(true)
    }
  })

  it('blocks the 101st request for the same identifier', async () => {
    const { checkRateLimit } = await import('../rate-limiter')
    const id = nextId()
    for (let i = 0; i < 100; i++) {
      checkRateLimit(id)
    }
    expect(checkRateLimit(id)).toBe(false)
  })

  it('different identifiers have independent limits', async () => {
    const { checkRateLimit } = await import('../rate-limiter')
    const idA = nextId()
    const idB = nextId()
    for (let i = 0; i < 100; i++) {
      checkRateLimit(idA)
    }
    // idA exhausted, but idB is fresh
    expect(checkRateLimit(idA)).toBe(false)
    expect(checkRateLimit(idB)).toBe(true)
  })
})
