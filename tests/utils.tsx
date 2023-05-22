import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'

let queryKeyCount = 0
export function uniqueKey(): string {
  queryKeyCount++
  return `query_${queryKeyCount}`
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
