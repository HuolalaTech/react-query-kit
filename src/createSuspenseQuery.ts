import { useQuery, useSuspenseQuery } from '@tanstack/react-query'

import { createBaseQuery } from './createBaseQuery'
import type {
  CompatibleError,
  CreateSuspenseQueryOptions,
  SuspenseQueryHook,
} from './types'
import { suspenseOptions } from './utils'

export const createSuspenseQuery = <
  TFnData,
  TVariables = void,
  TError = CompatibleError
>(
  options: CreateSuspenseQueryOptions<TFnData, TVariables, TError>
): SuspenseQueryHook<TFnData, TVariables, TError> => {
  return useSuspenseQuery
    ? createBaseQuery(options, useSuspenseQuery)
    : createBaseQuery(options, useQuery, suspenseOptions)
}
