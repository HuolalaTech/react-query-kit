import { useMutation } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'

import type { DefaultError, Middleware, MutationHook } from './types'
import { withMiddlewares } from './utils'

export interface CreateMutationOptions<
  TData = unknown,
  TVariables = void,
  TError = DefaultError,
  TContext = unknown
> extends UseMutationOptions<TData, TError, TVariables, TContext> {
  use?: Middleware<MutationHook<TData, TError, TVariables>>[]
}

export function createMutation<
  TData = unknown,
  TVariables = void,
  TError = DefaultError,
  TContext = unknown
>(
  defaultOptions: CreateMutationOptions<TData, TVariables, TError, TContext>
): MutationHook<TData, TVariables, TError> {
  const getKey = () => defaultOptions.mutationKey

  return Object.assign(
    withMiddlewares(useMutation, defaultOptions, 'mutations'),
    {
      getKey,
      mutationFn: defaultOptions.mutationFn,
    }
  ) as MutationHook<TData, TVariables, TError>
}
