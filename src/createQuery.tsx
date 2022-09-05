import type {
  QueryFunction,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { PartialQueryKitKey, QueryKitKey } from './types'
import { genKeyFn, parseQueryKitArgs, useEnabled } from './utils'

interface CreateQueryOptions<TFnData, TVariables, Error>
  extends Omit<
    UseQueryOptions<TFnData, Error, unknown, QueryKitKey<TVariables>>,
    'queryKey' | 'queryFn' | 'enabled' | 'select'
  > {
  primaryKey: string
  queryFn: QueryFunction<TFnData, QueryKitKey<TVariables>>
  enabled?: boolean | ((data?: TFnData) => boolean)
}

type UseGeneratedQueryOptions<TFnData, Error, TData, TVariables> = Omit<
  UseQueryOptions<TFnData, Error, TData, QueryKitKey<TVariables>>,
  'queryKey' | 'queryFn' | 'enabled'
> & {
  enabled?: boolean | ((data?: TFnData) => boolean)
} & (TVariables extends void
    ? { variables?: TVariables }
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
  getKey: <V extends PartialQueryKitKey<TVariables>>(
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
    const { variables, ...restOptions } = options || {}
    const mergedOptions = {
      ...defaultOptions,
      ...restOptions,
      queryFn,
      queryKey: getKey(variables as PartialQueryKitKey<TVariables>),
    }

    return useQuery({
      ...mergedOptions,
      enabled: useEnabled(mergedOptions),
    } as UseQueryOptions<TFnData, Error, TData, QueryKitKey<TVariables>>)
  }

  useGeneratedQuery.getPrimaryKey = getPrimaryKey
  useGeneratedQuery.getKey = getKey
  useGeneratedQuery.queryFn = queryFn

  return useGeneratedQuery
}
