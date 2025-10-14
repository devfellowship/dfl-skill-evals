import { useCallback } from 'react'
import { useChallengesGlobal } from './useChallengesGlobal'
import { toast } from 'sonner'

export type BroadcastType = 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'archive'

export interface BroadcastConfig {
  showToast?: boolean
  toastMessages?: {
    success?: string
    error?: string
  }
}
export function useBroadcastOperations() {
  const {
    broadcastChallengeCreated,
    broadcastChallengeUpdated,
    broadcastChallengeDeleted,
    loadAllChallenges
  } = useChallengesGlobal()

  const executeWithBroadcast = useCallback(async <T>(
    operation: () => Promise<T>,
    broadcastType: BroadcastType,
    config: BroadcastConfig = {}
  ): Promise<T> => {
    const {
      showToast = true,
      toastMessages = {}
    } = config

    try {
      const result = await operation()
      try {
        switch (broadcastType) {
          case 'create':
            broadcastChallengeCreated(result)
            break
          case 'update':
            broadcastChallengeUpdated(result)
            break
          case 'delete':
            broadcastChallengeDeleted(typeof result === 'string' ? result : (result as any)?.id || '')
            break
          case 'approve':
          case 'reject':
          case 'archive':
            broadcastChallengeUpdated(result)
            break
        }
      } catch (broadcastError) {
        loadAllChallenges()
      }
      if (showToast && toastMessages.success) {
        toast.success(toastMessages.success)
      }

      return result
    } catch (error) {
      if (showToast && toastMessages.error) {
        toast.error(toastMessages.error)
      }
      throw error
    }
  }, [
    broadcastChallengeCreated,
    broadcastChallengeUpdated,
    broadcastChallengeDeleted,
    loadAllChallenges
  ])
  const executeWithBroadcastAndToast = useCallback(async <T>(
    operation: () => Promise<T>,
    broadcastType: BroadcastType,
    successMessage: string,
    errorMessage: string = 'Erro na operação'
  ): Promise<T> => {
    return executeWithBroadcast(operation, broadcastType, {
      showToast: true,
      toastMessages: {
        success: successMessage,
        error: errorMessage
      }
    })
  }, [executeWithBroadcast])

  return {
    executeWithBroadcast,
    executeWithBroadcastAndToast
  }
}

