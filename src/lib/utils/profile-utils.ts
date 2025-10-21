import { PROFILE_CONSTANTS } from '@/consts/profile/profile-constants'
import { ProfileData } from '@/types/profile/profile'
export const validateEmail = (email: string): boolean => {
  return PROFILE_CONSTANTS.EMAIL_REGEX.test(email)
}
export const canChangeName = (profile: ProfileData | null): boolean => {
  if (!profile?.last_name_change) return true
  if (profile.role === 'admin' || profile.role === 'mentor') return true
  const lastChange = new Date(profile.last_name_change)
  const now = new Date()
  const daysDiff = Math.floor((now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24))
  return daysDiff >= PROFILE_CONSTANTS.NAME_CHANGE_COOLDOWN_DAYS
}
export const getDaysUntilNameChange = (profile: ProfileData | null): number => {
  if (!profile?.last_name_change) return 0
  if (profile.role === 'admin' || profile.role === 'mentor') return 0
  const lastChange = new Date(profile.last_name_change)
  const now = new Date()
  const daysDiff = Math.floor((now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, PROFILE_CONSTANTS.NAME_CHANGE_COOLDOWN_DAYS - daysDiff)
}
export const getUserDisplayName = (user: any, profile: ProfileData | null): string => {
  if (!user) return 'Usuário'
  if (profile?.full_name) {
    return profile.full_name
  }
  if (user.user_metadata?.full_name) {
    return user.user_metadata.full_name
  }
  if (user.email) {
    return user.email.split('@')[0]
  }
  return 'Usuário'
}
export const getUserInitials = (name: string): string => {
  return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
}
export const formatPhoneNumber = (phone: string | null | undefined): string => {
  if (!phone) return 'Não informado'
  return phone
}