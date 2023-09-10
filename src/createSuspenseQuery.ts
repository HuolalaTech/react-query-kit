import type { DefaultError, UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { createBaseQuery } from './createBaseQuery'
import type {
  AdditionalCreateOptions,
  Middleware,
  SuspenseQueryHook,
  inferQueryKey,
} from './types'

export interface CreateSuspenseQueryOptions<
  TFnData = unknown,
  TVariables = any,
  TError = DefaultError
> extends Omit<
      UseQueryOptions<TFnData, TError, TFnData, inferQueryKey<TVariables>>,
      | 'queryKey'
      | 'queryFn'
      | 'enabled'
      | 'select'
      | 'suspense'
      | 'throwOnError'
      | 'placeholderData'
      | 'keepPreviousData'
      | 'useErrorBoundary'
    >,
    Omit<AdditionalCreateOptions<TFnData, TVariables>, 'enabled'> {
  use?: Middleware<SuspenseQueryHook<TFnData, TVariables, TVariables>>[]
}

export function createSuspenseQuery<
  TFnData,
  TVariables = any,
  TError = DefaultError
>(
  options: CreateSuspenseQueryOptions<TFnData, TVariables, TError>
): SuspenseQueryHook<TFnData, TVariables, TError> {
  return createBaseQuery(options, useQuery, {
    enabled: true,
    suspense: true,
    throwOnError: true,
    // compatible with ReactQuery v4
    // @ts-ignore
    useErrorBoundary: true,
  })
}
