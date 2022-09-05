export type QueryKitKey<TVariables> = TVariables extends void
  ? [string]
  : [string, TVariables]

export type PartialQueryKitKey<TVariables> = TVariables extends Record<any, any>
  ?
      | {
          [P in keyof TVariables]?: TVariables[P]
        }
      | void
  : TVariables | void
