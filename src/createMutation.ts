import * as ReactQuery from '@tanstack/react-query'

import type {
  CompatibleError,
  CreateMutationOptions,
  MutationHook,
} from './types'
import { withMiddleware } from './utils'

export const createMutation = <
  TData = unknown,
  TVariables = void,
  TError = CompatibleError,
  TContext = unknown
>(
  defaultOptions: CreateMutationOptions<TData, TVariables, TError, TContext>
): MutationHook<TData, TVariables, TError> => {
  const getKey = () => defaultOptions.mutationKey

  return Object.assign(
    withMiddleware(ReactQuery.useMutation, defaultOptions, 'mutations'),
    {
      getKey,
      mutationFn: defaultOptions.mutationFn,
    }
  ) as MutationHook<TData, TVariables, TError>
}
