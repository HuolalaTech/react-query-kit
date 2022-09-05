import type { ContextOptions, QueryFunction } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import type { PartialQueryKitKey, QueryKitKey } from './types'

export function genKeyFn<TVariables>(primaryKey: string) {
  return <V extends PartialQueryKitKey<TVariables> | void = void>(
    variables?: V
  ) =>
    (typeof variables === 'undefined'
      ? [primaryKey]
      : [primaryKey, variables]) as QueryKitKey<V>
}

export function parseQueryKitArgs<TOptions extends Record<any, any>>(
  arg1: string | TOptions,
  arg2?: QueryFunction<any, any> | TOptions,
  arg3?: TOptions
): TOptions {
  if (typeof arg1 !== 'string') {
    return arg1 as TOptions
  }

  if (typeof arg2 === 'function') {
    return { ...arg3, primaryKey: arg1, queryFn: arg2 } as unknown as TOptions
  }

  return { ...arg2, primaryKey: arg1 } as unknown as TOptions
}

export function useEnabled({
  context,
  enabled,
  queryKey,
}: {
  context?: ContextOptions['context']
  enabled?: boolean | undefined | ((data: any) => boolean)
  queryKey: any[]
}) {
  const queryClient = useQueryClient({ context })

  return typeof enabled === 'function'
    ? enabled(queryClient.getQueryData(queryKey))
    : enabled
}
