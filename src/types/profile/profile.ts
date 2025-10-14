import { UserRole } from '@/lib/supabase'
export interface ProfileData {
  id: string
  email: string
  full_name: string
  phone?: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
  last_name_change?: string
}
export interface UseProfileReturn {
  profile: ProfileData | null
  loading: boolean
  error: string | null
  canChangeName: boolean
  daysUntilNameChange: number
  updateProfile: (data: Partial<ProfileData>) => Promise<{ error: any }>
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ error: any }>
  changeEmail: (newEmail: string) => Promise<{ error: any }>
  refreshProfile: () => Promise<void>
}
export interface ProfileEditFormProps {
  onClose?: () => void
}
export interface ProfileFormData {
  full_name: string
}
export interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
export interface EmailFormData {
  newEmail: string
}