export interface Challenge {
  id: string
  title: string
  slug: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  category: string
  functionName: string
  status: "draft" | "published" | "archived"
  createdAt: string
  updatedAt: string
  initialCode?: string
  testCases?: any[]
}

export interface ChallengeFormData {
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  category: string
  functionName: string
  status: "draft" | "published" | "archived"
  initialCode: string
  testCases: any[]
}

export const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Fácil", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Médio", color: "bg-yellow-100 text-yellow-800" },
  { value: "hard", label: "Difícil", color: "bg-red-100 text-red-800" }
] as const

export const CATEGORY_OPTIONS = [
  "Arrays", "Strings", "Linked Lists", "Trees", "Graphs", "Dynamic Programming", 
  "Sorting", "Searching", "Math", "Bit Manipulation", "Recursion", "Backtracking"
] as const

export const STATUS_OPTIONS = [
  { value: "draft", label: "Rascunho", color: "bg-gray-100 text-gray-800" },
  { value: "published", label: "Publicado", color: "bg-blue-100 text-blue-800" },
  { value: "archived", label: "Arquivado", color: "bg-orange-100 text-orange-800" }
] as const
