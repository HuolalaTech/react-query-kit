import { useInfiniteQuery } from '@tanstack/react-query'

import { createBaseQuery } from './createBaseQuery'
import type {
  CreateSuspenseInfiniteQueryOptions,
  SuspenseInfiniteQueryHook,
} from './types'
import { suspenseOptions } from './utils'

export const createSuspenseInfiniteQuery = <
  TFnData,
  TVariables = void,
  TError = Error,
  TPageParam = number
>(
  options: CreateSuspenseInfiniteQueryOptions<
    TFnData,
    TVariables,
    TError,
    TPageParam
  >
): SuspenseInfiniteQueryHook<TFnData, TVariables, TError, TPageParam> => {
  return createBaseQuery(options, useInfiniteQuery, suspenseOptions)
}
