export interface AdminChallenge {
  id: string
  title: string
  slug: string
  description: string
  difficulty: "easy" | "medium" | "hard" | "expert"
  category: string[]
  functionName: string
  status: "draft" | "published" | "archived" | "deleted"
  createdAt: string
  updatedAt: string
  initialCode?: string
  testCases?: any[]
  orderIndex?: number
  mentor?: string
  created_by?: string
  trending?: boolean
  trending_priority?: number | null
  deleted_at?: string | null
  deleted_by?: string | null
  deletion_reason?: string | null
  rating?: number
  participants?: number
  skills?: string[]
  image?: string
}

export interface ChallengeFormData {
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard" | "expert"
  category: string[]
  functionName: string
  status: "draft" | "published" | "archived" | "deleted"
  initialCode: string
  testCases: any[]
}

export const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Fácil", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Médio", color: "bg-yellow-100 text-yellow-800" },
  { value: "hard", label: "Difícil", color: "bg-red-100 text-red-800" },
  { value: "expert", label: "Expert", color: "bg-purple-100 text-purple-800" }
] as const

export const CATEGORY_OPTIONS = [
  "Arrays", "Strings", "Linked Lists", "Trees", "Graphs", "Dynamic Programming", 
  "Sorting", "Searching", "Math", "Bit Manipulation", "Recursion", "Backtracking"
] as const

export const STATUS_OPTIONS = [
  { value: "draft", label: "Em análise", color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900 transition-colors" },
  { value: "published", label: "Publicado", color: "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-600 transition-colors" },
  { value: "archived", label: "Arquivado", color: "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900 transition-colors" },
  { value: "deleted", label: "Excluído", color: "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900 transition-colors" }
] as const
