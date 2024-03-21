import * as TanstackReactQuery from '@tanstack/react-query'
import type { Query, QueryClient, QueryKey } from '@tanstack/react-query'

import type { Middleware } from './types'

export const ReactQuery = TanstackReactQuery

export const isV5 = !!ReactQuery.useSuspenseQuery

export const suspenseOptions = {
  enabled: true,
  suspense: true,
  keepPreviousData: undefined,
  useErrorBoundary: (_error: unknown, query: Query) =>
    query.state.data === undefined,
}

export const withMiddleware = (
  hook: any,
  defaultOptions: any,
  type: 'queries' | 'mutations'
) => {
  return function useMiddleware(
    options?: { client?: QueryClient; use?: Middleware[] },
    queryClient?: QueryClient
  ) {
    const [uses, opts]: [Middleware[], any] = [
      ReactQuery.useQueryClient(
        // @ts-ignore Compatible with ReactQuery v4
        isV5 ? queryClient : options
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

    return uses.reduceRight((next, use) => use(next), hook)(opts, queryClient)
  }
}

export const getKey = (queryKey: QueryKey, variables?: any): QueryKey => {
  return variables === undefined ? queryKey : [...queryKey, variables]
}
