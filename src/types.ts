import type {
  InfiniteData,
  MutationFunction,
  MutationKey,
  QueryFunction,
  QueryKey,
  QueryKeyHashFunction,
  SetDataOptions,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'

export declare type DataUpdateFunction<TInput, TOutput> = (
  input: TInput
) => TOutput

export declare type Updater<TInput, TOutput> =
  | TOutput
  | DataUpdateFunction<TInput, TOutput>

export type CompatibleWithV4<V5, V4> =
  InfiniteData<unknown> extends UseInfiniteQueryResult<
    InfiniteData<unknown>
  >['data']
    ? V5
    : V4

export type CompatibleQueryFunction<
  T = unknown,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown
> = CompatibleWithV4<
  QueryFunction<T, TQueryKey, TPageParam>,
  QueryFunction<T, TQueryKey>
>

export type CompatibleUseInfiniteQueryOptions<
  TFnData,
  TVariables,
  Error,
  TPageParam
> = CompatibleWithV4<
  UseInfiniteQueryOptions<
    TFnData,
    Error,
    InfiniteData<TFnData>,
    TFnData,
    inferQueryKey<TVariables>,
    TPageParam
  >,
  UseInfiniteQueryOptions<
    TFnData,
    Error,
    TFnData,
    TFnData,
    inferQueryKey<TVariables>
  >
>

export type inferQueryKey<TVariables> = TVariables extends void
  ? [string]
  : [string, TVariables]

type inferEnabled<TFnData, TVariables, TPageParam = never> =
  | boolean
  | ([TPageParam] extends [never]
      ? (data: TFnData | undefined, variables: TVariables) => boolean
      : (
          data: InfiniteData<TFnData> | undefined,
          variables: TVariables
        ) => boolean)

export type AdditionalCreateOptions<TFnData, TVariables, TPageParam = never> = {
  primaryKey: string
  queryFn: CompatibleQueryFunction<
    TFnData,
    inferQueryKey<TVariables>,
    TPageParam
  >
  enabled?: inferEnabled<TFnData, TVariables, TPageParam>
}

export type AdditionalQueryHookOptions<
  TFnData,
  TVariables,
  TPageParam = never,
  TOptVariables = TVariables
> = {
  enabled?: inferEnabled<TFnData, TVariables, TPageParam>
} & (TOptVariables extends void
  ? {
      variables?: TVariables
    }
  : {
      variables: TVariables
    })

type inferPartialQueryKey<TVariables> = TVariables extends Record<any, any>
  ?
      | {
          [P in keyof TVariables]?: TVariables[P]
        }
      | void
  : TVariables | void

export type ExposeMethods<TFnData, TVariables, TPageParam = never> = {
  getPrimaryKey: () => string
  getKey: <V extends inferPartialQueryKey<TVariables> | void = void>(
    variables?: V
  ) => inferQueryKey<V>
  queryFn: CompatibleQueryFunction<
    TFnData,
    inferQueryKey<TVariables>,
    TPageParam
  >
  queryKeyHashFn: QueryKeyHashFunction<inferQueryKey<TVariables>>
}

export type QueryHookOptions<
  TFnData,
  Error,
  TData,
  TVariables,
  TOptVariables = TVariables
> = Omit<
  UseQueryOptions<TFnData, Error, TData, inferQueryKey<TVariables>>,
  'queryKey' | 'queryFn' | 'queryKeyHashFn' | 'enabled'
> &
  AdditionalQueryHookOptions<TFnData, TVariables, TOptVariables>

export type QueryHookResult<
  TFnData,
  TVariables,
  TError = unknown,
  TData = TFnData
> = UseQueryResult<TData, TError> & {
  queryKey: inferQueryKey<TVariables>
  variables: TVariables
  setData: (
    updater: Updater<TFnData | undefined, TFnData>,
    options?: SetDataOptions | undefined
  ) => TFnData | undefined
}

export interface QueryHook<
  TFnData,
  TVariables,
  TError = unknown,
  TOptVariables = TVariables
> extends ExposeMethods<TFnData, TVariables> {
  <TData = TFnData>(
    options: TOptVariables extends void
      ? QueryHookOptions<
          TFnData,
          TError,
          TData,
          TVariables,
          TOptVariables
        > | void
      : QueryHookOptions<TFnData, TError, TData, TVariables, TOptVariables>
  ): QueryHookResult<TFnData, TVariables, TError, TData>
}

export type InfiniteQueryHookOptions<
  TFnData,
  Error,
  TVariables,
  TPageParam = number,
  TOptVariables = TVariables
> = Omit<
  CompatibleUseInfiniteQueryOptions<TFnData, TVariables, Error, TPageParam>,
  | 'queryKey'
  | 'queryFn'
  | 'queryKeyHashFn'
  | 'enabled'
  | 'defaultPageParam'
  | 'getPreviousPageParam'
  | 'getNextPageParam'
> &
  AdditionalQueryHookOptions<TFnData, TVariables, TPageParam, TOptVariables>

export type InfiniteQueryHookResult<
  TFnData,
  TVariables,
  TError = unknown,
  TData = InfiniteData<TFnData>
> = UseInfiniteQueryResult<CompatibleWithV4<TData, TFnData>, TError> & {
  queryKey: inferQueryKey<TVariables>
  variables: TVariables
  setData: (
    updater: Updater<TData | undefined, TData | undefined>,
    options?: SetDataOptions
  ) => TData | undefined
}

export interface InfiniteQueryHook<
  TFnData,
  TVariables,
  TError = unknown,
  TPageParam = number,
  TOptVariables = TVariables
> extends ExposeMethods<TFnData, TVariables, TPageParam> {
  <TData = InfiniteData<TFnData>>(
    options: TOptVariables extends void
      ? InfiniteQueryHookOptions<
          TFnData,
          TError,
          TVariables,
          TPageParam,
          TOptVariables
        > | void
      : InfiniteQueryHookOptions<
          TFnData,
          TError,
          TVariables,
          TPageParam,
          TOptVariables
        >
  ): InfiniteQueryHookResult<TFnData, TVariables, TError, TData>
}

export type MutationHookOptions<TData, TError, TVariables, TContext> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  'mutationFn' | 'mutationKey'
>

export interface MutationHook<TData, TError, TVariables> {
  <TContext>(
    options?: MutationHookOptions<TData, TError, TVariables, TContext>
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

export type inferFnData<T> = T extends QueryHook<infer TData, any, any>
  ? TData
  : T extends InfiniteQueryHook<infer TData, any, any>
  ? TData
  : T extends MutationHook<infer TData, any, any>
  ? TData
  : never
