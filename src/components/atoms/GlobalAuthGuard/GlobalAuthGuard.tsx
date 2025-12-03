"use client"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/components/providers/AuthProvider"
const PUBLIC_ROUTES = [
  '/login',
  '/reset-password',
  '/auth/login',
  '/auth/reset-password',
  '/challenge',
  '/challenge/pre'
]

const isPublicRoute = (pathname: string) => {
  return PUBLIC_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )
}
export function GlobalAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()
  useEffect(() => {
    if (!loading && !user && !isPublicRoute(pathname)) {
      router.replace(`/auth/login?from=${encodeURIComponent(pathname)}`)
    }
  }, [loading, user, router, pathname])
  if (loading) {
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
