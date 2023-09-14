import { useMutation } from '@tanstack/react-query'

import type { CreateMutationOptions, DefaultError, MutationHook } from './types'
import { withMiddleware } from './utils'

export const createMutation = <
  TData = unknown,
  TVariables = void,
  TError = DefaultError,
  TContext = unknown
>(
  defaultOptions: CreateMutationOptions<TData, TVariables, TError, TContext>
): MutationHook<TData, TVariables, TError> => {
  const getKey = () => defaultOptions.mutationKey

  return Object.assign(
    withMiddleware(useMutation, defaultOptions, 'mutations'),
    {
      getKey,
      mutationFn: defaultOptions.mutationFn,
    }
  ) as MutationHook<TData, TVariables, TError>
}
