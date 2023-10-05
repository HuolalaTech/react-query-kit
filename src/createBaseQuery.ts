import type {
  QueryClient,
  UseBaseQueryOptions,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query'

import type { AdditionalQueryOptions, Middleware } from './types'
import { getKey as getQueryKey, withMiddleware } from './utils'

interface CreateBaseQueryOptions
  extends Omit<UseInfiniteQueryOptions, 'queryKey' | 'queryFn'>,
    AdditionalQueryOptions<any, any> {
  use?: Middleware[]
  variables?: any
}

type QueryBaseHookOptions = Omit<
  UseBaseQueryOptions,
  'queryKey' | 'queryFn'
> & {
  variables?: any
}

export const createBaseQuery = (
  defaultOptions: any,
  useRQHook: (options: any, queryClient?: any) => any,
  overrideOptions?: QueryBaseHookOptions
): any => {
  if (process.env.NODE_ENV !== 'production') {
    // @ts-ignore
    if (defaultOptions.useDefaultOptions) {
      throw new Error(
        'useDefaultOptions is not supported, please use middleware instead.'
      )
    }
  }

  const {
    primaryKey,
    queryFn,
    queryKeyHashFn,
    getPreviousPageParam,
    getNextPageParam,
    initialPageParam,
  } = defaultOptions as CreateBaseQueryOptions

  const getPrimaryKey = () => primaryKey

  const getKey = (variables?: any) => getQueryKey(primaryKey, variables)

  const getFetchOptions = (variables: any) => {
    return {
      queryKey: getKey(variables),
      queryFn,
      queryKeyHashFn,
      getPreviousPageParam,
      getNextPageParam,
      initialPageParam,
    }
  }

  const useBaseHook = (
    { variables, ...restOptions }: QueryBaseHookOptions,
    queryClient?: QueryClient
  ) => {
    return useRQHook(
      {
        ...restOptions,
        ...overrideOptions,
        queryKey: getKey(variables),
      },
      queryClient
    )
  }

  return Object.assign(withMiddleware(useBaseHook, defaultOptions, 'queries'), {
    getPrimaryKey,
    getKey,
    queryFn,
    queryKeyHashFn,
    getFetchOptions,
  })
}
