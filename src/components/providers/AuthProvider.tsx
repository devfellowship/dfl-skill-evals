"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useMockAuth } from '@/hooks/useMockAuth'
import { isMockEmail } from '@/lib/mock-data'

interface AuthContextType {
  user: any
  session: any
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any }>
  isMockMode: boolean
  mockUser: any
  mockSignIn: (email: string, password: string) => Promise<{ error: any }>
  mockSignOut: () => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMockMode, setIsMockMode] = useState(false)

  const {
    mockUser,
    mockSession,
    loading: mockLoading,
    signInMock,
    signOutMock,
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
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (isMockEmail(email)) {
      setIsMockMode(true)
      return await signInMock(email, password)
    }

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
    if (isMockMode) {
      setIsMockMode(false)
      return await signOutMock()
    }

    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    return { error }
  }

  const mockSignIn = async (email: string, password: string) => {
    setIsMockMode(true)
    return await signInMock(email, password)
  }

  const mockSignOut = async () => {
    setIsMockMode(false)
    return await signOutMock()
  }

  const value = {
    user: isMockMode ? mockUser : user,
    session: isMockMode ? mockSession : session,
    loading: isMockMode ? mockLoading : loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isMockMode,
    mockUser,
    mockSignIn,
    mockSignOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
