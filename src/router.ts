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

type RouterNode = RouterConfig[string]
type RouterTypedNode = RouterNode & {
  _routerType: 'q' | 'inf' | 'm'
}

const isRouterLeaf = (value: RouterNode): value is RouterTypedNode => {
  return !!value && typeof value._routerType === 'string'
}

const buildRouter = (keys: QueryKey, config: RouterConfig) => {
  return Object.entries(config).reduce(
    (acc, [key, opts]) => {
      if (!isRouterLeaf(opts)) {
        acc[key] = buildRouter([...keys, key], opts)
      } else {
        const type = opts._routerType
        const options: any = {
          ...opts,
          [type === `m` ? `mutationKey` : `queryKey`]: [...keys, key],
        }

        if (type === `m`) {
          acc[key] = {
            useMutation: createMutation(options),
            ...createMutation(options),
          }
          return acc
        }

        acc[key] =
          type === `q`
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

function query<TFnData, TVariables = void, TError = CompatibleError>(
  options: RouterQueryOptions<TFnData, TVariables, TError>
): RouterQuery<TFnData, TVariables, TError> {
  return {
    ...options,
    _routerType: 'q',
  }
}

function infiniteQuery<
  TFnData,
  TVariables = void,
  TError = CompatibleError,
  TPageParam = number
>(
  options: RouterInfiniteQueryOptions<TFnData, TVariables, TError, TPageParam>
): RouterInfiniteQuery<TFnData, TVariables, TError, TPageParam> {
  return { ...options, _routerType: 'inf' } as RouterInfiniteQuery<
    TFnData,
    TVariables,
    TError,
    TPageParam
  >
}

function mutation<
  TFnData = unknown,
  TVariables = void,
  TError = CompatibleError,
  TContext = unknown
>(
  options: RouterMutationOptions<TFnData, TVariables, TError, TContext>
): RouterMutation<TFnData, TVariables, TError, TContext> {
  return { ...options, _routerType: 'm' } as RouterMutation<
    TFnData,
    TVariables,
    TError,
    TContext
  >
}

router.query = query
router.infiniteQuery = infiniteQuery
router.mutation = mutation
