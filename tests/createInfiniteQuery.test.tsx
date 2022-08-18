import { QueryClient } from '@tanstack/react-query'
import { createInfiniteQuery } from '../src/createInfiniteQuery'

const queryClient = new QueryClient()

it('createInfiniteQuery', () => {
  type PrimaryKey = string
  type Variables = number

  const primaryKey: PrimaryKey = 'primaryKey'
  const variables: Variables = 1
  const queryKey: [PrimaryKey, Variables] = [primaryKey, variables]
  const query = createInfiniteQuery<[PrimaryKey, Variables], Variables>({
    primaryKey,
    queryFn: ({ queryKey }) => queryKey,
  })

  expect(query.getPrimaryKey()).toBe(primaryKey)
  expect(query.getKey(variables)).toEqual(queryKey)
  queryClient.fetchInfiniteQuery(queryKey, query.queryFn).then(data =>
    expect(data).toEqual({
      pageParams: [undefined],
      pages: [['primaryKey', 1]],
    })
  )
})
