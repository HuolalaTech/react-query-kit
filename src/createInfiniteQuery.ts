import type {
  InfiniteData,
  QueryFunction,
  SetDataOptions,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { Updater } from '@tanstack/react-query/build/types/packages/query-core/src/utils'
import { createBaseQuery } from './createBaseQuery'
import type {
  AdditionalCreateOptions,
  AdditionalQueryHookOptions,
  ExposeMethods,
  QueryKitKey,
} from './types'
import { parseQueryKitArgs } from './utils'

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
    >,
    AdditionalCreateOptions<TFnData, TVariables> {}

type InfiniteQueryHookOptions<TFnData, Error, TData, TVariables> = Omit<
  UseInfiniteQueryOptions<
    TFnData,
    Error,
    TData,
    TFnData,
    QueryKitKey<TVariables>
  >,
  'queryKey' | 'queryFn' | 'enabled'
> &
  AdditionalQueryHookOptions<TFnData, TVariables>

export interface InfiniteQueryHook<TFnData, TVariables = void, Error = unknown>
  extends ExposeMethods<TFnData, TVariables> {
  <TData = TFnData>(
    options: TVariables extends void
      ? InfiniteQueryHookOptions<TFnData, Error, TData, TVariables> | void
      : InfiniteQueryHookOptions<TFnData, Error, TData, TVariables>
  ): UseInfiniteQueryResult<TData, Error> & {
    queryKey: QueryKitKey<TVariables>
    setData: (
      updater: Updater<
        InfiniteData<TFnData> | undefined,
        InfiniteData<TFnData> | undefined
      >,
      options?: SetDataOptions
    ) => InfiniteData<TFnData> | undefined
  }
}

export function createInfiniteQuery<
  TFnData,
  TVariables = void,
  Error = unknown
>(
  options: CreateInfiniteQueryOptions<TFnData, TVariables, Error>
): InfiniteQueryHook<TFnData, TVariables, Error>

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
): InfiniteQueryHook<TFnData, TVariables, Error>

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
): InfiniteQueryHook<TFnData, TVariables, Error>

export function createInfiniteQuery<
  TFnData,
  TVariables = void,
  Error = unknown
>(
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
