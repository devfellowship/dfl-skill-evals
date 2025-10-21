export * from './editor'
export type { 
  Challenge, 
  SearchFilters,
  ChallengePageProps,
  PreChallengePageProps,
  Problem,
  Example,
  ProblemDifficulty,
  TestCase as ChallengeTestCase
} from './challenges'
export type { ExecutionTestCase, TestResult } from './editor'
export interface User {
  name: string
  email: string
  avatar?: string
  initials: string
}