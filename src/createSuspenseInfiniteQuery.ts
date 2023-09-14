import { useInfiniteQuery } from '@tanstack/react-query'

import { createBaseQuery } from './createBaseQuery'
import type {
  CreateSuspenseInfiniteQueryOptions,
  DefaultError,
  SuspenseInfiniteQueryHook,
} from './types'

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
