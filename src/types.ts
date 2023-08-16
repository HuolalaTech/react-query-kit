import type {
  InfiniteData,
  InfiniteQueryObserverSuccessResult,
  MutationFunction,
  MutationKey,
  QueryFunction,
  QueryKey,
  QueryKeyHashFunction,
  QueryObserverSuccessResult,
  SetDataOptions,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'

// utils

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

// query hook

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

// immutable query hook

export type ImmutableQueryHookOptions<
  TFnData,
  Error,
  TData,
  TVariables,
  TOptVariables = TVariables
> = Omit<
  UseQueryOptions<TFnData, Error, TData, inferQueryKey<TVariables>>,
  | 'queryKey'
  | 'queryFn'
  | 'queryKeyHashFn'
  | 'enabled'
  | 'refetchInterval'
  | 'refetchIntervalInBackground'
  | 'refetchOnMount'
  | 'refetchOnReconnect'
  | 'refetchOnWindowFocus'
  | 'staleTime'
  | 'gcTime'
  | 'cacheTime'
> &
  Omit<
    AdditionalQueryHookOptions<TFnData, TVariables, TOptVariables>,
    'enabled'
  >

export type ImmutableQueryHookResult<
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

export interface ImmutableQueryHook<
  TFnData,
  TVariables,
  TError = unknown,
  TOptVariables = TVariables
> extends ExposeMethods<TFnData, TVariables> {
  <TData = TFnData>(
    options: TOptVariables extends void
      ? ImmutableQueryHookOptions<
          TFnData,
          TError,
          TData,
          TVariables,
          TOptVariables
        > | void
      : ImmutableQueryHookOptions<
          TFnData,
          TError,
          TData,
          TVariables,
          TOptVariables
        >
  ): ImmutableQueryHookResult<TFnData, TVariables, TError, TData>
}

// suspense query hook

export type SuspenseQueryHookOptions<
  TFnData,
  Error,
  TData,
  TVariables,
  TOptVariables = TVariables
> = Omit<
  UseQueryOptions<TFnData, Error, TData, inferQueryKey<TVariables>>,
  | 'queryKey'
  | 'queryFn'
  | 'queryKeyHashFn'
  | 'enabled'
  | 'suspense'
  | 'throwOnError'
  | 'placeholderData'
  | 'keepPreviousData'
  | 'useErrorBoundary'
> &
  Omit<
    AdditionalQueryHookOptions<TFnData, TVariables, TOptVariables>,
    'enabled'
  >

export type SuspenseQueryHookResult<
  TFnData,
  TVariables,
  TError = unknown,
  TData = TFnData
> = Omit<
  QueryObserverSuccessResult<TData, TError>,
  'isPlaceholderData' | 'isPreviousData'
> & {
  queryKey: inferQueryKey<TVariables>
  variables: TVariables
  setData: (
    updater: Updater<TFnData | undefined, TFnData>,
    options?: SetDataOptions | undefined
  ) => TFnData | undefined
}

export interface SuspenseQueryHook<
  TFnData,
  TVariables,
  TError = unknown,
  TOptVariables = TVariables
> extends ExposeMethods<TFnData, TVariables> {
  <TData = TFnData>(
    options: TOptVariables extends void
      ? SuspenseQueryHookOptions<
          TFnData,
          TError,
          TData,
          TVariables,
          TOptVariables
        > | void
      : SuspenseQueryHookOptions<
          TFnData,
          TError,
          TData,
          TVariables,
          TOptVariables
        >
  ): SuspenseQueryHookResult<TFnData, TVariables, TError, TData>
}

// infinite query hook

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
  <
    TData = CompatibleWithV4<
      InfiniteData<TFnData, TPageParam>,
      InfiniteData<TFnData>
    >
  >(
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

// infinite sususpense query hook

export type SuspenseInfiniteQueryHookOptions<
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
  | 'suspense'
  | 'throwOnError'
  | 'placeholderData'
  | 'keepPreviousData'
  | 'useErrorBoundary'
> &
  Omit<
    AdditionalQueryHookOptions<TFnData, TVariables, TPageParam, TOptVariables>,
    'enabled'
  >

export type SuspenseInfiniteQueryHookResult<
  TFnData,
  TVariables,
  TError = unknown,
  TData = InfiniteData<TFnData>
> = Omit<
  InfiniteQueryObserverSuccessResult<CompatibleWithV4<TData, TFnData>, TError>,
  'isPlaceholderData' | 'isPreviousData'
> & {
  queryKey: inferQueryKey<TVariables>
  variables: TVariables
  setData: (
    updater: Updater<TData | undefined, TData | undefined>,
    options?: SetDataOptions
  ) => TData | undefined
}

export interface SuspenseInfiniteQueryHook<
  TFnData,
  TVariables,
  TError = unknown,
  TPageParam = number,
  TOptVariables = TVariables
> extends ExposeMethods<TFnData, TVariables, TPageParam> {
  <
    TData = CompatibleWithV4<
      InfiniteData<TFnData, TPageParam>,
      InfiniteData<TFnData>
    >
  >(
    options: TOptVariables extends void
      ? SuspenseInfiniteQueryHookOptions<
          TFnData,
          TError,
          TVariables,
          TPageParam,
          TOptVariables
        > | void
      : SuspenseInfiniteQueryHookOptions<
          TFnData,
          TError,
          TVariables,
          TPageParam,
          TOptVariables
        >
  ): SuspenseInfiniteQueryHookResult<TFnData, TVariables, TError, TData>
}

// mutation hook

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

// infer types

export type inferVariables<T> = T extends QueryHook<any, infer TVariables, any>
  ? TVariables
  : T extends SuspenseQueryHook<any, infer TVariables, any>
  ? TVariables
  : T extends ImmutableQueryHook<any, infer TVariables, any>
  ? TVariables
  : T extends InfiniteQueryHook<any, infer TVariables, any>
  ? TVariables
  : T extends SuspenseQueryHook<any, infer TVariables, any>
  ? TVariables
  : T extends MutationHook<any, any, infer TVariables>
  ? TVariables
  : never

export type inferData<T> = T extends QueryHook<infer TData, any, any>
  ? TData
  : T extends SuspenseQueryHook<infer TData, any, any>
  ? TData
  : T extends ImmutableQueryHook<infer TData, any, any>
  ? TData
  : T extends InfiniteQueryHook<infer TData, any, any, infer TPageParam>
  ? CompatibleWithV4<InfiniteData<TData, TPageParam>, InfiniteData<TData>>
  : T extends SuspenseInfiniteQueryHook<infer TData, any, any, infer TPageParam>
  ? CompatibleWithV4<InfiniteData<TData, TPageParam>, InfiniteData<TData>>
  : T extends MutationHook<infer TData, any, any>
  ? TData
  : never

export type inferFnData<T> = T extends QueryHook<infer TData, any, any>
  ? TData
  : T extends SuspenseQueryHook<infer TData, any, any>
  ? TData
  : T extends ImmutableQueryHook<infer TData, any, any>
  ? TData
  : T extends InfiniteQueryHook<infer TData, any, any>
  ? TData
  : T extends SuspenseInfiniteQueryHook<infer TData, any, any>
  ? TData
  : T extends MutationHook<infer TData, any, any>
  ? TData
  : never
