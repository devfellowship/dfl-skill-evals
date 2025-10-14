import { useCallback } from 'react'
import { useBaseStates } from './useBaseStates'
import { useBroadcastOperations } from './useBroadcastOperations'
import { useUserValidation } from './useUserValidation'

export interface CrudOperation<T = any> {
  (data: T): Promise<any>
}

export interface CrudOperationsConfig<T = any> {
  create?: CrudOperation<T>
  update?: (id: string, data: Partial<T>) => Promise<any>
  delete?: (id: string) => Promise<any>
  requireAuth?: boolean
  requirePermission?: 'create' | 'approve' | 'delete'
}

export function useCrudOperations<T = any>(config: CrudOperationsConfig<T> = {}) {
  const { loading, error, executeWithLoading } = useBaseStates()
  const { executeWithBroadcastAndToast } = useBroadcastOperations()
  const { validateUser, executeIfAuthorized } = useUserValidation()

  const {
    create: createFn,
    update: updateFn,
    delete: deleteFn,
    requireAuth = true,
    requirePermission
  } = config

  const executeOperation = useCallback(async <R>(
    operation: () => Promise<R>,
    permission?: 'create' | 'approve' | 'delete'
  ): Promise<R> => {
    if (requireAuth) {
      validateUser()
    }

    if (permission && requirePermission) {
      return executeIfAuthorized(permission, operation)
    }

    return operation()
  }, [requireAuth, validateUser, executeIfAuthorized, requirePermission])

  const create = useCallback(async (data: T) => {
    if (!createFn) {
      throw new Error('Função de criação não configurada')
    }

    return executeWithLoading(async () => {
      const operation = () => createFn(data)
      const result = await executeOperation(operation, 'create')
      
      return executeWithBroadcastAndToast(
        () => Promise.resolve(result),
        'create',
        'Item criado com sucesso!',
        'Erro ao criar item'
      )
    })
  }, [createFn, executeWithLoading, executeOperation, executeWithBroadcastAndToast])

  const update = useCallback(async (id: string, data: Partial<T>) => {
    if (!updateFn) {
      throw new Error('Função de atualização não configurada')
    }

    return executeWithLoading(async () => {
      const operation = () => updateFn(id, data)
      const result = await executeOperation(operation, 'approve')
      
      return executeWithBroadcastAndToast(
        () => Promise.resolve(result),
        'update',
        'Item atualizado com sucesso!',
        'Erro ao atualizar item'
      )
    })
  }, [updateFn, executeWithLoading, executeOperation, executeWithBroadcastAndToast])

  const remove = useCallback(async (id: string) => {
    if (!deleteFn) {
      throw new Error('Função de exclusão não configurada')
    }

    return executeWithLoading(async () => {
      const operation = () => deleteFn(id)
      const result = await executeOperation(operation, 'delete')
      
      return executeWithBroadcastAndToast(
        () => Promise.resolve(result),
        'delete',
        'Item excluído com sucesso!',
        'Erro ao excluir item'
      )
    })
  }, [deleteFn, executeWithLoading, executeOperation, executeWithBroadcastAndToast])

  return {
    loading,
    error,
    create,
    update,
    delete: remove
  }
}

