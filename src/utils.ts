import { type QueryClient, useQueryClient } from '@tanstack/react-query'

import type { Middleware, inferQueryKey } from './types'

export const withMiddleware = (
  hook: any,
  defaultOptions: any,
  type: 'queries' | 'mutations'
) => {
  return function useMiddleware(
    options?: { client?: QueryClient; use?: Middleware[] },
    queryClient?: QueryClient
  ) {
    const [middleware, opts] = [
      useQueryClient(
        // @ts-ignore
        // compatible with ReactQuery v4
        options?.context ? { context: options.context } : queryClient
      ).getDefaultOptions()[type],
      defaultOptions,
      options,
    ].reduce(
      ([u, o1], { use = [], ...o2 } = {}) => [[...u, ...use], { ...o1, ...o2 }],
      [[], {}]
    )

    let next = hook
    for (let i = middleware.length; i--; ) {
      next = middleware[i](next)
    }

    return next(opts, queryClient)
  }
}

export const suspenseOptions = {
  enabled: true,
  suspense: true,
  throwOnError: true,
  useErrorBoundary: true,
}

export const getKey = <TVariables>(
  primaryKey: string,
  variables?: TVariables
) => {
  return (
    variables === undefined ? [primaryKey] : [primaryKey, variables]
  ) as inferQueryKey<TVariables>
}
