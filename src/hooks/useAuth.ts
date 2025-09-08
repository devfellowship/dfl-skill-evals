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

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
    
        
        if (session?.user) {
          // Buscar perfil atualizado
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
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer logout')
    } finally {
      setLoading(false)
    }
  }

  const hasRole = (role: UserRole): boolean => {
    return user?.profile?.role === role
  }

  const canCreateChallenges = (): boolean => {
    const role = user?.profile?.role
    return role === 'admin' || role === 'professor' || role === 'mentor'
  }

  const canApproveChallenges = (): boolean => {
    const role = user?.profile?.role
    return role === 'admin' || role === 'professor'
  }

  const isAdmin = (): boolean => {
    return user?.profile?.role === 'admin'
  }

  return {
    user,
    loading,
    error,
    signOut,
    hasRole,
    canCreateChallenges,
    canApproveChallenges,
    isAdmin,
  }
}