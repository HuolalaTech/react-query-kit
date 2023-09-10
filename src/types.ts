import type {
  GetNextPageParamFunction,
  GetPreviousPageParamFunction,
  InfiniteData,
  InfiniteQueryObserverSuccessResult,
  MutationFunction,
  MutationKey,
  QueryClient,
  QueryFunction,
  QueryKey,
  QueryKeyHashFunction,
  QueryObserverSuccessResult,
  SetDataOptions,
  Updater,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'

// utils

export type DefaultError = Error

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

export type CompatibleInfiniteQueryPageParamsOptions<
  TQueryFnData = unknown,
  TPageParam = unknown
> = CompatibleWithV4<
  {
    getPreviousPageParam?: GetPreviousPageParamFunction<
      TPageParam,
      TQueryFnData
    >
    getNextPageParam: GetNextPageParamFunction<TPageParam, TQueryFnData>
    initialPageParam: TPageParam
  },
  {
    getPreviousPageParam?: GetPreviousPageParamFunction<TQueryFnData>
    getNextPageParam: GetNextPageParamFunction<TQueryFnData>
  }
>

export type CompatibleUseInfiniteQueryOptions<
  TFnData,
  TVariables,
  TData,
  TError,
  TPageParam
> = CompatibleWithV4<
  UseInfiniteQueryOptions<
    TFnData,
    TError,
    TData,
    TFnData,
    inferQueryKey<TVariables>,
    TPageParam
  >,
  UseInfiniteQueryOptions<
    TFnData,
    TError,
    TData,
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
  variables?: TVariables
}

export type Middleware<
  T extends (...args: any) => any = QueryHook<any, any, any>
> = (hook: T) => (...args: Parameters<T>) => ReturnType<T>

export type AdditionalQueryHookOptions<
  TFnData,
  TVariables,
  TPageParam = never
> = {
  enabled?: inferEnabled<TFnData, TVariables, TPageParam>
  variables?: TVariables
}

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export type ExposeMethods<TFnData, TVariables, TPageParam = never> = {
  getPrimaryKey: () => string
  getKey: <V extends DeepPartial<TVariables> | void = void>(
    variables?: V
  ) => inferQueryKey<V>
  queryFn: CompatibleQueryFunction<
    TFnData,
    inferQueryKey<TVariables>,
    TPageParam
  >
  queryKeyHashFn: QueryKeyHashFunction<inferQueryKey<TVariables>>
  getFetchOptions: (
    variables: TVariables extends void ? TVariables | void : TVariables
  ) => [TPageParam] extends [never]
    ? {
        queryKey: inferQueryKey<TVariables>
        queryFn: CompatibleQueryFunction<
          TFnData,
          inferQueryKey<TVariables>,
          TPageParam
        >
        queryKeyHashFn?: QueryKeyHashFunction<inferQueryKey<TVariables>>
      }
    : {
        queryKey: inferQueryKey<TVariables>
        queryFn: CompatibleQueryFunction<
          TFnData,
          inferQueryKey<TVariables>,
          TPageParam
        >
        queryKeyHashFn?: QueryKeyHashFunction<inferQueryKey<TVariables>>
      } & CompatibleInfiniteQueryPageParamsOptions<TFnData, TPageParam>
}

// query hook

export type QueryHookOptions<TFnData, TError, TData, TVariables> = Omit<
  UseQueryOptions<TFnData, TError, TData, inferQueryKey<TVariables>>,
  'queryKey' | 'queryFn' | 'queryKeyHashFn' | 'enabled'
> &
  AdditionalQueryHookOptions<TFnData, TVariables>

export type QueryHookResult<
  TFnData = unknown,
  TVariables = any,
  TError = DefaultError,
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
  TFnData = unknown,
  TVariables = any,
  TError = DefaultError
> extends ExposeMethods<TFnData, TVariables> {
  <TData = TFnData>(
    options?: QueryHookOptions<TFnData, TError, TData, TVariables>,
    queryClient?: CompatibleWithV4<QueryClient, void>
  ): QueryHookResult<TFnData, TVariables, TError, TData>
}

// immutable query hook

export type ImmutableQueryHookOptions<TFnData, TError, TData, TVariables> =
  Omit<
    UseQueryOptions<TFnData, TError, TData, inferQueryKey<TVariables>>,
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
    Omit<AdditionalQueryHookOptions<TFnData, TVariables>, 'enabled'>

export type ImmutableQueryHookResult<
  TFnData = unknown,
  TVariables = any,
  TError = DefaultError,
  TData = TFnData
> = UseQueryResult<TData, TError> & {
  queryKey: inferQueryKey<TVariables>
  variables: TVariables
  setData: (
    updater: Updater<TFnData | undefined, TFnData>,
    options?: SetDataOptions | undefined
  ) => TFnData | undefined
}

export interface ImmutableQueryHook<TFnData, TVariables, TError = DefaultError>
  extends ExposeMethods<TFnData, TVariables> {
  <TData = TFnData>(
    options?: ImmutableQueryHookOptions<TFnData, TError, TData, TVariables>,
    queryClient?: CompatibleWithV4<QueryClient, void>
  ): ImmutableQueryHookResult<TFnData, TVariables, TError, TData>
}

// suspense query hook

