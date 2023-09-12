import { useInfiniteQuery } from '@tanstack/react-query'

import { createBaseQuery } from './createBaseQuery'
import type {
  AdditionalCreateOptions,
  CompatibleUseInfiniteQueryOptions,
  DefaultError,
  InfiniteQueryHook,
  Middleware,
} from './types'

export interface CreateInfiniteQueryOptions<
  TFnData = unknown,
  TVariables = any,
  TError = DefaultError,
  TPageParam = number
> extends Omit<
      CompatibleUseInfiniteQueryOptions<
        TFnData,
        TVariables,
        TFnData,
        TError,
        TPageParam
      >,
      'queryKey' | 'queryFn' | 'enabled' | 'select'
    >,
    AdditionalCreateOptions<TFnData, TVariables, TPageParam> {
  use?: Middleware<InfiniteQueryHook<TFnData, TVariables, TError, TPageParam>>[]
}

export const createInfiniteQuery = <
  TFnData,
  TVariables = any,
  TError = DefaultError,
  TPageParam = number
>(
  options: CreateInfiniteQueryOptions<TFnData, TVariables, TError, TPageParam>
): InfiniteQueryHook<TFnData, TVariables, TError, TPageParam> => {
  return createBaseQuery(options, useInfiniteQuery)
}
