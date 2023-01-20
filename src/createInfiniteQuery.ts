import type {
  QueryFunction,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query'
import { useInfiniteQuery } from '@tanstack/react-query'
import { createBaseQuery } from './createBaseQuery'
import type {
  AdditionalCreateOptions,
  InfiniteQueryHook,
  QueryKitKey,
} from './types'
import { parseQueryKitArgs } from './utils'

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
  options: CreateInfiniteQueryOptions<TFnData, TVariables, Error>
): InfiniteQueryHook<TFnData, TVariables, Error>

export function createInfiniteQuery<TFnData, TVariables = any, Error = unknown>(
  primaryKey: string,
  options?: Omit<
    CreateInfiniteQueryOptions<TFnData, TVariables, Error>,
    'primaryKey'
  >
): InfiniteQueryHook<TFnData, TVariables, Error>

export function createInfiniteQuery<TFnData, TVariables = any, Error = unknown>(
  primaryKey: string,
  queryFn: QueryFunction<TFnData, QueryKitKey<TVariables>>,
  options?: Omit<
    CreateInfiniteQueryOptions<TFnData, TVariables, Error>,
    'primaryKey' | 'queryFn'
  >
): InfiniteQueryHook<TFnData, TVariables, Error>

export function createInfiniteQuery<TFnData, TVariables = any, Error = unknown>(
  arg1: any,
  arg2?: any,
  arg3?: any
): InfiniteQueryHook<TFnData, TVariables, Error> {
  const options = parseQueryKitArgs(arg1, arg2, arg3)
  return createBaseQuery(options, useInfiniteQuery) as InfiniteQueryHook<
    TFnData,
    TVariables,
    Error
  >
}
