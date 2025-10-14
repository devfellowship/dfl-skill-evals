'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserRole } from '@/hooks/useUserRole'

export default function CreatePage() {
  const router = useRouter()
  const { isAdmin } = useUserRole()

  useEffect(() => {
    // Redireciona para a página de criação baseada na role do usuário
    router.replace(isAdmin ? '/admin' : '/teacher/create')
  }, [router, isAdmin])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando para a página de criação...</p>
      </div>
    </div>
  )
}




