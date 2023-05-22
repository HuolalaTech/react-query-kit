import type { QueryClient, UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { createBaseQuery } from './createBaseQuery'
import type {
  AdditionalCreateOptions,
  CompatibleWithV4,
  QueryHook,
  QueryHookOptions,
  inferQueryKey,
} from './types'

export interface CreateQueryOptions<TFnData, TVariables = any, Error = unknown>
  extends Omit<
      UseQueryOptions<TFnData, Error, TFnData, inferQueryKey<TVariables>>,
      'queryKey' | 'queryFn' | 'enabled' | 'select'
    >,
    AdditionalCreateOptions<TFnData, TVariables> {}

export function createQuery<TFnData, TVariables = any, Error = unknown>(
  options: CreateQueryOptions<TFnData, TVariables, Error> & {
    useDefaultOptions: () => Omit<
      QueryHookOptions<TFnData, Error, TFnData, TVariables>,
      'select'
    > & { variables: TVariables }
  },
  queryClient?: CompatibleWithV4<QueryClient, void>
): QueryHook<TFnData, TVariables, Error, TVariables | void>

export function createQuery<TFnData, TVariables = any, Error = unknown>(
  options: CreateQueryOptions<TFnData, TVariables, Error> & {
    useDefaultOptions: () => Omit<
      QueryHookOptions<TFnData, Error, TFnData, TVariables>,
      'select' | 'variables'
    >
  },
  queryClient?: CompatibleWithV4<QueryClient, void>
): QueryHook<TFnData, TVariables, Error, TVariables>

export function createQuery<TFnData, TVariables = any, Error = unknown>(
  options: CreateQueryOptions<TFnData, TVariables, Error>,
  queryClient?: CompatibleWithV4<QueryClient, void>
): QueryHook<TFnData, TVariables, Error, TVariables>

export function createQuery(options: any, queryClient?: any) {
  return createBaseQuery(options, useQuery, queryClient)
}
