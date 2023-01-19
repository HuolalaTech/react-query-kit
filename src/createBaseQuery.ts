import { hashQueryKey } from '@tanstack/query-core'
import type { SetDataOptions, UseBaseQueryOptions } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import type { Updater } from '@tanstack/react-query/build/types/packages/query-core/src/utils'
import type {
  AdditionalCreateOptions,
  AdditionalQueryHookOptions,
} from './types'

interface CreateQueryOptions
  extends Omit<UseBaseQueryOptions, 'queryKey' | 'queryFn' | 'enabled'>,
    AdditionalCreateOptions<any, any> {}

type QueryBaseHookOptions = Omit<
  UseBaseQueryOptions,
  'queryKey' | 'queryFn' | 'enabled'
> &
  AdditionalQueryHookOptions<any, any>

export function createBaseQuery(
  options: CreateQueryOptions,
  useRQHook: (options: any) => any
): any {
  const {
    primaryKey,
    queryFn,
    queryKeyHashFn = hashQueryKey,
    select: _select,
    ...defaultOptions
  } = options

  const getPrimaryKey = () => primaryKey

  const getKey = (variables?: any) =>
    typeof variables === 'undefined' ? [primaryKey] : [primaryKey, variables]

  function useGeneratedQuery(options?: QueryBaseHookOptions) {
    const { variables, ...restOptions } = options || {}

    const queryKey = getKey(variables)

    const { enabled, ...mergedOptions } = {
      ...defaultOptions,
      ...restOptions,
      queryKeyHashFn,
      queryFn,
      queryKey,
    }

    const queryClient = useQueryClient({ context: mergedOptions.context })

    const setData = (updater: Updater<any, any>, options?: SetDataOptions) =>
      queryClient.setQueryData(queryKey, updater, options)

    const result = useRQHook({
      ...mergedOptions,
      enabled:
        typeof enabled === 'function'
          ? enabled(queryClient.getQueryData(queryKey), variables)
          : enabled,
    })

    return Object.assign(result, { queryKey, setData })
  }

  useGeneratedQuery.getPrimaryKey = getPrimaryKey
  useGeneratedQuery.getKey = getKey
  useGeneratedQuery.queryFn = queryFn
  useGeneratedQuery.queryKeyHashFn = queryKeyHashFn

  return useGeneratedQuery
}
