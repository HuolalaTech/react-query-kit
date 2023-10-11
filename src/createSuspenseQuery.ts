import { useQuery } from '@tanstack/react-query'

import { createBaseQuery } from './createBaseQuery'
import type { CreateSuspenseQueryOptions, SuspenseQueryHook } from './types'
import { suspenseOptions } from './utils'

export const createSuspenseQuery = <TFnData, TVariables = void, TError = Error>(
  options: CreateSuspenseQueryOptions<TFnData, TVariables, TError>
): SuspenseQueryHook<TFnData, TVariables, TError> => {
  return createBaseQuery(options, useQuery, suspenseOptions)
}
