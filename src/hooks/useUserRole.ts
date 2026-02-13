'use client'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { UserRole } from '@/lib/supabase'
import {
  getRoleInfo,
  getDefaultRoleInfo,
  getLoadingRoleInfo,
  getUnauthenticatedRoleInfo,
} from '@/lib/utils/user-role-utils'
import type { UserRoleInfo } from '@/types/user-role/user-role'
type SupabaseRole = 'superadmin' | 'admin' | 'community_member'
type AppRole = 'admin' | 'mentor' | 'community_member'
function pickHighestRole(input?: string[] | string | null): SupabaseRole {
  const order: SupabaseRole[] = ['superadmin', 'admin', 'community_member']
  if (!input) return 'community_member'
  const arr = Array.isArray(input) ? input : [input]
  for (const r of order) if (arr.includes(r)) return r
  return 'community_member'
}
function mapSupabaseToAppRole(role: SupabaseRole): AppRole {
  switch (role) {
    case 'superadmin':
      return 'admin'
    case 'admin':
      return 'admin'
    case 'community_member':
    default:
      return 'community_member'
  }
}
export function useUserRole(): UserRoleInfo {
  const { user, loading: authLoading } = useAuth()
  const [info, setInfo] = useState<UserRoleInfo>(getLoadingRoleInfo())
  const userId = useMemo(() => user?.id ?? null, [user?.id])
  useEffect(() => {
    let alive = true
    const run = async () => {
      if (authLoading) {
        if (alive) setInfo(getLoadingRoleInfo())
        return
      }
      if (!userId) {
        if (alive) setInfo(getUnauthenticatedRoleInfo())
        return
      }
      const { data: iamData, error: iamError } = await supabase
        .rpc('get_my_iam_role')
      if (iamError || !iamData) {
        if (alive) setInfo(getDefaultRoleInfo())
        return
      }
      const roles = (iamData as { role_id: string; level: number }[] | null) || []
      const iamRole = roles[0]
      // Map IAM level to app role: level >= 80 = admin, else community_member
      const appRole: AppRole = iamRole && iamRole.level >= 80 ? 'admin' : 'community_member'
      if (alive) setInfo(getRoleInfo(appRole as unknown as UserRole))
    }
    run()
    return () => { alive = false }
  }, [authLoading, userId])
  return info
}