import { useQuery } from '@tanstack/react-query'

import { createBaseQuery } from './createBaseQuery'
import type { CompatibleError, CreateQueryOptions, QueryHook } from './types'

export const createQuery = <
  TFnData,
  TVariables = void,
  TError = CompatibleError
>(
  options: CreateQueryOptions<TFnData, TVariables, TError>
): QueryHook<TFnData, TVariables, TError> => {
  return createBaseQuery(options, useQuery)
}
