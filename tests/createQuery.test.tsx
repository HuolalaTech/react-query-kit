import { QueryClient } from '@tanstack/react-query'
import '@testing-library/jest-dom'
import { waitFor } from '@testing-library/react'
import * as React from 'react'

import { createQuery } from '../src'
import type { QueryHook, QueryHookResult } from '../src'
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

  it('should return the correct variables from middleware', async () => {
    const variables = { id: 1 }

    const myMiddileware: Middleware<
      QueryHook<string, { id: number }>
    > = useQueryNext => {
      return options => {
        return useQueryNext({
          ...options,
          variables: options?.variables ?? variables,
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

    await waitFor(() => rendered.getByText('test'))

    expect(states[0]?.variables).toBe(variables)
    expect(states[0]?.queryKey).toStrictEqual(
      useGeneratedQuery.getKey(variables)
    )
  })

  it('should return the correct variables', async () => {
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
              variables: options?.variables ?? variables,
            })
        },
      ],
    })
    const variables = { id: 1 }
    const states: QueryHookResult<any, any>[] = []

    function Page() {
      const state = useGeneratedQuery({ variables })

      states.push(state)

      return <span>{state.data}</span>
    }

    const rendered = renderWithClient(queryClient, <Page />)

    await waitFor(() => rendered.getByText('test'))

    expect(states[0]?.variables).toBe(variables)
    expect(states[0]?.queryKey).toStrictEqual(
      useGeneratedQuery.getKey(variables)
    )
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

  it('should update the data when invoke setData', async () => {
    const useGeneratedQuery = createQuery<string>({
      primaryKey: uniqueKey(),
      queryFn: () => {
        return 'test'
      },
    })
    const states: QueryHookResult<any, any>[] = []

    function Page() {
      const state = useGeneratedQuery({
        enabled: false,
      })

      React.useEffect(() => {
        state.setData('updatedData')
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      states.push(state)

      return <span>{state.data}</span>
    }

    const rendered = renderWithClient(queryClient, <Page />)

    await waitFor(() => rendered.getByText('updatedData'))
  })
})
