import { QueryKey } from '@tanstack/react-query'

import { createInfiniteQuery } from './createInfiniteQuery'
import { createMutation } from './createMutation'
import { createQuery } from './createQuery'
import { createSuspenseInfiniteQuery } from './createSuspenseInfiniteQuery'
import { createSuspenseQuery } from './createSuspenseQuery'
import type {
  CompatibleError,
  CreateRouter,
  RouterConfig,
  RouterInfiniteQuery,
  RouterInfiniteQueryOptions,
  RouterMutation,
  RouterMutationOptions,
  RouterQuery,
  RouterQueryOptions,
} from './types'

const buildRouter = (keys: QueryKey, config: RouterConfig) => {
  return Object.entries(config).reduce(
    (acc, [key, opts]) => {
      if (!opts._type) {
        acc[key] = buildRouter([...keys, key], opts)
      } else {
        const options: any = {
          ...opts,
          [opts._type === `m` ? `mutationKey` : `queryKey`]: [...keys, key],
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
      }

      return acc
    },
    {
      getKey: () => keys,
    } as any
  )
}

export const router = <TConfig extends RouterConfig>(
  key: string | QueryKey,
  config: TConfig
): CreateRouter<TConfig> => {
  return buildRouter(Array.isArray(key) ? key : [key], config)
}

router.query = <TFnData, TVariables = void, TError = CompatibleError>(
  options: RouterQueryOptions<TFnData, TVariables, TError>
) => {
  return {
    ...options,
    _type: 'q',
  } as RouterQuery<TFnData, TVariables, TError>
}

router.infiniteQuery = <
  TFnData,
  TVariables = void,
  TError = CompatibleError,
  TPageParam = number
>(
  options: RouterInfiniteQueryOptions<TFnData, TVariables, TError, TPageParam>
) => {
  return { ...options, _type: 'inf' } as RouterInfiniteQuery<
    TFnData,
    TVariables,
    TError,
    TPageParam
  >
}

router.mutation = <
  TFnData = unknown,
  TVariables = void,
  TError = CompatibleError,
  TContext = unknown
>(
  options: RouterMutationOptions<TFnData, TVariables, TError, TContext>
) => {
  return { ...options, _type: 'm' } as RouterMutation<
    TFnData,
    TVariables,
    TError,
    TContext
  >
}
