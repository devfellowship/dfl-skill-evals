export interface AdminChallenge {
  id: string
  title: string
  slug: string
  description: string
  difficulty: "easy" | "medium" | "hard" | "expert"
  category: string[]
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
  difficulty: "easy" | "medium" | "hard" | "expert"
  category: string[]
  functionName: string
  status: "draft" | "published" | "archived"
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
  { value: "draft", label: "Em análise", color: "bg-yellow-100 text-yellow-800" },
  { value: "published", label: "Publicado", color: "bg-green-100 text-green-800" },
  { value: "archived", label: "Arquivado", color: "bg-gray-100 text-gray-800" }
] as const
