import type {
  QueryFunction,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { PartialQueryKitKey, QueryKitKey } from './types'
import { genKeyFn, parseQueryKitArgs, useEnabled } from './utils'

interface CreateInfiniteQueryOptions<TFnData, TVariables, Error>
  extends Omit<
    UseInfiniteQueryOptions<
      TFnData,
      Error,
      unknown,
      TFnData,
      QueryKitKey<TVariables>
    >,
    'queryKey' | 'queryFn' | 'enabled' | 'select'
  > {
  primaryKey: string
  queryFn: QueryFunction<TFnData, QueryKitKey<TVariables>>
  enabled?: boolean | ((data?: TFnData) => boolean)
}

type UseGeneratedInfiniteQueryOptions<TFnData, Error, TData, TVariables> = Omit<
  UseInfiniteQueryOptions<
    TFnData,
    Error,
    TData,
    TFnData,
    QueryKitKey<TVariables>
  >,
  'queryKey' | 'queryFn' | 'enabled'
> & {
  enabled?: boolean | ((data?: TFnData) => boolean)
} & (TVariables extends void
    ? {
        variables?: TVariables
      }
    : {
        variables: TVariables
      })

interface CreateInfiniteQueryResult<
  TFnData,
  TVariables = void,
  Error = unknown
> {
  <TData = TFnData>(
    options: TVariables extends void
      ? UseGeneratedInfiniteQueryOptions<
          TFnData,
          Error,
          TData,
          TVariables
        > | void
      : UseGeneratedInfiniteQueryOptions<TFnData, Error, TData, TVariables>
  ): UseInfiniteQueryResult<TData, Error>
  getPrimaryKey: () => string
  getKey: <V extends PartialQueryKitKey<TVariables> | void = void>(
    variables?: V
  ) => QueryKitKey<V>
  queryFn: QueryFunction<TFnData, QueryKitKey<TVariables>>
}

export function createInfiniteQuery<
  TFnData,
  TVariables = void,
  Error = unknown
>(
  options: CreateInfiniteQueryOptions<TFnData, TVariables, Error>
): CreateInfiniteQueryResult<TFnData, TVariables, Error>

export function createInfiniteQuery<
  TFnData,
  TVariables = void,
  Error = unknown
>(
  primaryKey: string,
  options?: Omit<
    CreateInfiniteQueryOptions<TFnData, TVariables, Error>,
    'primaryKey'
  >
): CreateInfiniteQueryResult<TFnData, TVariables, Error>

export function createInfiniteQuery<
  TFnData,
  TVariables = void,
  Error = unknown
>(
  primaryKey: string,
  queryFn: QueryFunction<TFnData, QueryKitKey<TVariables>>,
  options?: Omit<
    CreateInfiniteQueryOptions<TFnData, TVariables, Error>,
    'primaryKey' | 'queryFn'
  >
): CreateInfiniteQueryResult<TFnData, TVariables, Error>

export function createInfiniteQuery<
  TFnData,
  TVariables = void,
  Error = unknown
>(
  arg1: any,
  arg2?: any,
  arg3?: any
): CreateInfiniteQueryResult<TFnData, TVariables, Error> {
  const { primaryKey, queryFn, ...defaultOptions } = parseQueryKitArgs<
    CreateInfiniteQueryOptions<TFnData, TVariables, Error>
  >(arg1, arg2, arg3)
  const getPrimaryKey = () => primaryKey
  const getKey = genKeyFn<TVariables>(primaryKey)

  function useGeneratedInfiniteQuery<TData = TFnData>(
    options: TVariables extends void
      ? UseGeneratedInfiniteQueryOptions<
          TFnData,
          Error,
          TData,
          TVariables
        > | void
      : UseGeneratedInfiniteQueryOptions<TFnData, Error, TData, TVariables>
  ) {
    const { variables, ...restOptions } = options || {}
    const mergedOptions = {
      ...defaultOptions,
      ...restOptions,
      queryFn,
      queryKey: getKey(variables as PartialQueryKitKey<TVariables>),
    }

    return useInfiniteQuery({
      ...mergedOptions,
      enabled: useEnabled(mergedOptions),
    } as UseInfiniteQueryOptions<TFnData, Error, TData, TFnData, QueryKitKey<TVariables>>)
  }

  useGeneratedInfiniteQuery.getPrimaryKey = getPrimaryKey
  useGeneratedInfiniteQuery.getKey = getKey
  useGeneratedInfiniteQuery.queryFn = queryFn

  return useGeneratedInfiniteQuery
}
