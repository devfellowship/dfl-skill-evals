export interface ChallengeData {
  id: string
  title: string
  slug: string
  description: string
  difficulty: string
  category?: string
  skills: string[]
  function_name: string
  initial_code: string
  test_cases: any[]
  examples?: any[]
  constraints: string[]
  hints: string[]
  status: string
  created_at: string
  updated_at: string
}

export interface TestCase {
  input: string
  expectedOutput: string
}

export interface Example {
  input: string
  output: string
}

export interface MentorChallenge {
  id: string
  title: string
  description: string
  difficulty: string
  status: string
  created_at: string
  updated_at: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  difficulty: string
  status: string
  created_at: string
  updated_at: string
  imageUrl?: string
  category?: string[]
  functionName?: string
  initialCode?: string
  testCases?: any[]
  orderIndex?: number | null
}

export interface ChallengeFormProps {
  isCreating: boolean
  editingChallenge: Challenge | null
}

export interface ChallengeControlsProps {
  language: string
  setLanguage: (language: string) => void
}

export interface ChallengeHeaderProps {
  title: string
  backHref?: string
}

export interface ChallengeRightSidebarProps {
  problem: any
}

export interface ChallengeComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  challengeId: string | null
  onCompare: (challengeId: string) => void
}

export interface ComparisonResult {
  hasChanges: boolean
  changes: {
    field: string
    oldValue: any
    newValue: any
  }[]
}
