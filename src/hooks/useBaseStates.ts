import { useState, useCallback } from 'react'

export interface BaseStates {
  loading: boolean
  error: string | null
  executeWithLoading: <T>(operation: () => Promise<T>) => Promise<T>
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
}
export function useBaseStates(): BaseStates {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeWithLoading = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await operation()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    executeWithLoading,
    setError,
    setLoading
  }
}
