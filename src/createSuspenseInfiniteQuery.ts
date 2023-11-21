import * as ReactQuery from '@tanstack/react-query'

import { createBaseQuery } from './createBaseQuery'
import type {
  CompatibleError,
  CreateSuspenseInfiniteQueryOptions,
  SuspenseInfiniteQueryHook,
} from './types'
import { isV5, suspenseOptions } from './utils'

export const createSuspenseInfiniteQuery = <
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
): SuspenseInfiniteQueryHook<TFnData, TVariables, TError, TPageParam> => {
  return isV5
    ? createBaseQuery(options, ReactQuery.useSuspenseInfiniteQuery)
    : createBaseQuery(options, ReactQuery.useInfiniteQuery, suspenseOptions)
}
