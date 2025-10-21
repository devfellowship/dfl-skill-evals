import { UserRole } from '@/lib/supabase'
import { UserRoleInfo } from '@/types/user-role/user-role'
const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  mentor: 'Mentor',
  community_member: 'Membro da Comunidade'
}
const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-red-500',
  mentor: 'bg-green-500',
  community_member: 'bg-blue-500'
}
const DEFAULT_ROLE_INFO: UserRoleInfo = {
  role: 'community_member',
  label: 'Membro da Comunidade',
  color: 'bg-blue-500',
  isLoading: true,
  isAdmin: false,
  isMentor: false,
  canCreateChallenges: false
}
export const getRoleInfo = (role: UserRole): UserRoleInfo => {
  return {
    role,
    label: ROLE_LABELS[role] || 'Usuário',
    color: ROLE_COLORS[role] || 'bg-gray-500',
    isLoading: false,
    isAdmin: role === 'admin',
    isMentor: role === 'mentor' || role === 'admin', 
    canCreateChallenges: role === 'admin' || role === 'mentor'
  }
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
