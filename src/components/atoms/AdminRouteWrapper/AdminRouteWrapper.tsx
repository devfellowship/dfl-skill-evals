"use client"

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AdminRouteWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

export function AdminRouteWrapper({ children, fallback }: AdminRouteWrapperProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Por enquanto, sem autenticação - sempre autorizado
    // TODO: Implementar verificação de autenticação quando conectar com banco
    setIsAuthorized(true)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    if (fallback) {
      return <>{fallback}</>
    }
    
    // Redireciona para página principal se não autorizado
    router.push('/')
    return null
  }

  return <>{children}</>
}
