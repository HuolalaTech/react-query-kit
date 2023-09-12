import { useInfiniteQuery } from '@tanstack/react-query'

import { createBaseQuery } from './createBaseQuery'
import type {
  AdditionalCreateOptions,
  CompatibleUseInfiniteQueryOptions,
  DefaultError,
  Middleware,
  SuspenseInfiniteQueryHook,
} from './types'

export interface CreateSuspenseInfiniteQueryOptions<
  TFnData = unknown,
  TVariables = any,
  TError = DefaultError,
  TPageParam = number
> extends Omit<
      CompatibleUseInfiniteQueryOptions<
        TFnData,
        TVariables,
        TFnData,
        TError,
        TPageParam
      >,
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
    Omit<AdditionalCreateOptions<TFnData, TVariables, TPageParam>, 'enabled'> {
  use?: Middleware<SuspenseInfiniteQueryHook<TFnData, TVariables, TVariables>>[]
}

export const createSuspenseInfiniteQuery = <
  TFnData,
  TVariables = any,
  TError = DefaultError,
  TPageParam = number
>(
  options: CreateSuspenseInfiniteQueryOptions<
    TFnData,
    TVariables,
    TError,
    TPageParam
  >
): SuspenseInfiniteQueryHook<TFnData, TVariables, TError, TPageParam> => {
  return createBaseQuery(options, useInfiniteQuery, {
    enabled: true,
    suspense: true,
    throwOnError: true,
    // compatible with ReactQuery v4
    // @ts-ignore
    useErrorBoundary: true,
  })
}
