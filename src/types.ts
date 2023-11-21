import type {
  DataTag,
  DefaultError,
  DefinedUseInfiniteQueryResult,
  DefinedUseQueryResult,
  InfiniteData,
  InfiniteQueryObserverSuccessResult,
  MutationFunction,
  MutationKey,
  QueryClient,
  QueryFunction,
  QueryFunctionContext,
  QueryKey,
  QueryKeyHashFunction,
  QueryObserverSuccessResult,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'

// utils

type CompatibleWithV4<V5, V4> =
  InfiniteData<unknown> extends UseInfiniteQueryResult<
    InfiniteData<unknown>
  >['data']
    ? V5
    : V4

type CompatibleUseInfiniteQueryOptions<TFnData, TData, TError, TPageParam> =
  CompatibleWithV4<
    UseInfiniteQueryOptions<
      TFnData,
      TError,
      TData,
      TFnData,
      QueryKey,
      TPageParam
    >,
    UseInfiniteQueryOptions<TFnData, TError, TData, TFnData, QueryKey>
  >

type CompatibleInfiniteData<TFnData, TPageParam> = CompatibleWithV4<
  InfiniteData<TFnData, TPageParam>,
  InfiniteData<TFnData>
>

type NonUndefinedGuard<T> = T extends undefined ? never : T

type WithRequired<T, K extends keyof T> = T & {
  [_ in K]: {}
}

export type CompatibleError = CompatibleWithV4<DefaultError, Error>

export type AdditionalQueryOptions<TFnData, TVariables, TPageParam = never> = {
  fetcher: (
    variables: TVariables,
    context: QueryFunctionContext<QueryKey, TPageParam>
  ) => TFnData | Promise<TFnData>
  variables?: TVariables
}

type inferMiddlewareHook<T extends (...args: any) => any> = (
  options: inferCreateOptions<T>,
  queryClient?: CompatibleWithV4<QueryClient, void>
) => ReturnType<T>

export type Middleware<
  T extends (...args: any) => any = QueryHook<any, any, any>
> = (hook: inferMiddlewareHook<T>) => inferMiddlewareHook<T>

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export type ExposeMethods<TFnData, TVariables, TError, TPageParam = never> = {
  fetcher: (
    variables: TVariables,
    context?: Partial<QueryFunctionContext<QueryKey, TPageParam>>
  ) => TFnData | Promise<TFnData>
  getKey: <V extends DeepPartial<TVariables> | void = void>(
    variables?: V
  ) => CompatibleWithV4<
    DataTag<
      QueryKey,
      [TPageParam] extends [never] ? TFnData : InfiniteData<TFnData, TPageParam>
    >,
    QueryKey
  >
  getFetchOptions: (
    variables: TVariables extends void ? TVariables | void : TVariables
  ) => Pick<
    ReturnType<
      ExposeMethods<TFnData, TVariables, TError, TPageParam>['getOptions']
    >,
    // @ts-ignore
    [TPageParam] extends [never]
      ? 'queryKey' | 'queryFn' | 'queryKeyHashFn'
      :
          | 'queryKey'
          | 'queryFn'
          | 'queryKeyHashFn'
          | 'getNextPageParam'
          | 'getPreviousPageParam'
          | 'initialPageParam'
  >
  getOptions: (
    variables: TVariables extends void ? TVariables | void : TVariables
  ) => [TPageParam] extends [never]
    ? CompatibleWithV4<
        UseQueryOptions<TFnData, TError, TFnData, QueryKey> & {
          queryKey: DataTag<QueryKey, TFnData>
        },
        // Not work to infer TError in v4
        {
          queryKey: QueryKey
          queryFn: QueryFunction<TFnData, QueryKey>
          queryKeyHashFn?: QueryKeyHashFunction<QueryKey>
        }
      >
    : CompatibleUseInfiniteQueryOptions<
        TFnData,
        TFnData,
        TError,
        TPageParam
      > & {
        queryKey: CompatibleWithV4<
          DataTag<QueryKey, InfiniteData<TFnData, TPageParam>>,
          QueryKey
        >
      }
}

type Clone<T> = T extends infer TClone ? TClone : never

// query hook

export interface CreateQueryOptions<
  TFnData = unknown,
  TVariables = void,
  TError = CompatibleError
> extends Omit<
      UseQueryOptions<TFnData, TError, TFnData, QueryKey>,
      'queryFn' | 'select'
    >,
    AdditionalQueryOptions<TFnData, TVariables> {
  use?: Middleware<
    QueryHook<Clone<TFnData>, Clone<TVariables>, Clone<TError>>
  >[]
  variables?: TVariables
}

export interface QueryHookOptions<TFnData, TError, TData, TVariables>
  extends Omit<
    UseQueryOptions<TFnData, TError, TData, QueryKey>,
    'queryKey' | 'queryFn' | 'queryKeyHashFn'
  > {
  use?: Middleware<QueryHook<TFnData, TVariables, TError>>[]
  variables?: TVariables
}

export interface DefinedQueryHookOptions<TFnData, TError, TData, TVariables>
  extends Omit<
    QueryHookOptions<TFnData, TError, TData, TVariables>,
    'initialData'
  > {
  initialData: NonUndefinedGuard<TFnData> | (() => NonUndefinedGuard<TFnData>)
}

export type QueryHookResult<TData, TError> = UseQueryResult<TData, TError>

export type DefinedQueryHookResult<TData, TError> = DefinedUseQueryResult<
  TData,
  TError
>

export interface QueryHook<
  TFnData = unknown,
  TVariables = any,
  TError = CompatibleError
> extends ExposeMethods<TFnData, TVariables, TError> {
  <TData = TFnData>(
    options: DefinedQueryHookOptions<TFnData, TError, TData, TVariables>,
    queryClient?: CompatibleWithV4<QueryClient, void>
  ): DefinedQueryHookResult<TData, TError>
  <TData = TFnData>(
    options?: QueryHookOptions<TFnData, TError, TData, TVariables>,
    queryClient?: CompatibleWithV4<QueryClient, void>
  ): QueryHookResult<TData, TError>
}

// suspense query hook

export interface CreateSuspenseQueryOptions<
  TFnData = unknown,
  TVariables = void,
  TError = CompatibleError
> extends Omit<
      UseQueryOptions<TFnData, TError, TFnData, QueryKey>,
      | 'queryFn'
      | 'enabled'
      | 'select'
      | 'suspense'
      | 'throwOnError'
      | 'placeholderData'
      | 'keepPreviousData'
      | 'useErrorBoundary'
    >,
    AdditionalQueryOptions<TFnData, TVariables> {
  use?: Middleware<
    SuspenseQueryHook<Clone<TFnData>, Clone<TVariables>, Clone<TError>>
  >[]
}

export interface SuspenseQueryHookOptions<TFnData, TError, TData, TVariables>
  extends Omit<
    UseQueryOptions<TFnData, TError, TData, QueryKey>,
    | 'queryKey'
    | 'queryFn'
    | 'queryKeyHashFn'
    | 'enabled'
    | 'suspense'
    | 'throwOnError'
    | 'placeholderData'
    | 'keepPreviousData'
    | 'useErrorBoundary'
  > {
  use?: Middleware<SuspenseQueryHook<TFnData, TVariables, TVariables>>[]
  variables?: TVariables
}

export type SuspenseQueryHookResult<TData, TError> = Omit<
  QueryObserverSuccessResult<TData, TError>,
  'isPlaceholderData' | 'isPreviousData'
>

export interface SuspenseQueryHook<
  TFnData = unknown,
  TVariables = void,
  TError = CompatibleError
> extends ExposeMethods<TFnData, TVariables, TError> {
  <TData = TFnData>(
    options?: SuspenseQueryHookOptions<TFnData, TError, TData, TVariables>,
    queryClient?: CompatibleWithV4<QueryClient, void>
  ): SuspenseQueryHookResult<TData, TError>
}

// infinite query hook

export interface CreateInfiniteQueryOptions<
  TFnData = unknown,
  TVariables = void,
  TError = CompatibleError,
  TPageParam = number
> extends Omit<
      CompatibleUseInfiniteQueryOptions<TFnData, TFnData, TError, TPageParam>,
      'queryFn' | 'select'
    >,
    AdditionalQueryOptions<TFnData, TVariables, TPageParam> {
  use?: Middleware<
    InfiniteQueryHook<
      Clone<TFnData>,
      Clone<TVariables>,
      Clone<TError>,
      Clone<TPageParam>
    >
  >[]
}

export interface InfiniteQueryHookOptions<
  TFnData,
  TError,
  TData,
  TVariables,
  TPageParam = number
> extends Omit<
    CompatibleUseInfiniteQueryOptions<TFnData, TData, TError, TPageParam>,
    | 'queryKey'
    | 'queryFn'
    | 'queryKeyHashFn'
    | 'initialPageParam'
    | 'getPreviousPageParam'
    | 'getNextPageParam'
  > {
  use?: Middleware<InfiniteQueryHook<TFnData, TVariables, TError, TPageParam>>[]
  variables?: TVariables
}

export interface DefinedInfiniteQueryHookOptions<
  TFnData,
  TError,
  TData,
  TVariables,
  TPageParam = number
> extends Omit<
    InfiniteQueryHookOptions<TFnData, TError, TData, TVariables, TPageParam>,
    'initialData'
  > {
  initialData:
    | NonUndefinedGuard<CompatibleInfiniteData<TFnData, TPageParam>>
    | (() => NonUndefinedGuard<CompatibleInfiniteData<TFnData, TPageParam>>)
}

export type InfiniteQueryHookResult<TData, TError> = UseInfiniteQueryResult<
  TData,
  TError
>

export type DefinedInfiniteQueryHookResult<TData, TError> = CompatibleWithV4<
  DefinedUseInfiniteQueryResult<TData, TError>,
  WithRequired<UseInfiniteQueryResult<TData, TError>, 'data'>
>

export interface InfiniteQueryHook<
  TFnData = unknown,
  TVariables = void,
  TError = CompatibleError,
  TPageParam = number
> extends ExposeMethods<TFnData, TVariables, TError, TPageParam> {
  <TData = CompatibleWithV4<InfiniteData<TFnData, TPageParam>, TFnData>>(
    options: DefinedInfiniteQueryHookOptions<
      TFnData,
      TError,
      TData,
      TVariables,
      TPageParam
    >,
    queryClient?: CompatibleWithV4<QueryClient, void>
  ): DefinedInfiniteQueryHookResult<TData, TError>
  <TData = CompatibleWithV4<InfiniteData<TFnData, TPageParam>, TFnData>>(
    options?: InfiniteQueryHookOptions<
      TFnData,
      TError,
      TData,
      TVariables,
      TPageParam
    >,
    queryClient?: CompatibleWithV4<QueryClient, void>
  ): InfiniteQueryHookResult<TData, TError>
}

// infinite sususpense query hook

export interface CreateSuspenseInfiniteQueryOptions<
  TFnData = unknown,
  TVariables = void,
  TError = CompatibleError,
  TPageParam = number
> extends Omit<
      CompatibleUseInfiniteQueryOptions<TFnData, TFnData, TError, TPageParam>,
      | 'queryFn'
      | 'enabled'
      | 'select'
      | 'suspense'
      | 'throwOnError'
      | 'placeholderData'
      | 'keepPreviousData'
      | 'useErrorBoundary'
    >,
    AdditionalQueryOptions<TFnData, TVariables, TPageParam> {
  use?: Middleware<
    SuspenseInfiniteQueryHook<
      Clone<TFnData>,
      Clone<TVariables>,
      Clone<TError>,
      Clone<TPageParam>
    >
  >[]
}

export interface SuspenseInfiniteQueryHookOptions<
  TFnData,
  TError,
  TData,
  TVariables,
  TPageParam = number
> extends Omit<
    CompatibleUseInfiniteQueryOptions<TFnData, TData, TError, TPageParam>,
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
  > {
  use?: Middleware<SuspenseInfiniteQueryHook<TFnData, TVariables, TVariables>>[]
  variables?: TVariables
}

export type SuspenseInfiniteQueryHookResult<TData, TError> = Omit<
  InfiniteQueryObserverSuccessResult<TData, TError>,
  'isPlaceholderData' | 'isPreviousData'
>

export interface SuspenseInfiniteQueryHook<
  TFnData = unknown,
  TVariables = void,
  TError = CompatibleError,
  TPageParam = number
> extends ExposeMethods<TFnData, TVariables, TError, TPageParam> {
  <TData = CompatibleWithV4<InfiniteData<TFnData, TPageParam>, TFnData>>(
    options?: SuspenseInfiniteQueryHookOptions<
      TFnData,
      TError,
      TData,
      TVariables,
      TPageParam
    >,
    queryClient?: CompatibleWithV4<QueryClient, void>
  ): SuspenseInfiniteQueryHookResult<TData, TError>
}

// mutation hook

export interface CreateMutationOptions<
  TData = unknown,
  TVariables = void,
  TError = CompatibleError,
  TContext = unknown
> extends UseMutationOptions<TData, TError, TVariables, TContext> {
  use?: Middleware<MutationHook<TData, TError, TVariables>>[]
}

export interface MutationHookOptions<TData, TError, TVariables, TContext>
  extends Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    'mutationFn' | 'mutationKey'
  > {
  use?: Middleware<MutationHook<TData, TError, TVariables>>[]
}

export type MutationHookResult<
  TData = unknown,
  TError = CompatibleError,
  TVariables = void,
  TContext = unknown
> = UseMutationResult<TData, TError, TVariables, TContext>

export interface MutationHook<
  TData = unknown,
  TVariables = void,
  TError = unknown,
  TDefaultContext = unknown
> {
  <TContext = TDefaultContext>(
    options?: MutationHookOptions<TData, TError, TVariables, TContext>,
    queryClient?: CompatibleWithV4<QueryClient, void>
  ): MutationHookResult<TData, TError, TVariables, TContext>
  getKey: () => MutationKey | undefined
  getOptions: () => UseMutationOptions<
    TData,
    TError,
    TVariables,
    TDefaultContext
  >
  mutationFn: MutationFunction<TData, TVariables>
}

// infer types

export type inferVariables<T> = T extends QueryHook<any, infer TVariables, any>
  ? TVariables
  : T extends SuspenseQueryHook<any, infer TVariables, any>
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
  : T extends InfiniteQueryHook<infer TData, any, any, infer TPageParam>
  ? CompatibleInfiniteData<TData, TPageParam>
  : T extends SuspenseInfiniteQueryHook<infer TData, any, any, infer TPageParam>
  ? CompatibleInfiniteData<TData, TPageParam>
  : T extends MutationHook<infer TData, any, any>
  ? TData
  : never

export type inferFnData<T> = T extends QueryHook<infer TData, any, any>
  ? TData
  : T extends SuspenseQueryHook<infer TData, any, any>
  ? TData
  : T extends InfiniteQueryHook<infer TData, any, any>
  ? TData
  : T extends SuspenseInfiniteQueryHook<infer TData, any, any>
  ? TData
  : T extends MutationHook<infer TData, any, any>
  ? TData
  : never

export type inferError<T> = T extends QueryHook<any, any, infer TError>
  ? TError
  : T extends SuspenseQueryHook<any, any, infer TError>
  ? TError
  : T extends InfiniteQueryHook<any, any, infer TError>
  ? TError
  : T extends SuspenseInfiniteQueryHook<any, any, infer TError>
  ? TError
  : T extends MutationHook<any, any, infer TError>
  ? TError
  : never

export type inferOptions<T> = T extends QueryHook<
  infer TFnData,
  infer TVariables,
  infer TError
>
  ? QueryHookOptions<TFnData, TError, TFnData, TVariables>
  : T extends SuspenseQueryHook<infer TFnData, infer TVariables, infer TError>
  ? SuspenseQueryHookOptions<TFnData, TError, TFnData, TVariables>
  : T extends InfiniteQueryHook<
      infer TFnData,
      infer TVariables,
      infer TError,
      infer TPageParam
    >
  ? InfiniteQueryHookOptions<
      TFnData,
      TError,
      CompatibleWithV4<InfiniteData<TFnData, TPageParam>, TFnData>,
      TVariables,
      TPageParam
    >
  : T extends SuspenseInfiniteQueryHook<
      infer TFnData,
      infer TVariables,
      infer TError,
      infer TPageParam
    >
  ? SuspenseInfiniteQueryHookOptions<
      TFnData,
      TError,
      CompatibleWithV4<InfiniteData<TFnData, TPageParam>, TFnData>,
      TVariables,
      TPageParam
    >
  : T extends MutationHook<infer TFnData, infer TVariables, infer TError>
  ? MutationHookOptions<TFnData, TError, TVariables, unknown>
  : never

export type inferCreateOptions<T> = T extends QueryHook<
  infer TFnData,
  infer TVariables,
  infer TError
>
  ? CreateQueryOptions<TFnData, TVariables, TError>
  : T extends SuspenseQueryHook<infer TFnData, infer TVariables, infer TError>
  ? CreateSuspenseQueryOptions<TFnData, TVariables, TError>
  : T extends InfiniteQueryHook<
      infer TFnData,
      infer TVariables,
      infer TError,
      infer TPageParam
    >
  ? CreateInfiniteQueryOptions<TFnData, TVariables, TError, TPageParam>
  : T extends SuspenseInfiniteQueryHook<
      infer TFnData,
      infer TVariables,
      infer TError,
      infer TPageParam
    >
  ? CreateSuspenseInfiniteQueryOptions<TFnData, TVariables, TError, TPageParam>
  : T extends MutationHook<infer TFnData, infer TVariables, infer TError>
  ? CreateMutationOptions<TFnData, TError, TVariables, unknown>
  : never
