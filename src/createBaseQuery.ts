import type { SetDataOptions, UseBaseQueryOptions } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import type {
  AdditionalCreateOptions,
  AdditionalQueryHookOptions,
  Updater,
} from './types'
import { isUndefined } from './utils'

interface CreateQueryOptions
  extends Omit<UseBaseQueryOptions, 'queryKey' | 'queryFn' | 'enabled'>,
    AdditionalCreateOptions<any, any> {
  useDefaultOptions?: () => QueryBaseHookOptions
}

type QueryBaseHookOptions = Omit<
  UseBaseQueryOptions,
  'queryKey' | 'queryFn' | 'enabled'
> &
  AdditionalQueryHookOptions<any, any> & { context?: any }

export function createBaseQuery(
  options: any,
  useRQHook: (options: any, queryClient?: any) => any,
  queryClient?: any
): any {
  const {
    primaryKey,
    queryFn,
    queryKeyHashFn,
    useDefaultOptions,
    ...defaultOptions
  } = options as CreateQueryOptions

  const getPrimaryKey = () => primaryKey

  const getKey = (variables?: any) =>
    isUndefined(variables) ? [primaryKey] : [primaryKey, variables]

  const useGeneratedQuery = ({
    variables: currVariables,
    ...currOptions
  }: QueryBaseHookOptions = {}) => {
    const {
      select: _select,
      variables: prevVariables,
      ...prevOptions
    } = {
      ...defaultOptions,
      ...useDefaultOptions?.(),
    } as QueryBaseHookOptions

    const variables = isUndefined(currVariables) ? prevVariables : currVariables

    const queryKey = getKey(variables)

    const { enabled, ...mergedOptions } = {
      ...prevOptions,
      ...currOptions,
      queryKeyHashFn,
      queryFn,
      queryKey,
    }

    const client = useQueryClient(
      mergedOptions.context ? { context: mergedOptions.context } : queryClient
    )

    const setData = (
      updater: Updater<any, any>,
      setDataOptions?: SetDataOptions
    ) => client.setQueryData(queryKey, updater, setDataOptions)

    const result = useRQHook(
      {
        ...mergedOptions,
        enabled:
          typeof enabled === 'function'
            ? enabled(client.getQueryData(queryKey), variables)
            : enabled,
      },
      client
    )

    return Object.assign(result, { queryKey, setData })
  }

  return Object.assign(useGeneratedQuery, {
    getPrimaryKey,
    getKey,
    queryFn,
    queryKeyHashFn,
  })
}
