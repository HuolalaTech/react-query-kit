export type QueryKitKey<TVariables> = TVariables extends void
  ? [string]
  : [string, TVariables]

export type PartialQueryKitKey<TVariables> = TVariables extends Record<
  infer K,
  infer V
>
  ? Record<K, V | void> | void
  : TVariables | void
