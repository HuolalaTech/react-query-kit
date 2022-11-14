import type { QueryFunction } from '@tanstack/react-query'

export type QueryKitKey<TVariables> = TVariables extends void
  ? [string]
  : [string, TVariables]

export type AdditionalCreateOptions<TFnData, TVariables> = {
  primaryKey: string
  queryFn: QueryFunction<TFnData, QueryKitKey<TVariables>>
  enabled?:
    | boolean
    | ((data: TFnData | undefined, variables: TVariables) => boolean)
}

export type AdditionalQueryHookOptions<TFnData, TVariables> = {
  enabled?:
    | boolean
    | ((data: TFnData | undefined, variables: TVariables) => boolean)
} & (TVariables extends void
  ? {
      variables?: TVariables
    }
  : {
      variables: TVariables
    })

type PartialQueryKitKey<TVariables> = TVariables extends Record<any, any>
  ?
      | {
          [P in keyof TVariables]?: TVariables[P]
        }
      | void
  : TVariables | void

export type ExposeMethods<TFnData, TVariables> = {
  getPrimaryKey: () => string
  getKey: <V extends PartialQueryKitKey<TVariables> | void = void>(
    variables?: V
  ) => QueryKitKey<V>
  queryFn: QueryFunction<TFnData, QueryKitKey<TVariables>>
}
