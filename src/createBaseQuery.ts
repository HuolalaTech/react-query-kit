import type {
  QueryClient,
  QueryFunctionContext,
  UseBaseQueryOptions,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query'

import { getKey as getFullKey, withMiddleware } from './utils'

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

  const getQueryOptions = (fetcherFn: any, variables: any) => {
    return {
      queryFn: (context: QueryFunctionContext) => fetcherFn(variables, context),
      queryKey: getFullKey(defaultOptions.queryKey, variables),
    }
  }

  const getKey = (variables?: any) =>
    getFullKey(defaultOptions.queryKey, variables)

  const getOptions = (variables: any) => {
    return {
      ...defaultOptions,
      ...getQueryOptions(defaultOptions.fetcher, variables),
    }
  }

  const getFetchOptions = (variables: any) => {
    return {
      ...getQueryOptions(defaultOptions.fetcher, variables),
      queryKeyHashFn: defaultOptions.queryKeyHashFn,
      getPreviousPageParam: defaultOptions.getPreviousPageParam,
      getNextPageParam: defaultOptions.getNextPageParam,
      initialPageParam: defaultOptions.initialPageParam,
    }
  }

  const useBaseHook = (
    options: QueryBaseHookOptions,
    queryClient?: QueryClient
  ) => {
    return useRQHook(
      {
        ...options,
        ...getQueryOptions(options.fetcher, options.variables),
        ...overrideOptions,
      },
      queryClient
    )
  }

  return Object.assign(withMiddleware(useBaseHook, defaultOptions, 'queries'), {
    fetcher: defaultOptions.fetcher,
    getKey,
    getOptions,
    getFetchOptions,
  })
}
