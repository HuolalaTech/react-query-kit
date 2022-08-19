import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { QueryKitKey } from './types'
import { genKeyFn } from './utils'

export interface CreateQueryOptions<TFnData, TVariables, Error>
  extends Omit<
    UseQueryOptions<TFnData, Error, unknown, QueryKitKey<TVariables>>,
    'queryKey' | 'queryFn' | 'select'
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
    ? unknown
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
    > & { variables: any }

    const mergedOptions = {
      ...defaultOptions,
      ...rest,
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
