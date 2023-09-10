import { QueryClient, useQueryClient } from '@tanstack/react-query'

import { CompatibleWithV4, Middleware } from './types'

export const useCompatibeQueryClient = (
  options?: any,
  queryClient?: CompatibleWithV4<QueryClient, void>
) =>
  // @ts-ignore
  useQueryClient(options?.context ? { context: options.context } : queryClient)

export const withMiddlewares = (
  hook: any,
  defaultOptions: any,
  type: 'queries' | 'mutations'
) => {
  const { use = [], ...restOptions } = defaultOptions

  return function useMiddleware(
    options?: { client?: QueryClient; use?: Middleware[] },
    queryClient?: CompatibleWithV4<QueryClient, void>
  ) {
    const client = useCompatibeQueryClient(options, queryClient)

    let next = hook

    const { use: configUse = [], ...configOptions } =
      (client.getDefaultOptions()[type] as any) || {}

    const middleware: Middleware[] = configUse.concat(use)

    for (let i = middleware.length; i--; ) {
      if (middleware[i] === undefined) {
        console.log(middleware[i], middleware)
      }
      next = middleware[i]!(next)
    }

    return next({ ...configOptions, ...restOptions, ...options }, queryClient)
  }
}

export const getQueryKey = <TVariables>(
  primaryKey: string,
  variables?: TVariables
) => {
  return variables === undefined ? [primaryKey] : [primaryKey, variables]
}
