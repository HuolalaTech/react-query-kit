import type { UseInfiniteQueryOptions } from '@tanstack/react-query'
import { useInfiniteQuery } from '@tanstack/react-query'
import { createBaseQuery } from './createBaseQuery'
import type {
  AdditionalCreateOptions,
  InfiniteQueryHook,
  InfiniteQueryHookOptions,
  QueryKitKey,
} from './types'

interface CreateInfiniteQueryOptions<TFnData, TVariables, Error>
  extends Omit<
      UseInfiniteQueryOptions<
        TFnData,
        Error,
        TFnData,
        TFnData,
        QueryKitKey<TVariables>
      >,
      'queryKey' | 'queryFn' | 'enabled' | 'select'
    >,
    AdditionalCreateOptions<TFnData, TVariables> {}

export function createInfiniteQuery<TFnData, TVariables = any, Error = unknown>(
  options: CreateInfiniteQueryOptions<TFnData, TVariables, Error> & {
    useDefaultOptions: () => Omit<
      InfiniteQueryHookOptions<TFnData, Error, TFnData, TVariables>,
      'select'
    > & { variables: TVariables | void }
  }
): InfiniteQueryHook<TFnData, TVariables, Error, TVariables | void>

export function createInfiniteQuery<TFnData, TVariables = any, Error = unknown>(
  options: CreateInfiniteQueryOptions<TFnData, TVariables, Error> & {
    useDefaultOptions: () => Omit<
      InfiniteQueryHookOptions<TFnData, Error, TFnData, TVariables>,
      'select' | 'variables'
    >
  }
): InfiniteQueryHook<TFnData, TVariables, Error, TVariables>

export function createInfiniteQuery<TFnData, TVariables = any, Error = unknown>(
  options: CreateInfiniteQueryOptions<TFnData, TVariables, Error>
): InfiniteQueryHook<TFnData, TVariables, Error, TVariables>

export function createInfiniteQuery(options: any) {
  return createBaseQuery(options, useInfiniteQuery)
}
