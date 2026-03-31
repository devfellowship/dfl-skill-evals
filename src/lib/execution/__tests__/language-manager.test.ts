import { describe, it, expect } from 'vitest'
import { isLanguageSupported, getLanguageName } from '../language-manager'

describe('isLanguageSupported', () => {
  it('returns true for supported language ids', () => {
    expect(isLanguageSupported(63)).toBe(true)  // JavaScript
    expect(isLanguageSupported(74)).toBe(true)  // TypeScript
    expect(isLanguageSupported(71)).toBe(true)  // Python
  })

  it('returns false for unsupported language ids', () => {
    expect(isLanguageSupported(62)).toBe(false) // Java
    expect(isLanguageSupported(50)).toBe(false) // C
    expect(isLanguageSupported(0)).toBe(false)
  })
})

describe('getLanguageName', () => {
  it('returns the correct name for known language ids', () => {
    expect(getLanguageName(63)).toContain('JavaScript')
    expect(getLanguageName(74)).toContain('TypeScript')
    expect(getLanguageName(71)).toContain('Python')
  })

  it('returns "Unknown Language" for unsupported ids', () => {
    expect(getLanguageName(999)).toBe('Unknown Language')
    expect(getLanguageName(0)).toBe('Unknown Language')
  })
})
