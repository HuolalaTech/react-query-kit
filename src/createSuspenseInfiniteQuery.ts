import { createBaseQuery } from './createBaseQuery'
import type {
  CompatibleError,
  CreateSuspenseInfiniteQueryOptions,
  SuspenseInfiniteQueryHook,
} from './types'
import { ReactQuery, isV5, suspenseOptions } from './utils'

export function createSuspenseInfiniteQuery<
  TFnData,
  TVariables = void,
  TError = CompatibleError,
  TPageParam = number
>(
  options: CreateSuspenseInfiniteQueryOptions<
    TFnData,
    TVariables,
    TError,
    TPageParam
  >
): SuspenseInfiniteQueryHook<TFnData, TVariables, TError, TPageParam> {
  return isV5
    ? createBaseQuery(options, ReactQuery.useSuspenseInfiniteQuery)
    : createBaseQuery(options, ReactQuery.useInfiniteQuery, suspenseOptions)
}
