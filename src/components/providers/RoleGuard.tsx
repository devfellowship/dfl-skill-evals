"use client"

import { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { LoadingState } from '@/components/molecules/LoadingState/LoadingState'
import { NotFoundState } from '@/components/molecules/NotFoundState/NotFoundState'
import type { UserRole } from '@/lib/supabase'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: UserRole[]
  fallbackTitle?: string
  fallbackMessage?: string
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallbackTitle = "Acesso Negado",
  fallbackMessage = "Você não tem permissão para acessar esta página."
}: RoleGuardProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingState message="Verificando permissões..." />
  }

  if (!user) {
    return (
      <NotFoundState 
        title="Login Necessário" 
        message="Você precisa estar logado para acessar esta página." 
      />
    )
  }

  const userRole = user.profile?.role
  if (!userRole || !allowedRoles.includes(userRole)) {
    return (
      <NotFoundState 
        title={fallbackTitle}
        message={fallbackMessage}
      />
    )
  }

  return <>{children}</>
}
