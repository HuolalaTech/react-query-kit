import type {
  QueryClient,
  SetDataOptions,
  Updater,
  UseBaseQueryOptions,
} from '@tanstack/react-query'

import type {
  AdditionalCreateOptions,
  AdditionalQueryHookOptions,
  CompatibleWithV4,
  Middleware,
} from './types'
import { getQueryKey, useCompatibeQueryClient, withMiddleware } from './utils'

interface CreateQueryOptions
  extends Omit<UseBaseQueryOptions, 'queryKey' | 'queryFn' | 'enabled'>,
    AdditionalCreateOptions<any, any> {
  use?: Middleware[]
}

type QueryBaseHookOptions = Omit<
  UseBaseQueryOptions,
  'queryKey' | 'queryFn' | 'enabled'
> &
  AdditionalQueryHookOptions<any, any>

export function createBaseQuery(
  defaultOptions: any,
  useRQHook: (options: any, queryClient?: any) => any,
  overrideOptions?: QueryBaseHookOptions
): any {
  const { primaryKey, queryFn, queryKeyHashFn } =
    defaultOptions as CreateQueryOptions

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
      getPreviousPageParam: (defaultOptions as any).getPreviousPageParam,
      getNextPageParam: (defaultOptions as any).getNextPageParam,
      initialPageParam: (defaultOptions as any).initialPageParam,
    }
  }

  const useBaseHook = (
    options: QueryBaseHookOptions,
    queryClient?: CompatibleWithV4<QueryClient, void>
  ) => {
    const client = useCompatibeQueryClient(options, queryClient)
    const { enabled, variables, ...mergedOptions } = {
      ...options,
      ...overrideOptions,
    } as QueryBaseHookOptions
    const queryKey = getKey(variables)

    return Object.assign(
      useRQHook(
        {
          ...mergedOptions,
          enabled:
            typeof enabled === 'function'
              ? enabled(client.getQueryData(queryKey), variables)
              : enabled,
          queryKey,
        },
        client
      ),
      {
        queryKey: queryKey,
        variables,
        setData: (
          updater: Updater<any, any>,
          setDataOptions?: SetDataOptions
        ) => client.setQueryData(queryKey, updater, setDataOptions),
      }
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
