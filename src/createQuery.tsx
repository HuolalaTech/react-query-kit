import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { createBaseQuery } from './createBaseQuery'
import type {
  AdditionalCreateOptions,
  DefaultError,
  Middleware,
  QueryHook,
  inferQueryKey,
} from './types'

export interface CreateQueryOptions<
  TFnData = unknown,
  TVariables = any,
  TError = DefaultError
> extends Omit<
      UseQueryOptions<TFnData, TError, TFnData, inferQueryKey<TVariables>>,
      'queryKey' | 'queryFn' | 'enabled' | 'select'
    >,
    AdditionalCreateOptions<TFnData, TVariables> {
  use?: Middleware<QueryHook<TFnData, TVariables, TError>>[]
}

export const createQuery = <TFnData, TVariables = any, TError = DefaultError>(
  options: CreateQueryOptions<TFnData, TVariables, TError>
): QueryHook<TFnData, TVariables, TError> => {
  return createBaseQuery(options, useQuery)
}
