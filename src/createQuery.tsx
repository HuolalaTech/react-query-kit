import type {
  QueryFunction,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { QueryKitKey, QueryKitPartialKey } from './types'
import { genKeyFn, parseQueryKitArgs } from './utils'

interface CreateQueryOptions<TFnData, TVariables, Error>
  extends Omit<
    UseQueryOptions<TFnData, Error, unknown, QueryKitKey<TVariables>>,
    'queryKey' | 'queryFn' | 'select'
  > {
  primaryKey: string
  queryFn: QueryFunction<TFnData, QueryKitKey<TVariables>>
}

type UseGeneratedQueryOptions<TFnData, Error, TData, TVariables> = Omit<
  UseQueryOptions<TFnData, Error, TData, QueryKitKey<TVariables>>,
  'queryKey' | 'queryFn'
> &
  (TVariables extends void
    ? unknown
    : {
        variables: TVariables
      })

interface CreateQueryResult<TFnData, TVariables = void, Error = unknown> {
  <TData = TFnData>(
    options: TVariables extends void
      ? UseGeneratedQueryOptions<TFnData, Error, TData, TVariables> | void
      : UseGeneratedQueryOptions<TFnData, Error, TData, TVariables>
  ): UseQueryResult<TData, Error>
  getPrimaryKey: () => string
  getKey: <V extends QueryKitPartialKey<TVariables>>(
    variables?: V | undefined
  ) => QueryKitKey<V>
  queryFn: QueryFunction<TFnData, QueryKitKey<TVariables>>
}

export function createQuery<TFnData, TVariables = void, Error = unknown>(
  options: CreateQueryOptions<TFnData, TVariables, Error>
): CreateQueryResult<TFnData, TVariables, Error>

export function createQuery<TFnData, TVariables = void, Error = unknown>(
  primaryKey: string,
  options?: Omit<CreateQueryOptions<TFnData, TVariables, Error>, 'primaryKey'>
): CreateQueryResult<TFnData, TVariables, Error>

export function createQuery<TFnData, TVariables = void, Error = unknown>(
  primaryKey: string,
  queryFn: QueryFunction<TFnData, QueryKitKey<TVariables>>,
  options?: Omit<
    CreateQueryOptions<TFnData, TVariables, Error>,
    'primaryKey' | 'queryFn'
  >
): CreateQueryResult<TFnData, TVariables, Error>

export function createQuery<TFnData, TVariables = void, Error = unknown>(
  arg1: any,
  arg2?: any,
  arg3?: any
): CreateQueryResult<TFnData, TVariables, Error> {
  const { primaryKey, queryFn, ...defaultOptions } = parseQueryKitArgs<
    CreateQueryOptions<TFnData, TVariables, Error>
  >(arg1, arg2, arg3)
  const getPrimaryKey = () => primaryKey
  const getKey = genKeyFn<TVariables>(primaryKey)

  function useGeneratedQuery<TData = TFnData>(
    options: TVariables extends void
      ? UseGeneratedQueryOptions<TFnData, Error, TData, TVariables> | void
      : UseGeneratedQueryOptions<TFnData, Error, TData, TVariables>
  ) {
    const { variables, ...restOptions } = options as UseGeneratedQueryOptions<
      TFnData,
      Error,
      TData,
      unknown
    > & { variables: any }

    const mergedOptions = {
      ...defaultOptions,
      ...restOptions,
      queryFn,
      queryKey: getKey(variables),
    } as UseQueryOptions<TFnData, Error, TData, QueryKitKey<TVariables>>

    return useQuery(mergedOptions)
  }

  useGeneratedQuery.getPrimaryKey = getPrimaryKey
  useGeneratedQuery.getKey = getKey
  useGeneratedQuery.queryFn = queryFn

  return useGeneratedQuery
}
