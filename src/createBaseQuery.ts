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

const existedPrimaryKeys = new Set<string>()

export const createBaseQuery = (
  defaultOptions: any,
  useRQHook: (options: any, queryClient?: any) => any,
  overrideOptions?: QueryBaseHookOptions
): any => {
  const {
    primaryKey,
    queryFn,
    queryKeyHashFn,
    getPreviousPageParam,
    getNextPageParam,
    initialPageParam,
  } = defaultOptions as CreateBaseQueryOptions

  if (process.env.NODE_ENV !== 'production') {
    if (existedPrimaryKeys.has(primaryKey)) {
      console.error(`[Bug] Duplicated primaryKey: ${primaryKey}`)
    } else {
      existedPrimaryKeys.add(primaryKey)
    }

    // @ts-ignore
    if (defaultOptions.useDefaultOptions) {
      console.error(
        '[Bug] useDefaultOptions is not supported, please use middleware instead.'
      )
    }
  }

  const getPrimaryKey = () => primaryKey

  const getKey = (variables?: any) => getQueryKey(primaryKey, variables)

  const getOptions = (variables: any) => {
    return {
      ...defaultOptions,
      queryKey: getKey(variables),
    }
  }

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
    options: QueryBaseHookOptions,
    queryClient?: QueryClient
  ) => {
    return useRQHook(
      {
        ...options,
        ...overrideOptions,
        queryKey: getKey(options.variables),
      },
      queryClient
    )
  }

  return Object.assign(withMiddleware(useBaseHook, defaultOptions, 'queries'), {
    getPrimaryKey,
    getKey,
    queryFn,
    queryKeyHashFn,
    getOptions,
    getFetchOptions,
  })
}
