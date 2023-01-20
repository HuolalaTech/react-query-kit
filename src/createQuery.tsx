import type { QueryFunction, UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { createBaseQuery } from './createBaseQuery'
import type { AdditionalCreateOptions, QueryHook, QueryKitKey } from './types'
import { parseQueryKitArgs } from './utils'

interface CreateQueryOptions<TFnData, TVariables, Error>
  extends Omit<
      UseQueryOptions<TFnData, Error, TFnData, QueryKitKey<TVariables>>,
      'queryKey' | 'queryFn' | 'enabled' | 'select'
    >,
    AdditionalCreateOptions<TFnData, TVariables> {}

export function createQuery<TFnData, TVariables = any, Error = unknown>(
  options: CreateQueryOptions<TFnData, TVariables, Error>
): QueryHook<TFnData, TVariables, Error>

export function createQuery<TFnData, TVariables = any, Error = unknown>(
  primaryKey: string,
  options?: Omit<CreateQueryOptions<TFnData, TVariables, Error>, 'primaryKey'>
): QueryHook<TFnData, TVariables, Error>

export function createQuery<TFnData, TVariables = any, Error = unknown>(
  primaryKey: string,
  queryFn: QueryFunction<TFnData, QueryKitKey<TVariables>>,
  options?: Omit<
    CreateQueryOptions<TFnData, TVariables, Error>,
    'primaryKey' | 'queryFn'
  >
): QueryHook<TFnData, TVariables, Error>

export function createQuery<TFnData, TVariables = any, Error = unknown>(
  arg1: any,
  arg2?: any,
  arg3?: any
): QueryHook<TFnData, TVariables, Error> {
  const options = parseQueryKitArgs(arg1, arg2, arg3)
  return createBaseQuery(options, useQuery) as QueryHook<
    TFnData,
    TVariables,
    Error
  >
}
