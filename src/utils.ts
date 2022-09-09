import type { QueryFunction } from '@tanstack/react-query'

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
