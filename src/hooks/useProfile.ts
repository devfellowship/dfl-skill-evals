'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { ProfileFormData } from '@/types/profile/profile'
import { canChangeName, getDaysUntilNameChange, validateEmail, getUserDisplayName, getUserInitials } from '@/lib/utils/profile-utils'
import { UserRole } from '@/lib/supabase'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
  last_name_change?: string
  avatar_url?: string
}

export const useProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return
    try {
      setLoading(true)
      setError(null)
      
      // Buscar dados do perfil e do users_with_roles em paralelo
      const [profileResult, userRolesResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('users_with_roles')
          .select('name, roles')
          .eq('id', user.id)
          .maybeSingle()
      ])

      const profileData = profileResult.data
      const userRolesData = userRolesResult.data

      if (profileResult.error && !profileData) {
        throw profileResult.error
      }

      const mapped: Profile = {
        id: user.id,
        email: profileData?.email || user.email || '',
        full_name: profileData?.full_name || userRolesData?.name || user.user_metadata?.full_name || '',
        role: (profileData?.role as UserRole) || 'community_member',
        is_active: profileData?.is_active !== false,
        created_at: profileData?.created_at || new Date().toISOString(),
        updated_at: profileData?.updated_at || new Date().toISOString(),
        last_name_change: profileData?.last_name_change || undefined,
        avatar_url: profileData?.avatar_url || undefined
      }
      setProfile(mapped)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar perfil')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (user?.id) fetchProfile()
  }, [user?.id, fetchProfile])

  const updateProfile = useCallback(async (data: ProfileFormData) => {
    if (!user?.id) return
    try {
      setError(null)
      const payload = { full_name: data.full_name, updated_at: new Date().toISOString() }
      const { data: updated, error: updateError } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', user.id)
        .select()
        .single()
      if (updateError) throw updateError
      if (!updated) throw new Error('Nenhum perfil retornado')
      const mapped: Profile = {
        id: updated.id,
        email: updated.email || user.email || '',
        full_name: updated.full_name || updated.name || '',
        role: (updated.role as UserRole) || 'community_member',
        is_active: updated.is_active !== false,
        created_at: updated.created_at || new Date().toISOString(),
        updated_at: updated.updated_at || new Date().toISOString(),
        last_name_change: updated.last_name_change || undefined,
        avatar_url: updated.avatar_url || undefined
      }
      setProfile(mapped)
      await fetchProfile()
      return mapped
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil')
      throw err
    }
  }, [user?.id, fetchProfile])

  const changePassword = useCallback(async (_current: string, next: string) => {
    if (!user) return
    const { error } = await supabase.auth.updateUser({ password: next })
    if (error) throw error
    return true
  }, [user])

  const changeEmail = useCallback(async (newEmail: string) => {
    if (!user) return
    if (!validateEmail(newEmail)) throw new Error('Email inválido')
    if (newEmail === user.email) throw new Error('O novo email deve ser diferente do atual')
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    if (error) throw error
    return true
  }, [user])

  const canChangeNameNow = canChangeName(profile)
  const daysUntilNameChange = getDaysUntilNameChange(profile)

  return {
    profile,
    loading,
    error,
    updateProfile,
    changePassword,
    changeEmail,
    canChangeName: canChangeNameNow,
    daysUntilNameChange,
    getUserDisplayName: () => getUserDisplayName(user, profile),
    getUserInitials: () => getUserInitials(getUserDisplayName(user, profile))
  }
}
