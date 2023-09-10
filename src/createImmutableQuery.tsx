import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { createBaseQuery } from './createBaseQuery'
import type {
  AdditionalCreateOptions,
  DefaultError,
  ImmutableQueryHook,
  Middleware,
  inferQueryKey,
} from './types'

export interface CreateImmutableQueryOptions<
  TFnData = unknown,
  TVariables = any,
  TError = DefaultError
> extends Omit<
      UseQueryOptions<TFnData, TError, TFnData, inferQueryKey<TVariables>>,
      | 'queryKey'
      | 'queryFn'
      | 'enabled'
      | 'select'
      | 'refetchInterval'
      | 'refetchIntervalInBackground'
      | 'refetchOnMount'
      | 'refetchOnReconnect'
      | 'refetchOnWindowFocus'
      | 'staleTime'
      | 'gcTime'
      | 'cacheTime'
    >,
    Omit<AdditionalCreateOptions<TFnData, TVariables>, 'enabled'> {
  use?: Middleware<ImmutableQueryHook<TFnData, TVariables, TError>>[]
}

export function createImmutableQuery<
  TFnData,
  TVariables = any,
  TError = DefaultError
>(
  options: CreateImmutableQueryOptions<TFnData, TVariables, TError>
): ImmutableQueryHook<TFnData, TVariables, TError> {
  return createBaseQuery(options, useQuery, {
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: Infinity,
    // compatible with ReactQuery v4
    // @ts-ignore
    cacheTime: Infinity,
  })
}
