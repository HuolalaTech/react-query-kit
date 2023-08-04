import type { QueryClient, UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { createBaseQuery } from './createBaseQuery'
import type {
  AdditionalCreateOptions,
  CompatibleWithV4,
  SuspenseQueryHook,
  SuspenseQueryHookOptions,
  inferQueryKey,
} from './types'

export interface CreateSuspenseQueryOptions<
  TFnData,
  TVariables = any,
  Error = unknown
> extends Omit<
      UseQueryOptions<TFnData, Error, TFnData, inferQueryKey<TVariables>>,
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
    AdditionalCreateOptions<TFnData, TVariables> {}

export function createSuspenseQuery<TFnData, TVariables = any, Error = unknown>(
  options: CreateSuspenseQueryOptions<TFnData, TVariables, Error> & {
    useDefaultOptions: () => Omit<
      SuspenseQueryHookOptions<TFnData, Error, TFnData, TVariables>,
      'select'
    > & { variables: TVariables }
  },
  queryClient?: CompatibleWithV4<QueryClient, void>
): SuspenseQueryHook<TFnData, TVariables, Error, TVariables | void>

export function createSuspenseQuery<TFnData, TVariables = any, Error = unknown>(
  options: CreateSuspenseQueryOptions<TFnData, TVariables, Error> & {
    useDefaultOptions: () => Omit<
      SuspenseQueryHookOptions<TFnData, Error, TFnData, TVariables>,
      'select' | 'variables'
    >
  },
  queryClient?: CompatibleWithV4<QueryClient, void>
): SuspenseQueryHook<TFnData, TVariables, Error, TVariables>

export function createSuspenseQuery<TFnData, TVariables = any, Error = unknown>(
  options: CreateSuspenseQueryOptions<TFnData, TVariables, Error>,
  queryClient?: CompatibleWithV4<QueryClient, void>
): SuspenseQueryHook<TFnData, TVariables, Error, TVariables>

export function createSuspenseQuery(options: any, queryClient?: any) {
  return createBaseQuery(options, useQuery, queryClient, {
    enabled: true,
    suspense: true,
    throwOnError: true,
    // compatible with ReactQuery v4
    // @ts-ignore
    useErrorBoundary: true,
  })
}
