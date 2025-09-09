import { UserRole } from '@/lib/supabase'
import { ROLE_LABELS, ROLE_COLORS, DEFAULT_ROLE_INFO, ADMIN_EMAILS } from '@/consts/user-role/user-role-constants'
import { UserRoleInfo } from '@/types/user-role/user-role'

export const getRoleInfo = (role: UserRole): UserRoleInfo => {
  return {
    role,
    label: ROLE_LABELS[role] || 'Usuário',
    color: ROLE_COLORS[role] || 'bg-gray-500',
    isLoading: false,
    isAdmin: role === 'admin',
    isMentor: role === 'mentor',
    canCreateChallenges: role === 'admin' || role === 'mentor'
  }
}

export const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email as any)
}

export const getDefaultRoleInfo = (): UserRoleInfo => {
  return { ...DEFAULT_ROLE_INFO }
}

export const getLoadingRoleInfo = (): UserRoleInfo => {
  return { ...DEFAULT_ROLE_INFO, isLoading: true }
}

export const getUnauthenticatedRoleInfo = (): UserRoleInfo => {
  return { ...DEFAULT_ROLE_INFO, isLoading: false }
}
