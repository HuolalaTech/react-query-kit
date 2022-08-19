import type { QueryKitKey, QueryKitPartialKey } from './types'

export function genKeyFn<TVariables>(primaryKey: string) {
  return <V extends QueryKitPartialKey<TVariables>>(variables?: V) =>
    (typeof variables === undefined
      ? [primaryKey]
      : [primaryKey, variables]) as QueryKitKey<V>
}
