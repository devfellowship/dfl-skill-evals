import { UserRole } from '@/lib/supabase'
export interface UserRoleInfo {
  role: UserRole | 'user'
  label: string
  color: string
  isLoading: boolean
  isAdmin: boolean
  isMentor: boolean
  canCreateChallenges: boolean
}
export interface RoleLabels {
  [key: string]: string
}
export interface RoleColors {
  [key: string]: string
}