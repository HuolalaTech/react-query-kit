import { useInfiniteQuery } from '@tanstack/react-query'

import { createBaseQuery } from './createBaseQuery'
import type { CreateInfiniteQueryOptions, InfiniteQueryHook } from './types'

export const createInfiniteQuery = <
  TFnData,
  TVariables = any,
  TError = Error,
  TPageParam = number
>(
  options: CreateInfiniteQueryOptions<TFnData, TVariables, TError, TPageParam>
): InfiniteQueryHook<TFnData, TVariables, TError, TPageParam> => {
  return createBaseQuery(options, useInfiniteQuery)
}
