import { createInfiniteQuery } from '../src/createInfiniteQuery'
import { omit, uniqueKey } from './utils'

describe('createInfiniteQuery', () => {
  it('should return the correct key', () => {
    type Response = {
      projects: { id: string; name: string }[]
      nextCursor: number
    }
    type Variables = { id: number }

    const key = uniqueKey()
    const variables = { id: 1 }
    const fetcher = (_variables: Variables): Promise<Response> => {
      return fetch(`/test`).then(res => res.json())
    }
    const initialPageParam = 1
    const getNextPageParam = (lastPage: Response) => lastPage.nextCursor
    const useGeneratedQuery = createInfiniteQuery<Response, Variables, Error>({
      queryKey: key,
      fetcher,
      initialPageParam,
      getNextPageParam,
    })

    expect(useGeneratedQuery.getKey()).toEqual(key)
    expect(useGeneratedQuery.getKey(variables)).toEqual([...key, variables])
    expect(omit(useGeneratedQuery.getOptions(variables), 'queryFn')).toEqual({
      queryKey: [...key, variables],
      fetcher,
      initialPageParam,
      getNextPageParam,
    })
    expect(
      omit(useGeneratedQuery.getFetchOptions(variables), 'queryFn')
    ).toEqual({
      queryKey: [...key, variables],
      initialPageParam,
      getNextPageParam,
    })
  })
})
