import { createBaseQuery } from './createBaseQuery'
import type {
  CompatibleError,
  CreateInfiniteQueryOptions,
  InfiniteQueryHook,
} from './types'
import { ReactQuery } from './utils'

export const createInfiniteQuery = <
  TFnData,
  TVariables = void,
  TError = CompatibleError,
  TPageParam = number
>(
  options: CreateInfiniteQueryOptions<TFnData, TVariables, TError, TPageParam>
): InfiniteQueryHook<TFnData, TVariables, TError, TPageParam> => {
  return createBaseQuery(options, ReactQuery.useInfiniteQuery)
}
