import { createInfiniteQuery } from '../src/createInfiniteQuery'
import { uniqueKey } from './utils'

describe('createInfiniteQuery', () => {
  it('should return the correct key', () => {
    type Response = {
      projects: { id: string; name: string }[]
      nextCursor: number
    }
    type Variables = { id: number }

    const primaryKey = uniqueKey()
    const variables = { id: 1 }
    const queryFn = () => {
      return fetch(`${primaryKey}/${variables.id}`).then(res => res.json())
    }
    const initialPageParam = 1
    const getNextPageParam = (lastPage: Response) => lastPage.nextCursor
    const useGeneratedQuery = createInfiniteQuery<Response, Variables, Error>({
      primaryKey,
      queryFn,
      initialPageParam,
      getNextPageParam,
    })

    expect(useGeneratedQuery.getPrimaryKey()).toBe(primaryKey)
    expect(useGeneratedQuery.getKey()).toEqual([primaryKey])
    expect(useGeneratedQuery.getKey(variables)).toEqual([primaryKey, variables])
    expect(useGeneratedQuery.getOptions(variables)).toEqual({
      primaryKey,
      queryKey: [primaryKey, variables],
      queryFn,
      initialPageParam,
      getNextPageParam,
    })
    expect(useGeneratedQuery.getFetchOptions(variables)).toEqual({
      queryKey: [primaryKey, variables],
      queryFn,
      initialPageParam,
      getNextPageParam,
    })
  })
})
