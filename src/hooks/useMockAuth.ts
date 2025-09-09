import { useState, useEffect } from 'react'
import { MOCK_USERS, getMockUserByEmail, verifyMockPassword, getMockProfile, isMockEmail } from '@/lib/mock-data'
import type { UserRole } from '@/lib/supabase'

interface MockUser {
  id: string
  email: string
  full_name: string
  role: UserRole
  institution?: string
  bio?: string
  avatar_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface MockSession {
  user: MockUser
  access_token: string
  refresh_token: string
  expires_at: number
}

export function useMockAuth() {
  const [mockUser, setMockUser] = useState<MockUser | null>(null)
  const [mockSession, setMockSession] = useState<MockSession | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedSession = localStorage.getItem('mock-session')
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession)
        if (session.expires_at > Date.now()) {
          setMockSession(session)
          setMockUser(session.user)
        } else {
          localStorage.removeItem('mock-session')
        }
      } catch (error) {
        localStorage.removeItem('mock-session')
      }
    }
  }, [])

  const signInMock = async (email: string, password: string) => {
    setLoading(true)
    
    try {
      if (!isMockEmail(email)) {
        throw new Error('Email não encontrado nos dados mock')
      }

      if (!verifyMockPassword(email, password)) {
        throw new Error('Senha incorreta')
      }

      const user = getMockUserByEmail(email)
      if (!user) {
        throw new Error('Usuário não encontrado')
      }

      const session: MockSession = {
        user: getMockProfile(email)!,
        access_token: `mock-token-${Date.now()}`,
        refresh_token: `mock-refresh-${Date.now()}`,
        expires_at: Date.now() + (24 * 60 * 60 * 1000)
      }

      localStorage.setItem('mock-session', JSON.stringify(session))
      
      setMockSession(session)
      setMockUser(session.user)
      
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Erro desconhecido') }
    } finally {
      setLoading(false)
    }
  }

  const signOutMock = async () => {
    localStorage.removeItem('mock-session')
    setMockSession(null)
    setMockUser(null)
    return { error: null }
  }

  const hasRole = (role: UserRole): boolean => {
    return mockUser?.role === role
  }

  const canCreateChallenges = (): boolean => {
    const role = mockUser?.role
    return role === 'admin' || role === 'mentor'
  }

  const canApproveChallenges = (): boolean => {
    const role = mockUser?.role
    return role === 'admin'
  }

  const isAdmin = (): boolean => {
    return mockUser?.role === 'admin'
  }

  return {
    mockUser,
    mockSession,
    loading,
    signInMock,
    signOutMock,
    hasRole,
    canCreateChallenges,
    canApproveChallenges,
    isAdmin,
  }
}
