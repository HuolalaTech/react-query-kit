import { QueryClient, useQueryClient } from '@tanstack/react-query'

import { CompatibleWithV4, Middleware, inferQueryKey } from './types'

export const withMiddleware = (
  hook: any,
  defaultOptions: any,
  type: 'queries' | 'mutations'
) => {
  return function useMiddleware(
    options?: { client?: QueryClient; use?: Middleware[] },
    queryClient?: CompatibleWithV4<QueryClient, void>
  ) {
    const [middleware, opts] = [
      useQueryClient(
        // compatible with ReactQuery v4
        // @ts-ignore
        options?.context ? { context: options.context } : queryClient
      ).getDefaultOptions()[type],
      defaultOptions,
      options,
    ].reduce(
      ([middleware, opts], { use = [], ...rest } = {}) => [
        [...middleware, ...use],
        { ...opts, ...rest },
      ],
      [[], {}]
    )

    let next = hook
    for (let i = middleware.length; i--; ) {
      next = middleware[i](next)
    }

    return next(opts, queryClient)
  }
}

export const getKey = <TVariables>(
  primaryKey: string,
  variables?: TVariables
) => {
  return (
    variables === undefined ? [primaryKey] : [primaryKey, variables]
  ) as inferQueryKey<TVariables>
}
