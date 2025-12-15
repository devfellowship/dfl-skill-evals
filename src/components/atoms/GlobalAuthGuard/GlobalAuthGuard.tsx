"use client"
import { useEffect } from "react"
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from "@/components/providers/AuthProvider"

const PUBLIC_ROUTES = ['/login', '/reset-password', '/auth/login', '/auth/reset-password']

const isPublicRoute = (pathname: string | null): boolean => {
  if (!pathname) return false
  
  if (PUBLIC_ROUTES.includes(pathname)) return true
  
  if (pathname.startsWith('/assets/')) return true
  if (pathname.startsWith('/_next/')) return true
  if (pathname.endsWith('.js')) return true
  if (pathname.endsWith('.css')) return true
  if (pathname.endsWith('.json')) return true
  
  return false
}

export function GlobalAuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation(); const pathname = location.pathname
  const { user, loading } = useAuth()
  
  useEffect(() => {
    if (!loading && !user && !isPublicRoute(pathname)) {
      navigate(`/auth/login?from=${encodeURIComponent(pathname || '/')}`)
    }
  }, [loading, user, router, pathname])
  
  if (loading && !isPublicRoute(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verificando autenticação...</p>
        </div>
      </div>
    )
  }
  
  if (!user && !isPublicRoute(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Redirecionando para login...</p>
        </div>
      </div>
    )
  }
  
  return <>{children}</>
}
