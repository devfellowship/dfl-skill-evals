import { UserRole } from '@/lib/supabase'
import { RoleLabels, RoleColors } from '@/types/user-role/user-role'

export const ROLE_LABELS: RoleLabels = {
  student: 'Estudante',
  mentor: 'Mentor',
  admin: 'Administrador',
  user: 'Usuário'
}

export const ROLE_COLORS: RoleColors = {
  student: 'bg-blue-500',
  mentor: 'bg-green-500',
  admin: 'bg-red-500',
  user: 'bg-gray-500'
}

export const DEFAULT_ROLE_INFO = {
  role: 'user' as UserRole | 'user',
  label: 'Usuário',
  color: 'bg-gray-500',
  isLoading: true,
  isAdmin: false,
  isMentor: false,
  canCreateChallenges: false
} as const

export const ADMIN_EMAILS = [
  'samuelstefanodocarmo@gmail.com',
  'admin@devshapper.com'
] as const
