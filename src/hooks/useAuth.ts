import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { UserRole, Tables } from '@/lib/supabase'
interface AuthUser extends User {
  profile?: Tables<'profiles'>
}
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) setUser(session.user as AuthUser)
        else setUser(null)
      } catch {
        setError('Erro ao carregar sessão')
      } finally {
        setLoading(false)
      }
    }
    getSession()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(session.user as AuthUser)
      else setUser(null)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])
  const signIn = async (email: string, password: string) => {
    if (!email?.trim() || !password?.trim()) {
      return { error: { message: 'Email e senha são obrigatórios' } }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }
  const signUp = async (email: string, password: string, fullName: string) => {
    if (!email?.trim() || !password?.trim() || !fullName?.trim()) {
      return { error: { message: 'Email, senha e nome são obrigatórios' } }
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    return { error }
  }
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    return { error }
  }
  const getUserRole = (): UserRole => {
    const profile = (user as any)?.profile
    if (profile?.role) return profile.role as UserRole
    return 'community_member'
  }
  const hasRole = (role: UserRole): boolean => getUserRole() === role
  const canCreateChallenges = (): boolean => {
    const role = getUserRole()
    return role === 'admin' || role === 'superadmin'
  }
  const canApproveChallenges = (): boolean => {
    const role = getUserRole()
    return role === 'admin' || role === 'superadmin'
  }
  const isAdmin = (): boolean => {
    const role = getUserRole()
    return role === 'admin' || role === 'superadmin'
  }
  return {
    user,
    session: null,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    getUserRole,
    hasRole,
    canCreateChallenges,
    canApproveChallenges,
    isAdmin,
  }
}