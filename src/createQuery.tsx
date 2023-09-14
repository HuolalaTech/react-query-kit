import { useQuery } from '@tanstack/react-query'

import { createBaseQuery } from './createBaseQuery'
import type { CreateQueryOptions, DefaultError, QueryHook } from './types'

export const createQuery = <TFnData, TVariables = any, TError = DefaultError>(
  options: CreateQueryOptions<TFnData, TVariables, TError>
): QueryHook<TFnData, TVariables, TError> => {
  return createBaseQuery(options, useQuery)
}
