import { describe, it, expect } from 'vitest'
import { generateUniqueSlug, slugExists } from '../slug-generator'

describe('generateUniqueSlug', () => {
  it('converts a simple title to a slug', () => {
    expect(generateUniqueSlug('Hello World')).toBe('hello-world')
  })

  it('lowercases the title', () => {
    expect(generateUniqueSlug('FizzBuzz Challenge')).toBe('fizzbuzz-challenge')
  })

  it('removes special characters', () => {
    expect(generateUniqueSlug('Two Sum!')).toBe('two-sum')
  })

  it('collapses multiple spaces into a single dash', () => {
    expect(generateUniqueSlug('A   B   C')).toBe('a-b-c')
  })

  it('strips leading and trailing dashes', () => {
    expect(generateUniqueSlug('  hello  ')).toBe('hello')
  })

  it('falls back to "challenge" for empty/symbol-only titles', () => {
    expect(generateUniqueSlug('!!!')).toBe('challenge')
    expect(generateUniqueSlug('')).toBe('challenge')
  })

  it('appends a counter when slug already exists', () => {
    const existing = ['two-sum']
    expect(generateUniqueSlug('Two Sum', existing)).toBe('two-sum-1')
  })

  it('increments counter until unique', () => {
    const existing = ['two-sum', 'two-sum-1', 'two-sum-2']
    expect(generateUniqueSlug('Two Sum', existing)).toBe('two-sum-3')
  })

  it('returns base slug when no conflicts exist', () => {
    expect(generateUniqueSlug('Binary Search', ['other-slug'])).toBe('binary-search')
  })
})

describe('slugExists', () => {
  it('returns true when slug is in the list', () => {
    expect(slugExists('two-sum', ['two-sum', 'fizzbuzz'])).toBe(true)
  })

  it('returns false when slug is not in the list', () => {
    expect(slugExists('merge-sort', ['two-sum', 'fizzbuzz'])).toBe(false)
  })

  it('returns false for an empty list', () => {
    expect(slugExists('two-sum', [])).toBe(false)
  })
})
