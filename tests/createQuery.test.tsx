import { QueryClient, skipToken } from '@tanstack/react-query'
import '@testing-library/jest-dom'
import { fireEvent, waitFor } from '@testing-library/react'
import * as React from 'react'

import { createQuery } from '../src'
import type { QueryHookResult } from '../src'
import { Middleware } from '../src/types'
import { omit, renderWithClient, sleep, uniqueKey } from './utils'

describe('createQuery', () => {
  const queryClient = new QueryClient()

  it('should return the correct key', () => {
    const key = uniqueKey()
    const variables = { id: 1 }
    const fetcher = (_variables: { id: number }) => {
      return 'test'
    }
    const useGeneratedQuery = createQuery({
      queryKey: key,
      fetcher,
    })

    expect(useGeneratedQuery.getKey()).toEqual(key)
    expect(useGeneratedQuery.getKey(variables)).toEqual([...key, variables])
    expect(omit(useGeneratedQuery.getOptions(variables), 'queryFn')).toEqual({
      queryKey: [...key, variables],
      fetcher,
    })
    expect(
      omit(useGeneratedQuery.getFetchOptions(variables), 'queryFn')
    ).toEqual({
      queryKey: [...key, variables],
    })

    queryClient.prefetchQuery(useGeneratedQuery.getFetchOptions(variables))
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

    const useGeneratedQuery = createQuery({
      queryKey: uniqueKey(),
      fetcher: (_variables: { id: number }) => {
        return 'test'
      },
      use: [
        useNext => {
          return options =>
            useNext({
              ...options,
              initialData: 'fakeData',
              enabled: false,
            })
        },
        myMiddileware,
      ],
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
      queryKey: uniqueKey(),
      fetcher: () => {
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
      queryKey: uniqueKey(),
      fetcher: () => {
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

  it('should respect skipToken and refetch when skipToken is taken away', async () => {
    const useGeneratedQuery = createQuery<string>({
      queryKey: uniqueKey(),
      fetcher: async () => {
        await sleep(10)
        return Promise.resolve('data')
      },
    })

    function Page({ enabled }: { enabled: boolean }) {
      const { data, status } = useGeneratedQuery({
        variables: enabled ? undefined : skipToken,
        retry: false,
        retryOnMount: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      })

      return (
        <div>
          <div>status: {status}</div>
          <div>data: {String(data)}</div>
        </div>
      )
    }

    function App() {
      const [enabled, toggle] = React.useReducer(x => !x, false)

      return (
        <div>
          <Page enabled={enabled} />
          <button onClick={toggle}>enable</button>
        </div>
      )
    }

    const rendered = renderWithClient(queryClient, <App />)

    await waitFor(() => rendered.getByText('status: pending'))

    fireEvent.click(rendered.getByRole('button', { name: 'enable' }))
    await waitFor(() => rendered.getByText('status: success'))
    await waitFor(() => rendered.getByText('data: data'))
  })
})
