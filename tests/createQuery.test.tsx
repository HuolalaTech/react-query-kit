import { QueryClient } from '@tanstack/react-query'
import '@testing-library/jest-dom'
import { waitFor } from '@testing-library/react'
import * as React from 'react'

import { createQuery } from '../src'
import type { QueryHookResult } from '../src'
import { Middleware } from '../src/types'
import { renderWithClient, uniqueKey } from './utils'

describe('createQuery', () => {
  const queryClient = new QueryClient()

  it('should return the correct key', () => {
    const primaryKey = uniqueKey()
    const variables = { id: 1 }
    const useGeneratedQuery = createQuery<void, { id: number }>({
      primaryKey,
      queryFn: () => {},
    })
    expect(useGeneratedQuery.getPrimaryKey()).toBe(primaryKey)
    expect(useGeneratedQuery.getKey()).toEqual([primaryKey])
    expect(useGeneratedQuery.getKey(variables)).toEqual([primaryKey, variables])
  })

  it('should return the correct initial data from middleware', async () => {
    const myMiddileware: Middleware = useQueryNext => {
      return options => {
        return useQueryNext({
          ...options,
          initialData: 'initialData',
          enabled: false,
        })
      }
    }

    const useGeneratedQuery = createQuery<string, { id: number }>({
      primaryKey: uniqueKey(),
      queryFn: () => {
        return 'test'
      },
      use: [myMiddileware],
    })

    const states: QueryHookResult<any, any>[] = []

    function Page() {
      const state = useGeneratedQuery()

      states.push(state)

      return <span>{state.data}</span>
    }

    const rendered = renderWithClient(queryClient, <Page />)

    await waitFor(() => rendered.getByText('initialData'))
  })

  it('should return the correct initial data', async () => {
    const useGeneratedQuery = createQuery<string, { id: number }>({
      primaryKey: uniqueKey(),
      queryFn: () => {
        return 'test'
      },
      use: [
        useNext => {
          return options =>
            useNext({
              ...options,
              initialData: options.initialData ?? 'initialData',
              enabled: false,
            })
        },
      ],
    })
    const states: QueryHookResult<any, any>[] = []

    function Page() {
      const state = useGeneratedQuery({ initialData: 'stateData' })

      states.push(state)

      return <span>{state.data}</span>
    }

    const rendered = renderWithClient(queryClient, <Page />)

    await waitFor(() => rendered.getByText('stateData'))
  })

  it('should return the selected data', async () => {
    const useGeneratedQuery = createQuery<string>({
      primaryKey: uniqueKey(),
      queryFn: () => {
        return 'test'
      },
    })
    const states: QueryHookResult<any, any>[] = []

    function Page() {
      const state = useGeneratedQuery({
        select() {
          return 'selectedData'
        },
      })

      states.push(state)

      return <span>{state.data}</span>
    }

    const rendered = renderWithClient(queryClient, <Page />)

    await waitFor(() => rendered.getByText('selectedData'))
  })
})
