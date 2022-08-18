import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { QueryKitKey } from './types'
import { genKeyFn, genPartialKeyFn } from './utils'

export interface CreateQueryOptions<TFnData, TVariables, Error>
  extends Omit<
    UseQueryOptions<TFnData, Error, unknown, QueryKitKey<TVariables>>,
    'queryKey' | 'queryFn'
  > {
  primaryKey: string
  queryFn: Required<
    UseQueryOptions<TFnData, Error, unknown, QueryKitKey<TVariables>>
  >['queryFn']
}

type UseGeneratedQueryOptions<TFnData, Error, TData, TVariables> = Omit<
  UseQueryOptions<TFnData, Error, TData, QueryKitKey<TVariables>>,
  'queryKey' | 'queryFn'
> &
  (TVariables extends void
    ? Record<string, never>
    : {
        variables: TVariables
      })

export function createQuery<TFnData, TVariables = void, Error = unknown>({
  primaryKey,
  queryFn,
  ...defaultOptions
}: CreateQueryOptions<TFnData, TVariables, Error>) {
  const getPrimaryKey = () => primaryKey
  const getKey = genKeyFn<TVariables>(primaryKey)
  const getPartialKey = genPartialKeyFn<TVariables>(primaryKey)

  function useGeneratedQuery<TData = TFnData>(
    options: TVariables extends void
      ? UseGeneratedQueryOptions<TFnData, Error, TData, TVariables> | void
      : UseGeneratedQueryOptions<TFnData, Error, TData, TVariables>
  ) {
    const { variables, ...rest } = options as UseGeneratedQueryOptions<
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
    } as UseQueryOptions<TFnData, Error, TData, QueryKitKey<TVariables>>

    return useQuery(mergedOptions)
  }

  useGeneratedQuery.getPrimaryKey = getPrimaryKey
  useGeneratedQuery.getPartialKey = getPartialKey
  useGeneratedQuery.getKey = getKey
  useGeneratedQuery.queryFn = queryFn

  return useGeneratedQuery
}
