import type { QueryKitKey, QueryKitPartialKey } from './types'

export function genKeyFn<TVariables>(primaryKey: string) {
  return (variables: TVariables) =>
    (typeof variables === undefined
      ? [primaryKey]
      : [primaryKey, variables]) as QueryKitKey<TVariables>
}

export function genPartialKeyFn<TVariables>(primaryKey: string) {
  return <TQueryKitPartialKey extends QueryKitPartialKey<TVariables>>(
    partialVariables: TQueryKitPartialKey
  ) =>
    (typeof partialVariables === undefined
      ? [primaryKey]
      : [primaryKey, partialVariables]) as QueryKitKey<TQueryKitPartialKey>
}
