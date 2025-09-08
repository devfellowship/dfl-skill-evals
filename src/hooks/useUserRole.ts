'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import { UserRoleInfo } from '@/types/user-role/user-role'
import { getRoleInfo, isAdminEmail, getDefaultRoleInfo, getLoadingRoleInfo, getUnauthenticatedRoleInfo } from '@/lib/utils/user-role-utils'
import { UserRole } from '@/lib/supabase'

export function useUserRole(): UserRoleInfo {
  const { user, loading: authLoading } = useAuth()
  const [roleInfo, setRoleInfo] = useState<UserRoleInfo>(getLoadingRoleInfo())

  useEffect(() => {
    const fetchUserRole = async () => {
      if (authLoading) {
        setRoleInfo(getLoadingRoleInfo())
        return
      }

      if (!user) {
        setRoleInfo(getUnauthenticatedRoleInfo())
        return
      }


      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) {
          if (error.code === '42P17' || error.message.includes('infinite recursion')) {
            if (isAdminEmail(user.email || '')) {
              setRoleInfo(getRoleInfo('admin'))
              return
            }
            setRoleInfo(getDefaultRoleInfo())
            return
          }
          
          setRoleInfo(getDefaultRoleInfo())
          return
        }

        if (!profile) {
          setRoleInfo(getDefaultRoleInfo())
          return
        }

        const role = profile.role as UserRole
        const newRoleInfo = getRoleInfo(role)
        setRoleInfo(newRoleInfo)
      } catch (error) {
        setRoleInfo(getDefaultRoleInfo())
      }
    }

    fetchUserRole()
  }, [user, authLoading])

  return roleInfo
}
