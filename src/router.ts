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
  CreateRouter,
  RouterConfig,
  RouterInfiniteQuery,
  RouterMutation,
  RouterQuery,
} from './types'

export const router = <TConfig extends RouterConfig>(
  scope: string,
  config: TConfig
): CreateRouter<TConfig> => {
  return Object.entries(config).reduce(
    (acc, [key, opts]) => {
      const options: any = {
        ...opts,
        [opts._type === `m` ? `mutationKey` : `queryKey`]: [scope, key],
      }

      acc[key] =
        opts._type === `m`
          ? {
              useMutation: createMutation(options),
              ...createMutation(options),
            }
          : opts._type === `q`
          ? {
              useQuery: createQuery(options),
              useSuspenseQuery: createSuspenseQuery(options),
              ...createQuery(options),
            }
          : {
              useInfiniteQuery: createInfiniteQuery(options),
              useSuspenseInfiniteQuery: createSuspenseInfiniteQuery(options),
              ...createInfiniteQuery(options),
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
