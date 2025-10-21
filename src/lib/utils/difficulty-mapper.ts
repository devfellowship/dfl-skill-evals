
export const DIFFICULTY_MAP = {
  easy: 1,
  medium: 2,
  hard: 3,
  expert: 4,
} as const
export type DifficultyString = keyof typeof DIFFICULTY_MAP
export type DifficultyNumber = typeof DIFFICULTY_MAP[DifficultyString]
export const mapDifficultyToNumber = (difficulty: string): number => {
  return DIFFICULTY_MAP[difficulty as DifficultyString] || 2
}
export const mapDifficultyToString = (difficulty: number): string => {
  const entry = Object.entries(DIFFICULTY_MAP).find(([, value]) => value === difficulty)
  return entry ? entry[0] : 'medium'
}
export const isValidDifficulty = (difficulty: string): difficulty is DifficultyString => {
  return difficulty in DIFFICULTY_MAP
}
export const getAvailableDifficulties = (): DifficultyString[] => {
  return Object.keys(DIFFICULTY_MAP) as DifficultyString[]
}