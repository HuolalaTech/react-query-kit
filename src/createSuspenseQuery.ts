import type { DefaultError } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { createBaseQuery } from './createBaseQuery'
import type { CreateSuspenseQueryOptions, SuspenseQueryHook } from './types'

export const createSuspenseQuery = <
  TFnData,
  TVariables = any,
  TError = DefaultError
>(
  options: CreateSuspenseQueryOptions<TFnData, TVariables, TError>
): SuspenseQueryHook<TFnData, TVariables, TError> => {
  return createBaseQuery(options, useQuery, {
    enabled: true,
    suspense: true,
    throwOnError: true,
    // compatible with ReactQuery v4
    // @ts-ignore
    useErrorBoundary: true,
  })
}
