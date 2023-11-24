import { createBaseQuery } from './createBaseQuery'
import type {
  CompatibleError,
  CreateSuspenseQueryOptions,
  SuspenseQueryHook,
} from './types'
import { ReactQuery, isV5, suspenseOptions } from './utils'

export const createSuspenseQuery = <
  TFnData,
  TVariables = void,
  TError = CompatibleError
>(
  options: CreateSuspenseQueryOptions<TFnData, TVariables, TError>
): SuspenseQueryHook<TFnData, TVariables, TError> => {
  return isV5
    ? createBaseQuery(options, ReactQuery.useSuspenseQuery)
    : createBaseQuery(options, ReactQuery.useQuery, suspenseOptions)
}
