import { describe, it, expect } from 'vitest'
import { ChallengeSorter, SortType } from '../challenge-sorter'
import type { AdminChallenge } from '@/types/admin/admin-dashboard'

const makeChallenge = (overrides: Partial<AdminChallenge> = {}): AdminChallenge => ({
  id: overrides.id ?? 'c1',
  title: overrides.title ?? 'Challenge',
  description: 'desc',
  difficulty: overrides.difficulty ?? 'medium',
  category: [],
  functionName: 'solve',
  initialCode: '',
  testCases: [],
  slug: 'challenge',
  status: 'published',
  mentor: 'mentor',
  createdAt: overrides.createdAt ?? '01/01/2024',
  updatedAt: '01/01/2024',
  ...overrides,
})

describe('ChallengeSorter.sortChallenges', () => {
  const challenges: AdminChallenge[] = [
    makeChallenge({ id: 'c1', title: 'Zebra', difficulty: 'hard',   createdAt: '01/03/2024' }),
    makeChallenge({ id: 'c2', title: 'Apple', difficulty: 'easy',   createdAt: '01/01/2024' }),
    makeChallenge({ id: 'c3', title: 'Mango', difficulty: 'expert', createdAt: '01/02/2024' }),
  ]

  it('sorts by created_desc (newest first)', () => {
    const sorted = ChallengeSorter.sortChallenges(challenges, 'created_desc')
    expect(sorted[0].id).toBe('c1')
    expect(sorted[2].id).toBe('c2')
  })

  it('sorts by created_asc (oldest first)', () => {
    const sorted = ChallengeSorter.sortChallenges(challenges, 'created_asc')
    expect(sorted[0].id).toBe('c2')
    expect(sorted[2].id).toBe('c1')
  })

  it('sorts by difficulty_asc (easy → expert)', () => {
    const sorted = ChallengeSorter.sortChallenges(challenges, 'difficulty_asc')
    expect(sorted[0].difficulty).toBe('easy')
    expect(sorted[2].difficulty).toBe('expert')
  })

  it('sorts by difficulty_desc (expert → easy)', () => {
    const sorted = ChallengeSorter.sortChallenges(challenges, 'difficulty_desc')
    expect(sorted[0].difficulty).toBe('expert')
    expect(sorted[2].difficulty).toBe('easy')
  })

  it('sorts by title_asc (A → Z)', () => {
    const sorted = ChallengeSorter.sortChallenges(challenges, 'title_asc')
    expect(sorted[0].title).toBe('Apple')
    expect(sorted[2].title).toBe('Zebra')
  })

  it('sorts by title_desc (Z → A)', () => {
    const sorted = ChallengeSorter.sortChallenges(challenges, 'title_desc')
    expect(sorted[0].title).toBe('Zebra')
    expect(sorted[2].title).toBe('Apple')
  })

  it('returns the original order for unknown sort type', () => {
    const sorted = ChallengeSorter.sortChallenges(challenges, 'unknown' as SortType)
    expect(sorted).toHaveLength(3)
  })

  it('does not mutate the original array', () => {
    const original = [...challenges]
    ChallengeSorter.sortChallenges(challenges, 'title_asc')
    expect(challenges[0].id).toBe(original[0].id)
  })
})

describe('ChallengeSorter.getSortLabel', () => {
  it('returns a human-readable label for each sort type', () => {
    expect(ChallengeSorter.getSortLabel('created_desc')).toBeTruthy()
    expect(ChallengeSorter.getSortLabel('title_asc')).toBeTruthy()
    expect(ChallengeSorter.getSortLabel('difficulty_asc')).toBeTruthy()
  })

  it('returns "Padrão" for unknown sort types', () => {
    expect(ChallengeSorter.getSortLabel('unknown' as SortType)).toBe('Padrão')
  })
})
