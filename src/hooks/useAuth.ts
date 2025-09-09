import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { UserRole, Tables } from '@/lib/supabase'
import { useMockAuth } from './useMockAuth'
import { isMockEmail } from '@/lib/mock-data'

interface AuthUser extends User {
  profile?: Tables<'profiles'>
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMockMode, setIsMockMode] = useState(false)

  const {
    mockUser,
    mockSession,
    loading: mockLoading,
    signInMock,
    signOutMock,
    hasRole: mockHasRole,
    canCreateChallenges: mockCanCreateChallenges,
    canApproveChallenges: mockCanApproveChallenges,
    isAdmin: mockIsAdmin,
  } = useMockAuth()

  useEffect(() => {
    const savedSession = localStorage.getItem('mock-session')
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession)
        if (session.expires_at > Date.now()) {
          setIsMockMode(true)
          setLoading(false)
          return
        } else {
          localStorage.removeItem('mock-session')
        }
      } catch (error) {
        localStorage.removeItem('mock-session')
      }
    }
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setUser({ ...session.user, profile })
        } else {
          setUser(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    getSession()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setUser({ ...session.user, profile })
        } else {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      setLoading(true)
      
      if (isMockMode) {
        const { error } = await signOutMock()
        if (error) throw error
        setIsMockMode(false)
        setUser(null)
      } else {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        setUser(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer logout')
    } finally {
      setLoading(false)
    }
  }

  const hasRole = (role: UserRole): boolean => {
    if (isMockMode) {
      return mockHasRole(role)
    }
    return user?.profile?.role === role
  }

  const canCreateChallenges = (): boolean => {
    if (isMockMode) {
      return mockCanCreateChallenges()
    }
    const role = user?.profile?.role
    return role === 'admin' || role === 'mentor'
  }

  const canApproveChallenges = (): boolean => {
    if (isMockMode) {
      return mockCanApproveChallenges()
    }
    const role = user?.profile?.role
    return role === 'admin'
  }

  const isAdmin = (): boolean => {
    if (isMockMode) {
      return mockIsAdmin()
    }
    return user?.profile?.role === 'admin'
  }

  return {
    user: isMockMode ? mockUser : user,
    loading: isMockMode ? mockLoading : loading,
    error,
    signOut,
    hasRole,
    canCreateChallenges,
    canApproveChallenges,
    isAdmin,
    isMockMode,
  }
}