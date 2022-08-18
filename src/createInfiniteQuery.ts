import type { UseInfiniteQueryOptions } from '@tanstack/react-query'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { QueryKitKey } from './types'
import { genKeyFn, genPartialKeyFn } from './utils'

export interface CreateInfiniteQueryOptions<TFnData, TVariables, Error>
  extends Omit<
    UseInfiniteQueryOptions<
      TFnData,
      Error,
      unknown,
      TFnData,
      QueryKitKey<TVariables>
    >,
    'queryKey' | 'queryFn'
  > {
  primaryKey: string
  queryFn: Required<
    UseInfiniteQueryOptions<
      TFnData,
      Error,
      unknown,
      TFnData,
      QueryKitKey<TVariables>
    >
  >['queryFn']
}

type UseGeneratedInfiniteQueryOptions<TFnData, Error, TData, TVariables> = Omit<
  UseInfiniteQueryOptions<
    TFnData,
    Error,
    TData,
    TFnData,
    QueryKitKey<TVariables>
  >,
  'queryKey' | 'queryFn'
> &
  (TVariables extends void
    ? Record<string, never>
    : {
        variables: TVariables
      })

export function createInfiniteQuery<
  TFnData,
  TVariables = void,
  Error = unknown
>({
  primaryKey,
  queryFn,
  ...defaultOptions
}: CreateInfiniteQueryOptions<TFnData, TVariables, Error>) {
  const getPrimaryKey = () => primaryKey
  const getKey = genKeyFn<TVariables>(primaryKey)
  const getPartialKey = genPartialKeyFn<TVariables>(primaryKey)

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
    const { variables, ...rest } = options as UseGeneratedInfiniteQueryOptions<
      TFnData,
      Error,
      TData,
      unknown
    > & { variables: TVariables }

    const mergedOptions = {
      ...defaultOptions,
      ...rest,
      queryFn,
      queryKey: getKey(variables),
    } as UseInfiniteQueryOptions<
      TFnData,
      Error,
      TData,
      TFnData,
      QueryKitKey<TVariables>
    >

    return useInfiniteQuery(mergedOptions)
  }

  useGeneratedInfiniteQuery.getPrimaryKey = getPrimaryKey
  useGeneratedInfiniteQuery.getPartialKey = getPartialKey
  useGeneratedInfiniteQuery.getKey = getKey
  useGeneratedInfiniteQuery.queryFn = queryFn

  return useGeneratedInfiniteQuery
}
