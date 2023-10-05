import { useQuery } from '@tanstack/react-query'

import { createBaseQuery } from './createBaseQuery'
import type { CreateQueryOptions, QueryHook } from './types'

export const createQuery = <TFnData, TVariables = any, TError = Error>(
  options: CreateQueryOptions<TFnData, TVariables, TError>
): QueryHook<TFnData, TVariables, TError> => {
  return createBaseQuery(options, useQuery)
}
