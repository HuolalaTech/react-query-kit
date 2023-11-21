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
): MutationHook<TData, TVariables, TError, TContext> => {
  return Object.assign(
    withMiddleware(ReactQuery.useMutation, defaultOptions, 'mutations'),
    {
      getKey: () => defaultOptions.mutationKey,
      getOptions: () => defaultOptions,
      mutationFn: defaultOptions.mutationFn,
    }
  ) as MutationHook<TData, TVariables, TError, TContext>
}
