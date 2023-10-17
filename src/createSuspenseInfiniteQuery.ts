import {
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query'

import { createBaseQuery } from './createBaseQuery'
import type {
  CompatibleError,
  CreateSuspenseInfiniteQueryOptions,
  SuspenseInfiniteQueryHook,
} from './types'
import { suspenseOptions } from './utils'

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
  return useSuspenseInfiniteQuery
    ? createBaseQuery(options, useSuspenseInfiniteQuery)
    : createBaseQuery(options, useInfiniteQuery, suspenseOptions)
}
