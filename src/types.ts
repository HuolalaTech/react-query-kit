import type {
  InfiniteData,
  MutationFunction,
  MutationKey,
  QueryFunction,
  QueryKeyHashFunction,
  SetDataOptions,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import type { Updater } from '@tanstack/react-query/build/types/packages/query-core/src/utils'

export type QueryKitKey<TVariables> = TVariables extends void
  ? [string]
  : [string, TVariables]

export type AdditionalCreateOptions<TFnData, TVariables> = {
  primaryKey: string
  queryFn: QueryFunction<TFnData, QueryKitKey<TVariables>>
  enabled?:
    | boolean
    | ((data: TFnData | undefined, variables: TVariables) => boolean)
}

export type AdditionalQueryHookOptions<TFnData, TVariables> = {
  enabled?:
    | boolean
    | ((data: TFnData | undefined, variables: TVariables) => boolean)
} & (TVariables extends void
  ? {
      variables?: TVariables
    }
  : {
      variables: TVariables
    })

type PartialQueryKitKey<TVariables> = TVariables extends Record<any, any>
  ?
      | {
          [P in keyof TVariables]?: TVariables[P]
        }
      | void
  : TVariables | void

export type ExposeMethods<TFnData, TVariables> = {
  getPrimaryKey: () => string
  getKey: <V extends PartialQueryKitKey<TVariables> | void = void>(
    variables?: V
  ) => QueryKitKey<V>
  queryFn: QueryFunction<TFnData, QueryKitKey<TVariables>>
  queryKeyHashFn: QueryKeyHashFunction<QueryKitKey<TVariables>>
}

type QueryHookOptions<TFnData, Error, TData, TVariables> = Omit<
  UseQueryOptions<TFnData, Error, TData, QueryKitKey<TVariables>>,
  'queryKey' | 'queryFn' | 'queryKeyHashFn' | 'enabled'
> &
  AdditionalQueryHookOptions<TFnData, TVariables>

export interface QueryHook<TFnData, TVariables, Error>
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

type InfiniteQueryHookOptions<TFnData, Error, TData, TVariables> = Omit<
  UseInfiniteQueryOptions<
    TFnData,
    Error,
    TData,
    TFnData,
    QueryKitKey<TVariables>
  >,
  'queryKey' | 'queryFn' | 'queryKeyHashFn' | 'enabled'
> &
  AdditionalQueryHookOptions<TFnData, TVariables>

export interface InfiniteQueryHook<TFnData, TVariables, Error = unknown>
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

export interface MutationHook<TData, TError, TVariables> {
  <TContext>(
    options?: Omit<
      UseMutationOptions<TData, TError, TVariables, TContext>,
      'mutationFn' | 'mutationKey'
    >
  ): UseMutationResult<TData, TError, TVariables, TContext>
  getKey: () => MutationKey | undefined
  mutationFn: MutationFunction<TData, TVariables>
}

export type inferVariables<T> = T extends QueryHook<any, infer TVariables, any>
  ? TVariables
  : T extends InfiniteQueryHook<any, infer TVariables, any>
  ? TVariables
  : T extends MutationHook<any, any, infer TVariables>
  ? TVariables
  : never

export type inferData<T> = T extends QueryHook<infer TData, any, any>
  ? TData
  : T extends InfiniteQueryHook<infer TData, any, any>
  ? InfiniteData<TData>
  : T extends MutationHook<infer TData, any, any>
  ? TData
  : never
