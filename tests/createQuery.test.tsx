import { QueryClient } from '@tanstack/react-query'
import { createQuery } from '../src/createQuery'

const queryClient = new QueryClient()

it('createQuery', () => {
  type PrimaryKey = string
  type Variables = number

  const primaryKey: PrimaryKey = 'primaryKey'
  const variables: Variables = 1
  const queryKey: [PrimaryKey, Variables] = [primaryKey, variables]
  const query = createQuery<[PrimaryKey, Variables], Variables>({
    primaryKey,
    queryFn: ({ queryKey }) => queryKey,
  })

  expect(query.getPrimaryKey()).toBe(primaryKey)
  expect(query.getKey(variables)).toEqual(queryKey)
  queryClient
    .fetchQuery(queryKey, query.queryFn)
    .then(data => expect(data).toEqual(queryKey))
})
