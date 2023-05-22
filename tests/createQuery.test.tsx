import * as React from 'react'
import { QueryClient } from '@tanstack/react-query'
import { waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createQuery } from '../src'
import type { QueryHookResult } from '../src'
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

  it('should return the correct variables from useDefaultOptions', async () => {
    const variables = { id: 1 }
    const useGeneratedQuery = createQuery<string, { id: number }>({
      primaryKey: uniqueKey(),
      queryFn: () => {
        return 'test'
      },
      useDefaultOptions: () => {
        return { variables }
      },
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
      useDefaultOptions: () => {
        return { variables: { id: 2 } }
      },
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
