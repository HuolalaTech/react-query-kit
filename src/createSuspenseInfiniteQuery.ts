import type { QueryClient } from '@tanstack/react-query'
import { useInfiniteQuery } from '@tanstack/react-query'
import { createBaseQuery } from './createBaseQuery'
import type {
  AdditionalCreateOptions,
  CompatibleUseInfiniteQueryOptions,
  CompatibleWithV4,
  SuspenseInfiniteQueryHook,
  SuspenseInfiniteQueryHookOptions,
} from './types'

export interface CreateSuspenseInfiniteQueryOptions<
  TFnData,
  TVariables = any,
  Error = unknown,
  TPageParam = number
> extends Omit<
      CompatibleUseInfiniteQueryOptions<
        TFnData,
        TVariables,
        TFnData,
        Error,
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
    Omit<AdditionalCreateOptions<TFnData, TVariables, TPageParam>, 'enabled'> {}

export function createSuspenseInfiniteQuery<
  TFnData,
  TVariables = any,
  Error = unknown,
  TPageParam = number
>(
  options: CreateSuspenseInfiniteQueryOptions<
    TFnData,
    TVariables,
    Error,
    TPageParam
  > & {
    useDefaultOptions: () => Omit<
      SuspenseInfiniteQueryHookOptions<
        TFnData,
        Error,
        TVariables,
        TVariables,
        TPageParam
      >,
      'select'
    > & { variables: TVariables }
  },
  queryClient?: CompatibleWithV4<QueryClient, void>
): SuspenseInfiniteQueryHook<
  TFnData,
  TVariables,
  Error,
  TPageParam,
  TVariables | void
>

export function createSuspenseInfiniteQuery<
  TFnData,
  TVariables = any,
  Error = unknown,
  TPageParam = number
>(
  options: CreateSuspenseInfiniteQueryOptions<
    TFnData,
    TVariables,
    Error,
    TPageParam
  > & {
    useDefaultOptions: () => Omit<
      SuspenseInfiniteQueryHookOptions<
        TFnData,
        Error,
        TVariables,
        TPageParam,
        TVariables
      >,
      'select' | 'variables'
    >
  },
  queryClient?: CompatibleWithV4<QueryClient, void>
): SuspenseInfiniteQueryHook<TFnData, TVariables, Error, TPageParam, TVariables>

export function createSuspenseInfiniteQuery<
  TFnData,
  TVariables = any,
  Error = unknown,
  TPageParam = number
>(
  options: CreateSuspenseInfiniteQueryOptions<
    TFnData,
    TVariables,
    Error,
    TPageParam
  >,
  queryClient?: CompatibleWithV4<QueryClient, void>
): SuspenseInfiniteQueryHook<TFnData, TVariables, Error, TPageParam, TVariables>

export function createSuspenseInfiniteQuery(options: any, queryClient?: any) {
  return createBaseQuery(options, useInfiniteQuery, queryClient, {
    enabled: true,
    suspense: true,
    throwOnError: true,
    // compatible with ReactQuery v4
    // @ts-ignore
    useErrorBoundary: true,
  })
}
