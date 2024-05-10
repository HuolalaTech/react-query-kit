import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import * as React from 'react'

let queryKeyCount = 0
export function uniqueKey(): string[] {
  queryKeyCount++
  return [`query_${queryKeyCount}`]
}

export function renderWithClient(
  client: QueryClient,
  ui: React.ReactElement
): ReturnType<typeof render> {
  const { rerender, ...result } = render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  )
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={client}>{rerenderUi}</QueryClientProvider>
      ),
  } as any
}

export function omit<T extends object, K extends string[]>(
  object: T | null | undefined,
  ...paths: K
): Pick<T, Exclude<keyof T, K[number]>> {
  return Object.fromEntries(
    Object.entries(object || {}).filter(([key]) => !paths.includes(key))
  ) as Pick<T, Exclude<keyof T, K[number]>>
}

export function sleep(timeout: number): Promise<void> {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, timeout)
  })
}
