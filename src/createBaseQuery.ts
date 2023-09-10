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
import { getQueryKey, useCompatibeQueryClient, withMiddlewares } from './utils'

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
  const { primaryKey } = defaultOptions as CreateQueryOptions

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
      queryFn: defaultOptions.queryFn,
      queryKeyHashFn: defaultOptions.queryKeyHashFn,
      getPreviousPageParam: (defaultOptions as any).getPreviousPageParam,
      getNextPageParam: (defaultOptions as any).getNextPageParam,
      initialPageParam: (defaultOptions as any).initialPageParam,
    }
  }

  const useGeneratedQuery = (
    options: QueryBaseHookOptions,
    queryClient?: CompatibleWithV4<QueryClient, void>
  ) => {
    const client = useCompatibeQueryClient(options, queryClient)

    const { enabled, variables, ...mergedOptions } = {
      ...options,
      ...overrideOptions,
    } as QueryBaseHookOptions

    const queryKey = getKey(variables)

    const result = useRQHook(
      {
        ...mergedOptions,
        enabled:
          typeof enabled === 'function'
            ? enabled(client.getQueryData(queryKey), variables)
            : enabled,
        queryKey,
      },
      client
    )

    return Object.assign(result, {
      queryKey: queryKey,
      variables,
      setData: (updater: Updater<any, any>, setDataOptions?: SetDataOptions) =>
        client.setQueryData(queryKey, updater, setDataOptions),
    })
  }

  return Object.assign(
    withMiddlewares(useGeneratedQuery, defaultOptions, 'queries'),
    {
      getPrimaryKey,
      getKey,
      queryFn: defaultOptions.queryFn,
      queryKeyHashFn: defaultOptions.queryKeyHashFn,
      getFetchOptions,
    }
  )
}
