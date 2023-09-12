import { QueryClient, useQueryClient } from '@tanstack/react-query'

import { CompatibleWithV4, Middleware } from './types'

export const useCompatibeQueryClient = (
  options?: any,
  queryClient?: CompatibleWithV4<QueryClient, void>
) => {
  return useQueryClient(
    // compatible with ReactQuery v4
    // @ts-ignore
    options?.context ? { context: options.context } : queryClient
  )
}

export const withMiddleware = (
  hook: any,
  defaultOptions: any,
  type: 'queries' | 'mutations'
) => {
  return function useMiddleware(
    options?: { client?: QueryClient; use?: Middleware[] },
    queryClient?: CompatibleWithV4<QueryClient, void>
  ) {
    const client = useCompatibeQueryClient(options, queryClient)
    const [middleware, opts] = [
      client.getDefaultOptions()[type],
      defaultOptions,
      options,
    ].reduce(
      (acc, item = {}) => {
        const [middleware, opts] = acc
        const { use = [], ...rest } = item
        return [[...middleware, ...use], { ...opts, ...rest }]
      },
      [[], {}]
    )

    let next = hook
    for (let i = middleware.length; i--; ) {
      next = middleware[i](next)
    }

    return next(opts, queryClient)
  }
}

export const getQueryKey = <TVariables>(
  primaryKey: string,
  variables?: TVariables
) => {
  return variables === undefined ? [primaryKey] : [primaryKey, variables]
}
