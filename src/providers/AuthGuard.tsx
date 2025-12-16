import { useEffect, ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/components/providers/AuthProvider'
import { ROUTES, isPublicRoute, isAssetRoute } from '@/config/routes'
import { LoadingScreen } from '@/components/ui/LoadingScreen'

interface AuthGuardProviderProps {
  children: ReactNode
}

export function AuthGuardProvider({ children }: AuthGuardProviderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading } = useAuth()

  const isPublic = isPublicRoute(location.pathname)
  const isAsset = isAssetRoute(location.pathname)

  useEffect(() => {
    if (!loading && !user && !isPublic && !isAsset) {
      navigate(`/auth/login?from=${encodeURIComponent(location.pathname)}`, { replace: true })
    }
  }, [loading, user, navigate, location.pathname, isPublic, isAsset])

  if (loading && !isPublic && !isAsset) {
    return <LoadingScreen message="Verificando autenticação..." />
  }

  if (!user && !isPublic && !isAsset) {
    return null
  }

  return <>{children}</>
}
