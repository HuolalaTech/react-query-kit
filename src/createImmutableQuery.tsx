import type { QueryClient, UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { createBaseQuery } from './createBaseQuery'
import type {
  AdditionalCreateOptions,
  CompatibleWithV4,
  ImmutableQueryHook,
  ImmutableQueryHookOptions,
  inferQueryKey,
} from './types'

export interface CreateImmutableQueryOptions<
  TFnData,
  TVariables = any,
  Error = unknown
> extends Omit<
      UseQueryOptions<TFnData, Error, TFnData, inferQueryKey<TVariables>>,
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
    Omit<AdditionalCreateOptions<TFnData, TVariables>, 'enabled'> {}

export function createImmutableQuery<
  TFnData,
  TVariables = any,
  Error = unknown
>(
  options: CreateImmutableQueryOptions<TFnData, TVariables, Error> & {
    useDefaultOptions: () => Omit<
      ImmutableQueryHookOptions<TFnData, Error, TFnData, TVariables>,
      'select'
    > & { variables: TVariables }
  },
  queryClient?: CompatibleWithV4<QueryClient, void>
): ImmutableQueryHook<TFnData, TVariables, Error, TVariables | void>

export function createImmutableQuery<
  TFnData,
  TVariables = any,
  Error = unknown
>(
  options: CreateImmutableQueryOptions<TFnData, TVariables, Error> & {
    useDefaultOptions: () => Omit<
      ImmutableQueryHookOptions<TFnData, Error, TFnData, TVariables>,
      'select' | 'variables'
    >
  },
  queryClient?: CompatibleWithV4<QueryClient, void>
): ImmutableQueryHook<TFnData, TVariables, Error, TVariables>

export function createImmutableQuery<
  TFnData,
  TVariables = any,
  Error = unknown
>(
  options: CreateImmutableQueryOptions<TFnData, TVariables, Error>,
  queryClient?: CompatibleWithV4<QueryClient, void>
): ImmutableQueryHook<TFnData, TVariables, Error, TVariables>

export function createImmutableQuery(options: any, queryClient?: any) {
  return createBaseQuery(options, useQuery, queryClient, {
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
