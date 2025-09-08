export interface AssessmentGridProps {
  assessments: any[]
  isLoading?: boolean
}

export interface ProblemPanelProps {
  problem: any
}

export interface TestResultsPanelProps {
  results: any
  passedTests: number
}

export interface PreChallengeHeroProps {
  title: string
}

export interface PreChallengeActionsProps {
  challengeId: string
  systemChecks: {
    browser: boolean
    internet: boolean
    microphone: boolean
  }
}

export interface HintsProps {
  hints: string[]
  hintsUsed: number
}

export interface FooterSectionProps {
  title: string
  children: React.ReactNode
}
