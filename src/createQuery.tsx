import type {
  QueryFunction,
  SetDataOptions,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { Updater } from '@tanstack/react-query/build/types/packages/query-core/src/utils'
import { createBaseQuery } from './createBaseQuery'
import type {
  AdditionalCreateOptions,
  AdditionalQueryHookOptions,
  ExposeMethods,
  QueryKitKey,
} from './types'
import { parseQueryKitArgs } from './utils'

interface CreateQueryOptions<TFnData, TVariables, Error>
  extends Omit<
      UseQueryOptions<TFnData, Error, unknown, QueryKitKey<TVariables>>,
      'queryKey' | 'queryFn' | 'enabled' | 'select'
    >,
    AdditionalCreateOptions<TFnData, TVariables> {}

type QueryHookOptions<TFnData, Error, TData, TVariables> = Omit<
  UseQueryOptions<TFnData, Error, TData, QueryKitKey<TVariables>>,
  'queryKey' | 'queryFn' | 'enabled'
> &
  AdditionalQueryHookOptions<TFnData, TVariables>

interface QueryHook<TFnData, TVariables = void, Error = unknown>
  extends ExposeMethods<TFnData, TVariables> {
  <TData = TFnData>(
    options: TVariables extends void
      ? QueryHookOptions<TFnData, Error, TData, TVariables> | void
      : QueryHookOptions<TFnData, Error, TData, TVariables>
  ): UseQueryResult<TData, Error> & {
    queryKey: QueryKitKey<TVariables>
    setData: (
      updater: Updater<TFnData | undefined, TFnData>,
      options?: SetDataOptions | undefined
    ) => TFnData | undefined
  }
}

export function createQuery<TFnData, TVariables = void, Error = unknown>(
  options: CreateQueryOptions<TFnData, TVariables, Error>
): QueryHook<TFnData, TVariables, Error>

export function createQuery<TFnData, TVariables = void, Error = unknown>(
  primaryKey: string,
  options?: Omit<CreateQueryOptions<TFnData, TVariables, Error>, 'primaryKey'>
): QueryHook<TFnData, TVariables, Error>

export function createQuery<TFnData, TVariables = void, Error = unknown>(
  primaryKey: string,
  queryFn: QueryFunction<TFnData, QueryKitKey<TVariables>>,
  options?: Omit<
    CreateQueryOptions<TFnData, TVariables, Error>,
    'primaryKey' | 'queryFn'
  >
): QueryHook<TFnData, TVariables, Error>

export function createQuery<TFnData, TVariables = void, Error = unknown>(
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
