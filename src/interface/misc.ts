export interface SkillTagsProps {
  skills: string[]
  maxVisible?: number
}

export interface DifficultyIndicatorProps {
  difficulty: number
  maxLevel?: number
}

export interface ProblemExamplesProps {
  examples: any[]
}

export interface ProblemExampleProps {
  example: any
  index: number
}

export interface CodeEditorProps {
  value: string
  onChange: (code: string) => void
}

export interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void
  currentQuery: string
}

export interface SearchFilters {
  difficulty?: string[]
  category?: string[]
  status?: string[]
}

export interface TeacherChallengeListProps {
  challenges: any[]
  onDelete: (id: string) => void
}

export interface ChallengeViewBySlugProps {
  slug: string
}

export interface AdminChallengeViewProps {
  challengeId: string
}

export interface EditChallengeProps {
  challengeId: string
}

export interface TeacherChallengeViewProps {
  challengeId: string
}

export interface ChallengeCreateFormProps {
  onSubmit: (data: any) => void
  initialData?: any
}

export interface ChallengeDetails {
  // Campos adicionais processados
  [key: string]: any
}
