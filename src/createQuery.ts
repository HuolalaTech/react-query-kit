import { createBaseQuery } from './createBaseQuery'
import type { CompatibleError, CreateQueryOptions, QueryHook } from './types'
import { ReactQuery } from './utils'

export const createQuery = <
  TFnData,
  TVariables = void,
  TError = CompatibleError
>(
  options: CreateQueryOptions<TFnData, TVariables, TError>
): QueryHook<TFnData, TVariables, TError> => {
  return createBaseQuery(options, ReactQuery.useQuery)
}
