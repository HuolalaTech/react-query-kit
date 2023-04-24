import type { QueryClient } from '@tanstack/react-query'
import { useInfiniteQuery } from '@tanstack/react-query'
import { createBaseQuery } from './createBaseQuery'
import type {
  AdditionalCreateOptions,
  CompatibleUseInfiniteQueryOptions,
  CompatibleWithV4,
  InfiniteQueryHook,
  InfiniteQueryHookOptions,
} from './types'

interface CreateInfiniteQueryOptions<TFnData, TVariables, Error, TPageParam>
  extends Omit<
      CompatibleUseInfiniteQueryOptions<TFnData, TVariables, Error, TPageParam>,
      'queryKey' | 'queryFn' | 'enabled' | 'select'
    >,
    AdditionalCreateOptions<TFnData, TVariables, TPageParam> {}

export function createInfiniteQuery<
  TFnData,
  TVariables = any,
  Error = unknown,
  TPageParam = number
>(
  options: CreateInfiniteQueryOptions<
    TFnData,
    TVariables,
    Error,
    TPageParam
  > & {
    useDefaultOptions: () => Omit<
      InfiniteQueryHookOptions<
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
): InfiniteQueryHook<TFnData, TVariables, Error, TVariables | void, TPageParam>

export function createInfiniteQuery<
  TFnData,
  TVariables = any,
  Error = unknown,
  TPageParam = number
>(
  options: CreateInfiniteQueryOptions<
    TFnData,
    TVariables,
    Error,
    TPageParam
  > & {
    useDefaultOptions: () => Omit<
      InfiniteQueryHookOptions<
        TFnData,
        Error,
        TVariables,
        TVariables,
        TPageParam
      >,
      'select' | 'variables'
    >
  },
  queryClient?: CompatibleWithV4<QueryClient, void>
): InfiniteQueryHook<TFnData, TVariables, Error, TVariables, TPageParam>

export function createInfiniteQuery<
  TFnData,
  TVariables = any,
  Error = unknown,
  TPageParam = number
>(
  options: CreateInfiniteQueryOptions<TFnData, TVariables, Error, TPageParam>,
  queryClient?: CompatibleWithV4<QueryClient, void>
): InfiniteQueryHook<TFnData, TVariables, Error, TVariables, TPageParam>

export function createInfiniteQuery(options: any, queryClient?: any) {
  return createBaseQuery(options, useInfiniteQuery, queryClient)
}
