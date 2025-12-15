'use client'
import { ReactNode, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useUserRole } from '@/hooks/useUserRole'
import { Loader2 } from 'lucide-react'
interface AdminRouteWrapperProps {
  children: ReactNode
  allowedRoles: string[]
}
export function AdminRouteWrapper({ children, allowedRoles }: AdminRouteWrapperProps) {
  const { user, loading: authLoading } = useAuth()
  const { role, isLoading: roleLoading } = useUserRole()
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)
  useEffect(() => {
    const checkAccess = async () => {
      if (authLoading || roleLoading) {
        return
      }
      if (!user) {
        navigate('/login')
        return
      }
      if (!role) {
        return
      }
      if (!allowedRoles.includes(role)) {
        navigate('/')
        return
      }
      setIsChecking(false)
    }
    checkAccess()
  }, [user, role, authLoading, roleLoading, allowedRoles, router])
  if (authLoading || roleLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    )
  }
  if (!user) {
    return null
  }
  if (!allowedRoles.includes(role)) {
    return null
  }
  return <>{children}</>
}