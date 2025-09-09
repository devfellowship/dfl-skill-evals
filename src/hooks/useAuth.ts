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
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setUser({
            ...session.user,
            profile: profile || undefined
          } as AuthUser)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error getting session:', error)
        setError('Erro ao carregar sessão')
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
            
            setUser({
              ...session.user,
              profile: profile || undefined
            } as AuthUser)
          } catch (error) {
            console.error('Error loading profile:', error)
            setUser(session.user as AuthUser)
          }
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
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

  const hasRole = (role: UserRole): boolean => {
    return user?.profile?.role === role
  }

  const canCreateChallenges = (): boolean => {
    const role = user?.profile?.role
    return role === 'admin' || role === 'mentor'
  }

  const canApproveChallenges = (): boolean => {
    return user?.profile?.role === 'admin'
  }

  const isAdmin = (): boolean => {
    return user?.profile?.role === 'admin'
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
    hasRole,
    canCreateChallenges,
    canApproveChallenges,
    isAdmin,
  }
}