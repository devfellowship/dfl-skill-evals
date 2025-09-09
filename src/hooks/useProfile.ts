import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useUserRole } from '@/hooks/useUserRole'
import { ProfileFormData, PasswordFormData, EmailFormData } from '@/types/profile/profile'
import { canChangeName, getDaysUntilNameChange, validateEmail, getUserDisplayName, getUserInitials, formatPhoneNumber } from '@/lib/utils/profile-utils'

export interface Profile {
  id: string
  email: string
  full_name: string
  phone: string | null
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
  last_name_change?: string
}

export const useProfile = () => {
  const { user } = useAuth()
  const { roleInfo } = useUserRole()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (fetchError) {
        throw fetchError
      }

      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar perfil')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const updateProfile = useCallback(async (data: ProfileFormData) => {
    if (!user?.id) return

    try {
      setError(null)

      const payload: any = {
        full_name: data.full_name,
        phone: data.phone || null,
        updated_at: new Date().toISOString()
      }

      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', user.id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      setProfile(updatedProfile)
      await fetchProfile()
      
      return updatedProfile
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil')
      throw err
    }
  }, [user?.id, fetchProfile])

  const changePassword = useCallback(async (data: PasswordFormData) => {
    if (!user) return

    try {
      setError(null)

      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword
      })

      if (updateError) {
        throw updateError
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar senha')
      throw err
    }
  }, [user])

  const changeEmail = useCallback(async (data: EmailFormData) => {
    if (!user) return

    try {
      setError(null)

      if (!validateEmail(data.newEmail)) {
        throw new Error('Email inválido')
      }

      if (data.newEmail === user.email) {
        throw new Error('O novo email deve ser diferente do atual')
      }

      const { error: updateError } = await supabase.auth.updateUser({
        email: data.newEmail
      })

      if (updateError) {
        throw updateError
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar email')
      throw err
    }
  }, [user])

  const canChangeNameNow = canChangeName(profile?.last_name_change, roleInfo?.role)
  const daysUntilNameChange = getDaysUntilNameChange(profile?.last_name_change)

  return {
    profile,
    loading,
    error,
    updateProfile,
    changePassword,
    changeEmail,
    canChangeName: canChangeNameNow,
    daysUntilNameChange,
    getUserDisplayName: () => getUserDisplayName(profile, user),
    getUserInitials: () => getUserInitials(profile, user),
    formatPhoneNumber: (phone: string | null) => formatPhoneNumber(phone)
  }
}
