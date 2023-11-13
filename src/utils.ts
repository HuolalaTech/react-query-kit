import * as ReactQuery from '@tanstack/react-query'

import type { Middleware, inferQueryKey } from './types'

export const withMiddleware = (
  hook: any,
  defaultOptions: any,
  type: 'queries' | 'mutations'
) => {
  return function useMiddleware(
    options?: { client?: ReactQuery.QueryClient; use?: Middleware[] },
    queryClient?: ReactQuery.QueryClient
  ) {
    const [middleware, opts] = [
      ReactQuery.useQueryClient(
        // @ts-ignore Compatible with ReactQuery v4
        isV5() ? queryClient : options
      ).getDefaultOptions()[type],
      defaultOptions,
      options,
    ].reduce(
      ([u1, o1], { use: u2 = [], ...o2 } = {}) => [
        [...u1, ...u2],
        { ...o1, ...o2 },
      ],
      [[]]
    )

    let next = hook
    for (let i = middleware.length; i--; ) {
      next = middleware[i](next)
    }

    return next(opts, queryClient)
  }
}

// Compatible with ReactQuery v4
export const suspenseOptions = {
  enabled: true,
  suspense: true,
  useErrorBoundary: (_error: unknown, query: ReactQuery.Query) =>
    query.state.data === undefined,
}

export const isV5 = () => !!ReactQuery.useSuspenseQuery

export const getKey = <TVariables = void>(
  primaryKey: string,
  variables?: TVariables
) => {
  return (
    variables === undefined ? [primaryKey] : [primaryKey, variables]
  ) as inferQueryKey<unknown, TVariables>
}
