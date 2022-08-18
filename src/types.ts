export type QueryKitKey<TVariables> = TVariables extends void
  ? [string]
  : [string, TVariables]

export type QueryKitPartialKey<TVariables> = TVariables extends Record<
  infer K,
  infer V
>
  ? Record<K, QueryKitPartialKey<V>> | void
  : TVariables | void
