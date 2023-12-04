import { createInfiniteQuery } from './createInfiniteQuery'
import { createMutation } from './createMutation'
import { createQuery } from './createQuery'
import { createSuspenseInfiniteQuery } from './createSuspenseInfiniteQuery'
import { createSuspenseQuery } from './createSuspenseQuery'
import type {
  CompatibleError,
  CreateInfiniteQueryOptions,
  CreateMutationOptions,
  CreateQueryOptions,
  ExposeMethods,
  ExposeMutationMethods,
  InfiniteQueryHook,
  MutationHook,
  QueryHook,
  SuspenseQueryHook,
} from './types'

export type RouterQuery<
  TFnData,
  TVariables = void,
  TError = CompatibleError
> = Omit<CreateQueryOptions<TFnData, TVariables, TError>, 'queryKey'> & {
  _type: `q`
}

export type RouterInfiniteQuery<
  TFnData,
  TVariables = void,
  TError = CompatibleError,
  TPageParam = number
> = Omit<
  CreateInfiniteQueryOptions<TFnData, TVariables, TError, TPageParam>,
  'queryKey'
> & {
  _type: `inf`
}

export type RouterMutation<
  TData = unknown,
  TVariables = void,
  TError = CompatibleError,
  TContext = unknown
> = Omit<
  CreateMutationOptions<TData, TVariables, TError, TContext>,
  'mutationKey'
> & {
  _type: `m`
}

export type RouterConfig = Record<
  string,
  | RouterQuery<any, any, any>
  | RouterInfiniteQuery<any, any, any>
  | RouterMutation<any, any, any>
>

export type CreateRouter<TConfig extends RouterConfig> = {
  [K in keyof TConfig]: TConfig[K] extends RouterMutation<
    infer TFnData,
    infer TVariables,
    infer TError,
    infer TContext
  >
    ? {
        useMutation: MutationHook<TFnData, TVariables, TError, TContext>
      } & ExposeMutationMethods<TFnData, TVariables, TError, TContext>
    : TConfig[K] extends RouterInfiniteQuery<
        infer TFnData,
        infer TVariables,
        infer TError,
        infer TPageParam
      >
    ? {
        useInfiniteQuery: InfiniteQueryHook<
          TFnData,
          TVariables,
          TError,
          TPageParam
        >
        useSuspenseInfiniteQuery: InfiniteQueryHook<
          TFnData,
          TVariables,
          TError,
          TPageParam
        >
      } & ExposeMethods<TFnData, TVariables, TError, TPageParam>
    : TConfig[K] extends Omit<
        RouterQuery<infer TFnData, infer TVariables, infer TError>,
        'queryKey'
      >
    ? {
        useQuery: QueryHook<TFnData, TVariables, TError>
        useSuspenseQuery: SuspenseQueryHook<TFnData, TVariables, TError>
      } & ExposeMethods<TFnData, TVariables, TError>
    : never
} & { getKey: () => [string] }

export const router = <TConfig extends RouterConfig>(
  scope: string,
  config: TConfig
): CreateRouter<TConfig> => {
  return Object.entries(config).reduce(
    (acc, [key, opts]) => {
      const keys = [scope, key]

      if (opts._type === `m`) {
        acc[key] = {
          useMutation: createMutation({
            ...opts,
            mutationKey: keys,
          }),
          ...createMutation({
            ...opts,
            mutationKey: keys,
          }),
        }
      } else if (opts._type === `q`) {
        acc[key] = {
          useQuery: createQuery({
            ...(opts as any),
            queryKey: keys,
          }),
          useSuspenseQuery: createSuspenseQuery({
            ...(opts as any),
            queryKey: keys,
          }),
          ...createQuery({
            ...(opts as any),
            queryKey: keys,
          }),
        }
      } else {
        acc[key] = {
          useInfiniteQuery: createInfiniteQuery({
            ...opts,
            queryKey: keys,
          }),
          useSuspenseInfiniteQuery: createSuspenseInfiniteQuery({
            ...(opts as any),
            queryKey: keys,
          }),
          ...createInfiniteQuery({
            ...opts,
            queryKey: keys,
          }),
        }
      }

      return acc
    },
    {
      getKey: () => [scope],
    } as any
  )
}

router.query = <TFnData, TVariables = void, TError = CompatibleError>(
  options: Omit<CreateQueryOptions<TFnData, TVariables, TError>, 'queryKey'>
): RouterQuery<TFnData, TVariables, TError> => {
  return {
    ...options,
    _type: 'q',
  }
}

router.infiniteQuery = <
  TFnData,
  TVariables = void,
  TError = CompatibleError,
  TPageParam = number
>(
  options: Omit<
    CreateInfiniteQueryOptions<TFnData, TVariables, TError, TPageParam>,
    'queryKey'
  >
): RouterInfiniteQuery<TFnData, TVariables, TError, TPageParam> => {
  return { ...options, _type: 'inf' }
}

router.mutation = <
  TFnData = unknown,
  TVariables = void,
  TError = CompatibleError,
  TContext = unknown
>(
  options: Omit<
    CreateMutationOptions<TFnData, TVariables, TError, TContext>,
    'mutationKey'
  >
): RouterMutation<TFnData, TVariables, TError, TContext> => {
  return { ...options, _type: 'm' }
}
