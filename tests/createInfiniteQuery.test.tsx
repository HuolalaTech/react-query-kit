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
    const useGeneratedQuery = createInfiniteQuery<Response, Variables, Error>({
      primaryKey,
      queryFn: () => {
        return fetch(`${primaryKey}/${variables.id}`).then(res => res.json())
      },
      initialPageParam: 1,
      getNextPageParam: lastPage => lastPage.nextCursor,
      enabled: data => !data,
    })

    expect(useGeneratedQuery.getPrimaryKey()).toBe(primaryKey)
    expect(useGeneratedQuery.getKey()).toEqual([primaryKey])
    expect(useGeneratedQuery.getKey(variables)).toEqual([primaryKey, variables])
  })
})
