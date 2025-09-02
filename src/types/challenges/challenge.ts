export interface Challenge {
  id: number
  supabaseId?: string 
  title: string
  description: string
  skills: string[]
  difficulty: number

  problems: number
  participants: number
  rating: number
  category: string
  trending: boolean
  image?: string
}

export interface SearchFilters {
  skills: string[]
  difficulties: string[]

  minRating: number
  categories: string[]
  trending: boolean
}

export type SortOption = "relevance" | "rating" | "popularity" | "recent"

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5

export interface DifficultyConfig {
  level: DifficultyLevel
  label: string
  color: string
} 