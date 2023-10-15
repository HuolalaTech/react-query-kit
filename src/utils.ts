import {
  type Query,
  type QueryClient,
  useQueryClient,
} from '@tanstack/react-query'

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
        // @ts-ignore Compatible with ReactQuery v4
        options?.context ? options : queryClient
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

const defaultThrowOnError = (_error: unknown, query: Query) =>
  query.state.data === undefined

export const suspenseOptions = {
  enabled: true,
  suspense: true,
  throwOnError: defaultThrowOnError,
  // Compatible with ReactQuery v4
  useErrorBoundary: defaultThrowOnError,
}

export const getKey = <TVariables = void>(
  primaryKey: string,
  variables?: TVariables
) => {
  return (
    variables === undefined ? [primaryKey] : [primaryKey, variables]
  ) as inferQueryKey<TVariables>
}
