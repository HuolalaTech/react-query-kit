import type {
  QueryClient,
  UseBaseQueryOptions,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query'

import type {
  AdditionalCreateOptions,
  CompatibleWithV4,
  Middleware,
} from './types'
import { getKey as getQueryKey, withMiddleware } from './utils'

interface CreateBaseQueryOptions
  extends Omit<UseInfiniteQueryOptions, 'queryKey' | 'queryFn'>,
    AdditionalCreateOptions<any, any> {
  use?: Middleware[]
}

type QueryBaseHookOptions = Omit<
  UseBaseQueryOptions,
  'queryKey' | 'queryFn'
> & {
  variables?: any
}

export function createBaseQuery(
  defaultOptions: any,
  useRQHook: (options: any, queryClient?: any) => any,
  overrideOptions?: QueryBaseHookOptions
): any {
  const {
    primaryKey,
    queryFn,
    queryKeyHashFn,
    getPreviousPageParam,
    getNextPageParam,
    initialPageParam,
  } = defaultOptions as CreateBaseQueryOptions

  if (process.env.NODE_ENV !== 'production') {
    // @ts-ignore
    if (defaultOptions.useDefaultOptions) {
      throw new Error(
        'useDefaultOptions is not supported, please use middleware instead.'
      )
    }
  }

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
    { variables, ...rest }: QueryBaseHookOptions,
    queryClient?: CompatibleWithV4<QueryClient, void>
  ) => {
    return useRQHook(
      {
        ...rest,
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
