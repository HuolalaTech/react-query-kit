import { createInfiniteQuery } from '../src/createInfiniteQuery'

it('createInfiniteQuery', () => {
  type Response = { title: string; content: string }
  type Variables = { id: number }

  const primaryKey = '/posts'
  const variables = { id: 1 }

  const query = createInfiniteQuery<Response, Variables, Error>({
    primaryKey,
    queryFn: ({ queryKey: [primaryKey, variables] }) => {
      return fetch(`${primaryKey}/${variables.id}`).then(res => res.json())
    },
    enabled: data => !data,
    suspense: true,
  })

  expect(query.getPrimaryKey()).toBe(primaryKey)
  expect(query.getKey()).toEqual([primaryKey])
  expect(query.getKey(variables)).toEqual([primaryKey, variables])
})