export type SuspenseQueryHookOptions<TFnData, TError, TData, TVariables> = Omit<
  UseQueryOptions<TFnData, TError, TData, inferQueryKey<TVariables>>,
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
  Omit<AdditionalQueryHookOptions<TFnData, TVariables>, 'enabled'>

export type SuspenseQueryHookResult<
  TFnData,
  TVariables,
  TError = DefaultError,
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
  TFnData = unknown,
  TVariables = any,
  TError = DefaultError
> extends ExposeMethods<TFnData, TVariables> {
  <TData = TFnData>(
    options?: SuspenseQueryHookOptions<TFnData, TError, TData, TVariables>,
    queryClient?: CompatibleWithV4<QueryClient, void>
  ): SuspenseQueryHookResult<TFnData, TVariables, TError, TData>
}

// infinite query hook

export type InfiniteQueryHookOptions<
  TFnData,
  TError,
  TData,
  TVariables,
  TPageParam = number
> = Omit<
  CompatibleUseInfiniteQueryOptions<
    TFnData,
    TVariables,
    TData,
    TError,
    TPageParam
  >,
  | 'queryKey'
  | 'queryFn'
  | 'queryKeyHashFn'
  | 'enabled'
  | 'initialPageParam'
  | 'getPreviousPageParam'
  | 'getNextPageParam'
> &
  AdditionalQueryHookOptions<TFnData, TVariables, TPageParam>

export type InfiniteQueryHookResult<
  TFnData,
  TVariables,
  TError = DefaultError,
  TData = CompatibleWithV4<InfiniteData<TFnData>, TFnData>
> = UseInfiniteQueryResult<TData, TError> & {
  queryKey: inferQueryKey<TVariables>
  variables: TVariables
  setData: (
    updater: Updater<
      InfiniteData<TFnData> | undefined,
      InfiniteData<TFnData> | undefined
    >,
    options?: SetDataOptions
  ) => InfiniteData<TFnData> | undefined
}

export interface InfiniteQueryHook<
  TFnData = unknown,
  TVariables = any,
  TError = DefaultError,
  TPageParam = number
> extends ExposeMethods<TFnData, TVariables, TPageParam> {
  <TData = CompatibleWithV4<InfiniteData<TFnData, TPageParam>, TFnData>>(
    options?: InfiniteQueryHookOptions<
      TFnData,
      TError,
      TData,
      TVariables,
      TPageParam
    >,
    queryClient?: CompatibleWithV4<QueryClient, void>
  ): InfiniteQueryHookResult<TFnData, TVariables, TError, TData>
}

// infinite sususpense query hook

export type SuspenseInfiniteQueryHookOptions<
  TFnData,
  TError,
  TData,
  TVariables,
  TPageParam = number
> = Omit<
  CompatibleUseInfiniteQueryOptions<
    TFnData,
    TVariables,
    TData,
    TError,
    TPageParam
  >,
  | 'queryKey'
  | 'queryFn'
  | 'queryKeyHashFn'
  | 'enabled'
  | 'initialPageParam'
  | 'getPreviousPageParam'
  | 'getNextPageParam'
  | 'suspense'
  | 'throwOnError'
  | 'placeholderData'
  | 'keepPreviousData'
  | 'useErrorBoundary'
> &
  Omit<AdditionalQueryHookOptions<TFnData, TVariables, TPageParam>, 'enabled'>

export type SuspenseInfiniteQueryHookResult<
  TFnData,
  TVariables,
  TError = DefaultError,
  TData = CompatibleWithV4<InfiniteData<TFnData>, TFnData>
> = Omit<
  InfiniteQueryObserverSuccessResult<CompatibleWithV4<TData, TFnData>, TError>,
  'isPlaceholderData' | 'isPreviousData'
> & {
  queryKey: inferQueryKey<TVariables>
  variables: TVariables
  setData: (
    updater: Updater<
      InfiniteData<TFnData> | undefined,
      InfiniteData<TFnData> | undefined
    >,
    options?: SetDataOptions
  ) => InfiniteData<TFnData> | undefined
}

export interface SuspenseInfiniteQueryHook<
  TFnData = unknown,
  TVariables = any,
  TError = DefaultError,
  TPageParam = number
> extends ExposeMethods<TFnData, TVariables, TPageParam> {
  <TData = CompatibleWithV4<InfiniteData<TFnData, TPageParam>, TFnData>>(
    options?: SuspenseInfiniteQueryHookOptions<
      TFnData,
      TError,
      TData,
      TVariables,
      TPageParam
    >,
    queryClient?: CompatibleWithV4<QueryClient, void>
  ): SuspenseInfiniteQueryHookResult<TFnData, TVariables, TError, TData>
}

// mutation hook

export type MutationHookOptions<TData, TError, TVariables, TContext> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  'mutationFn' | 'mutationKey'
>

export interface MutationHook<
  TData = unknown,
  TVariables = any,
  TError = unknown
> {
  <TContext>(
    options?: MutationHookOptions<TData, TError, TVariables, TContext>,
    queryClient?: CompatibleWithV4<QueryClient, void>
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
  : T extends SuspenseInfiniteQueryHook<any, infer TVariables, any>
  ? TVariables
  : T extends MutationHook<any, infer TVariables, any>
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
