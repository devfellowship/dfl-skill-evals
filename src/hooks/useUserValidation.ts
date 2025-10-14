import { useCallback } from 'react'
import { useAuth } from './useAuth'
import { useUserRole } from './useUserRole'

export interface UserValidationResult {
  user: NonNullable<ReturnType<typeof useAuth>['user']>
  isAdmin: boolean
  isMentor: boolean
  canCreateChallenges: boolean
  canApproveChallenges: boolean
}


export function useUserValidation() {
  const { user } = useAuth()
  const { isAdmin, isMentor, canCreateChallenges } = useUserRole()
  
  const canApproveChallenges = isAdmin

  const validateUser = useCallback((): UserValidationResult => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado')
    }

    return {
      user,
      isAdmin,
      isMentor,
      canCreateChallenges,
      canApproveChallenges
    }
  }, [user, isAdmin, isMentor, canCreateChallenges, canApproveChallenges])

  const hasPermission = useCallback((action: 'create' | 'approve' | 'delete'): boolean => {
    if (!user?.id) return false

    switch (action) {
      case 'create':
        return canCreateChallenges
      case 'approve':
        return canApproveChallenges
      case 'delete':
        return isAdmin
      default:
        return false
    }
  }, [user, canCreateChallenges, canApproveChallenges, isAdmin])

  const executeIfAuthorized = useCallback(async <T>(
    action: 'create' | 'approve' | 'delete',
    operation: () => Promise<T>
  ): Promise<T> => {
    if (!hasPermission(action)) {
      throw new Error(`Usuário não tem permissão para ${action}`)
    }

    return await operation()
  }, [hasPermission])

  return {
    user,
    isAdmin,
    isMentor,
    canCreateChallenges,
    canApproveChallenges,
    validateUser,
    hasPermission,
    executeIfAuthorized
  }
}
