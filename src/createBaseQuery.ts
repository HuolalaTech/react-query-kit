import type {
  QueryClient,
  QueryFunctionContext,
  UseBaseQueryOptions,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query'

import type { AdditionalQueryOptions, Middleware } from './types'
import { getKey as getFullKey, withMiddleware } from './utils'

interface CreateBaseQueryOptions
  extends Omit<UseInfiniteQueryOptions, 'queryFn'>,
    AdditionalQueryOptions<any, any> {
  use?: Middleware[]
  variables?: any
}

type QueryBaseHookOptions = Omit<
  UseBaseQueryOptions,
  'queryKey' | 'queryFn'
> & {
  fetcher?: any
  variables?: any
}

export const createBaseQuery = (
  defaultOptions: any,
  useRQHook: (options: any, queryClient?: any) => any,
  overrideOptions?: Partial<UseInfiniteQueryOptions>
): any => {
  if (process.env.NODE_ENV !== 'production') {
    // @ts-ignore
    if (defaultOptions.useDefaultOptions) {
      console.error(
        '[Bug] useDefaultOptions is not supported, please use middleware instead.'
      )
    }

    // @ts-ignore
    if (defaultOptions.queryFn) {
      console.error(
        '[Bug] queryFn is not supported, please use fetcher instead.'
      )
    }
  }

  const {
    queryKey,
    fetcher,
    queryKeyHashFn,
    getPreviousPageParam,
    getNextPageParam,
    initialPageParam,
  } = defaultOptions as CreateBaseQueryOptions

  const getQueryOptions = (fetcherFn: any, variables: any) => {
    return {
      queryFn: (context: QueryFunctionContext) => fetcherFn(variables, context),
      queryKey: getFullKey(queryKey, variables),
    }
  }

  const getKey = (variables?: any) => getFullKey(queryKey, variables)

  const getOptions = (variables: any) => {
    return {
      ...defaultOptions,
      ...getQueryOptions(fetcher, variables),
    }
  }

  const getFetchOptions = (variables: any) => {
    return {
      queryKeyHashFn,
      getPreviousPageParam,
      getNextPageParam,
      initialPageParam,
      ...getQueryOptions(fetcher, variables),
    }
  }

  const useBaseHook = (
    options: QueryBaseHookOptions,
    queryClient?: QueryClient
  ) => {
    return useRQHook(
      {
        ...options,
        ...overrideOptions,
        ...getQueryOptions(options.fetcher, options.variables),
      },
      queryClient
    )
  }

  return Object.assign(withMiddleware(useBaseHook, defaultOptions, 'queries'), {
    fetcher,
    getKey,
    getOptions,
    getFetchOptions,
  })
}
