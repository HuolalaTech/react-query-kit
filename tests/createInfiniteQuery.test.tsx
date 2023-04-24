import { createInfiniteQuery } from '../src/createInfiniteQuery'

it('createInfiniteQuery', () => {
  type Response = {
    projects: { id: string; name: string }[]
    nextCursor: number
  }
  type Variables = { id: number }

  const primaryKey = '/projects'
  const variables = { id: 1 }

  const query = createInfiniteQuery<Response, Variables, Error>({
    primaryKey,
    queryFn: ({ queryKey: [primaryKey, variables] }) => {
      return fetch(`${primaryKey}/${variables.id}`).then(res => res.json())
    },
    defaultPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextCursor,
    enabled: data => !data,
    suspense: true,
  })

  expect(query.getPrimaryKey()).toBe(primaryKey)
  expect(query.getKey()).toEqual([primaryKey])
  expect(query.getKey(variables)).toEqual([primaryKey, variables])
})
