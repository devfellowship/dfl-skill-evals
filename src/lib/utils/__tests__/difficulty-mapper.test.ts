import { describe, it, expect } from 'vitest'
import {
  mapDifficultyToNumber,
  mapDifficultyToString,
  isValidDifficulty,
  getAvailableDifficulties,
  DIFFICULTY_MAP,
} from '../difficulty-mapper'

describe('DIFFICULTY_MAP', () => {
  it('has four difficulty levels', () => {
    expect(Object.keys(DIFFICULTY_MAP)).toHaveLength(4)
  })

  it('maps easy → 1, medium → 2, hard → 3, expert → 4', () => {
    expect(DIFFICULTY_MAP.easy).toBe(1)
    expect(DIFFICULTY_MAP.medium).toBe(2)
    expect(DIFFICULTY_MAP.hard).toBe(3)
    expect(DIFFICULTY_MAP.expert).toBe(4)
  })
})

describe('mapDifficultyToNumber', () => {
  it('converts known difficulty strings to numbers', () => {
    expect(mapDifficultyToNumber('easy')).toBe(1)
    expect(mapDifficultyToNumber('medium')).toBe(2)
    expect(mapDifficultyToNumber('hard')).toBe(3)
    expect(mapDifficultyToNumber('expert')).toBe(4)
  })

  it('defaults to 2 (medium) for unknown strings', () => {
    expect(mapDifficultyToNumber('beginner')).toBe(2)
    expect(mapDifficultyToNumber('')).toBe(2)
  })
})

describe('mapDifficultyToString', () => {
  it('converts numbers back to difficulty strings', () => {
    expect(mapDifficultyToString(1)).toBe('easy')
    expect(mapDifficultyToString(2)).toBe('medium')
    expect(mapDifficultyToString(3)).toBe('hard')
    expect(mapDifficultyToString(4)).toBe('expert')
  })

  it('defaults to "medium" for unknown numbers', () => {
    expect(mapDifficultyToString(99)).toBe('medium')
    expect(mapDifficultyToString(0)).toBe('medium')
  })
})

describe('isValidDifficulty', () => {
  it('returns true for valid difficulty strings', () => {
    expect(isValidDifficulty('easy')).toBe(true)
    expect(isValidDifficulty('medium')).toBe(true)
    expect(isValidDifficulty('hard')).toBe(true)
    expect(isValidDifficulty('expert')).toBe(true)
  })

  it('returns false for invalid strings', () => {
    expect(isValidDifficulty('beginner')).toBe(false)
    expect(isValidDifficulty('')).toBe(false)
    expect(isValidDifficulty('EASY')).toBe(false)
  })
})

describe('getAvailableDifficulties', () => {
  it('returns all four difficulty keys', () => {
    const difficulties = getAvailableDifficulties()
    expect(difficulties).toHaveLength(4)
    expect(difficulties).toContain('easy')
    expect(difficulties).toContain('medium')
    expect(difficulties).toContain('hard')
    expect(difficulties).toContain('expert')
  })
})
